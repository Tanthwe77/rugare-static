# Rugare Static Site — Deployment Guide

Static website at the repository root. No PHP, framework, or database required.

## Folder structure

```
/
├── index.html              # Home
├── about.html
├── programs.html
├── media.html
├── contact.html
├── favicon.ico
├── assets/
│   ├── css/style.css       # Full site styles (from rugare-custom.css)
│   ├── js/script.js        # Hero slider, stat counters, contact form
│   └── images/             # Site images (logo, photos)
├── vercel.json
├── netlify.toml
└── DEPLOYMENT.md
```

## Local preview

Open `index.html` in a browser, or run a simple static server:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

## Contact form (Formspree)

1. Create a free form at [https://formspree.io](https://formspree.io).
2. In `contact.html`, replace `YOUR_FORM_ID` in the form `action`:

   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

3. Until you do this, submitting the form opens the visitor’s email app (`mailto:` fallback).

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. **Framework Preset:** Other  
4. **Root Directory:** `.` (repository root)  
5. **Build Command:** leave empty  
6. **Output Directory:** `.`  
7. Deploy.

`vercel.json` enables clean URLs (e.g. `/about` serves `about.html`).

## Deploy to Netlify

1. Connect the Git repository in [Netlify](https://netlify.com).
2. **Build command:** (empty) or `echo 'static'`
3. **Publish directory:** `.`
4. Deploy.

`netlify.toml` includes clean-path redirects (`/about`, `/programs`, etc.) to the HTML files.

## Spotify link

Update the “Listen on Spotify” button in `media.html` when you have the podcast URL (`href="#"` placeholder).
