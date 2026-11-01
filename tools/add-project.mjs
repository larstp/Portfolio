#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsFile = path.join(root, "src", "data", "projects.json");
const technologiesFile = path.join(root, "src", "data", "technologies.json");
const validatorFile = path.join(root, "tools", "validate-projects.mjs");
const rl = readline.createInterface({ input, output });

async function ask(question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || defaultValue;
}

async function required(question, defaultValue = "") {
  let answer = await ask(question, defaultValue);
  while (!answer) {
    console.log("This value is required.");
    answer = await ask(question, defaultValue);
  }
  return answer;
}

async function yesNo(question, defaultValue = false) {
  const answer = (
    await ask(`${question} (y/n)`, defaultValue ? "y" : "n")
  ).toLowerCase();
  return answer === "y" || answer === "yes";
}

function listFromAnswer(answer) {
  return answer
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function generateId(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function askImage(label, defaultSource = "") {
  const src = await ask(`${label} path (blank for none)`, defaultSource);
  if (!src) return null;
  return {
    src,
    alt: await required(`${label} alt text`),
    caption: await required(`${label} caption`),
  };
}

async function askCarousel() {
  const images = [];
  console.log(
    "Add carousel images one at a time. Leave the path empty when finished.",
  );
  while (true) {
    const src = await ask(`Carousel image ${images.length + 1} path`);
    if (!src) break;
    images.push({
      src,
      alt: await required("  Alt text"),
      caption: await required("  Caption"),
      fitted: await yesNo("  Fit the whole image inside the frame", true),
    });
  }
  return images;
}

async function askSections() {
  const sections = [];
  const count = Number(await ask("Number of Article sections", "2"));
  const sectionCount = Number.isInteger(count) && count > 0 ? count : 1;

  for (let index = 0; index < sectionCount; index += 1) {
    console.log(`\nArticle section ${index + 1}`);
    sections.push({
      heading: await required("Heading"),
      paragraph: await required("Paragraph"),
      image: await askImage("Section image"),
      imagePosition: await ask("Image position (left/right/below)", "below"),
    });
  }
  return sections;
}

async function main() {
  const original = fs.readFileSync(projectsFile, "utf8");
  const data = JSON.parse(original);
  const technologiesData = JSON.parse(
    fs.readFileSync(technologiesFile, "utf8"),
  );
  const existingIds = new Set(data.projects.map((project) => project.id));
  const availableTechnologies = Object.keys(
    technologiesData.technologies ?? {},
  );

  console.log("\nAdd a project to the portfolio\n");
  console.log(`Available technologies: ${availableTechnologies.join(", ")}`);

  const title = await required("Project title");
  const generatedId = generateId(title);
  let id = await ask("Project ID", generatedId);
  while (!id || existingIds.has(id)) {
    if (existingIds.has(id)) console.log(`The ID '${id}' already exists.`);
    id = await required("Project ID", generatedId);
  }

  const description = await required("Home card description");
  const projectType = await ask("Project type", "School project");
  const thumbnailSource = await required(
    "Thumbnail path",
    `/images/projects/${id}/thumbnail.webp`,
  );
  const thumbnailAlt = await required(
    "Thumbnail alt text",
    `${title} project screenshot`,
  );
  const technologies = listFromAnswer(
    await required("Technologies (comma-separated)"),
  );
  const live = await ask("Live URL (optional)");
  const repository = await required("Repository URL");
  const featured = await yesNo("Feature this project on Home", false);
  const status = await ask(
    "Status (active/archived)",
    featured ? "active" : "archived",
  );
  const dateCreated = await ask(
    "Date created (YYYY-MM-DD)",
    new Date().toISOString().slice(0, 10),
  );

  console.log("\nArticle details");
  const articleTitle = await required("Article title", title);
  const article = {
    title: articleTitle,
    subheading: await required("Article subheading"),
    roles: listFromAnswer(
      await required("Roles (comma-separated)", "Frontend developer"),
    ),
    logo: await askImage("Logo"),
    image: await askImage("Main Article image", thumbnailSource),
    images: await askCarousel(),
    description: await required("Article description", description),
    sections: await askSections(),
    pullRequest: await ask("Pull request URL (optional)"),
    improvement: await ask("Improvement section title", "Recent improvements"),
    improvementReason: listFromAnswer(
      await required("Improvement notes (comma-separated)"),
    ),
    process: await required("Development process summary"),
  };

  const project = {
    id,
    title,
    projectType,
    description,
    image: { src: thumbnailSource, alt: thumbnailAlt },
    technologies,
    links: { live, repository },
    articlePath: `/projects/${id}`,
    article,
    featured,
    dateCreated,
    status,
  };

  console.log("\nProject to be added:\n");
  console.log(JSON.stringify(project, null, 2));
  const confirmed = await yesNo("Write this project to projects.json", false);
  if (!confirmed) {
    console.log("Cancelled. No files were changed.");
    return;
  }

  data.projects.push(project);
  data.settings ??= {};
  data.settings.projectOrder ??= [];
  if (!data.settings.projectOrder.includes(id))
    data.settings.projectOrder.push(id);
  fs.writeFileSync(projectsFile, `${JSON.stringify(data, null, 2)}\n`);

  try {
    execFileSync(process.execPath, [validatorFile], {
      cwd: root,
      stdio: "inherit",
    });
  } catch (error) {
    fs.writeFileSync(projectsFile, original);
    throw new Error(
      `Validation failed; projects.json was restored. ${error.message}`,
    );
  }

  console.log(`\nAdded ${title} (${id}).`);
}

main()
  .catch((error) => {
    console.error(`\nCould not add project: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
