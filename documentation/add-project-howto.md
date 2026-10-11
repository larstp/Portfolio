# Add a Project Manually

This guide covers the current manual workflow for adding a project. The interactive `npm run add-project` automation from the old portfolio is intentionally not included yet.

Use the complete copy-pasteable template here:

[project-template.json](project-template.json)

## 1. Prepare the Assets

1. Create a lowercase project folder inside `public/images/projects/`, matching the project `id`.
2. Add the project thumbnail as `public/images/projects/project-id/thumbnail.webp`.
3. Add carousel images inside `public/images/projects/project-id/carousel/`.
4. Add the project logo as `public/images/projects/project-id/logo.svg` if it has one.
5. Use `.webp`, `.png`, or `.jpeg` for project and Article images.
6. Keep every thumbnail and Article image at or below 200 KB.
7. Use browser-friendly public paths beginning with `/images/`, not `public/`.

Example:

```text
File: public/images/projects/my-project/thumbnail.webp
JSON: /images/projects/my-project/thumbnail.webp
```

Carousel example:

```text
File: public/images/projects/mimir/carousel/image.webp
JSON: /images/projects/mimir/carousel/image.webp
```

## 2. Copy the Template

Open `src/data/projects.json` and copy the object from [project-template.json](project-template.json) into the `projects` array.

Remember to add a comma after the previous project object before pasting the new object.

Do not add comments to JSON. JSON does not support comments. Use the existing `featured` and `status` fields to control whether a project appears.

## 3. Fill Out the Project Fields

### Card fields

- `id`: Unique URL-safe identifier, for example `my-project`.
- `title`: Project name.
- `description`: Short home-card description. Keep it to approximately 120-130 characters and no more than two lines.
- `image.src`: Thumbnail path.
- `image.alt`: Useful description of the thumbnail.
- `technologies`: Technology IDs from `src/data/technologies.json`.
- `links.live`: Live project URL.
- `links.repository`: GitHub repository URL.
- `articlePath`: Internal Article route, normally `/projects/my-project`.
- `featured`: Use `true` to show it on the Home page.
- `status`: Use `active` for current projects or `archived` to keep them in the JSON without showing them.
- `dateCreated`: Use the `YYYY-MM-DD` format.

### Article fields

- `article.title`: Article page title.
- `article.subheading`: Article-only introduction below the title.
- `article.roles`: Array of roles, such as `Frontend developer`, `Designer`, or `UI/UX`.
- `article.logo`: Optional logo image and alt text.
- `article.image`: Main Article image, alt text, and caption.
- `article.sections`: Ordered Article content sections.
- `article.carousel`: Optional additional images stored in the project `carousel` folder.
- `article.pullRequest`: GitHub pull request URL, or `null` if there is none.
- `article.improvement`: Collapsible assignment improvement title.
- `article.improvementReason`: Array of paragraphs explaining the improvement.
- `article.process`: Additional process content if needed.

## 4. Build Article Sections

Each section can contain one paragraph or multiple paragraphs:

```json
{
  "heading": "Project overview",
  "paragraph": ["The first paragraph.", "The second paragraph."],
  "image": {
    "src": "/images/projects/my-project/carousel/overview.webp",
    "alt": "Description of the overview image",
    "caption": "Overview of the project."
  },
  "imagePosition": "right"
}
```

Supported image positions are:

- `left`
- `right`
- `below`

Use `"image": null` when a section does not have an image yet.

Add as many sections as the project needs. There is no fixed ten-section limit in the current structure.

## 5. Control Home Visibility

To show a project on the Home page:

```json
"featured": true,
"status": "active"
```

To keep it in the JSON but hide it from Featured Projects:

```json
"featured": false,
"status": "archived"
```

The current Home page filters for projects where both `featured` is `true` and `status` is `active`.

## 6. Validate the Change

After editing the JSON, run:

```bash
npm run typecheck
npm run build
npm run lint
```

Check the following manually:

- The project card appears on Home if it is featured and active.
- The card links to the correct Article route.
- The Article route loads directly.
- External live-site and repository links work.
- All image paths load.
- Image files are no larger than 200 KB.
- The short description fits the card layout.
- Article images have useful alt text and captions.

## 7. Common JSON Mistakes

Invalid JSON:

```json
"paragraph": "First paragraph",
"Second paragraph"
```

Valid JSON with multiple paragraphs:

```json
"paragraph": [
  "First paragraph",
  "Second paragraph"
]
```

Other common mistakes include:

- Forgetting a comma between project objects.
- Using single quotes instead of double quotes.
- Adding comments inside JSON.
- Using `public/images/...` instead of `/images/...` in browser paths.
- Using Windows backslashes such as `public\\images\\...` instead of URL forward slashes such as `/images/...`.
- Using a technology ID that does not exist in `technologies.json`.
- Setting `featured` to `true` but leaving `status` as `archived`.

The automated project generator and JSON validation script will be documented here later, after the manual workflow is stable and the assignment is complete.
