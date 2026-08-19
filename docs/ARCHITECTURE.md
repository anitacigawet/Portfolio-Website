# Architecture

## Purpose

The portfolio is a static, image-led introduction to a body of public-interest systems work. Its primary job is narrative clarity: let a visitor understand the problems behind the projects, inspect the work, and reach the canonical repository or live site.

## Shape

- React and TypeScript provide a small component model.
- Vite builds the site into static assets in `dist/`.
- One data file, `client/src/data/projects.ts`, keeps released-project order, copy, links, images, and boundaries together.
- `client/src/App.tsx` contains the page's intentionally small set of sections and the featured Z-SPAN presentation.
- Framer Motion supplies restrained entrance and in-view transitions; reduced-motion preferences disable them.
- GitHub Actions independently runs the tests and production build on every push.
- Cloudflare Pages connects directly to the GitHub repository and builds each `main` commit into the production site.

There is no backend. External navigation is limited to the project repositories, the Z-SPAN site, and the owner's GitHub profile.

## Production hosting

- Cloudflare Pages project: `scootsolute-portfolio`
- Git source: `anitacigawet/Portfolio-Website`
- Production branch: `main`
- Build command: `npm test && npm run build`
- Build output: `dist`
- Canonical domain: `https://scootsolute.org`
- Additional domain: `https://www.scootsolute.org`

Only the root and `www` DNS records point to this Pages project. ScootSolute's project subdomains continue to use their existing Cloudflare Tunnel routes.

Cloudflare provides managed HTTPS for both domains. `client/public/_headers` adds a restrictive content security policy, clickjacking protection, MIME sniffing protection, referrer and browser-permission controls, cross-origin isolation headers, and HSTS. The site contains no runtime secrets or environment variables.

## Public-data boundaries

Project descriptions must remain consistent with each project's own README and visible boundaries. In particular:

- Arizona Basin Monitor uses synthetic demonstration data and is not a live monitoring service.
- PrisonBreak supports document review and question preparation; it is not legal advice.
- Z-SPAN summaries are described as traceable to public source recordings.
- Temporarily unavailable project links stay visible when the underlying public project is under maintenance; the portfolio should not silently substitute a different destination.

## Updating the portfolio

1. Update the canonical project's README and screenshots first.
2. Copy the representative screenshot into `client/public/projects/`.
3. Update `client/src/data/projects.ts` or the featured block in `App.tsx`.
4. Run type checking, tests, and a production build.
5. Capture desktop and mobile screenshots and visually review them before publishing.

## Design constraints

The cloud-and-portal entrance is inherited from the original portfolio and is part of its identity. It must not become an accessibility gate: navigation and the full page remain available without clicking an entrance animation. Public copy should stay warm, plain-spoken, and centered on the thinking and usefulness of the project—not technical spectacle or a presumed specialist audience.
