# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Tide Sheet** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing a live tide chart, an OpenStreetMap location marker, solar UV data, and wind data for a configured coordinate, sourced from the [Storm Glass](https://stormglass.io/) API. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
postcss.config.js          <-- Tailwind CSS v3 + autoprefixer, referenced by Vite's CSS pipeline
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  components/
    app/                      <-- top-level component (loader, fonts, i18n)
    main/                     <-- grid layout: title + tidechart + solardata + osmap + winddata
    tidechart/                <-- fetches tide extremes from Storm Glass, renders a recharts AreaChart
    solardata/                <-- fetches UV index from Storm Glass, renders piechartuvgauge per hour
    winddata/                 <-- fetches wind speed/direction from Storm Glass, renders piechartrosecompass per hour
    piechartuvgauge/          <-- recharts gauge (half pie + needle) for UV index
    piechartrosecompass/      <-- recharts gauge (full pie + needle) for wind direction
    osmap/                    <-- react-leaflet map centered on the configured coordinate
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full convention. This template's is `dsplay-template-tide-sheet`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. Doesn't apply to actual template variable content typed in by a CMS user, nor to OpenStreetMap's required tile attribution text in `src/components/osmap/index.jsx` (its exact wording is a license requirement, not this template's own copy).
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself** — never leave it sparse/empty relying on i18next's implicit key-as-fallback behavior.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants like `pt_br`). `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: `const [lng] = locale.split('_'); i18n.changeLanguage(lng);` (done once, in `src/components/app/index.jsx`, since i18next's language is a global singleton shared by every `useTranslation()` call in the tree).
- **Audit `t()` call sites against `src/i18n.js`'s resources whenever either changes** — same principle as the CSS/font audit below: a key used but missing a required language is a bug; a key defined but never referenced is dead. This template previously had zero `t()` usage at all (including a title hardcoded in Portuguese, `"— Tábua de Marés —"`) despite an `i18n.js` full of dead demo keys (`Title`/`Config`/`Media`/`Orientation`).

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- [`@dsplay/react-template-utils`](https://github.com/dsplay/react-template-utils) exposes `useTemplateVal` (used for `latitude`/`longitude`/`storm_glass_api_key`).
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call [`@dsplay/template-utils`](https://github.com/dsplay/template-utils)'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- **New `dsplay_template` variable keys should use `snake_case`** (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's on-screen label from its key name, and snake_case reads more naturally there. This only applies to variables added from now on — never rename this template's existing keys just to match, since they're already registered/in use in production CMS configurations.
- `tidechart`, `solardata`, and `winddata` each independently call the Storm Glass API on mount and cache the response in `localStorage` for a couple of hours — this duplication predates this migration and was left alone; only structure/naming/dependency hygiene and i18n were touched, not runtime/fetch behavior.
- `src/components/osmap/index.jsx` renders a `react-leaflet` map; Leaflet's own CSS/JS are loaded via `<link>`/`<script>` tags in `index.html` from a CDN (unpkg) rather than an npm import, to avoid any risk of regressing marker-icon asset resolution under Vite's bundler — this predates the migration and was kept as-is.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Browser/WebView compatibility (Android SDK 23 minimum)

DSPLAY's Android app supports devices back to Android 6.0 (API 23). On locked-down signage hardware that never receives WebView updates via Play Store, the actual JS engine can be stuck around the Chrome ~40-51 era that shipped with that OS generation — not a modern evergreen browser. `@vitejs/plugin-legacy` exists specifically to cover this: it builds a modern ES-module bundle plus a transpiled+polyfilled "legacy" nomodule bundle for anything the `browserslist` target in `package.json` doesn't natively support.

Two things must never regress, or the legacy bundle silently stops protecting old devices while still *looking* correctly configured:

- **`package.json`'s `browserslist` must keep `Chrome >= 45` and `Android >= 4.4`** (alongside the generic `>0.2%`/`not dead`/etc. entries) — dropping these two narrows the resolved target list to whatever's "current" (verify with `npx browserslist`), which silently stops emitting transpiled code for anything old, even though `@vitejs/plugin-legacy` stays nominally wired up.
- **`vite.config.js`'s `build.minify` must stay `'terser'`, not the default `oxc`** — `oxc`'s minifier has a known bug where it reintroduces `?.`/`??` into the legacy chunk after Babel already expanded them away, silently breaking the one guarantee the legacy build exists to provide.

After touching either of these, verify by actually running `npm run build` and grepping the emitted `build/assets/index-legacy-*.js` for untranspiled arrow functions (`=>`) or real `?.`/`??` usage — a config that looks right can still emit a broken legacy bundle if a dependency version bump reintroduces one of these, so don't assume correctness from the config file alone.

### Fixed: `browserslist` had drifted too narrow, silently defeating the legacy build's old-Android coverage

This repo's `browserslist` was `[">0.2%", "not dead", "not ie <= 11", "not op_mini all"]` — missing the `Chrome >= 45`/`Android >= 4.4` entries present in the reference boilerplate, meaning `npx browserslist` had no explicit floor pinning old Chrome/Android versions into the resolved target list. `@vitejs/plugin-legacy` was still correctly wired to `pkg.browserslist` in `vite.config.js`, so the config looked fine at a glance. `vite.config.js`'s `build.minify: 'terser'` (with its explanatory comment) was already present here, so no change was needed there. Found during a full fleet audit and fixed by restoring the two missing browserslist entries; after rebuilding, `npx browserslist` resolves down through `chrome 45` and `android 4.4`, and the legacy chunk (`build/assets/index-legacy-*.js`) has zero untranspiled arrow functions and no real `?.`/`??` (the only `?.` matches are a regex character-class escape and two ternary expressions like `n?.5:...`, not optional chaining).

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

The 2026 Vite/React 19 migration removed `chart.js`/`react-chartjs-2`, `d3`, `date-fns`, `dayjs`, `react-compass`, `@types/leaflet`, `@types/react-compass` — none were actually imported anywhere in `src/` (this template renders its charts with `recharts` and its map with `react-leaflet` only). It also removed two clearly accidental dependencies, `"-"` and `"save"` (leftovers from a mistyped `npm install` command), and added an explicit `prop-types` dependency — it was being imported by `piechartrosecompass`/`piechartuvgauge` without ever being declared, working only by luck via CRA's flattened `node_modules`.

### Known pending bump: recharts 2 -> 3

`recharts` is pinned to `^2.12.7`; `2.x` is deprecated upstream in favor of `3.x`, but `3.x` has breaking API changes (see [their migration guide](https://github.com/recharts/recharts/wiki/3.0-migration-guide)) that would need careful re-verification of `tidechart`, `piechartuvgauge`, and `piechartrosecompass`'s custom dots/labels/needles — deliberately left out of the 2026 Vite/React 19 migration's scope to avoid an unverifiable visual regression.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
- Version bumps (`package.json`'s `version` field) get their own commit, titled with just the version number and no emoji (e.g. `4.0.0`), separate from the commit(s) that made the actual change.
