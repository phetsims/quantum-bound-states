# Quantum Bound States — Core Description Design

A design specification for the **screen-reader (Interactive Description) experience** of the Quantum
Bound States simulation, at the **Core Description** phase. The aim is an experience that is *joyful,
pedagogically engaging, and exploratory* — one that hands a learner who relies on description the
same raw, observable facts a sighted learner reads off the graphs, then gets out of the way so the
physics is **discovered, not pre-announced**.

> **Ground truth = the sim.** The simulation is authoritative: `js/` + [state-map.md](state-map.md) for
> structure and behavior, and **`quantum-bound-states-strings_en.yaml` for the exact strings.** Where this
> document — or the historical `Quantum Bound States HTML5 Design Doc.pdf` — disagrees with the sim, **the
> sim wins.** This doc is the *design rationale and target*: it explains the show-don't-tell intent and
> proposes responses not yet authored, but it no longer overrides the shipped strings. Where a response is
> richer here than in the YAML, it is a **proposed target** (flagged as such). Genuinely open items are in
> [§11](#11-open-decisions).

**Sim decisions that supersede the earlier HTML5 Design Doc** (these are settled; the PDF is historical):
>
> - Potential name is **"Pöschl-Teller"**, not "Anharmonic Oscillator" (`potentialWells.poschlTeller`).
> - The **"Localized Particle"** preset keeps its name. "particle" is avoided as a *generic* noun (use "System"), but retained in this specific state name.
> - The inter-well control ships **both** terms: **"separation"** for Finite Square (`finiteSquareSeparationHandle`) and **"spacing"** for Pöschl-Teller (`poschlTellerSpacingHandle`).
> - Superposition keeps four detail/edit controls: **Probability Density Details** and **Wave Function Details** (equation dialogs), **Superposition Preset Details**, and **Superposition Customization** — there is no single "retire the rest" scheme.
> - There is **no "Average Probability Density of Band"** graph and no zoom buttons in the shipped strings — the sim has **two** graph types (Probability Density, Wave Function).
> - Superposition is **6 potentials including Morse**; the Customize dialog uses a **two-value** coefficient format (amplitude / magnitude-and-phase), not three tabs.
> - Coulomb is **E₁-indexed**; time has **five** speed stops.
> - Several richer responses proposed here (Energy Level object response, Angular Frequency, zoom, the Customize-dialog controls) are **not yet authored** in the YAML — the customize-dialog strings are currently parked (commented out).

**Companion docs:** [state-map.md](state-map.md) (every discrete user-settable state) ·
[core-description-overview.md](../../phet-info/doc/core-description-overview.md) ·
[core-description-options.md](../../phet-info/doc/core-description-options.md).
The `Quantum Bound States HTML5 Design Doc.pdf` remains useful for *learning goals and model physics*,
but its UI/string decisions are superseded by the sim wherever they differ.

---

## 1. Design vision and tenets

**Vision.** The described experience is an invitation to explore, not a lecture delivered aloud. It
reports *states, not conclusions*: which potential is chosen, which level is selected, how many times
the curve crosses zero, whether the sim is playing or paused. It is warm, second-person, and
action-forward ("step up through the levels and notice how the wave function responds"), but
disciplined by Core Description's mandate to keep the screen summary **simple** — binary or
enumerable states in Current Details, with richer quantitative detail pushed down next to the object
it describes.

Two hard constraints shape every string:

1. **Avoid "particle" as a generic noun.** The **System** is the noun where one is needed; energy is
   **Total Energy**. (The one exception the sim keeps is the specific **"Localized Particle"** preset name.)
2. **Eigenstate subscripts remap by potential**, so every string that names a level or coefficient
   ships in an **E₀-indexed and an E₁-indexed variant** ([§2.3](#23-subscript-remapping-e-vs-e)).

Equations are spoken as plain left-to-right words, never math font.

### The tenets

| # | Tenet | Do | Don't |
|---|-------|----|----|
| 1 | **Show the state, withhold the conclusion.** Surface the observable a sighted learner reads off the graph; never state the relationship the learner is meant to infer. | "Wave function for E₂. The curve crosses zero 1 time." | "…showing that higher levels always have more nodes." |
| 2 | **Name the System, never the particle.** | "Adjust the mass of the system and observe how the wave function responds." | "Adjust the mass of the particle and observe the particle energy." |
| 3 | **Every eigenstate string ships an E₀ and an E₁ variant,** selected by the potential's ground-state index. | `select_groundStateIndex { 0: "…psi sub 0…", 1: "…psi sub 1…" }` | "Ground state is E₁" hardcoded for all potentials. |
| 4 | **Keep Current Details binary; push richness to the object.** | Summary: "Sim is paused." Graph paragraph: "The curve crosses zero 2 times." | Summary: "Paused, level 3, 2 nodes, real part on, magnitude off, reference line at 0.4 nm." |
| 5 | **Speak equations as plain left-to-right words.** | "The probability density equals the magnitude of the wave function squared." | "\|Ψ(x,t)\|² = the probability density." |
| 6 | **Invite the action; let time reveal the physics.** | "Choose a superposition and press Play to explore how the state behaves over time." | "Press Play to see the superposition oscillate, because two levels beat at their energy difference." |
| 7 | **Anchor help text in change-and-observe, not verdicts.** | "Widen or narrow the well and observe how the energy levels respond." | "Widen the well to lower the levels and space them closer." |
| 8 | **One precise name per thing.** Use the sim's settled names consistently — "separation" (Finite Square), "spacing" (Pöschl-Teller), Total Energy, Wave Function (two words). Context responses report the change, not its significance. | "Separation 0.8 nanometers." / "Real part shown." | "Real part shown, revealing the oscillating structure." |

**Voice rules.** Second person, present tense, active voice. Warm and curious but never hype (no
"amazing," "beautiful," "watch the magic" — joy comes from invitation, not adjectives). Lead with
the action or observable, not the apparatus. One idea per sentence, so a learner can stop at any
period and still have a complete thought. Prefer concrete observables (crossings, counts,
femtoseconds, electron volts) over evaluative qualifiers ("fairly deep," "moderately spaced").

**Anti-patterns** (do not do): pre-announcing a conclusion the learner should discover; "particle" as a
generic noun / "Particle Energy"; "wavefunction" as one word; math font, sub/superscript glyphs, or raw notation
(`|Ψ(x,t)|²`, `Ψ<sub>0</sub>`) inside a spoken string; hardcoding a single subscript index; overloading
Current Details; multi-parameter qualitative scales ("a moderately deep, fairly narrow well with
closely spaced levels"); context responses that interpret rather than report; referencing features the
learner has not reached from within the summary; help text that states the outcome of its own control.

**Punctuation** (Core Description conventions):

- `accessibleName` — title case, no end punctuation ("Reference Line", "Energy Level", "Time Speed").
- `accessibleHelpText` — sentence case, full sentence/phrase, end punctuation.
- `accessibleObjectResponse` — fragment, no end punctuation ("3.2 electron volts", "level 3, crosses zero 2 times").
- `accessibleContextResponse` — sentence case, end punctuation, one or two short sentences.
- `accessibleParagraph` / `accessibleHeading` — sentences / title case as appropriate.
- Spell symbols and units as words: "electron volts", "nanometers", "psi sub 0", "pi over 2".

---

## 2. The physics you can *hear*

Core Description's job here is to make each learning-goal **discovery** reachable through
exploration. For every phenomenon below, the description surfaces the **observable** and stops before
the "so what." The controlled qualitative vocabulary is deliberately small (Core Description warns
against multi-parameter qualitative scales).

| Phenomenon (goal) | Screens | What is observable (surfaced) | Reveal strategy — never say | Vocabulary |
|---|---|---|---|---|
| **Node count rises one-for-one with level** (G1/7) | all | Wave function crosses zero a fixed number of times; density shows that many + 1 humps | Speak the crossing/hump count near the graph; let the learner step levels and notice it climb. Never "nodes = n − 1." | no/one/two crossings; one/two/three humps |
| **Curvature increases with kinetic energy** (G7) | all | Higher levels wiggle faster; curves most where the level sits far above the potential floor | Describe the wiggle per level; let stepping reveal the trend. Never state ψ″/ψ = −(2m/ħ²)(E−V). | gentle wiggle, tighter wiggle, curves more, flatter |
| **Amplitude largest where the System moves slowly** (G7) | One Well | *Excited* states in curved/finite wells bulge toward the turning points; the infinite square well is uniform | **Only for excited states** (see the physics-accuracy note below); ground states are a single central hump | central hump, larger humps toward the outer well, even amplitude |
| **Wave function leaks past the wall and decays** (G7) | One Well, Two Wells | Finite wells: the curve extends past the edge; infinite walls pin it to zero exactly at the wall | Report per level whether it extends past the wall or reaches zero at it. Never say "tunneling." | reaches zero at the wall, extends past the wall |
| **Level spacing depends on potential shape** (G7) | One Well, Superposition, Many Wells | The ladder is spaced differently per potential; switching re-spaces it | Speak neighbor-level energies near the diagram so the learner infers the gap pattern. Never label a potential's n-dependence. | (report energies; learner infers) |
| **Heavier System compresses the ladder, spreads the wave function** (G7) | One Well | Increasing mass moves levels closer and the wave function spreads, inside an unchanged potential | Report new mass and, when it changes, the new level count. Never say heavier compresses/spreads. | (raw mass + count) |
| **The lowest level sits above the well bottom** (G1/7) | all | The ground line never rests at the floor; you cannot select a level at the minimum | On ground select, report its energy relative to the floor; narrowing raises it. Never say "zero-point energy." | ground state, above the well bottom, lowest level |
| **Harmonic Oscillator levels are equally spaced** (G7) | One Well, Superposition | Every adjacent gap is the same; the Angular Frequency readout gives one ω | Let the learner step and read equal energies; ω changes with width **and mass**. Never state E = (n+½)ħω. | evenly spaced, same gap |
| **Coulomb levels crowd toward the top** (G7) | One Well | Gaps shrink rapidly going up; many levels near the top | Let the learner step and read shrinking gaps; the magnifier helps count. Never state −1/n². | (report energies; learner infers) |
| **Each level splits into a close pair as two wells approach** (G3/4) | Two Wells, Superposition | Each single-well level appears as a close pair; a thinner barrier widens the split; the lower member has the same sign in both wells, the upper takes opposite signs with a node between | Surface the sign structure in the graph paragraph and neighbor energies in the diagram paragraph. Never say bonding/antibonding/symmetric/tunneling in described state. | same sign in both wells, opposite signs, node between the wells |
| **Levels cluster into bands with gaps as wells multiply** (G8) | Many Wells | Adding wells rearranges the lines; N wells → N lines per cluster | Report the level count on well-count change; magnifier counts lines. Never say "band," "gap," "band structure." | (report counts; learner infers) |
| **A field tilts the lattice and localizes states** (G9) | Many Wells | The field slants the picture; states gather into fewer wells; levels can tilt out of view | Report tilt direction + reversal. Never say Stark / Wannier-Stark / localization. | tilts up to the right/left, reverses |
| **An eigenstate's \|ψ\|² holds still while Re/Im rotate** (G6) | all | With time running on one level, density and Magnitude do not change; Real and Imaginary parts oscillate; higher level → faster | Let the learner press Play and notice. Never state ω = E/ħ or that the density is stationary. | steady, oscillates, faster, slower |
| **A superposition's \|ψ\|² sloshes; rate set by ΔE** (G4/5/6) | Superposition | Combining ≥2 levels makes the density move; far-apart levels → fast, close → slow; one level → frozen | Phrase the single-level case **identically** to the multi-level case so the contrast is found by playing. Never state the beat formula. | moving, frozen, faster, slower |
| **Representations line up** (G2) | all | Density zeros sit where Real and Imaginary both cross zero; Magnitude is the envelope; density = magnitude squared | Let the learner toggle and notice shared node positions. Never assert \|ψ\|² = Re² + Im². | same node positions, envelope |

### 2.1 Terminology

| Use | Notes (sim ground truth) |
|---|---|
| **System** | The noun where one is needed; otherwise leave the subject inferential. Avoid "particle" as a *generic* noun. The **"Localized Particle"** preset keeps "particle" as a specific state name. |
| **Total Energy** | Not "Particle Energy" (`totalEnergy` string). |
| **separation** (Finite Square) / **spacing** (Pöschl-Teller) | The sim ships **both** inter-well-distance terms: `finiteSquareSeparationHandle` = "separation handle" (edge-to-edge barrier width); `poschlTellerSpacingHandle` = "spacing handle". Match the term to the potential. |
| **Wave Function** | Two words. The visible potential name is **"Pöschl-Teller"** (not "Anharmonic Oscillator"). |

### 2.2 Quantitative-readout policy

Speak a number only where it earns its place, and **at the object, not in Current Details**:

- **Eigenstate subscript label** (E₀/E₁-remapped) — always, in the level's object/context response.
- **Node/crossing count and hump count** (small integers) — the load-bearing enumerable; in the
  **Quantum State Graph accessibleParagraph**, not Current Details.
- **Selected level energy in eV** — in the Energy Level object response and the **Energy Diagram
  accessibleParagraph**, so gaps can be inferred; the Energy Offset has **no numeric readout** (design
  retired it) — speak the selected level's new absolute energy instead.
- **Available-level count** — as a context response when it changes (potential, mass, offset, wells,
  field); keep Current Details to the count at most.
- **System mass** (One Well), **Number of Wells** (Many Wells), **field magnitude** (Many Wells) — in
  the control's own value text, not duplicated in the summary.
- **Coefficient magnitude** (two decimals) and **phase** (multiples of π) — in each slider's value text.
- **Play state and time** — speak the state; the raw time value display is optional and off the
  critical path.

### 2.3 Subscript remapping (E₁ vs E₀)

The **displayed** subscript of every eigenstate label and superposition coefficient is chosen by the
current potential's ground-state index; the *idea* of the state ("first state, second state…") is
unchanged. Because there is no math-to-language tooling and no math font, **every** string naming a
level or coefficient needs both variants, selected at render time — never hardcode a subscript.

| Ground index | Potentials | Ground label |
|---|---|---|
| **1 (E₁-indexed)** | Infinite Square, Finite Square, Infinite Step, Asymmetric Triangle, **Coulomb**, Double Square | E₁, then E₂, E₃… |
| **0 (E₀-indexed)** | Harmonic Oscillator, Pöschl-Teller, Morse | E₀, then E₁, E₂… |

> **Coulomb is E₁-indexed** (per code/state-map and physically correct: the 1D Coulomb spectrum is
> Rydberg-like, Eₙ ∝ −1/n², n ≥ 1). An earlier draft grouped it with the oscillators — that is wrong;
> lock it to E₁.

**Keep the ordinal phrase tied to distance-from-ground** so it is correct under both conventions:
"ground state / first excited state / second excited state…". Only the subscript changes.

```
Energy-level object response (ground):    "ground state, E1, no crossings"  /  "ground state, E0, no crossings"
Energy-level object response (1st excited):"first excited state, E2, one crossing" / "first excited state, E1, one crossing"
Selected-level context response:          "Selected energy level E2."  /  "Selected energy level E1."
Superposition coefficient name:           "Coefficient c1"  /  "Coefficient c0"
Contributing-levels fragment:             "levels E1 and E2"  /  "levels E0 and E1"
```

Band labels (**B1, B2…**, Many Wells) are band ordinals, **not** eigenstate subscripts — they do **not**
remap.

---

## 3. PDOM architecture

### 3.1 Heading structure (every screen)

```
H1  [Screen Name]                          (joist: One Well / Two Wells / Many Wells / Superposition)
    Screen Summary                         (region: play/control/current-details/interaction-hint)
    H2  Play Area
        H3  Energy Diagram                 (dynamic accessibleParagraph: selected level + available count)
        H3  Quantum State Graph            (dynamic accessibleParagraph: crossing/hump counts, tail/sign)
    H2  Control Area
        H3  Energy Diagram Controls        (Potential combo + screen-specific system controls + Energy Level)
        H3  Quantum State Graph Controls   (graph radio group + Curves toggle)
            H4  Wave Function Parts         (Real, Imaginary, Magnitude, Phase)
        H3  Tools                          (Values, Magnifier, Reference Line)
        H3  Time Controls                  (Play/Pause, Step Forward, Restart, Time Speed, Time Value)
```

> **Region name.** Use **"Quantum State Graph"** for the lower-graph region heading and region
> accessibleName — *not* "Wave Function Graph," which collides with the Wave Function radio option.

### 3.2 Where each kind of text lives — and who speaks

This is the rule the critics found most often violated; get it right up front.

- **Static state → `accessibleParagraph`** on the region Node. Read silently on cursor navigation;
  **never fired as an alert.** The dynamic Energy Diagram and Quantum State Graph descriptions
  (selected level, available count, crossing/hump counts, tail/sign observables) are **paragraphs**.
- **One interaction → one context response, owned by the interactive control.** When the learner
  changes the Energy Level, the *spinner* speaks the single context response; the Energy Diagram
  paragraph updates **silently**. Do not also fire the paragraph as a context response — that
  double-speaks on every change.
- **Disabled controls are silent.** A dimmed checkbox fires **no** context response on toggle.
  Availability conditions ("Available when the wave function is shown.") belong in **help text**, and
  the availability *change* is announced by the control that caused it (e.g. the graph radio button).
- **Value controls** (spinners, sliders, keyboard-draggable tools) deliver the object response via
  `createAriaValueText` and the context response via `createContextResponseAlert`, and set
  `keyboardStep` / `shiftKeyboardStep` / `pageKeyboardStep`.

### 3.3 Screen Summary framework

Each screen provides a `ScreenSummaryContent` with four parts:

- **playAreaContent** (static) — orients to the Energy Diagram + Quantum State Graph and invites
  exploration, *without spoiling the screen's payoff.*
- **controlAreaContent** (static) — orients to the controls without over-listing.
- **currentDetailsContent** (dynamic) — **kept simple**: a short list of binary/enumerable states.
  Target 3–5 items (the pH Scale exemplar is 2–3). Absolute numbers (eV, mass, field magnitude) do
  **not** appear here — they live at the object.
- **interactionHintContent** (**static** — one hint per screen, not state-dependent) — names an action and where to look.

---

## 4. Shared components (all screens)

Instantiated by `QBSScreenView`; present on **all four screens** (including Superposition). Object
responses are empty unless the component carries a value.

### 4.1 Quantum State Graph radio group + Wave Function Parts

| Component | Role | accessibleName | Help / context |
|---|---|---|---|
| Graph radio **group** | radio group | **Quantum State Graph** | Help: "Switch between the probability density and the wave function, and observe how the graph changes." |
| **Probability Density** button | radio | Probability Density | Context (selected): "Probability density shown. Wave function parts unavailable." |
| **Wave Function** button | radio | Wave Function | Context (selected): "Wave function shown. Wave function parts available." |
| **Real Part** | checkbox | Real Part | Checked: "Real part shown." Unchecked: "Real part hidden." *(Disabled under Probability Density = silent; availability via subgroup help.)* |
| **Imaginary Part** | checkbox | Imaginary Part | Checked: "Imaginary part shown." Unchecked: "Imaginary part hidden." |
| **Magnitude** | checkbox | Magnitude | Checked: "Magnitude shown. Phase available." Unchecked: "Magnitude hidden. Phase unavailable." *(Drop the Phase clause if the Phase preference is off.)* |
| **Phase** | checkbox | Phase | Help: "Available when the magnitude is shown." Checked: "Phase shown." Unchecked: "Phase hidden." |

- The **Wave Function Parts** subgroup gets an `accessibleHeading` ("Wave Function Parts") and help
  "Show or hide parts of the wave function. Available when the wave function is shown."
- **Gating:** parts are enabled only under the Wave Function graph. **Phase** is *present* only when
  `QBSPreferences.phaseCheckboxVisibleProperty` is on, and *enabled* only when Magnitude is checked
  **and** Wave Function is selected. `?phaseToColor` (twilight/rainbow) has no described-state effect.
- **Disabled = silent** for all four parts (no context response on a dimmed toggle).

### 4.2 Curves toggle and Tools

| Component | Role | accessibleName | Help / context |
|---|---|---|---|
| **Curves** | toggle button | Hide Curves / Show Curves (`accessibleNameOn`/`Off`) | Help: "Hide the curves to predict their shape, then show them to check." Context: "Curves shown." / "Curves hidden." |
| **Values** | checkbox | Values | Help: "Keep values visible for handles and energy levels." Context: "Values stay visible." / "Values shown on focus." *(YAML: the Values checkbox pins value labels on rather than showing them only on focus.)* |
| **Magnifier** | checkbox | Magnifier | Help: "Show a magnifier to look closely at the energy levels." Context: "Magnifier shown." / "Magnifier hidden." |
| **Reference Line** | checkbox | Reference Line | Help: "Show a vertical line you can drag across the graph to read values at a position." Context: "Reference line shown." / "Reference line hidden." |

> Magnifier help says "**look closely at** the energy levels," not "closely spaced levels" — the
> crowding is a discovery, not a given.

### 4.3 Time controls

| Component | Role | accessibleName | Help | Object (`createAriaValueText`) / context (`createContextResponseAlert`) |
|---|---|---|---|---|
| **Play / Pause** | play button | Play / Pause (`startPlayingAccessibleName`/`endPlayingAccessibleName`) | Paused: "Play to let time run. Watch the wave function graphs and the current time." Playing: "Pause to stop time and hold the current moment." | Context: "Time playing." / "Time paused." |
| **Step Forward** | button | Step Forward | "Advance time by one step. Available while paused." | Context: "Stepped forward. Time {value} femtoseconds." *(Drop the value clause if Time Value is hidden.)* Disabled while playing = silent. |
| **Restart** | button | Restart | "Reset time to zero." | Context: "Time reset to zero." Disabled at zero = silent. |
| **Time Speed** | slider (5 stops) | Time Speed | "Adjust how fast time runs. Changing the speed resets the clock to zero." | Object: "3 of 5, 1 femtosecond per step" (stops 1–5 = 0.01/0.1/1/10/100 fs). Context: "Time speed 3 of 5. Clock reset to zero." Set all keyboard steps = 1. |
| **Time Value** | toggle button | Hide Time Value / Show Time Value | "Show or hide the numeric time value." | Context: "Time value shown." / "Time value hidden." |

> **Deliberate parity (show-don't-tell):** the Play/Pause help and context are **identical** on the
> eigenstate screens (where \|ψ\|² is frozen) and on Superposition (where it sloshes). The difference is
> exactly what Play exists to reveal, so it is never pre-announced; it surfaces only through the
> Quantum State Graph paragraph updating, or not, while time runs.

### 4.4 Draggable tools (Play Area)

| Component | accessibleName | Help | Object response (`createAriaValueText`) |
|---|---|---|---|
| **Reference Line** (draggable) | Reference Line | "Drag left or right to read the graph values at that position." | Position + values for the **currently shown** parts only. Density: "0.4 nanometers, probability density 0.32 per nanometer." Wave Function: "0.4 nanometers, real part 0.30" (add magnitude if shown). Curves hidden: "0.4 nanometers." |
| **Magnifier** (draggable) | Magnifier | "Drag over the energy diagram to look closely at the energy levels." | Center energy + in-view level count: "centered at 3.2 electron volts, 3 energy levels in view" / "…no energy levels in view." |

Both appear when their checkbox is checked (the checkbox owns the appear/disappear context response).
Report only the enabled parts so the tool never contradicts the visible/hidden state. Never say
"levels crowd together" or name band structure — speak the count and stop.

### 4.5 Potential combo box

- **accessibleName:** "Potential" · **Help:** "Choose the shape of the potential well, and observe how
  the energy levels and the wave function respond."
- **Object response:** the selected item name (spoken natively), e.g. "Harmonic Oscillator."
- **Context response** (energy-level screens): report the selection, the new available-level count,
  and the reset to ground — with the correct subscript variant:
  ```
  flat well:   "Finite Square Well selected. {N} energy levels. Ground state selected."   (E1 ground)
  curvy well:  "Harmonic Oscillator selected. {N} energy levels. Ground state selected."  (E0 ground)
  Superposition: "Morse selected."   (no energy-level clause — none exists on this screen)
  ```
- Options per screen: One Well 8, Two Wells 2, Many Wells 2, Superposition 6. Never editorialize the
  shape ("deep," "narrow"). The visible potential name is **Pöschl-Teller** (the earlier "Anharmonic
  Oscillator" relabel was not adopted in the sim).

### 4.6 Energy Level spinner (One Well, Two Wells, Many Wells — absent on Superposition)

- **accessibleName:** "Energy Level" (stable, for quick-nav; the subscript rides in the responses).
- **Help:** "Move up or down through the energy levels, and observe how the wave function and its
  shape respond."
- **Object response** (`createAriaValueText`) — ordinal phrase (distance-from-ground) + subscript + energy:
  ```
  E1-indexed: "ground state, E1, 2.1 electron volts" · "first excited state, E2, 4.3 electron volts"
  E0-indexed: "ground state, E0, 0.5 electron volts" · "first excited state, E1, 1.5 electron volts"
  ```
- **Context response** (`createContextResponseAlert`): "Selected energy level E{subscript}." Plus a
  **separate** shared alert "Time reset and paused." (interacting restarts and pauses time). At range
  ends: "Ground state, lowest level." / "Highest available level."
- The **node/crossing count** lives in the Quantum State Graph paragraph, **not** here — keep this
  response to identity + energy. Range = `[groundStateIndex, groundStateIndex + boundStateCount − 1]`.

---

## 5. Screen 1 — One Well

**Primary goal (G7):** predict how curvature, amplitude, decay outside the well, and level spacing
depend on the **shape of the potential** and the **mass of the System**. Also G1, G2, G6. Potentials
(8): Infinite Square · Finite Square · Infinite Step · Asymmetric Triangle · Harmonic Oscillator ·
Pöschl-Teller · Morse · Coulomb.

**Physics framing.** This screen isolates how quantum structure responds to two things the learner
controls: the shape of the well and the System mass. Description exposes raw facts only — the ladder's
count and the selected level's energy and neighbor gaps (so switching potentials reveals the distinct
spacing signatures), the interior crossing/hump count (so stepping reveals the node climb), whether
the wave function reaches zero at the wall or extends past it (finite vs infinite contrast), and, for
excited states in curved wells, where its humps sit. The Angular Frequency readout lets the learner
tie the even Harmonic ladder to one ω that responds to **both** width and mass. Time controls invite
pressing Play and watching Real/Imaginary move; the stationarity of \|ψ\|² is never pre-announced.

### 5.1 Screen summary

- **playArea:** "In the upper play area, an energy diagram shows a potential well drawn as a purple
  curve, with green horizontal lines marking the energy levels of the system held inside it. One level
  is selected and highlighted. Below the diagram, a second graph shows the wave function for that
  level, either as a probability density or as its Real, Imaginary, and Magnitude parts. Choose among
  eight potentials, adjust the mass of the system, and step through the levels, and both graphs redraw
  so you can compare how the wave function changes shape and how the energy levels rearrange."
- **controlArea:** "The controls choose one of eight potentials, adjust the mass of the system in
  electron masses, and select which energy level to examine. A spinner beside the energy diagram
  shifts the zero of the energy scale. You can switch the lower graph between Probability Density and
  Wave Function, choose which wave-function parts are drawn, and add tools: value labels, a magnifier,
  and a movable reference line. Time controls play, pause, step forward, restart, and set how much
  time passes with each step."
- **currentDetails** — leading: "The One Well screen is ready to explore. Change any control and the
  graphs respond." Then (**enumerable only** — numbers live at the objects):

  ```
  Potential: { select_potential { infiniteSquare: "Infinite Square Well", finiteSquare: "Finite Square Well",
    infiniteStep: "Infinite Step", asymmetricTriangle: "Asymmetric Triangle",
    harmonicOscillator: "Harmonic Oscillator", poschlTeller: "Pöschl-Teller",
    morse: "Morse", coulomb: "Coulomb" } }.
  Selected level: { select_ordinal { ground: "ground state", excited: "{$ordinalWord} excited state" } }.
  Graph: { select_graph { probabilityDensity: "Probability Density", waveFunction: "Wave Function" } }.
  Sim is { select_playing { playing: "playing", paused: "paused" } }.
  ```

  *(Mass, energy zero, parts, curves, tools, time speed are each surfaced at their own control; keep
  them out of the summary. If faculty want the energy zero flagged, add a single binary line
  "Energy zero: shifted from default." — never a number.)*
- **interactionHint** (static): "Choose a potential, then step up through the energy levels and notice
  how the wave function and the energy ladder respond."

### 5.2 Screen-specific components

**System Mass** (`ElectronMassesControl`, One Well only) · name "System Mass" · help "Adjust the mass
of the system and observe how the wave function and the energy levels respond." · object "{value}
electron masses" (0.5–1.1, default 1.0) · context "Mass {value} electron masses." and, when the level
count changes, add "{N} energy levels." Never say heavier compresses/spreads.

**Energy Offset** (`EnergyRangeShiftSpinner`, lower-left of the diagram) · name "Energy Offset" · help
"Shift the zero of the energy scale up or down and read how the energy labels and the selected level
respond." · **no numeric offset readout** — object/context speak the selected level's new absolute
energy: "Energy zero shifted up. Selected level now {energy} electron volts." Interacting restarts and
pauses time; does not move the potential curve; each potential keeps its own offset; **not** reset by
Reset All.

**Energy Level** — see [§4.6](#46-energy-level-spinner-one-well-two-wells-many-wells--absent-on-superposition). Ground index 1 for
Infinite Square/Finite Square/Infinite Step/Asymmetric Triangle/**Coulomb**, 0 for Harmonic/Pöschl-Teller/Morse.

**Angular Frequency readout** (Harmonic Oscillator only, read-only) · name "Angular Frequency" · help
"Read the angular frequency of the Harmonic Oscillator; it changes as you adjust the well width **or
the system mass**." · object "omega equals {value} per femtosecond." · context fires on width change
**and on mass change** (both drive ω): "Angular frequency omega equals {value} per femtosecond." When
a non-Harmonic potential is selected: "Angular frequency readout hidden." Lets the learner tie the
even ladder to one ω without stating E = (n+½)ħω.

**Well-geometry handles** (focusable draggables — must be labeled; `createAriaValueText` /
`createContextResponseAlert`):

| Handle | Present for | Name | Object | Context |
|---|---|---|---|---|
| **Well Width** | all 8 potentials | Well Width | "{value} nanometers" | "Well width {value} nanometers. {N} energy levels available." + at-min/at-max |
| **Well Depth** | Finite Square, Asymmetric Triangle, Pöschl-Teller, Morse | Well Depth | "{value} electron volts" | "Well depth {value} electron volts. {N} energy levels available." + at-min/at-max |
| **Step Height** | Infinite Step only | Step Height | "{value} electron volts" | "Step height {value} electron volts. {N} energy levels available." + at-min/at-max |

Help (change-and-observe): "Widen or narrow the well and observe how the energy levels and wave
function respond." (depth/step analogous). Report value + resulting level count; never state the
outcome relationship.

### 5.3 Play-area paragraphs (dynamic `accessibleParagraph`, silent on read)

**Energy Diagram** — "{N} energy levels. {ordinal} E{subscript} selected at {energy} electron volts."
plus neighbor energies so the learner can infer the gap pattern and the ground-state gap above the
floor: ground → "…{gapAbove} electron volts below the next level up"; middle → "Next level down
{eBelow}, next level up {eAbove}"; highest → "…{gapBelow} electron volts above the level below."
Never label spacing "spreading / even / crowding."

**Quantum State Graph** — carries the load-bearing counts and the boundary/amplitude observables:

- **Node/hump count:** Density → "Probability density for E{subscript}: {select humps → 1: 'one hump,
  no interior zeros'; 2: 'two humps, touching zero once between them'; other: '{humps} humps, touching
  zero {nodes} times between them'}." Wave Function → "Real part for E{subscript}: {select crossings →
  0: 'no interior crossings'; 1: 'crosses zero one time'; other: 'crosses zero {crossings} times'}."
- **Boundary (per side, mixed-wall aware):**
  - Both walls infinite (Infinite Square): "The wave function reaches zero at each wall."
  - Both sides finite: "The wave function extends past each wall."
  - **Mixed** (Infinite Step, Asymmetric Triangle — one infinite wall, one open/sloping side): "The
    wave function reaches zero at the vertical wall and extends past the open side." *(The finite-tail
    string must never fire for the infinite wall.)*
- **Amplitude (physics-corrected — gate by level):**
  - **Ground state** of any well: "a single central hump." (Do **not** say "tallest near the edges" —
    ground states of Harmonic/Pöschl-Teller/Morse peak in the middle; Coulomb peaks at the nucleus.)
  - **Excited states** of curved wells (crossings ≥ 1): "the largest humps sit toward the outer parts
    of the well." Reference the turning points, not fixed "edges."

Never state "nodes = n − 1," never say "tunneling," never state the amplitude law. Humps = crossings + 1.

---

## 6. Screen 2 — Two Wells (Molecular Bonding)

**Primary goal (G3/4):** build a model for molecular bonding from the splitting of single-well levels
into close pairs — surfaced **only** as raw observables. Potentials (2): Finite Square Well (E₁) ·
Pöschl-Teller (E₀). Mass, field, well-count are fixed constants (no controls).

**Physics framing.** Each single-well level appears as a close pair; thinning the barrier widens the
split. Description surfaces three raw facts and stops: (1) the Energy Diagram paragraph reports the
selected level plus its nearest neighbor's energy, so pairs and their splitting read as an energy
difference; (2) the Separation handle reports the barrier getting narrower/wider — **value only**; (3)
the Quantum State Graph paragraph reports the sign structure (same sign in both wells = lower member;
opposite signs with a node between = upper member). The learner builds the bonding/antibonding model
themselves; **bonding, antibonding, symmetric, antisymmetric, molecule, tunneling, and "paired" are
withheld** from all described state.

### 6.1 Screen summary

- **playArea:** "In the upper play area, two potential wells sit side by side, drawn as an energy
  diagram with a ladder of energy levels across them. Drag handles set the wells' width and depth, and
  a separation handle brings the two wells closer together or moves them farther apart. Below, a second
  graph shows the probability density or the wave function for the selected level. Select a level,
  reshape the wells, and explore how the levels and wave function respond."
- **controlArea:** "A potential menu offers two double-well shapes. An energy level control steps
  through the levels. A graph selector switches between Probability Density and Wave Function, with
  checkboxes for the Real part, Imaginary part, and Magnitude. A tools panel adds a values readout, a
  magnifier, and a movable reference line. Time controls play, pause, step forward, and set the speed."
- **currentDetails** (enumerable only): Potential (Finite Square Well / Pöschl-Teller) ·
  Selected level (ordinal only) · Graph (+ "curves hidden" flag) · Sim playing/paused. Level energy,
  well values, and time speed live at their objects.
- **interactionHint** (static): "Choose an energy level and explore how the wave function fills the two
  wells."

### 6.2 Screen-specific components

**Well Width** (Finite Square only; the Pöschl-Teller width is fixed at 0.2 nm so the handle is absent) ·
name "Well Width" · object "well width {value} nanometers" · context "Well width {value} nanometers.
{N} energy levels available." + at-min/at-max.

**Well Depth** (both potentials) · name "Well Depth" · object "well depth {value} electron volts" ·
context "Well depth {value} electron volts. {N} energy levels available." + at-min/at-max. A shallower
well may drop the selected level out of range → resets to ground state.

**Separation** (the screen's primary control) · name "Separation" · help "Move the two wells closer
together or farther apart and observe how the energy levels respond." · object "separation {value}
nanometers" · **context = value + barrier only:**
```
decreased: "Separation {value} nanometers, barrier narrower."
increased: "Separation {value} nanometers, barrier wider."
at min/max: "Separation at minimum/maximum, {value} nanometers."
```
> **Do not** append "Nearby energy levels spread apart / move closer together." That narrates the
> Goal 3/4 discovery. Let the Energy Diagram paragraph's neighbor-energy readout update independently
> so the learner correlates the two facts themselves. Use "Separation" everywhere (even though the
> Pöschl-Teller Property is labeled `spacing` in code); for Finite Square it is the edge-to-edge
> barrier width. Handles clamp before the wells merge.

### 6.3 Play-area paragraphs

**Energy Diagram** — "{N} energy levels across the two wells. Level E{subscript} selected at {energy}
electron volts. The nearest level is E{neighbor} at {neighborEnergy} electron volts." (E₀/E₁ by
potential.) Reporting the selected level + nearest neighbor lets the learner hear that levels arrive
in close pairs and read the splitting as a difference — without asserting pairing.

**Quantum State Graph** — pick **one** enumerable per representation (crossings under Wave Function;
humps under Density) so the same node information is not announced twice, and carry the sign structure:
"Wave function for level E{subscript}. It crosses zero {n} times. Across the barrier the two wells
have {select → same: 'the same sign'; opposite: 'opposite signs'}." Never label the members bonding /
antibonding in the paragraph.

---

## 7. Screen 3 — Many Wells (Band Structure)

**Primary goals (G8, G9):** band structure from a lattice; the bridge from one atom to a solid. Also
the field-tilt goal (G4 of this screen). Potentials (2): Finite Square (E₁) · Pöschl-Teller
(E₀). Mass fixed.

**Physics framing.** A lattice rearranges the energy lines into clusters separated by empty ranges;
a field tilts the picture and gathers states into fewer wells. Description surfaces only raw
observables — which potential, how many wells, which level and its energy, crossing count, field
off/tilting-which-way, whether a level tilted out of view — and stops. **Band, gap, band structure,
delocalization, Stark, Wannier-Stark, localization never appear.** As the learner raises the well
count, the level-count context response and the magnifier let them watch the lines crowd and infer
clustering. As they raise the field, the tilt/reverse responses let them notice
states gathering. *(Goal 9's "one atom → solid" bridge was to be served by a band-average graph that the
sim does not ship — see §7.3.)*

### 7.1 Screen summary

- **playArea:** "You are in a lattice: a row of identical wells sits in the energy diagram, with a
  horizontal line at the energy of each bound state of the system. Below, a graph shows the same state
  as a probability density or as the parts of its wave function across all the wells. You choose how
  many wells to line up, from one to eight, and you can apply an electric field that slants the whole
  row. Step through the energy lines one at a time, and as you add or remove wells, notice how the
  lines rearrange."
- **controlArea:** "The top panel chooses the potential shape, sets the Number of Wells, and applies
  an Electric Field that tilts the potential either direction by its sign; it also selects the energy
  level. The bottom panel chooses the lower graph: Probability Density or Wave Function with its parts.
  Drag handles set the wells' width, depth, and Separation once more than one well is present. Along the
  bottom are tools — value labels, a magnifier, and a movable reference line — plus time controls and
  Reset All."
- **currentDetails** (enumerable only):
  ```
  Potential: Finite Square / Pöschl-Teller.
  { $numberOfWells -> [1] "One well" *[other] "{$numberOfWells} wells" } in the lattice.
  Selected {ordinal} level.
  Electric field is { $field -> [off] "off" [right] "tilting up to the right" *[left] "tilting up to the left" }.
  Sim is { playing / paused }.
  ```
  *(Field **magnitude** in V/nm and level **energy** in eV live at the slider and the diagram
  paragraph, not here.)*
- **interactionHint** (static): "Choose the number of wells and step through the energy levels to
  explore the lattice."

### 7.2 Screen-specific components

**Number of Wells** (`NumberControl`, integers 1–8, default 3) · name "Number of Wells" · help "Set
how many identical wells line up in the lattice, from one to eight, and observe how the energy lines
respond." · object "{n} wells" / "1 well" · context "{n} wells. Now {N} energy levels." + "1 well.
Fewest wells." / "8 wells. Most wells." When wells > 1 the Separation handle activates; interacting
restarts and pauses time. Do not say the lines "form bands."

**Electric Field** (slider, −1…1 V/nm, default 0) · name "Electric Field" · help "Apply an electric
field to tilt the whole lattice, and observe how the energy lines and wave function shift. Reverse the
sign to tilt the other way." · object "{state → off: 'off, 0 volts per nanometer'; on: '{value} volts
per nanometer, tilting up to the {right/left}'}" · context: turn-on "Field on, tilting up to the
{right/left}, {value} volts per nanometer."; return to zero "Field off."; cross zero "Field reversed,
tilting up to the {right/left}."; out-of-view "Selected level tilted out of view." *(The sim's solver-driven y-range
adjusts; there are no zoom buttons in the shipped strings.)* Never name Stark / Wannier-Stark / localization.

**Well Width** (Finite Square; Pöschl-Teller width fixed at 0.2 nm → absent) and **Well Depth** (both) —
same pattern as Two Wells: object "{value} nanometers/electron volts"; context adds "{N} energy levels
available." + at-min/at-max. **Separation** (active only when wells > 1) · object "{value} nanometers"
· context "Separation {value} nanometers." Disabled at one well: help/announcement "Separation is
unavailable with one well." Edge-to-edge barrier for Finite Square; say "Separation" for both.

**Energy Level** — shared pattern ([§4.6](#46-energy-level-spinner-one-well-two-wells-many-wells--absent-on-superposition)); range depends on potential, wells,
and field.

### 7.3 Not in the sim: Average Probability Density of Band

The HTML5 Design Doc floated a third "Average Probability Density of Band" graph (with a Band selector
replacing the Energy Level spinner, and `B1, B2…` band labels). **The sim does not ship it** — there are
two graph types only, so there is no band selector, band labels, or band-average equation to describe.
If it is ever added, describe the single-state density and the band-average with the *same* neutral
enumerable (peak count across the wells) and let the learner notice the repetition; never say
"smooth / lumpy / delocalized."

---

## 8. Screen 4 — Superposition

**Primary goals (G4, G5, G6):** what a superposition is; how its time dependence tracks the energy
**difference**; what is and is not time-dependent for an eigenstate vs a superposition. **No single
energy-level selection** on this screen. Potentials (6): Infinite Square (E₁) · Finite Square (E₁) ·
Harmonic Oscillator (E₀) · Pöschl-Teller (E₀) · Morse (E₀) · Double Square Well (E₁).

**Physics framing.** Three linked phenomena: (a) an eigenstate's \|ψ\|² is stationary while a
superposition's evolves; (b) the evolution rate tracks the energy difference (far-apart levels beat
fast); (c) at least two nonzero coefficients are required for motion, so a single-coefficient
"superposition" behaves exactly like an eigenstate. Description surfaces only which potential, which
levels contribute and with what coefficients, which representation is shown, and playing/paused. It
**never** says the density sloshes, never states the beat relationship, and **phrases the single-level
case identically to the multi-level case** so the frozen-vs-moving contrast is found by pressing Play.

### 8.1 Screen summary

- **playArea (de-spoiled):** "In the upper play area, the energy diagram shows the potential well as a
  purple curve and its bound energy levels as green lines; the levels that make up the current
  superposition are marked. Below it, the Quantum State Graph shows the current state across position,
  as either a Probability Density or a Wave Function. Unlike a single energy level, a superposition
  combines several levels at once. Build a combination and press Play to explore what the state does."
- **controlArea (de-spoiled):** "At the top, choose a potential well, then use the switch to pick
  Preset or Custom superpositions. Presets are ready-made combinations of levels; Custom opens a dialog
  where you set your own coefficients and save them. Below, choose whether the lower graph shows
  Probability Density or the Wave Function and its parts, and toggle the curves. Near the bottom, add
  tools — Values, a Magnifier, and a Reference Line — and use the time controls to play, pause, step
  through, and set the speed."
- **currentDetails** (the model to emulate — enumerable/binary):
  ```
  Potential: {6 names}.
  { $type -> [preset] "Preset superposition, {$presetName}"
            *[custom] "Custom superposition, {$customName}{ $valid -> [false] ", not valid for this potential" *[true] "" }" }.
  Graph: { probabilityDensity: "Probability Density" *[waveFunction] "Wave Function, parts: {$parts}" }.
  Curves are { shown / hidden }.
  Sim is { playing / paused }.
  ```
- **interactionHint** (static): "Choose a preset superposition and observe the quantum state graph to
  explore how the state changes over time."

### 8.2 Screen-specific components

**Preset / Custom switch** (`ABSwitch`) · `valueAAccessibleName` = "Preset", `valueBAccessibleName` =
"Custom" · help "Switch between ready-made preset superpositions and your own saved custom
superpositions." · context via `accessibleContextResponseLeftValue`/`RightValue`: "Preset
superpositions shown." / "Custom superpositions shown." (No freestanding object response — the switch
speaks its value natively.) Gates which combo box + button is visible.

**Preset combo box** (5 presets; subscripts remap; visible when type = Preset) · name "Preset
Superposition" · help "Choose a combination of energy levels, then press Play to explore how the state
changes over time." · object/context speak the equation as plain words + contributing levels, in both
variants:

| Preset | E₁ variant | E₀ variant |
|---|---|---|
| 1 | "c psi 1 plus c psi 2. Contributing levels E1 and E2." | "c psi 0 plus c psi 1. Contributing levels E0 and E1." |
| 2 | "c psi 1 plus c psi 3. Contributing levels E1 and E3." | "c psi 0 plus c psi 2. Contributing levels E0 and E2." |
| 3 | "c psi 1 minus c psi 2. Contributing levels E1 and E2." | "c psi 0 minus c psi 1. Contributing levels E0 and E1." |
| 4 | "c psi 1 plus c psi 2 plus c psi 3. Contributing levels E1, E2, and E3." | "c psi 0 plus c psi 1 plus c psi 2…" |
| 5 (Localized) | "Superposition set to **Localized Particle**. Contributing levels span many of the lower energy levels." | same |

> Preset 5 is **"Localized Particle"** (`superpositionStates.preset5`) — the sim keeps this name. Never
> say why combining levels makes the density move.

**Custom combo box** (custom1–5; visible when type = Custom) · name "Custom Superposition" · help
"Choose one of your saved custom superpositions, or open Customize to build a new one." · context
"Custom {n} selected."; invalid: "Custom {n} selected. It uses levels the current potential does not
have, so no state is shown."

The sim ships **four** detail/edit controls on this screen (not a single "Superposition Details"):

**Superposition Preset Details button** (`presetButton`, Preset side; opens a read-only dialog) · name
**"Superposition Preset Details"** · help "Open the full equation and coefficient list for selected
superposition preset." · context "Superposition Details dialog opened." Dialog = summed equation +
per-level coefficients, all plain text.

**Superposition Customization button** (`customButton`, Custom side; opens the edit dialog) · name
**"Superposition Customization"** · help "Open the Customize Superposition dialog to set the contribution
of each energy level in the superposition." · context "Superposition Customization dialog opened."

**Graph equation buttons** (`probabilityDensityDetailsButton`, `waveFunctionDetailsButton`; on the
Quantum State Graph) · names **"Probability Density Details"** / **"Wave Function Details"** · help "Open
the full equation for the probability density / wave function of the selected state." · context
"Probability Density equation shown." / "Wave Function equation shown." They open
`probabilityDensityDetailsDialog` / `waveFunctionDetailsDialog` (each currently ends with a
`PLACEHOLDER_FOR_EQUATION` token).

**Customize dialog controls** *(design target — in the YAML these a11y strings are currently **parked,
commented out**; the coefficient format is a **two-value** switch, `amplitude` / `magnitudeAndPhase`,
not three tabs. Author these when the dialog is wired.):*

| Control | Name | Object / context |
|---|---|---|
| **Number of Coefficients** (spinner, 2–48) | Number of Coefficients | "{n} coefficients" · "Now {n} coefficients." + "…fewest/most allowed." |
| **Coefficient Format** (radio) | Coefficient Format | "Amplitude format. Each level is set by one signed value." / "Magnitude and phase format. Each level is set by a magnitude and a phase." |
| **Coefficient amplitude** (per slot; amplitude format) | "Coefficient c{subscript}" (E₀/E₁) | object "amplitude {value}{, level available / , level unavailable for this potential}" (range −1…1) |
| **Coefficient magnitude** (per slot; mag+phase) | "Coefficient c{subscript} Magnitude" | object "magnitude {value}" (0…1, two decimals) |
| **Coefficient phase** (per slot; mag+phase) | "E{subscript} Phase" | object "phase {0 / pi over 2 / pi / …}" (see §11 on range) |
| **Normalize and Save** | Normalize and Save | "Superposition normalized and saved." (invalid: "…It uses levels the current potential does not have, so no state is shown until you switch potentials or edit it.") |
| **Clear** | Clear | "All coefficients cleared to zero." |

> **Validity indicator = folded in, not a separate stop.** The green/red slot marker is surfaced as
> "level available" / "level unavailable for this potential" inside each coefficient control's object
> response — **not** as a standalone focusable node (that would add a stop per slot).

### 8.3 Play-area paragraphs

**Quantum State Graph** (the Goal 5/6 payoff) — name the contributing levels and invite Play; **never**
say the density sloshes, tracks the gap, or that one level stays frozen:
```
valid:          "This state combines {contributing levels}. Press Play to explore how it changes over time."
single level:   "This state uses a single level, {level}. Press Play to explore how it behaves over time."   (identical framing)
invalid:        "This superposition uses levels the current potential does not have, so no state is shown.
                 Switch to a potential with more levels, or edit the superposition in Customize."
curves hidden:  "Curves are hidden. Predict the shape of the current state, then show the curves to check."
```
*Internal note: label the single-coefficient case "single contributing level," not "degenerate
superposition" (degenerate has a distinct QM meaning).* For a time-evolving superposition, node counts
change continuously, so **omit** node counts here — surface contributing levels + coefficients only.

**Energy Diagram** — "Contributing levels: {levels}." Invalid: "No levels are marked, because the
current superposition uses levels this potential does not have." Do **not** describe the
weight/emphasis of the marked levels; just name which contribute (add coefficient magnitudes near the
object only when Values is on).

**Well-geometry handles.** Reshaping a well changes the available levels and can invalidate the active
superposition. At minimum, the **Double Square separation** handle is a distinct focusable control and
needs a labeled name/object/context (mirror Two Wells). Confirm whether the other per-potential
width/depth handles are focusable here; if so, label them; if intentionally non-focusable, record that.

---

## 9. Preferences

**Wave Function Phase** (`PhaseFeatureControl`, Preferences ▸ Simulation; also `?phaseCheckboxVisible`).
Toggle name/label per the standard preference pattern; description: "Add a Phase checkbox to the wave
function controls for showing and hiding the phase of the wave function." Global, cross-screen,
survives Reset All, default **off** (design intent). When on, the Phase checkbox appears (still gated by
Magnitude) on every screen.

---

## 10. Per-screen state-coverage summary

Every discrete user-settable state (from [state-map.md](state-map.md)) is spoken. Where each is
surfaced:

| State | One Well | Two Wells | Many Wells | Superposition |
|---|---|---|---|---|
| Selected potential | combo context + summary | combo + summary | combo + summary | combo + summary |
| Energy level (E₀/E₁, energy, crossings) | spinner + diagram/graph paragraphs | same | same | — (no level selection) |
| System mass | mass control | — (fixed) | — (fixed) | — (fixed) |
| Energy offset | offset spinner | — | — | — |
| Number of wells | — | — (fixed 2) | Number of Wells control + summary | — |
| Electric field | — | — | field slider + summary | — |
| Well width / depth / step-height / separation | handles §5.2 | handles §6.2 | handles §7.2 | Double Square separation §8.3 |
| Superposition type / preset / custom | — | — | — | switch + combos + summary |
| Coefficient count / format / values / validity | — | — | — | Customize dialog §8.2 |
| Graph (Density / Wave Function) | radio + summary | radio | radio | radio + summary |
| Wave-function parts (Real/Imag/Mag/Phase, gated) | part checkboxes | same | same | same |
| Curves shown/hidden | Curves toggle | Curves | Curves + summary | Curves + summary |
| Values / Magnifier / Reference Line | Tools checkboxes + tools | same | same | same |
| Play/Pause · Step · Restart · Time Speed · Time Value | Time controls | same | same | same |
| Phase preference (global) | Preferences | Preferences | Preferences | Preferences |

Gated/edge states covered: Phase disabled/hidden/absent · parts disabled under Probability Density ·
spinner at range ends · Separation disabled at one well · level tilted out of view (Many Wells) ·
invalid / single-level superposition · Normalize-and-Save valid vs invalid.

---

## 11. Open decisions

Several earlier conflicts are now **settled by the sim** (see the header list): Pöschl-Teller name,
Localized Particle, separation + spacing coexisting, Morse on Superposition (6 potentials), the
two-value Customize format, five time-speed stops, no band graph/zoom buttons, and Coulomb E₁. What
remains open:

1. **Coefficient phase range.** state-map lists φ ∈ [0, π] (step 0.01); the earlier design floated
   quarter-π snaps up to 2π. Confirm the model's range/stepping before authoring the phase strings
   (and if 2π is ever offered, announce it identically to 0 — same physical state).
2. **Customize-dialog strings.** The controls (`numberOfCoefficients`, `coefficientFormat`,
   `normalizeAndSave`, `clear`, per-coefficient) exist in code but their a11y strings are **parked**
   (commented out) in the YAML. Author them with the two-value format when the dialog is finished, and
   confirm the validity indicator is folded into each coefficient's object response (recommended) rather
   than a separate focus stop.
3. **Energy Level object/context strings.** The rich object response proposed in §4.6 (ordinal +
   subscript + energy + crossings) is **not yet authored** — the YAML carries level detail in
   `energyDiagram.accessibleTemplate.energyLevel`. Confirm the split between the spinner's own response
   and the Energy Diagram paragraph.
4. **Angular Frequency readout strings.** None yet; author name/help/object when wired, including the
   mass dependence (ω changes with well width **and** System mass).
5. **Ordinal phrasing.** "ground state / Nth excited state" (distance-from-ground) vs "first/second/third
   state" for flat wells. Confirm one convention.
6. **Contributing-levels summarization.** For the Localized Particle preset and large custom states,
   enumerating many labels gets long; confirm the threshold for "span many of the lower energy levels".
7. **Current Details granularity.** The YAML's Current Details still speak some absolute numbers (Many
   Wells field magnitude; the default template's energy-level index). This doc's "keep it binary / push
   numbers to the object" is the *target* — confirm how far to simplify the shipped templates.
8. **Reference Line value readout.** No value label today; if a "potential energy at line position"
   readout ships, give the line its own object response with a position in nanometers (Option/Shift+C
   reads it).
9. **Hovered-but-not-selected energy line.** Spoken treatment undecided; hover previews would need their
   own object-response variant.
10. **Debounce on level sweeps.** Confirm "Time reset and paused" and rapid selection alerts are
    debounced during a spinner sweep so only the settled state speaks.

---

*Ground truth is the sim: `js/` + the state map for behavior, and `quantum-bound-states-strings_en.yaml`
for the exact strings. This document is the design rationale and target — where it and the shipped strings
disagree, **the strings win**; treat the richer responses here as proposals to author, not as the current
state of the sim.*
