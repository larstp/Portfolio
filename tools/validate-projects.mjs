#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsFile = path.join(root, "src", "data", "projects.json");
const technologiesFile = path.join(root, "src", "data", "technologies.json");
const publicDirectory = path.join(root, "public");
const maxImageBytes = 200 * 1024;

const errors = [];
const warnings = [];

function error(message) {
  errors.push(message);
}

function warning(message) {
  warnings.push(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isUrl(value) {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}

function checkPublicImage(imagePath, label) {
  if (typeof imagePath !== "string" || !imagePath.startsWith("/images/")) {
    error(`${label} must be a browser path beginning with /images/.`);
    return;
  }

  const filePath = path.join(publicDirectory, imagePath.slice(1));
  if (!fs.existsSync(filePath)) {
    error(`${label} does not exist: ${imagePath}`);
    return;
  }

  const size = fs.statSync(filePath).size;
  if (size > maxImageBytes) {
    warning(`${label} is larger than 200 KB: ${imagePath}`);
  }
}

function checkImage(image, label) {
  if (!isObject(image)) {
    error(`${label} must be an object.`);
    return;
  }
  if (!image.alt) error(`${label}.alt is required.`);
  checkPublicImage(image.src, `${label}.src`);
}

function checkLinks(project) {
  const links = project.links;
  if (!isObject(links)) {
    error(`${project.id}.links is required.`);
    return;
  }
  if (!links.live && !links.repository) {
    error(`${project.id} must have a live or repository link.`);
  }
  for (const [name, value] of Object.entries(links)) {
    if (value && !isUrl(value))
      error(`${project.id}.links.${name} is not a valid URL.`);
  }
}

function checkArticle(project) {
  const article = project.article;
  if (!article) {
    warning(`${project.id} has no article content.`);
    return;
  }

  for (const field of ["title", "subheading", "description", "process"]) {
    if (!article[field]) error(`${project.id}.article.${field} is required.`);
  }
  if (!Array.isArray(article.roles) || article.roles.length === 0) {
    error(`${project.id}.article.roles must contain at least one role.`);
  }
  if (!Array.isArray(article.sections)) {
    error(`${project.id}.article.sections must be an array.`);
  }
  if (article.logo) checkImage(article.logo, `${project.id}.article.logo`);
  if (article.image) checkImage(article.image, `${project.id}.article.image`);

  if (article.images) {
    if (!Array.isArray(article.images) || article.images.length === 0) {
      error(
        `${project.id}.article.images must be a non-empty array when provided.`,
      );
    } else {
      article.images.forEach((image, index) => {
        checkImage(image, `${project.id}.article.images[${index}]`);
        if (image.fitted !== undefined && typeof image.fitted !== "boolean") {
          error(
            `${project.id}.article.images[${index}].fitted must be boolean.`,
          );
        }
      });
    }
  }

  for (const [index, section] of (article.sections ?? []).entries()) {
    if (!section.heading)
      error(`${project.id}.article.sections[${index}].heading is required.`);
    if (!section.paragraph)
      error(`${project.id}.article.sections[${index}].paragraph is required.`);
    if (section.image)
      checkImage(
        section.image,
        `${project.id}.article.sections[${index}].image`,
      );
    if (
      section.imagePosition &&
      !["left", "right", "below"].includes(section.imagePosition)
    ) {
      error(
        `${project.id}.article.sections[${index}].imagePosition is invalid.`,
      );
    }
  }
}

function main() {
  let data;
  let technologies;

  try {
    data = JSON.parse(fs.readFileSync(projectsFile, "utf8"));
    technologies = JSON.parse(fs.readFileSync(technologiesFile, "utf8"));
  } catch (parseError) {
    console.error(`Could not parse project data: ${parseError.message}`);
    process.exitCode = 1;
    return;
  }

  if (!Array.isArray(data.projects))
    error("projects.json must contain a projects array.");
  const projects = data.projects ?? [];
  const technologyIds = new Set(Object.keys(technologies.technologies ?? {}));
  const ids = new Set();

  for (const [index, project] of projects.entries()) {
    const label = `projects[${index}]`;
    if (!isObject(project)) {
      error(`${label} must be an object.`);
      continue;
    }
    for (const field of [
      "id",
      "title",
      "description",
      "dateCreated",
      "status",
    ]) {
      if (!project[field]) error(`${label}.${field} is required.`);
    }
    if (ids.has(project.id)) error(`Duplicate project ID: ${project.id}`);
    ids.add(project.id);
    if (project.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) {
      error(`${project.id} is not a URL-safe project ID.`);
    }
    if (
      project.dateCreated &&
      !/^\d{4}-\d{2}-\d{2}$/.test(project.dateCreated)
    ) {
      error(`${project.id}.dateCreated must use YYYY-MM-DD.`);
    }
    if (!["active", "archived"].includes(project.status))
      error(`${project.id}.status is invalid.`);
    if (!Array.isArray(project.technologies))
      error(`${project.id}.technologies must be an array.`);
    for (const technology of project.technologies ?? []) {
      if (!technologyIds.has(technology))
        warning(`${project.id} uses unknown technology: ${technology}`);
    }
    checkImage(project.image, `${project.id}.image`);
    checkLinks(project);
    checkArticle(project);
  }

  const order = data.settings?.projectOrder;
  if (order !== undefined) {
    if (!Array.isArray(order)) {
      error("settings.projectOrder must be an array.");
    } else {
      const orderIds = new Set();
      for (const id of order) {
        if (orderIds.has(id)) error(`Duplicate projectOrder ID: ${id}`);
        orderIds.add(id);
        if (!ids.has(id))
          warning(`projectOrder references unknown project: ${id}`);
      }
    }
  }

  console.log(`Validated ${projects.length} projects.`);
  for (const message of warnings) console.warn(`Warning: ${message}`);
  for (const message of errors) console.error(`Error: ${message}`);
  console.log(`${warnings.length} warning(s), ${errors.length} error(s).`);
  if (errors.length > 0) process.exitCode = 1;
}

main();
