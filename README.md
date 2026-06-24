# Interactive Resume Web Application

This project is an **Interactive Resume Web Application** built with React, Vite, and Tailwind CSS. It supports multiple design themes, live previews, and customization.

## Deployment Guide

To host and deploy this application so employers can view your resume online, follow these step-by-step instructions.

### STEP 1: Initialize Git Repository
Initialize git locally inside your exported project folder:
```bash
git init
git add .
git commit -m "feat: initial commit"
```

### STEP 2: Create Repository on GitHub
Go to [github.com/new](https://github.com/new) and make a new public repository. Then run:
```bash
git remote add origin https://github.com/YOUR_USER/resume-applet.git
git branch -M main
git push -u origin main
```

### STEP 3: Deploy to GitHub Pages (Static Hosting)
You can automatically target free static page hosting using GitHub Actions! Create a file in your project under `.github/workflows/deploy.yml` with this exact config:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Build static site
        run: npm run build
      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Under your GitHub Repository settings, navigate to **Pages** (under Code and automation) and switch the build source to **GitHub Actions**. Next time you push to the `main` branch, your site will be built and deployed automatically!
