# PASSAGE

**[Open the instrument](https://egilerad.github.io/passage/)** · **[Performance guide](https://egilerad.github.io/passage/manual.html)**

Two sine waves become a passage: a small livecoding instrument combining audible frequency relationships with thin, depth-extended ribbon surfaces.

```text
sine 110
pair sine + 1/4
gain .12
enclose .4 over 60
```

Click **Play**, begin quietly, edit the code, then press **Update** or **Cmd/Ctrl+Enter**. Updates retain oscillator phase, elapsed time, and echo tails. **Esc / Stop** silences and freezes the visual; Play after Stop restarts.

- **Passage:** two profiles extruded into a fixed-perspective corridor.
- **Profiles:** separate source waves and their mathematical sum.
- **Computation:** arithmetic, `t` in seconds, `sine` references, `sin`, `cos`, `abs`, and `pi`.
- **Images:** optional, local, grayscale backgrounds; never uploaded by the instrument.
- **Privacy:** no account, tracking, remote fonts, or runtime dependencies. The last successful score is stored in this browser's local storage. The site is public; imported images stay in the page session.

The displayed carrier motion is slowed for legibility; the relative phase follows the true frequency difference. This is an expressive audiovisual instrument, **not** a measured acoustic simulation of a Serra sculpture.

See [MANUAL.md](MANUAL.md) for exact syntax, visual mappings, limits, artistic references, and a class performance study.

## Local use

Serve this folder over HTTP rather than opening the HTML as a file:

```sh
python3 -m http.server 8781 --bind 127.0.0.1
```

Open http://127.0.0.1:8781/.

## Tests

Node's built-in test runner checks the grammar, state continuity, and geometry:

```sh
node --test tests/*.test.mjs
```

The browser tests require a local Playwright installation. With a server on port 8781, run:

```sh
npm install --no-save playwright
npx playwright install chromium
node tests/audio-runner.mjs
node tests/browser.mjs
```

Set `BASE_URL` to test a different origin, including the hosted site. OfflineAudioContext tests exercise real synthesis and beating. Browser integration covers live updates, validation, visual modes, Stop, restart, and responsive layout. These establish function, not subjective acoustic realism or a safe listening level at every system volume.

## Hosting

GitHub Pages publishes the root of `main`; `.nojekyll` serves the plain HTML/CSS/ES modules without a build framework. The web instrument never needs GitHub credentials.
