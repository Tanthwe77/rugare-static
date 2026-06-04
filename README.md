# Rugare Mental Health Organisation

Static website for Rugare Mental Health Organisation — youth-led mental health advocacy in Malawi.

## Stack

- HTML, CSS, vanilla JavaScript
- No backend, database, or PHP

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| About | `about.html` |
| Programs | `programs.html` |
| Media | `media.html` |
| Contact | `contact.html` |

## Local preview

```bash
npx serve .
```

Open `http://localhost:3000`.

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel and Netlify instructions.

## Project structure

```
├── index.html
├── about.html
├── programs.html
├── media.html
├── contact.html
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   └── images/
├── vercel.json
└── netlify.toml
```

## Contact form

Configure [Formspree](https://formspree.io) in `contact.html` (replace `YOUR_FORM_ID`). Until then, the form uses a mailto fallback.
