# Technical Capability Chart

A small React and TypeScript design tool for creating technical capability graphics. It renders the chart as real SVG, supports live editing, and exports a standalone SVG file.

## Run It Locally

These steps are for someone who has not used GitHub or a JavaScript project before.

### 1. Install Node.js

Download and install the **LTS** version of Node.js from [nodejs.org](https://nodejs.org/). Node.js includes `npm`, the tool used to install this project's dependencies.

After installing it, open Terminal (macOS/Linux) or PowerShell (Windows) and check that it works:

```bash
node --version
npm --version
```

### 2. Clone the GitHub repository

Cloning downloads a copy of the project to your computer. Run:

```bash
git clone https://github.com/01binary/capabilities.git
cd capabilities
```

If your computer says that `git` is not installed, install Git from [git-scm.com](https://git-scm.com/downloads), then run those commands again.

### 3. Install the project packages

Run this once after cloning, or again after the project's dependencies change:

```bash
npm install
```

### 4. Start the local site

```bash
npm run dev
```

The terminal will show a local address, usually [http://localhost:5173](http://localhost:5173). Open that address in a browser. Keep the terminal running while you work. Changes to the source files will appear in the browser automatically.

Stop the local server with `Ctrl+C`.

## Build For Hosting

The production build is static and can be hosted by S3, CloudFront, Netlify, GitHub Pages, or any web server that serves HTML, CSS, and JavaScript files.

```bash
npm run build
```

This command checks the TypeScript project and creates the deployable files in `dist/`. Upload the **contents** of `dist/` to the website root, not the `dist/` folder itself. The result includes an `index.html` file and hashed assets under `assets/`.

To inspect the production build locally before uploading it:

```bash
npm run preview
```

## Upload To An Amazon S3 Static Website

This guide assumes the S3 bucket is intended to host this site at its root, for example `https://example.com/` or the bucket's S3 website endpoint.

### Option A: AWS CLI

Prerequisites:

- An AWS account and an S3 bucket.
- AWS CLI installed and authenticated with permission to write to that bucket. See the [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
- The bucket's static website hosting is enabled with `index.html` as the index document.

From the project directory:

```bash
npm install
npm run build
aws s3 sync dist/ s3://YOUR-BUCKET-NAME/ --delete
```

Replace `YOUR-BUCKET-NAME` with the real bucket name. The `--delete` option removes old files from the bucket when they no longer exist in `dist/`, which keeps the bucket aligned with the current build. Use it only when the bucket is dedicated to this site.

For a private bucket behind CloudFront, the same upload command works. Configure CloudFront to use the bucket as its origin and invalidate cached files after a release when necessary:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Option B: AWS Console

1. Run `npm run build` locally.
2. Open the S3 bucket in the AWS Console.
3. Open the bucket's **Properties** tab and enable **Static website hosting**.
4. Set the index document to `index.html`.
5. Open the bucket's **Objects** tab.
6. Upload everything inside the local `dist/` folder, including `index.html` and the `assets/` folder.
7. Use the bucket website endpoint shown in the Static website hosting section.

For a public S3 website, AWS may require changing **Block Public Access** and adding a bucket policy that allows `s3:GetObject`. This is an AWS security setting, not an application setting. For production sites, prefer a private bucket with CloudFront and Origin Access Control rather than making the bucket public.

### S3 Details That Matter

- Upload `dist/index.html` to the bucket root as `index.html`.
- Upload `dist/assets/` to `assets/` at the bucket root.
- Keep the Vite `base` setting as `/` when hosting at the bucket root.
- If hosting under a subfolder instead of the bucket root, change Vite's `base` to that path, such as `/capabilities/`, before building.
- This app currently has no client-side routes, so S3 does not need a special fallback rewrite. If routes are added later, configure the hosting layer to serve `index.html` for those routes.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and create `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the project's TypeScript validation |

## Project Structure

- `src/components/CapabilityChart.tsx` renders the SVG visualization.
- `src/lib/capabilityGeometry.ts` contains the deterministic shape geometry and area-aware math.
- `src/lib/svgExport.ts` serializes the chart into a standalone SVG download.
- `src/types/capability.ts` contains the core TypeScript types.
- `src/App.tsx` contains the editor state and controls.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
