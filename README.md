# Rhuztin Protomartir — Portfolio

A responsive, searchable personal portfolio hosted on GitHub Pages.

## Open locally

Open `index.html` in a browser or run a static web server from this folder. The contact form uses EmailJS from the browser and requires its configured public service, template, and public key in `js/app.js`.

## Project content

- Edit project records in `js/projects.js`.
- Project artwork and the downloadable CV are in `assets/`.
- Each project has a detail page in `projects/<project-id>/index.html`.
- Update `index.html` and the detail pages when personal, education, or experience information changes.

## SEO and deployment

The site is published at `https://rhuzgg.github.io/Protomartir-Rhuztin-Portfolio/`. Canonical and Open Graph metadata are in the HTML pages; `robots.txt` and `sitemap.xml` use the same public base URL. After publishing changes, check the public pages, project links, CV view/download, contact form, and responsive layouts.

## Contact form

The form submits through EmailJS and includes client-side required fields, length limits, and a honeypot field. Because the site is static, it does not store submissions in a private server database.
