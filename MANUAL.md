# PASSAGE
## Two sine waves become a passage

A small livecoding instrument combining paired sine relationships with thin, depth-extended ribbon surfaces. Black and white, Helvetica, no sliders. Audio synthesis, mathematical profiles, and enclosure share the same running state. This is an original interpretation of movement and spatial encounter, not a simulation of a Serra sculpture.

## Start

Open the hosted GitHub Pages site, or run locally:

```sh
python3 -m http.server 8781 --bind 127.0.0.1
```

Open http://127.0.0.1:8781. Click Play directly; audio will not autoplay. Start at low system volume. Both sources are summed before stereo reflections so beating is audible; the sources are not hard-panned separately to the ears.

## Four statements

```text
sine 110
pair sine + 1/4
gain .12
enclose .4 over 60
```

- `sine`: first source frequency in Hz, 30–2000.
- `pair`: second frequency, with `sine` referencing the first source's currently evaluated target frequency. Use `pair off` for one source. Default: `sine+1/4`.
- `gain`: level per source, 0–.25. Default .12. It also controls the profile's displacement. This is source level, not a guaranteed loudness measurement or safety limit.
- `enclose`: amount 0–1 reached once over 0–600 seconds, then held. Default zero. It narrows the drawn passage while darkening the direct signal and increasing damped reflections. This is an expressive coordinated mapping, not physical acoustics.

Arithmetic: `+ - * / % ^ **`, parentheses, `pi`, `sin()`, `cos()`, `abs()`. The variable `t` is elapsed **seconds** since Play. Expressions are evaluated about every 25 ms, not once per keystroke and not as per-sample user code.

```text
sine 110
pair sine + 1/4 + sin(t/20)/10
gain .08 + .04*(1+sin(t/8))/2
enclose .7 over 60
```

`sin()` uses radians. `sin(t/20)` therefore completes a cycle in 40*pi seconds, not twenty seconds. A simpler explicitly timed example is `sin(2*pi*t/60)`, which completes a cycle in sixty seconds. The audio sine itself remains a native oscillator at the given Hz; a slow expression modulates its frequency/level targets.

One statement per line; at most one of each type. `#` begins comments. `sine` is required; other statements have defaults. The `sine` reference is valid inside pair and gain expressions, not recursively inside the first sine expression. Arbitrary JavaScript and property access are not accepted. Later out-of-range expression values hold the last valid audio targets and report an error; submit a valid Update to resume continuous expression evaluation.

## Performance continuity

- **Play:** starts fresh oscillators and a fresh elapsed-time clock. While already playing, Play applies the score rather than restarting.
- **Update / Cmd+Enter / Ctrl+Enter:** applies the whole editor. It retains both native oscillators, phase history, elapsed time, and the existing reflection graph. Frequency/gain targets ease with a .12-second exponential smoothing constant, rather than jumping.
- **Stop / Esc:** suspends audio and freezes the profile animation. Play after Stop explicitly restarts from zero.
- Typing produces a **Draft**. It does not change the sound until Update. Invalid drafts preserve the previous active program.
- An unchanged enclosure target/duration retains its journey; changing either starts from the currently reached amount.
- `pair off` fades the second source while retaining the oscillator internally. Turning it back on reuses its phase history rather than reconstructing it. The ribbon's displacement fades with the corresponding source level.

The carrier never intentionally resets during Update. The mathematical phase model integrates the same exponential frequency smoothing used by the native AudioParams. It is a corresponding model, not a sample-by-sample measurement of the output. Browser suspension, background throttling, sample-rate precision and device behavior may introduce practical discrepancies. Keep the tab visible for performance.

## The two views

### Passage

Each source profile is extruded into a thin ruled surface in fixed perspective. Two surfaces create a corridor. Geometry is not an independent random animation:

- Source frequency controls cycles in the profile window.
- Source gain controls displacement.
- Relative accumulated phase controls the relationship of the two surfaces.
- Enclosure narrows their baseline separation.

Surface depth and camera perspective are visual framing, not a model of a sound wave travelling through actual steel walls. No automatic camera orbit is used. At high amplitudes some apparent crossings are expressive interference, not physical material collision.

### Profiles

A and B are shown separately, followed by their mathematical source sum. This makes the relationship easier to learn before returning to spatial perspective.

The window is fixed at **24 milliseconds**. The common carrier motion is slowed for readability, while **relative phase evolves at the true difference frequency**. This avoids attempting to animate a 110 Hz carrier literally on a screen. A 0.25 Hz difference gives a four-second beat period after frequency smoothing settles. The sum plot is the source sum, not an oscilloscope of the filtered/reverberant final output.

The small output meter is measured from the real master signal. Readouts show smoothed frequencies and their difference, not a decorative counter. Reduced-motion settings reduce redraw frequency; choosing Profiles is a useful less-spatial alternative. Changes are audible and visible without requiring fast typing.

## A short class performance

1. **Unison:** load Unison and Update. The two frequencies match. Let listeners establish the stable tone.
2. **Small difference:** change `pair sine` to `pair sine+1/4`. Wait and hear the slow beats. In Profiles, identify how the source sum changes as relative phase shifts.
3. **A larger difference:** change to `pair sine+1/2`. The beat rate changes. Do not immediately add another manipulation; let the relation be heard.
4. **A moving relation:** use `pair sine+1/4+sin(2*pi*t/60)/10`. The detuning changes slowly over a minute.
5. **Enclosure:** change only `enclose .7 over 60`, then wait. Switch to Passage so the slow narrowing accompanies the changing acoustic field.
6. **Return:** use `pair off`, or `gain 0`, and finally Stop. `gain 0` fades the sources while leaving the existing field to decay; Stop cuts everything immediately.

This is not a requirement to use all stages. A complete piece could be one small change and sustained listening. Keep system volume comfortable and avoid presenting discomfort as evidence of successful spatial intensity.

## Images and saving

**+ image** displays your local image, grayscale and faintly behind the surface drawing; **− image** removes it. Images remain in the page session only, are not uploaded, and are not automatically placed in the GitHub repository. Maximum 15 MB. Use your own images or ones you may display. They are optional: the surface relationship already provides meaningful visual content.

**Save** downloads editor text as `score.passage`. **History** downloads a JSON record of Play/Update/Stop/runtime-error entries with performance-relative timestamps. It does not record audio or provide automatic replay. Example buttons load text as Draft, not a secret playback change. The last successful Update persists in the browser's local storage for this site origin. No account is needed to use the hosted instrument.

## Artistic basis and limits

The approach draws on Richard Serra's concern with bodies moving in relation to material and space, as described by Dia, and the process-based emphasis of *Verb List* described by MoMA. These sources motivate the visual/sonic relationship; they do not specify this oscillator grammar. The paired passage also allows repetition, difference, and interval to remain legible rather than merely illustrating a sculpture.

- Dia, Richard Serra: https://www.diaart.org/exhibition/exhibitions-projects/richard-serra-exhibition
- MoMA, To Collect / Verb List: https://www.moma.org/explore/inside_out/2011/10/20/to-collect/
- Judd, Specific Objects (background to earlier iterations): https://juddfoundation.org/wp-content/uploads/2016/04/Specific_Objects_1964.pdf

This focused edition does **not** include sample playback, microphone capture, recorded gallery soundbanks, HRTF, multichannel installation routing, physical acoustics, or measured sculpture impulse responses. Earlier sampling instruments are separate projects. Two native sine oscillators and a bounded damped stereo feedback field are intentional, learnable material.

## Verification

Tested with Node and real Chromium OfflineAudioContext/live browser interactions: arithmetic and runtime bounds, continuous target/phase modeling, actual beating and finite unclipped fixture output, persistent oscillator generation during Update, invalid-edit preservation, both views, monochrome canvas, Stop/frozen animation, restart, and narrow-screen layout. These tests establish function, not subjective listening quality or a guarantee of safe output at every system volume.
