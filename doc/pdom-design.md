# Quantum Bound States — PDOM / Description Design

A holistic view of the Parallel DOM (PDOM) and Interactive Description for Quantum Bound States.
This document reflects the strings currently in
[`quantum-bound-states-strings_en.yaml`](../quantum-bound-states-strings_en.yaml) (the `a11y:` block)
**plus** recommended additions that close the remaining gaps between what is shown visually and what
is communicated non-visually. The implemented-vs-recommended status and the model-property notes have been
**cross-checked against the simulation code** (`js/`), with `file:line` anchors throughout and in the maintainer
notes.

It is meant to be read alongside the Quantum Bound States HTML5 Design Doc and PhET's
Description Design Guide (Core).

## Conventions used in this document

- **Static preview notation — but not everywhere.** Much of the sim is previewed with **static** content:
  wherever a dynamic value would normally be injected, those strings use an **ALL-CAPS token** (for example
  `POTENTIALTYPE`, `WELLWIDTH`, `INDEX`, `ENERGYLEVEL`, `TIME`) that renders literally and needs no Fluent
  wiring. This applies to the **screen summaries, the graph leading paragraphs, and the magnifier object
  responses**. **Two surfaces are already fully dynamic and production-wired, however** — the **potential drag
  handles** and the **Reference Line** emit live model values today (see §5.5 and §6.4). The eventual production
  version replaces each *remaining* ALL-CAPS token with a Fluent `{ $variable }` backed by a model Property.
- **Terminology (per Design Doc §2.1).** The word *particle* is intentionally avoided. The non-visual noun is
  *system*. *Particle Energy* is *Total Energy* everywhere.
- **Units.** Energy in electron volts (eV), mass in electron masses (mₑ), time in femtoseconds (fs), position
  in nanometers (nm), electric field in volts per nanometer (V/nm).
- **Status legend.** ✅ = implemented in the YAML today. 💡 = recommended addition (see §8). ✅↺ = a string
  that previously **revealed a phenomenon** and has now been **revised** for discovery (the change is recorded
  in §8.0).

## 1. Sim-wide learning goals the PDOM must serve

The descriptions are designed to make these goals reachable non-visually:

- **G1** Visualize wave functions, probability densities, and energy levels for bound states.
- **G2** Relate the multiple representations of a wave function to one another.
- **G3** Compare single-, double-, and many-well structures; explain molecular bonding.
- **G4/G5** Build intuition for superposition and how its time dependence varies with energy differences.
- **G6** Explain what *is* and *is not* time-dependent: |Ψ|² is stationary for an eigenstate but evolves for a
  superposition.
- **G7** Predict how curvature, amplitude, decay, and level spacing depend on the potential shape and the mass.
- **G8/G9** Build intuition for band structure from a lattice of wells, and the bridge from a microscopic
  potential to a macroscopic solid.

Notice that G2–G9 are framed as things the learner **predicts, compares, and discovers**. That framing drives
the philosophy below.

---

## Design philosophy: enable discovery, don't give it away

> Read this section before §7 and §8.

PhET's design philosophy is to **enable exploration and student inquiry, not to hand over the result**. This
applies to the non-visual experience as much as the visual one: a screen-reader user should get the same
opportunity to *discover* a relationship — not be told the answer in a paragraph a sighted peer never receives.
A description that announces "the energy levels are evenly spaced" or "the probability density is stationary"
has quietly converted an inquiry sim into a textbook for one group of learners only.

Two tools carry most of the discovery load non-visually, and descriptions should **defer to them** rather than
duplicate or pre-empt what they convey:

- **Graph sonification (planned)** conveys the **shape** of a graph — where a curve peaks, how many humps, how
  it rises and falls, and crucially whether that shape *changes as time plays*. Prose should therefore **not**
  narrate curve shape or trend; it should orient the learner and invite them to listen.
- **The Reference Line** lets a learner **read quantitative values** at any position (position, potential
  energy, probability density, and each wave-function part). Prose should therefore **not** enumerate values
  along a curve; it should point to the Reference Line as the measurement tool.

### What to provide vs. withhold

**Provide** (orientation and access — a sighted user gets these at a glance, and they *enable* inquiry):

- **Structural orientation** — what each graph plots, its axes, and what controls/tools exist.
- **Current discrete state values** — the selected energy level and its energy; parameter values (width, depth,
  separation, mass, field); and the **number of energy levels** and **number of nodes**. Counts are
  *observations*, not relationships — and they are exactly what sonification (continuous shape) and
  reference-line scrubbing (one point at a time) convey *poorly*.
- **Status / feedback** otherwise invisible and apt to cause "is it broken?" confusion — off-screen states, an
  invalid superposition, whether the clock is running.
- **Setup the learner constructed** — which levels contribute to a superposition.

**Withhold** (these *are* the learning goals — let exploration, sonification, and the Reference Line reveal
them):

- The **relationships and trends** students are meant to predict: how level spacing depends on shape or mass
  (G7); how levels split as two wells approach (G3); how levels gather into bands as wells are added (G8/G9);
  how a field tilts and localizes states (G8); and — above all — whether |Ψ|² is **stationary or evolving** in
  time (G6).

### A quick test for any description

1. Is this the *answer* to a learning goal (a trend/relationship to predict)? → **withhold**; make it explorable.
2. Is it structural orientation, or a current discrete value a sighted user reads at a glance? → **provide**.
3. Is it the graph's *shape* (sonification) or a *point value* (Reference Line)? → **don't narrate it; point to the tool**.
4. Is it otherwise-invisible status/feedback? → **provide** (it is a status message, not the answer).

### Why some information is still necessary (not a giveaway)

Withholding is not a license to under-describe. A screen-reader user must be given enough to make the tools
usable and to reason about what they are exploring:

- **Discrete counts** (energy levels, nodes) are the clearest case. A sighted learner reads them instantly and
  re-reads them constantly during inquiry. Sonification conveys *continuous shape*, not an exact integer; node
  counting by scrubbing the Reference Line is prohibitively tedious. The count is the *observation* a learner
  records — providing it enables the inquiry; it is the *relationship* ("more nodes at higher energy") we
  withhold.
- **Current values and orientation** are parity with the on-screen readouts and axes; without them the
  sonification and Reference Line are not interpretable.
- **Status messages** (off-screen states, invalid superposition) prevent a learner from concluding the sim is
  broken — they are WCAG 4.1.3 status messages, not conceptual answers.

---

## 2. PDOM heading structure

Headings create the navigable information relationships (WCAG 1.3.1 / 2.4.6). Current heading content:

```text
H1  {Screen Name}                         (joist screen)
  Screen Summary                          (joist)
    Play Area  / Control Area             (joist boiler-plate)
  ── Play Area ──────────────────────────
  H?  Energy Diagram                      ✅ energyDiagram.accessibleHeading
  H?  Probability Density Graph           ✅ probabilityDensityGraph.accessibleHeading
  H?  Wave Function Graph                 ✅ waveFunctionGraph.accessibleHeading
  H?  Magnifier                           ✅ magnifier.accessibleHeading            (when added)
  ── Control Area ───────────────────────
  H?  Energy Diagram Controls             ✅ energyDiagramControls.accessibleHeading
  H?  Quantum State Graph Controls        ✅ quantumStateGraphControls.accessibleHeading
        Wave Function Parts               ✅ waveFunctionParts.accessibleHeading
  H?  Tool Controls                       ✅ toolControls.accessibleHeading
  H?  Time Controls                       ✅ timeControls.accessibleHeading
        Time Buttons                      ✅ timeButtonGroup.accessibleHeading
```

> Note: the Probability Density Graph and Wave Function Graph occupy the same lower play-area slot; only the
> one matching the selected Quantum State Graph radio button is present in the PDOM at a time.

---

## 3. Screen summaries (all four screens)

Each screen summary has four parts: a static **Play Area** overview, a static **Control Area** overview, a
dynamic **Current Details** block, and a static **Interaction Hint**. The Current Details use the static
ALL-CAPS list notation and are intentionally kept simple per Core Description guidance. All four screen
summaries have been passed through the discovery philosophy (§8.0): they orient and invite, and no longer state
the outcome the learner should discover.

### 3.1 One Well ✅

- **Play Area** — Describes the Energy Diagram (energy-level structure of the chosen well; adjust parameters
  and the mass; change well type) and the Quantum State Graph (probability density or wave function; view the
  equation; toggle real / imaginary / magnitude / optional phase).
- **Control Area** — Visual-inspection and time controls: value labels, Reference Line, Magnifier, time
  display, pause / step / restart, and sim speed.
- **Current Details** (tokens): `POTENTIALTYPE`, `WELLWIDTH`, `WELLHEIGHT`, `INDEX`, `ENERGYLEVEL`,
  `GRAPHTYPERADIOBUTTON`, reference line / magnifier presence, `SIMSPEED`.
- **Interaction Hint** — "Select an energy level or change the properties of the well to begin exploring."

### 3.2 Two Wells (Molecular Bonding) ✅↺

- **Play Area** — Two closely spaced wells as a simple two-atom-molecule model; drag handles for width, height,
  and **separation**, and *"explore how the energy levels and states respond as the wells move together or
  apart."* (The previous "split apart into bonding and antibonding states" wording — a G3 giveaway — was
  removed.)
- **Control Area** — Same visual-inspection + time controls; Magnifier described neutrally as helping "tell
  apart closely spaced energy levels."
- **Current Details** (tokens): `POTENTIALTYPE`, `WELLWIDTH`, `WELLHEIGHT`, `SEPARATION`, `INDEX`,
  `ENERGYLEVEL`, `GRAPHTYPERADIOBUTTON`, values-shown state, reference line / magnifier presence, `SIMSPEED`.
- **Interaction Hint** — "Bring the two wells together or move them apart, and explore what happens to the
  energy levels."

### 3.3 Many Wells (Band Structure) ✅↺

- **Play Area** — A row of identical wells builds a lattice; drag handles for width, height, separation;
  *"add or remove wells and explore how the energy levels respond as the lattice grows. Apply an electric field
  and explore its effect on the energy levels."* (The "gather into bands separated by gaps" and "tilt the
  lattice and distort the bands" giveaways were removed.) Lower graph adds an **average probability density
  across a band**.
- **Control Area** — Number of wells, electric field, value labels, Reference Line, Magnifier (neutral "tell
  apart closely spaced energy levels"), energy-axis **zoom**, time controls.
- **Current Details** (tokens): `POTENTIALTYPE`, `NUMBEROFWELLS`, `ELECTRICFIELD`, `WELLWIDTH`,
  `SEPARATION`, `INDEX`, `ENERGYLEVEL`, `GRAPHTYPERADIOBUTTON`, tools, `SIMSPEED`.
- **Interaction Hint** — "Add more wells and explore what happens to the energy levels. Turn on an electric
  field and explore its effect."

### 3.4 Superposition ✅↺

- **Play Area** — Energy levels of the chosen potential with contributing levels emphasized by weight;
  *"Press Play to explore how this state changes over time."* (The "Unlike a single energy level, this state
  evolves in time… ripple and beat" wording — a G5/G6 giveaway — was removed.)
- **Control Area** — Preset vs. Custom switch, Customize dialog (magnitude + phase per level), value labels,
  Reference Line, Magnifier, time controls.
- **Current Details** (tokens): `POTENTIALTYPE`, `SUPERPOSITION`, `GRAPHTYPERADIOBUTTON`, `SIMSTATE`,
  `TIME`, tools, `SIMSPEED`.
- **Interaction Hint** — "Choose a preset superposition and press Play to explore how it changes over time."

---

## 4. Home-screen button help text ✅

These name the **topic** of each screen ("molecular bonding", "band structure") without stating the outcome —
which is the right altitude (naming what is explorable, not the answer).

| Screen | Accessible name (auto) | Help text |
|---|---|---|
| One Well | One Well | Explore bound states in various single well potentials. |
| Two Wells | Two Wells | Explore bound states and molecular bonding in two closely separated potentials. |
| Many Wells | Many Wells | Explore bound states and band structure in a periodic array of potentials. |
| Superposition | Superposition | Explore superposition states and their time-dependent behavior for various potentials. |

---

## 5. Play Area — interactive objects

PDOM order roughly top-to-bottom: Energy Diagram and its handles → Energy Offset spinner (One Well) →
Energy Level selector → Quantum State Graph and its inline controls.

### 5.1 Potential Combo Box ✅

- **Accessible name:** Potential
- **Help text:** Choose a potential shape for Energy Diagram.
- **Context response:** 💡 *recommended* — see §8.2 (confirm the change and the new bound-state count).

### 5.2 Mass control — One Well only ✅↺

- **`electronMassesControl` help text:** "Adjust the relative mass of the system and explore how the wave
  function and energy levels respond." Serves G7. (The earlier wording named "curvature" and "spacing of the
  energy levels" as what responds — pre-stating the G7 relationship — and was generalized to "wave function and
  energy levels respond.")

### 5.3 Energy Level Selector (spinner) ✅

- **Accessible name:** Energy Level
- **Help text:** "Step up or down through the energy levels and observe the selected state change in both
  graphs."
- **Object/context response:** 💡 *recommended* — `Energy level INDEX, ENERGYLEVEL electron volts,
  NUMBEROFNODES nodes.` (§8.2; needs node-count property — a *count*, which we provide.)

### 5.4 Energy Offset spinner — One Well only ✅

- **Accessible name:** Energy Offset
- **Help text:** "Shift the zero of the energy scale up or down." *(The earlier clause "the probability density
  does not change" was removed — that invariance is a G6 observation for the learner to make, not a fact to
  pre-announce.)*
- **Context response:** 💡 *recommended* — confirm the shift only; do **not** restate that |Ψ|² is unchanged
  (§8.2).

### 5.5 Potential drag handles ✅↺

Custom draggable handles on the potential curve. The group carries
`handles.accessibleRoleDescription: custom slider`, so each handle is announced as a custom slider. Each has an
accessible name, help text, and an object response carrying the live value.

| Handle | Accessible name | Object response |
|---|---|---|
| Asymmetric Triangle depth | depth handle | `{depth} electron volts` |
| Asymmetric Triangle width | width handle | `{width} nanometers` |
| Coulomb width | width handle | `{width} nanometers` |
| Finite Square depth | depth handle | `{depth} electron volts` |
| Finite Square width | width handle | `{width} nanometers` |
| Finite Square separation | separation handle | `{separation} nanometers` |
| Harmonic Oscillator width | width handle | `{width} nanometers` |
| Infinite Square width | width handle | `{width} nanometers` |
| Infinite Step width | width handle | `{width} nanometers` |
| Infinite Step height | step height handle | `{stepHeight} electron volts` |
| Morse depth | depth handle | `{depth} electron volts` |
| Morse width | width handle | `{width} nanometers` |
| Pöschl-Teller depth | depth handle | `{depth} electron volts` |
| Pöschl-Teller width | width handle | `{width} nanometers` |
| Pöschl-Teller spacing | spacing handle | `{spacing} nanometers` |

All handle help texts have been converged to a discovery-safe pattern: a structural first clause describing what
you physically change (steepen the slope, widen the well, deepen the wall, change the separation, …) followed by
a neutral invitation — **"…and observe how the energy levels respond"** (width handles add "…and wave
function"). Several earlier phrasings stated the answer (e.g., "evenly spaced energy ladder", "closely spaced
ladder", "levels split or merge", "change how many levels stay bound", "reshape its energy spacing") and were
removed. See §8.0 for the before/after.

> The handle object responses are **already live and dynamic** (not preview): each handle reads the current
> model value through `.createProperty(...)`. The mechanism is **not** `aria-valuetext` — handles are custom
> `InteractiveHighlighting(Node)` objects (`PotentialHandleNode.ts`) driven by `PotentialDragListener`
> (a `RichDragListener`), keyboard-operable with Home/End and with `ValueChangeSoundPlayer` feedback; the value
> is announced via `accessibleFocusObjectResponse` (on focus) and `addAccessibleObjectResponse()` (on move). The
> **Reference Line** is the other already-dynamic surface (§6.4); the screen summaries, graph leading
> paragraphs, and magnifier responses are the static-preview ones.

### 5.6 Many Wells extras ✅↺

- **`numberOfWellsControl` help text:** "Add or remove wells in the lattice and observe how the energy levels
  respond." (Was "watch the discrete levels gather into energy bands" — a G8 giveaway.)
- **`electricFieldControl` help text:** "Apply an electric field and explore its effect on the energy levels."
  (Was "tilt the lattice and distort the bands" — a G8 giveaway.)
- **Energy-axis zoom buttons** — names "Zoom In" / "Zoom Out"; help text and a context response reporting the
  new y-range (`zoomed in, y range {min} to {max}`). (Operational; fine.)

---

## 6. Control Area — interactive objects

### 6.1 Quantum State Graph controls

- **`quantumStateGraphRadioButtonGroup`** ✅ — name "Quantum State Graph"; help text "Choose which
  representation of the selected state to graph below the Energy Diagram."
- **Wave Function Parts checkboxes** ✅ — Real Part, Imaginary Part, Magnitude, Phase. Each has help text and
  checked / unchecked context responses (e.g. "Real part shown." / "Real part hidden.").
- **`curvesVisibleToggleButton`** ✅ — names "Hide Curves" / "Show Curves"; help text invites prediction
  ("Hide the curves to predict their shape, then reveal them to check."); context responses "Curves shown." /
  "Curves hidden." *(This control is itself a discovery scaffold — predict, then reveal.)*
- **`valuesCheckbox`** ✅ — help text "Keep values visible for handles and energy levels."; responses "Values
  stay visible." / "Values shown on focus."

### 6.2 Superposition controls — Superposition screen only ✅

- **`presetCustomSwitch`** — help text "Switch between curated preset superpositions and your own custom
  superpositions."
- **`superpositionPresetComboBox`** — name "Superposition Preset"; help text "Choose a ready-made
  combination of energy levels to explore as a superposition."
- **`superpositionCustomComboBox`** — name "Superposition Custom"; help text "Choose one of your saved
  custom superpositions to explore." (Includes spelled-out coefficient names, e.g. "c times psi sub 0 plus c
  times psi sub 1", because symbols are not read well by screen readers.)
- **`superpositionCustomizationButton`** — name "Superposition Customization"; opens the magnitude/phase
  editor; context response "Superposition Customization dialog opened."
- **`superpositionDetailsButton`** — name "Superposition Details"; opens the full-equation dialog; context
  response "Superposition Details dialog opened."

### 6.3 Equation details — inline label vs. dialog (corrected against code)

The implementation chooses per screen (`QuantumStateGraphNode` accepts an inline label *or* a details button,
never both):

- **One Well & Two Wells** show a static **inline equation label** (`EquationTermNode`) on the graph — no
  details button. ✅
- **Superposition** *does* use `ProbabilityDensityDetailsButton` + `WaveFunctionDetailsButton`
  (`SuperpositionScreenView.ts:32-33`), which open `ProbabilityDensityDetailsDialog` /
  `WaveFunctionDetailsDialog`. So these buttons and dialogs are **active, not retired** — and their
  `accessibleParagraph` equation strings (§7.2) **are consumed** on this screen.
- `PresetInfoButton` (summed equation + coefficient list) and `CustomEditButton` open
  dialogs that are still **"Under Construction"** placeholders (`PresetDialog.ts:25`,
  `CustomDialog.ts:25`), though the buttons' names and "dialog opened" context responses are
  wired.

*(Minor: `EquationTermNode.waveFunctionTerm()` has a double-nested `<sub><sub>` — likely a typo to fix.)*

### 6.4 Tools ✅

- **`magnifierCheckbox`** — help text "Show or hide magnifier."; responses "Magnifier shown." / "hidden."
- **Magnifier** (when present) — heading "Magnifier"; accessible paragraph "The Magnifier shows a zoomed-in
  view of part of the Energy Diagram, helpful for telling apart closely spaced energy levels." The probe and
  body are keyboard-draggable with sound (`SoundRichDragListener`), but their **object responses are
  static-preview** — `probe centered at POSITION nanometers` / `lens at POSITION nanometers` render the literal
  `POSITION` token. 💡 To make them live, wire `Magnifier.probePositionProperty` / `bodyPositionProperty` into
  the response.
  - **Probe** — name "Magnifier Probe"; help text "Move the probe over the Energy Diagram to choose what the
    magnifier shows."
  - **Body** — name "Magnifier Body"; help text "Move the magnified view window to a comfortable spot."
- **`referenceLineCheckbox`** — help text "Show or hide vertical Reference Line across Energy Diagram and
  Quantum State Graph."; responses "Reference Line shown." / "hidden."
- **Reference Line** ✅ **(fully dynamic, production-wired)** — role description "custom slider"; name
  "Reference Line"; help text "Move across graphs to set a reference position." `ReferenceLineDescriber.ts`
  builds a **live** object response from model values — position and potential energy always, plus probability
  density / real / imaginary / magnitude / phase conditionally on the selected graph and visible curves
  (`at {value} nanometers`, `potential energy is {value} electron volts`, …). It is keyboard-operable with
  `ValueChangeSoundPlayer` feedback and has an **Alt+R "read values"** hotkey (`ReferenceLineReadValuesListener.ts`).
  *(Two things to verify with the team: `ReferenceLineNode.ts:70` sources `accessibleHeading` from the
  `referenceLine.accessibleName` string — likely should be `accessibleName` for a custom slider; and the
  read-values hotkey is **Alt+R** in code vs. **Option/Shift+C** in design doc §3.11.)*

  > **The Reference Line is the primary non-visual measurement tool, and it is fully implemented.** It is how a
  > learner reads quantitative values off a graph one point at a time. Graph state descriptions (§7, §8) should
  > therefore *point to it* rather than enumerate values — and should not pre-compute the trend the learner
  > would assemble from those readings.

### 6.5 Time controls ✅↺

- **`timeDisplayToggleButton`** — names "Hide Time Display" / "Show Time Display"; help text "Show or hide
  the elapsed time readout in femtoseconds."; responses "Time display shown." / "hidden."
- **`timeButtonGroup`** — heading "Time Buttons"; help text "Restart, play, pause, and step the system forward
  in time." (Was "…to watch how the state evolves", which presupposed visible evolution; trimmed to operational.)
- **`restartButton`** — help text "Reset the clock to zero without changing any well or energy settings.";
  context response "Time reset."
- **`playPauseButton`** — help text (playing) "Pause to stop time and inspect the current state."; (paused)
  "Play to start time and explore what happens." (Was "freeze the evolving wave function" / "let the wave
  function evolve in time"; neutralized so it does not presuppose the |Ψ|² behavior — the G6 discovery.)
- **`stepForwardButton`** — help text "Step forward time while paused."; context response "Stepped forward."
- **`timeSpeedSlider`** — name "Time Speed"; help text "Speed up or slow down how fast time evolves, from Slow
  to Fast." (A stray trailing "Slow" was removed.)

### 6.6 Reset All

Standard PhET common-code component; always last in the Control Area.

---

## 7. Graph state descriptions and dialogs

### 7.1 Graph leading paragraphs ✅↺ (describers are stubs)

The three graph describers — `EnergyDiagramDescriber`, `ProbabilityDensityGraphDescriber`,
`WaveFunctionGraphDescriber` — currently render the leading paragraph below but are otherwise **TODO stubs**
(placeholder `TODO list item`s). The §8.1 recommended content is what should fill them. Also note **graph
sonification is not yet implemented** (only control-feedback sounds exist — drag / keyboard / Home-End); the
"listen to the shape" pointers are design-ahead, matching the philosophy section's "(planned)."

- **Energy Diagram** — `The Energy Diagram shows the POTENTIALTYPE potential energy curve in blue, with
  NUMBEROFLEVELS green energy levels. Energy level INDEX is selected at ENERGYLEVEL electron volts.` *(Color
  corrected: per `QBSColors.ts` the potential-energy curve is blue `rgb(85,85,255)`, not purple. Good altitude
  otherwise: structure + count + selection, no trend.)*
- **Probability Density Graph** — `The Probability Density graph shows the probability density across the well
  for energy level INDEX. The curve has NUMBEROFNODES nodes. Listen to the shape with sonification, or move the
  Reference Line to read the value at any position.` (The "keeps the same shape as time evolves" clause — a G6
  giveaway — was removed; the paragraph now points to the discovery channels.)
- **Wave Function Graph** — `The Wave Function graph shows the real, imaginary, and magnitude parts of the wave
  function across the well for energy level INDEX, drawn in magenta, orange, and black. Listen to each part with
  sonification, move the Reference Line to read values, and play time to explore how the parts behave.` *(Color
  corrected: per `QBSColors.ts` the real part is magenta `rgb(166,12,137)` — not purple; imaginary orange,
  magnitude black. The "oscillates … while the magnitude stays steady" G6 giveaway was removed.)*

### 7.2 Dialogs ✅↺

Both equation paragraphs begin with a literal `PLACEHOLDER FOR EQUATION` marker (the plain-text equation
rendering is still pending) and spell the math out for screen readers. The interpretive glosses that stated the
G6 result have been **trimmed**, leaving the equation statement (which is parity — a sighted learner opening the
same opt-in dialog sees it):

- **Probability Density Details** — "PLACEHOLDER FOR EQUATION The probability density of the selected state
  equals the magnitude of the wave function squared." (Was followed by "For a single energy level this shape is
  stationary, so it does not change as time evolves.")
- **Wave Function Details** — "PLACEHOLDER FOR EQUATION The wave function of the selected state, psi of x and t,
  equals psi times exp of negative i E t over h-bar." (Was followed by "Its real and imaginary parts oscillate
  in time … while the magnitude stays the same.")

A learner can derive the time behavior from the equation; the trimmed glosses let them do so rather than
pre-stating it. **These dialogs are active on the Superposition screen** (§6.3), so the strings are consumed —
not lower-stakes.

---

## 8. Recommended additions

The design guide asks for *static state descriptions of prominent dynamic graphs so a learner knows what is
visually there* — but, per the **Design philosophy** section, those descriptions must orient and grant access
**without delivering the relationship the learner is meant to discover**. All examples use the static ALL-CAPS
preview notation and could be added without model changes for the preview; production binds the tokens to the
properties in §9.

### 8.0 Discovery-philosophy revisions — APPLIED ✅↺

A full-file pass removed phrasings that revealed a learning-goal relationship and replaced them with
orientation + invitation. Naming the *topic* is fine (the screen names and §4 help text already do); stating the
*observed outcome* was the giveaway. All rows below are **now in the YAML**.

| Where | Reveals | Was | Now |
|---|---|---|---|
| Two Wells playArea | G3 | "…split apart into bonding and antibonding states as the wells move together…" | "…explore how the energy levels and states respond as the wells move together or apart." |
| Two Wells hint | G3 | "…watch the energy levels split and merge." | "…explore what happens to the energy levels." |
| Many Wells playArea | G8 | "…the discrete energy levels gather into bands separated by gaps." | "…explore how the energy levels respond as the lattice grows." |
| Many Wells playArea (field) | G8 | "Apply an electric field to tilt the lattice and distort the bands." | "Apply an electric field and explore its effect on the energy levels." |
| Many Wells hint | G8 | "…watch the energy levels gather into bands…" | "…explore what happens to the energy levels. Turn on an electric field and explore its effect." |
| Superposition playArea | G5/G6 | "Unlike a single energy level, this state evolves in time, so press Play to watch the probability density ripple and beat." | "Press Play to explore how this state changes over time." |
| Superposition hint | G6 | "…press Play to watch the probability density evolve in time." | "…press Play to explore how it changes over time." |
| `electronMassesControl` | G7 | "…watch the curvature of the wave function and the spacing of the energy levels respond." | "…explore how the wave function and energy levels respond." |
| `numberOfWellsControl` | G8 | "…watch the discrete levels gather into energy bands." | "…observe how the energy levels respond." |
| `electricFieldControl` | G8 | "…tilt the lattice and distort the bands." | "Apply an electric field and explore its effect on the energy levels." |
| Asymmetric Triangle depth handle | G7 | "…watch the energy spacing respond." | "…observe how the energy levels respond." |
| Asymmetric Triangle width handle | G7 | "…reshape where the system can be found." | "…observe how the energy levels and wave function respond." |
| Coulomb width handle | G7 | "…explore its closely spaced ladder of energy levels." | "…explore how its energy levels respond." |
| Finite Square depth handle | G7 | "…change how many energy levels stay bound inside." | "…observe how the energy levels respond." |
| Finite Square width handle | G7 | "…watch the energy levels and the spread of the wave function respond." | "…observe how the energy levels and wave function respond." |
| Finite Square separation handle | G3 | "…watch the bonding and antibonding levels split or merge." | "…observe how the energy levels respond." |
| Harmonic Oscillator width handle | G7 | "…reshape its evenly spaced energy ladder." | "…observe how the energy levels respond." |
| Infinite Square width handle | G7 | "…watch the energy levels move closer together or farther apart." | "…observe how the energy levels respond." |
| Infinite Step width handle | — | "Set how far the low-energy region extends before the step." | "…, and observe how the energy levels respond." |
| Infinite Step height handle | G7 | "…change which states stay bound." | "…observe how the energy levels respond." |
| Morse depth handle | G7 | "…change how many vibrational levels it can hold." | "…observe how the energy levels respond." |
| Morse width handle | G7 | "…reshape its uneven energy spacing." | "…observe how the energy levels respond." |
| Pöschl-Teller depth handle | G7 | "…change how many energy levels it can hold." | "…observe how the energy levels respond." |
| Pöschl-Teller width handle | G7 | "…reshape its energy spacing." | "…observe how the energy levels respond." |
| Pöschl-Teller spacing handle | G3 | "…watch the levels split or merge." | "…observe how the energy levels respond." |
| Prob. Density graph paragraph | G6 | "…keeps the same shape as time evolves." | dropped; points to sonification + Reference Line (§7.1) |
| Wave Function graph paragraph | G6 | "…oscillates … while the magnitude stays steady." | structural rewrite, points to the tools (§7.1) |
| Prob. Density / Wave Function dialogs | G6 | interpretive "stationary" / "magnitude stays the same" glosses | trimmed to the equation statement (§7.2) |
| `timeButtonGroup` | (presup.) | "…to watch how the state evolves." | "Restart, play, pause, and step the system forward in time." |
| `playPauseButton` | G6 | "freeze the evolving wave function" / "let the wave function evolve in time" | "stop time and inspect the current state" / "start time and explore what happens" |
| Magnifier mentions (One/Two/Many controlArea) | G3/G8 | "inspecting the splitting between…" / "counting the levels inside a band" | "telling apart closely spaced energy levels" |

Non-philosophy fixes applied in the same pass: the Two Wells controlArea "inspectiing" typo, the One Well
controlArea "closely space" typo, and the `timeSpeedSlider` trailing "Slow".

### 8.1 Accessible paragraphs (orientation + access, no giveaway) 💡

**Energy Diagram — count, range, and a navigable level list.** Provide the *number* of levels and the energy
*range* (observations a sighted user reads instantly), plus a per-level list so the learner can compare
energies and **derive the spacing pattern themselves**. Do **not** state the pattern (evenly spaced / closing /
clustered) — that is G3/G7/G8.

```yaml
energyDiagram:
  accessibleParagraph: >-
    NUMBEROFLEVELS energy levels are bound in this potential, from LOWESTENERGY to HIGHESTENERGY electron
    volts. Step through them with the Energy Level selector, listen to the diagram, or move the Reference Line
    to explore.
  levelListItem: Energy level INDEX, ENERGYLEVEL electron volts, SELECTEDSTATE.   # "selected" / "not selected"
```

**Quantum State Graph — node count + pointers to the discovery tools.** Keep the node *count* (a discrete
observation); drop shape narration (sonification) and any time-behavior claim (G6). *(The §7.1 leading
paragraphs already follow this; these fuller `accessibleParagraph`s would replace the TODO list items in the
stubbed describers. The node count can wrap `countNodes()` from `QBSSolverTestUtils.ts:20-71`.)*

```yaml
probabilityDensityGraph:
  accessibleParagraph: >-
    Probability density across the well for energy level INDEX, with NUMBEROFNODES nodes. Listen to the shape
    with sonification, or move the Reference Line to read the value at any position.

waveFunctionGraph:
  accessibleParagraph: >-
    The real, imaginary, and magnitude parts of the wave function across the well for energy level INDEX,
    drawn in magenta, orange, and black. Listen to each part with sonification, move the Reference Line to read
    values, and play time to explore how the parts behave.
```

**Time status — operational only.** A sighted learner can tell the clock is *running*; that is fair to state.
Whether |Ψ|² itself is stationary or evolving is the G6 discovery, and **sonification makes it audible** —
press Play and hear whether the sonified shape changes. So provide the clock state and withhold the verdict.

```yaml
timeStatus:
  playing: Time is playing. Elapsed time TIME femtoseconds.
  paused:  Time is paused at TIME femtoseconds.
```

> Contrast with a "Probability density is stationary…/…evolves with a beat" status, which is **not recommended**
> — it pre-empts the single most important comparison in the sim (eigenstate vs. superposition, G6).

**Status messages with no PDOM text today (provide — not giveaways):**

```yaml
offScreenStatesIndicator:
  accessibleParagraph: Additional energy states exist above the top of the diagram.        # Infinite Square, Harmonic Oscillator (§9.15)
invalidSuperpositionWarning:
  accessibleParagraph: This superposition uses energy levels that do not exist in the current potential, so no state is shown.  # (§8.2)
```

### 8.2 Context responses for changes 💡

Confirm **what changed and the new value** so the learner can keep their bearings — but withhold the
*relationship*, which is the inquiry payoff. Most of these report a value (and, where it is a discrete
observation, the new count) and stop there.

| Interaction | Recommended context response (static preview) | Withheld (why) |
|---|---|---|
| Potential type change | `Potential changed to POTENTIALTYPE. NUMBEROFLEVELS energy levels are now bound.` | the spacing pattern (G7) |
| Mass slider (One Well) | `Mass is now MASS electron masses.` | "levels move closer / wave function spreads" (G7) |
| Width / depth handle drag | `Width is now WIDTH nanometers. NUMBEROFLEVELS energy levels bound.` | "spacing changed" (G7) |
| Separation handle (Two Wells) | `Separation is now SEPARATION nanometers.` | the bonding/antibonding split (G3) |
| Energy level selected | `Energy level INDEX, ENERGYLEVEL electron volts, NUMBEROFNODES nodes.` | — (object value + count) |
| Energy offset | `Energy scale shifted.` | "probability density is unchanged" (G6) |
| Number of wells (Many Wells) | `NUMBEROFWELLS wells. NUMBEROFLEVELS energy levels.` | "levels cluster into bands" (G8) |
| Electric field (Many Wells) | `Electric field is now ELECTRICFIELD volts per nanometer.` | "bands tilt / states localize" (G8/G9) |
| Play / Pause pressed | `Playing.` / `Paused.` *(same regardless of eigenstate vs. superposition)* | the stationary-vs-evolving contrast (G5/G6) |
| Normalize and Save | `Custom superposition saved with NUMBEROFTERMS contributing levels.` | — (operational) |
| Preset / Custom selection | `Superposition set. Contributing levels: CONTRIBUTINGLEVELS.` | — (the setup the learner built) |

### 8.3 Altitude / placement and channel guidance

- Keep the **screen-summary Current Details** simple (as they are now).
- Put orientation-level dynamic descriptions in `accessibleParagraph`s **next to the graphs**, where the guide
  places them and where they map cleanly to Voicing reading blocks later.
- Let the **two discovery channels** carry the trend: **sonification** for graph *shape and time behavior*, the
  **Reference Line** for *quantitative point values*. Prose orients and points to these; it does not duplicate
  or pre-empt them.

---

## 9. Model properties the descriptions depend on

A code review shows **most of these already exist** (or are trivially derivable from `boundStateResultProperty`).
The doc previously treated them as design-doc §3.20 "planned/TBD," but the data is in the model today — only a
few items are genuinely absent.

| Property | Used by | Status (from code) |
|---|---|---|
| Eigenvalue array `boundStateResultProperty.value.energies` (`QBSModel.ts:75`) | total count, lowest/highest energy, per-level list — all derivable | **Exists** — derive a small read-only Property |
| Selected energy index `selectedEnergyLevelProperty` (`QBSModel.ts:85`) | Energy Diagram paragraph; energy-level response | **Exists** |
| Reference-line position + value-at-line (`referenceLine.xProperty`, `getPotentialEnergyAt/getProbabilityDensityAt/getRealPartAt/…`) | Reference Line object response | **Done** — used by `ReferenceLineDescriber` |
| **Number of nodes of selected eigenstate** | Wave Function & Probability Density paragraphs; energy-level response | **Computation exists** (`countNodes()`, `QBSSolverTestUtils.ts:20-71`), not yet exposed — **wrap as a DerivedProperty; prioritize** |
| Is-playing / elapsed time (`time.isPlayingProperty`, `currentTimeProperty`, `QBSTime.ts`) | Time status paragraph | **Exists** |
| Lowest / highest potential energy (eV) | Energy Diagram paragraph | derivable (`Math.min/max` on `boundStateResultProperty.value.potentials`) |
| Band count (eigenvalue clustering) | Many Wells; not a context response (would name the G8 concept) | **Absent** — needs new model work |
| Off-screen-states indicator (states above the display cap) | §8.1 status message | **Absent** — derive by comparing max eigenvalue to `energyDiagram.yRange` |
| Invalid-superposition flag; superposition coefficients + phase | §8.1 warning; §8.2 superposition responses | **Absent / incomplete** — coefficients live in `SuperpositionCoefficients` (methods, not Properties); phase is a TODO; the Customize dialog is Under Construction |

**Node count** is the single most valuable addition — and the computation already exists, so it only needs
exposing. It is a discrete observation a sighted learner reads at a glance, poorly served by sonification
(shape) or the Reference Line (one point at a time), and providing it *enables* the wave-function inquiry
(G2/G7) without revealing the relationship. A **qualitative spacing / splitting descriptor is intentionally not
recommended** as a default — it would state the very trend (G3/G7/G8) the learner should discover; the
per-level energy list is preferred. The **band count, off-screen indicator, invalid-superposition flag, and
superposition phase/coefficients are the only genuinely missing model state** behind the §8 recommendations.

---

**Maintainer notes** — items 1–8 are code-review findings cross-checked against the implementation; 9–11 are
editing history / production.

1. **QBS a11y is largely production-wired** — unlike a pure preview, the screen summaries (four
   `ScreenSummaryContent` classes), `pdomOrder`, all control names/help, control-panel headings, the **potential
   drag handles** (dynamic, keyboard, sound), the **Reference Line** (dynamic via `ReferenceLineDescriber`,
   Alt+R, sound), the **magnifier** (keyboard + sound), and the time controls are all implemented. The main open
   *description* work is the three stubbed graph describers and the node count.
2. **Graph describers are stubs.** `EnergyDiagramDescriber` / `ProbabilityDensityGraphDescriber` /
   `WaveFunctionGraphDescriber` render the leading paragraph but contain placeholder `TODO list item`s — §8.1 is
   what fills them.
3. **Colors resolved (supersedes the old "still open" note).** `QBSColors.ts`: Potential Energy = blue
   `rgb(85,85,255)`, Total Energy = green, real part = magenta `rgb(166,12,137)`, imaginary = orange, magnitude
   & probability density = black. There is **no purple/purple clash**; the §7.1 strings were corrected to
   blue / magenta. Still don't rely on color alone (WCAG 1.4.1) — the part *names* carry the identification.
4. **Details buttons/dialogs are active on Superposition, not retired** (§6.3): inline `EquationTermNode` on One
   Well / Two Wells; `ProbabilityDensityDetailsButton` + `WaveFunctionDetailsButton` → equation dialogs on
   Superposition (`SuperpositionScreenView.ts:32-33`). `PresetDialog` /
   `CustomDialog` are "Under Construction."
5. **Graph sonification is not implemented** (only control-feedback sounds — drag / keyboard / Home-End). The
   "listen to the shape" pointers are design-ahead, matching the philosophy section's "(planned)."
6. **Magnifier object response is static-preview** (`POSITION` token); wire `Magnifier.probePositionProperty` /
   `bodyPositionProperty` to make it live.
7. **Dangling / stubbed strings:** `a11y.adjustEnergyOffsetCheckbox.*` is unused (energy offset is the
   `EnergyOffsetControl` spinner, not a checkbox); the `yAxisZoomButtonGroup` zoom context responses use TODO
   placeholder `{min}/{max}` values.
8. **Verify with the team:** `ReferenceLineNode.ts:70` sources `accessibleHeading` from the
   `referenceLine.accessibleName` string (likely should be `accessibleName`); the read-values hotkey is **Alt+R**
   in code vs. **Option/Shift+C** in design doc §3.11; and `EquationTermNode.waveFunctionTerm()` has a
   double-nested `<sub><sub>`.
9. **Discovery-philosophy pass — applied file-wide (§8.0).** Screen summaries and hints, the mass / number-of-
   wells / electric-field help texts, every potential drag-handle help text, the two graph leading paragraphs,
   the equation-dialog glosses, the time-button-group and play/pause help texts, and the magnifier mentions were
   revised to invite observation instead of stating the outcome. YAML re-generated (`modulify`) and type-checks.
10. **Typos fixed:** Two Wells controlArea "inspectiing" → "for inspecting"; One Well controlArea "closely
    space" → "closely spaced"; `timeSpeedSlider` trailing "Slow" removed.
11. **To production:** replace each *remaining* ALL-CAPS token (screen summaries, graph paragraphs, magnifier)
    with a Fluent `{ $variable }` wired to the §9 property, then run
    `bin/grunt modulify --targets=strings --repo=quantum-bound-states` and type-check.
