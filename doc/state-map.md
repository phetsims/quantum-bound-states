# Quantum Bound States — State Map

A per-screen map of the **discrete, user-configurable state** in the sim: every toggle, switch,
radio-button group, combo box, and spinner a user can set, with its possible values, default, and
gating/interdependencies.

**Scope.** Continuous inputs (sliders and drag handles — electron mass, energy offset, electric
field, well width/depth/separation/spacing, custom superposition coefficients) are **excluded** from
the discrete state space and listed separately per screen for completeness. Momentary actions
(Step Forward, Restart, Reset All, dialog open/close) are not persistent states and are noted where
relevant. Backing Properties are named for cross-reference with PhET-iO / the code.

> Source of truth: `quantum-bound-states/js/`. Verified against `QBSModel`, `QBSScreenView`,
> `QBSTime`, `WaveFunctionGraph`, the four screen models/views, and the shared control components.

---

## 1. Architecture: what's shared vs. screen-specific

All four screens (`One Well`, `Two Wells`, `Many Wells`, `Superposition`) extend a common
`QBSModel` + `QBSScreenView`. They differ in exactly three ways:

| Axis | One Well | Two Wells | Many Wells | Superposition |
|---|---|---|---|---|
| **Potentials offered** (combo box) | 8 | 2 | 2 | 6 |
| **Right-hand panel** below the combo box | Electron mass + Energy offset + Energy level | Energy level | # of wells + Electric field + Energy level | Preset/Custom superposition controls |
| **Energy-level (quantum #) selection** | ✔ | ✔ | ✔ | **✗** (`hasEnergyLevelSelection: false`) |

Everything else — the Quantum State graph selector, wave-function part checkboxes, curves toggle,
Tools panel, and Time panel — is **identical on every screen** (`QBSScreenView`). Those shared
states are defined once in [§2](#2-shared-state-all-screens) and referenced from each screen section.

---

## 2. Shared state (all screens)

These controls are instantiated by `QBSScreenView` and therefore appear on **all four screens**
(including Superposition). "Gating" describes when a control is visible/enabled.

### 2.1 Quantum State graph & wave-function parts (`QuantumStateGraphPanel`)

| State | Control | Property | Values | Default | Gating |
|---|---|---|---|---|---|
| Selected graph | radio buttons | `selectedGraphProperty` | Probability Density · Wave Function | **Probability Density** | always available; selects which plot shows and gates the part checkboxes below |
| Real part | checkbox | `waveFunctionGraph.realPartSelectedProperty` | on / off | **on** | enabled only when **Wave Function** graph selected |
| Imaginary part | checkbox | `waveFunctionGraph.imaginaryPartSelectedProperty` | on / off | off | enabled only when Wave Function selected |
| Magnitude | checkbox | `waveFunctionGraph.magnitudeSelectedProperty` | on / off | off | enabled only when Wave Function selected; **gates Phase** |
| Phase | checkbox (color-spectrum swatch, indented) | `waveFunctionGraph.phaseSelectedProperty` | on / off | off | **visible** only if the *Phase* preference is on; **enabled** only when Magnitude is checked *and* Wave Function selected |

The four part checkboxes are always present but **disabled** whenever Probability Density is
selected (`checkboxesEnabledProperty = selectedGraph === waveFunctionGraph`). Phase carries the
extra `AND magnitudeSelected` enable-gate.

### 2.2 Curves toggle

| State | Control | Property | Values | Default | Gating |
|---|---|---|---|---|---|
| Curves visible | eye toggle button | `curvesVisibleProperty` | shown / hidden | **shown** | always available; applies to whichever graph is selected |

### 2.3 Tools panel (`ToolsPanel`)

| State | Control | Property | Values | Default |
|---|---|---|---|---|
| Values | checkbox | `energyDiagram.valuesVisibleProperty` | on / off | **off** |
| Magnifier | checkbox | `magnifier.visibleProperty` | on / off | **off** |
| Reference Line | checkbox | `referenceLine.visibleProperty` | on / off | **off** |

> Note (code smell, not a bug): `ToolsPanel`'s constructor parameters `referenceLineVisibleProperty`
> and `magnifierToolVisibleProperty` are named the opposite of the args `QBSScreenView` passes them,
> but the two swaps cancel — the Magnifier checkbox is correctly bound to `magnifier.visibleProperty`
> and the Reference Line checkbox to `referenceLine.visibleProperty`. Worth renaming the params.

### 2.4 Time panel (`TimePanel` / `QBSTime`)

| State | Control | Property | Values | Default | Notes |
|---|---|---|---|---|---|
| Play / Pause | toggle button | `time.isPlayingProperty` | playing / paused | **playing** | when paused, Step Forward enables |
| Time speed | slider snapped to integer stops (**discrete**) | `time.timeSpeedProperty` | 1 (0.01 fs) · 2 (0.1 fs) · 3 (1 fs) · 4 (10 fs) · 5 (100 fs) | **3** | changing speed resets the clock to 0 and changes displayed decimals |
| Time value visible | eye toggle button | `time.timeVisibleProperty` | shown / hidden | **shown** | not `phetioFeatured` |

Momentary (not states): **Restart** (enabled only when `currentTime !== 0`), **Step Forward**
(enabled only while paused).

### 2.5 Global preferences / query parameters (cross-screen, survive Reset All)

| State | Where set | Property | Values | Default | Effect |
|---|---|---|---|---|---|
| Phase feature available | Preferences ▸ Simulation switch, or `?phaseCheckboxVisible` | `QBSPreferences.phaseCheckboxVisibleProperty` | on / off | **on** *(source TODO: intended to become off)* | hides/shows the Phase checkbox on every screen |
| Phase-to-color mapping | private query param `?phaseToColor` only (no UI, no Property) | `QBSQueryParameters.phaseToColor` | twilight · rainbow | twilight | color scheme used when the Phase overlay renders |

---

## 3. One Well

**Potentials (8):** Infinite Square · Finite Square · Infinite Step · Asymmetric Triangle ·
Harmonic Oscillator · Pöschl–Teller · Morse · Coulomb.

### Screen-specific discrete state

| State | Control | Property | Values | Default | Gating / interdependency |
|---|---|---|---|---|---|
| Selected potential | combo box | `potentialProperty` | the 8 above | **Infinite Square** | changing it recomputes bound states, **resets energy level to the ground state**, and re-syncs the Energy-offset range |
| Energy level (quantum #) | number spinner + clickable energy lines | `selectedEnergyLevelIndexProperty` | integer `n ∈ [groundStateIndex, groundStateIndex + #boundStates − 1]` | ground state (`range.min`) | range depends on potential + electron mass + offset; interacting restarts & pauses time |

Ground-state index by potential: **1** for Infinite Square, Finite Square, Infinite Step,
Asymmetric Triangle, Coulomb; **0** for Harmonic Oscillator, Pöschl–Teller, Morse. (So the
selectable levels start at E₁ or E₀ accordingly, and how many exist depends on the configuration.)

Plus **all shared state** from [§2](#2-shared-state-all-screens).

A read-only **Angular Frequency** readout appears above the Energy Diagram **only when Harmonic
Oscillator is selected** (derived display, not configurable).

### Continuous controls (excluded from the discrete map)
- **Electron mass** — `electronMassesProperty`, 0.5–1.1 mₑ, default 1.0 *(One Well only)*.
- **Energy offset** — `energyOffsetProperty`, −10…10 eV, default 0; **not reset by Reset All**.
- **Well geometry drag handles** (per selected potential): well width (all), well depth
  (Finite Square, Asymmetric Triangle, Pöschl–Teller, Morse), step height (Infinite Step).

---

## 4. Two Wells

**Potentials (2):** Finite Square Well · Pöschl–Teller. Electron mass, electric field, and well
count are fixed constants (no controls).

### Screen-specific discrete state

| State | Control | Property | Values | Default | Gating / interdependency |
|---|---|---|---|---|---|
| Selected potential | combo box | `potentialProperty` | Finite Square · Pöschl–Teller | **Finite Square** | changing it recomputes bound states and resets the energy level to ground state |
| Energy level (quantum #) | number spinner + clickable energy lines | `selectedEnergyLevelIndexProperty` | integer `n` in the potential's range | ground state | Finite Square starts at E₁ (groundStateIndex 1); Pöschl–Teller at E₀ (groundStateIndex 0) |

Plus **all shared state** from [§2](#2-shared-state-all-screens).

### Continuous controls
- Finite Square: well width 0.5–2.5 nm (def 1), depth 1–15 eV (def 9), separation 0.05–0.7 nm (def 0.4).
- Pöschl–Teller: well width fixed 0.2 nm, depth 1–11 eV (def 10), spacing 0.25–3 nm (def 1).

---

## 5. Many Wells

**Potentials (2):** Finite Square Well · Pöschl–Teller. Solutions are always numeric (multi-well +
possible field). Electron mass is a fixed constant (no control).

### Screen-specific discrete state

| State | Control | Property | Values | Default | Gating / interdependency |
|---|---|---|---|---|---|
| Selected potential | combo box | `potentialProperty` | Finite Square · Pöschl–Teller | **Finite Square** | recomputes bound states; resets energy level to ground state |
| **Number of wells** | NumberControl (tweakers/slider, **discrete integers**) | `numberOfWellsProperty` | **1, 2, 3, 4, 5, 6, 7, 8** | **3** | shared by both potentials; when > 1 the separation/spacing handle activates; interacting restarts & pauses time |
| Energy level (quantum #) | number spinner + clickable energy lines | `selectedEnergyLevelIndexProperty` | integer `n` in the potential's range | ground state | range also depends on # of wells and electric field; Finite Square starts at E₁, Pöschl–Teller at E₀ |

Plus **all shared state** from [§2](#2-shared-state-all-screens).

### Continuous controls
- **Electric field** — `electricFieldProperty`, −1…1 V/nm, default 0 *(Many Wells only)*.
- Finite Square: width 0.35–0.55 nm (def 0.45), depth 5–15 eV (def 9), separation 0.05–0.25 nm (def 0.1, active when wells > 1).
- Pöschl–Teller: width fixed 0.2 nm, depth 6–11 eV (def 10), spacing 0.3–0.8 nm (def 0.5, active when wells > 1).

---

## 6. Superposition

**Potentials (6):** Infinite Square · Finite Square · Harmonic Oscillator · Pöschl–Teller · Morse ·
Double Square Well (its own internal well count fixed at 2). **No single energy-level selection**
on this screen.

### Screen-specific discrete state

| State | Control | Property | Values | Default | Gating / interdependency |
|---|---|---|---|---|---|
| Selected potential | combo box | `potentialProperty` | the 6 above | **Infinite Square** | recomputes bound states; shifts preset/custom coefficient subscripts via groundStateIndex (1 for Infinite/Finite/Double Square, 0 for Harmonic Oscillator/Pöschl–Teller/Morse) |
| Superposition type | on/off switch (`ABSwitch`) | `superpositionStateTypeProperty` | preset · custom | **preset** | **gates the two rows below**: preset row shown iff `preset`, custom row iff `custom` |
| Preset state | combo box | `presetSuperpositionStateProperty` | cΨ₁+cΨ₂ · cΨ₁+cΨ₃ · cΨ₁−cΨ₂ · cΨ₁+cΨ₂+cΨ₃ · Localized Particle *(5)* | **cΨ₁+cΨ₂** (preset1) | visible only when type = **preset**; read-only coefficients; info dialog via PresetInfoButton |
| Custom state | combo box | `customSuperpositionStateProperty` | custom1 … custom5 *(5 editable slots)* | **custom1** | visible only when type = **custom**; edit dialog via CustomEditButton |
| # of coefficients *(Custom dialog)* | number spinner | `customState.numberOfCoefficientsProperty` | integer **2–48** | **2** | only inside the Custom edit dialog (type = custom); per custom state |
| Coefficient format *(Custom dialog)* | radio buttons | `customState.coefficientFormatProperty` | amplitude · magnitudeAndPhase | **amplitude** | only inside the Custom edit dialog; switches each term between one amplitude spinner and a magnitude+phase pair |

Plus **all shared state** from [§2](#2-shared-state-all-screens) — including the Wave Function part
checkboxes (yes, they exist here too), but **not** the energy-level spinner.

### Continuous controls
- Custom coefficient spinners inside the Custom dialog: amplitude aₙ ∈ [−1, 1]; or magnitude cₙ ∈ [0, 1]
  and phase φₙ ∈ [0, 1]·π (step 0.01).
- Per-potential well width / depth / separation drag handles (Double Square has an active separation
  handle since it is fixed at 2 wells).

---

## 7. Discrete state-space summary

Primary selection dimensions per screen (shared toggles from §2 apply on top of all of these). Energy-level
counts are potential/config-dependent, so exact totals are noted as "×(levels)" rather than a fixed number.

| Screen | Primary discrete selectors | Combinations (excl. energy-level count & shared toggles) |
|---|---|---|
| One Well | potential (8) × energy level | 8 × (levels) |
| Two Wells | potential (2) × energy level | 2 × (levels) |
| Many Wells | potential (2) × # wells (8) × energy level | 16 × (levels) |
| Superposition | potential (6) × type (2) → preset (5) *or* custom (5) [+ per-custom: #coeff (2–48) × format (2)] | 6 × (5 preset **+** 5 custom); custom adds 47 × 2 dialog states each |

**Shared toggles that multiply onto every screen** (§2): graph (2) · curves (2) ·
Real/Imag/Mag/Phase (2⁴, Phase gated) · Values/Magnifier/RefLine (2³) · Play (2) · speed (5) ·
time-visible (2), i.e. **2 × 2 × 16 × 8 × 2 × 5 × 2 = 20 480** shared combinations layered over each
screen-specific selection (before applying enable-gates that make some combinations equivalent).

---

## 8. Cross-cutting interdependencies & reset behavior

- **Potential change ⇒** recompute bound states ⇒ energy level resets to that potential's ground
  state; on One Well the Energy-offset range/value re-syncs to the new potential.
- **Bound-state change** (from potential / mass / offset / # wells / field): energy level is kept if
  still in range, else reset to ground state.
- **Graph selection gates parts:** Real/Imaginary/Magnitude/Phase are operable only under the Wave
  Function graph. **Magnitude gates Phase.** The **Phase preference** gates Phase's very presence.
- **Time speed change** resets the clock to 0. Interacting with Energy Level / # Wells / Electric
  Field / Energy Offset **restarts and pauses** time.
- **Reset All** restores every state above to its default **except** One Well's Energy offset
  (intentionally preserved) and the global Preferences (Phase feature) / query parameters.
- **Superposition type** gates which state combo box (and its dialog) is reachable.
