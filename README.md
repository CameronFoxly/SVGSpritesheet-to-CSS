# SVG Spritesheet → CSS

A web-based tool that converts SVG spritesheets into ready-to-use CSS animations. Upload a spritesheet, configure your animation parameters, preview the result in real time, and copy the generated CSS.

## Features

- **Spritesheet upload** — drag-and-drop or browse for an SVG spritesheet image
- **Frame configuration** — set frame count, width, height, and FPS
- **Hold frames** — pause on specific frames for a custom duration (great for character idles, blinks, etc.)
- **Live preview** — watch the animation play back in loop, once, or paused mode
- **CSS output** — generates clean `@keyframes` and `.sprite` CSS you can copy straight into your project

## How it works

The tool treats a vertical spritesheet as a sequence of equally sized frames stacked top to bottom. It calculates `background-position` offsets and generates a CSS `steps()` animation that scrubs through them at the configured FPS.

When hold frames are added, the generator switches from a simple `steps(n)` animation to per-frame `@keyframes` percentages, stretching the timeline so the held frame stays visible for the specified extra duration.

## Getting started

```bash
# Clone the repository
git clone https://github.com/CameronFoxly/SVGSpritesheet-to-CSS.git
cd SVGSpritesheet-to-CSS

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Other available scripts:

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR     |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build       |
| `npm run lint`      | Run ESLint                         |

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Base UI)
- Deployed to [GitHub Pages](https://pages.github.com/) via GitHub Actions

## Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork** the repository and create a feature branch from `main`.
2. **Install dependencies** with `npm install`.
3. **Make your changes** — keep commits focused and descriptive.
4. **Lint and build** before pushing:
   ```bash
   npm run lint
   npm run build
   ```
5. **Open a pull request** against `main` with a clear description of what you changed and why.

### Guidelines

- Follow the existing code style (TypeScript, functional React components).
- Keep PRs small and focused on a single change when possible.
- If you're adding a new feature, consider updating this README to document it.
- Bug reports and feature requests are welcome as [GitHub Issues](https://github.com/CameronFoxly/SVGSpritesheet-to-CSS/issues).

## License

This project is licensed under the [MIT License](LICENSE).
