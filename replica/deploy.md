# GitHub Pages deployment

Repository: `vinitprajapat0822-coder/hari-ram-awpl-store`
Production branch: `main`
Hosting: GitHub Pages only (no Vercel).

## Build configuration

- Next.js static export: `output: "export"`
- Project-site base path: `/hari-ram-awpl-store`
- Static output directory: `out/`
- Remote AWPL product images: direct HTTPS URLs from the official AWPL image host; Next Image optimization is disabled for static hosting.
- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`

## Deployment flow

A push to `main` or manual workflow dispatch builds the static site, uploads `out/` as a Pages artifact, and deploys it using GitHub Pages Actions. The production URL is:

`https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/`

The first workflow run must finish successfully before the URL is considered live. Repository Pages settings must permit GitHub Actions as the build/deployment source.

## Quality gates

The catalogue quality workflow runs TypeScript, ESLint, Next.js static build and Playwright browser/accessibility tests. Browser tests use the same project base path.

## Catalogue/image limitations

The catalogue currently contains 126 parent products grouped from 134 captured listing rows. This is not the complete AWPL selector catalogue. Only exact verified official image URL matches are displayed; unresolved products retain the placeholder. Do not fabricate image filenames or reuse another product's image.

## Release safety

No Vercel project, token or integration is used. Do not claim a successful production deployment until the GitHub Pages deployment workflow reports success.
