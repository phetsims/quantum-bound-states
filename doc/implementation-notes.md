# Quantum Bound States - Implementation Notes

This document contains notes related to the implementation of the simulations in PhET's _Quantum Bound States_ suite.
This is not an exhaustive description of the implementation. The intention is to provide a high-level overview, and
to supplement the documentation in the source code.

The 5 simulations in the suite are listed below. For the derived simulations, consult their implementation-notes.md 
for a summary of how they relate to the _Quantum Bound States_ simulation.

* Quantum Bound States (the primary simulation)
* Band Structure
* Bound State Superposition
* Double Wells and Covalent Bonds
* Particle in a Box

Before reading this document, please read [model.md](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/model.md), a high-level description of the simulation model

## At a Glance

| Topic                   | Files                                                                                                                 |
|:------------------------|:----------------------------------------------------------------------------------------------------------------------|
| Entry point             | `js/quantum-bound-states-main.ts` — Launches the simulation with the 4 screens and sim-specific Preferences           |
| Screens                 | a subdirectory for each screen: `js/one-well/`, `js/two-wells/`, `js/many-wells/`, `js/superposition/`                |
| Shared Code             | code that is shared by 2 or more screens: `js/common/`                                                                |
| Constants               | `js/common/QBSConstants.ts`, `QBSColors.ts`, `QBSSymbols.ts`                                                          |
| Query Parameters        | `QBSQueryParameters.ts` - Run with `?log` to print all query parameter values to the browser console.                 |
| Utilities               | `QBSUtils.ts`                                                                                                         |
| Strings                 | `quantum-bound-states-strings_en.yaml`, `QuantumBoundStatesFluent.ts`                                                 |
| Model Base Classes      | `js/common/model/QBSModel.ts`, `StationaryStateModel.ts`                                                              |
| Quantum Potentials      | `js/common/model/potentials/`, `QuantumPotential.ts` base class                                                       |
| Wave Function Solvers   | `js/common/model/solvers/`                                                                                            |
| Time                    | `js/common/model/QBSTime.ts`                                                                                          |
| View Base Classes       | `js/common/view/QBSScreenView.ts`, `StationaryStateScreenView.ts`                                                     |
| Charts                  | `js/common/view/EnergyDiagramNode.ts`, `QuantumStateGraphNode.ts` and subclasses, `YCanvasLinePlot.ts` and subclasses |
| Potential Shape Editing | `js/common/view/handles/`, `js/common/view/markers/`                                                                  |
| Accessible Description  | `js/*/view/description/`                                                                                              |
| Developer Tools         | `js/common/view/debug/` — see `README.md`                                                                             |
| Unit Tests              | `js/quantum-bound-states-tests.ts`, `NumerovSolverTests.ts`                                                           |

## Terminology

The domain terminology needed to navigate the implementation is found in the
[**Terminology**](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/model.md#terminology)
section of model.md.

Additional terms used in the implementation:

**XGrid**: An equally spaced 1D spatial grid for quantum mechanics calculations, in this case used for the horizontal
(x-axis) dimension. The wave function is solved for positions on this grid. (Note that in many domains, the term 'grid'
implies two dimensions. But in quantum mechanics, solving the 1D Schrödinger equation, and especially when using finite
difference methods like the Numerov method, it is standard practice to refer to this as a grid.)

**Chart vs Graph vs Diagram**: When using the term "chart", we are typically referring to bamboo, PhET's library for
charts. When referring to "graph" or "diagram", we are typically referring to the name given to a specific bamboo chart
in the user interface.

**Energy Diagram**: Displays a potential energy curve and the ladder of energy levels. By design this was named
"Diagram" to align with classroom terminology. This is the top chart in the user interface.

**Quantum State Graph**: There are two such graphs, and exactly one is displayed at a time: the Probability Density
graph and the Wave Function graph. By design this was named "Graph" to align with classroom terminology. This is the
bottom chart in the user interface.

**Solver**: An implementation of a wave function solution. We use the term **analytical solution** loosely to mean
either an analytical solution or a transcendental equation specific to a potential type. When we refer to a **numerical
solution** we are referring to the **Numerov method**.

**Potential Handle**: A draggable handle used to change some Property of a potential. It looks like a double-headed
arrow, pointing either horizontally or vertically to indicate the direction that it can be dragged. Often referred to as
simply "handle".

**Potential Marker**: Related to potential handles, a potential marker is a pair of vertical dashed lines that 
shows the extents of some potential Property. For example, the spacing between wells in a Pöschl-Teller
potential is denoted by a pair of vertical lines drawn through the centers of adjacent wells. Often referred to as
simply "marker".

**Preset Superposition State**: A superposition state whose coefficients are fixed (preset) and cannot be changed by the
user.

**Custom Superposition State**: A superposition state whose coefficients can be edited (customized) by the user.

## General Considerations

This section describes how this simulation addresses implementation considerations that are common to
most PhET simulations.

### Code Sharing with Other Simulations

In addition to the code sharing between the 5 simulations in this suite, code is shared with the 
_Quantum Tunneling and Wave Packets_ simulation. That code lives in `totality/wave-functions-common` and 
quantum-tunneling-and-wave-packets has no dependencies on quantum-bound-states.

### Legacy Version

This sim was originally written in Java, circa 2011. But this implementation is not a port. It is an entirely new 
code base, including a radically different (and improved) model and expanded features. While some code was initially
ported from Java, none of it survived.  Search for "Java" to find references to the Java version in code comments.

### Coordinate Frames

Because this simulation relies heavily on PhET's bamboo library for charts, the majority of model-view transforms are
implemented using bamboo's `ChartTransform`.

`XGrid` is an equally spaced 1D spatial grid, whose values are positions in nm. A potential's wave function is solved for
each position value on this grid. All charts share the same XGrid and are horizontally aligned on this grid. The
ChartTransform for all charts therefore has a common x-axis mapping between position in nm and horizontal view
coordinates.

The Energy Diagram's ChartTransform is implemented in `EnergyDiagramNode`. For the y-axis, it maps between energy (eV)
and vertical view coordinates. The range of the y-axis is determined by the selected potential and its energy offset;
see
`yRangeProperty` in `EnergyDiagram`.

The ChartTransforms for the Wave Function Graph and Probability Density Graph are implemented in base class
`QuantumStateGraphNode`. For the y-axis, it maps between wave function amplitude (or probability density amplitude) and
vertical view coordinates. For both graphs, the y-range is updated dynamically to fit the time-independent wave function
solution. For details see QBSModel `getWaveFunctionRange`.

Potential handles and the Reference Line manage model-view transforms using ChartTransform and scenery drag listeners
that operate in view coordinates. For details, see `PotentialHandleDragListener` and `ReferenceLineDragListener`.

The Magnifier uses a hybrid approach to model-view transforms. In order to work with both bamboo charts and
scenery drag listeners, it synthesizes a `ModelViewTransform2` from a `ChartTransform`. For details, see
`transformProperty` in MagnifierNode.

### Memory management

For things that need to be disposed, `addDisposable` is the PhET Disposable pattern that is used exclusively throughout
this simulation. For details, see `axon.Disposable`.

Superposition State dialogs, for both preset and custom superposition states, are created dynamically and must be
disposed when the dialogs are closed. Relevant code can be identified by searching for `addDisposable`.

Dialogs that display equation details (in the _Superposition_ screen) are created dynamically and must be disposed when
the dialogs are closed. See `addDisposable` in `ProbabilityDensityDetailsDialog` and `WaveFunctionDetailsDialog`.

Instances of all other classes do not need to be disposed. They are instantiated at startup and exist for the lifetime
of the sim. Where they inherit from `Disposable`, option `isDisposable: false` has been added to guard against calls to
`dispose`
that would leak memory.

## Top-Level Class Hierarchy

At the top level, model and view class hierarchies are parallel, and differentiate between stationary-state screens
(_One Well_, _Two Wells_, _Many Wells_) and the _Superposition_ screen:

```text
QBSModel (abstract)                      QBSScreenView (abstract)
├── StationaryStateModel (abstract)      ├── StationaryStateScreenView (abstract)
│   ├── OneWellModel                     │   ├── OneWellScreenView
│   ├── TwoWellsModel                    │   ├── TwoWellsScreenView
│   └── ManyWellsModel                   │   └── ManyWellsScreenView
└── SuperpositionModel                   └── SuperpositionScreenView
```

Base classes `QBSModel` and `QBSScreenView` handle everything that is common to all screens, including screens for 
other simulations in the suite. The parts that differ are injected into these base classes via PhET's Options pattern.
For details, see `SelfOptions` in QBSModel.ts and QBSScreenView.ts.

## Model

### Quantum Potentials

The diagram below is an overview of the model class hierarchy for quantum potentials. It indicates which editable
Properties are provided by each class. For more details, consult the documentation for each class.

```text
QuantumPotential (abstract) - wellWidthProperty (nm), yOffsetProperty (eV)
├── QuantumPotentialDepth (abstract) - adds wellDepthProperty (eV)
│   ├── AsymmetricTrianglePotential
│   ├── FiniteSquarePotential - adds separationProperty (nm)
│   ├── MorsePotential
│   └── PoschlTellerPotential - adds spacingProperty (nm)
└── InfiniteQuantumPotential (abstract)
    ├── HarmonicOscillatorPotential - adds angularFrequencyProperty (fs<sup>-1</sup>)
    ├── InfiniteSquarePotential
    └── SteppedInfinitePotential - adds stepHeightProperty (eV)
```

Note that throughout the implementation of QuantumPotential and its subclasses, Property ranges
are specified as hard-coded values, like the example shown below for `FiniteSquarePotential` in `TwoWellsModel`.
This approach is much more obvious that making a Property's range a function of the x-axis or y-axis range.
And it allowed the designer to fine-tune ranges by editing the code, which happened frequently during development.

```
new FiniteSquarePotential( {
  ...
  wellWidthRange: new RangeWithValue( 0.5, 2.5, 1 ),
  wellDepthRange: new RangeWithValue( 1, 15, 9 ),
  separationRange: new RangeWithValue( 0.05, 0.7, 0.25 ),
  ...
} )
```

In addition to the Properties above, a set of "global" Properties is provided in QBSModel and applies to all potentials
for a screen:

* `numberOfWellsProperty` - number of wells in the potential
* `electronMassesProperty` - mass of the particle in electron masses (m<sub>e</sub>)
* `electricFieldProperty` - strength of the external electric field (V/nm)

When any Property of a quantum potential is constant in a screen, its range is specified such that the Property is
effectively constant. For example, all potentials have 1 well in the _One Well_ screen, so in `OneWellModel`:

```ts
const numberOfWellsProperty = new NumberProperty( 1, {
  range: new Range( 1, 1 ), // effectively constant
  ...
} );
```

Since different QuantumPotential subclasses have different Properties, it's difficult to observe those Properties
directly in a general way.  QuantumPotential therefore has `changedEmitter: Emitter` for notifying listeners when 
any of a potential's Properties change. For examples, search for `potential.changedEmitter.addListener`.

### Wave Function Solutions

The use of analytical solutions and a numerical solution (Numerov method) is covered in the
[**Wave Functions**](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/model.md#wave-functions)
section of model.md. For details, consult the following source files: 
* analytical solutions: `js/common/model/solvers/analytical-solutions/`
* Numerov method: `js/common/model/solvers/numerov/`

The difference between stationary states and superposition states affects how the wave function is computed,
and is covered in the [**Stationary States versus Superposition States**](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/model.md#stationary-states-versus-superposition-states)
section of model.md.

`TimeIndependentSolution` is the data structure that contains the time-independent wave function solution,
eigenvalues, and potential energy values. When the potential is changed, this data structure is updated.
See `QBSModel.getTimeIndependentSolution`. Note that `TimeIndependentSolution.potentialEnergyValues` will contain 
`Number.POSITIVE_INFINITY` wherever a potential is infinite. Code that uses this data structure must handle infinite 
values. 

`TimeDependentSolution` is the data structure that describes the wave function as it evolves over time.
This data is used to plot curves in the Wave Function Graph (real part, imaginary part, magnitude, phase) and the
Probability Density Graph (probability density). It is updated when `TimeIndependentSolution` changes, when the 
superposition state changes, and each time the simulation clock ticks. See `QBSModel.getTimeDependentSolution`.

### Time

`QBSTime` is responsible for all aspects of simulation time - play, pause, step, restart, speed, visibility,
and mapping to simulation time units (fs).

Note that time is paused while dragging handles to modify a potential. And time is restarted (set to 0 fs) whenever the
state being shown is redefined — by changing or reshaping the potential, by selecting an energy level, or by
selecting/saving a superposition state.

### State Coefficients and Superposition States

State coefficients are implemented as an immutable data structure; see `StateCoefficient`. 

A set of state coefficients is said to be "compatible" with a specific bound state if an energy level exists 
for each non-zero state coefficient.  See `QBSModel.isCompatibleState`.

State coefficients play a role for both stationary states and superposition states. The set of state coefficients
involved in computing the complete wave function is declared in base class QBSModel as 
`abstract stateCoefficientsProperty: TReadOnlyProperty<readonly StateCoefficient[]>`, where the derivation depends
on the type of state that is being modeled: 

* For stationary states (see `StationaryStateModel`) the derivation results in a single non-zero state coefficient, 
corresponding to the selected energy level.

* For superposition states (see `SuperpositionModel`) the derivation is more complicated. If the selected superposition state
  is compatible with selected potential, then the state coefficients of the selected superposition state are used to compute the
  complete wave function. If there is an incompatibility, the fallback is a single non-zero state coefficient for the 
  ground state, similar to selecting the lowest energy level in the stationary state model.
  This is a suitable fallback because we are always guaranteed to have a ground state energy level. 
  Using a fallback simplifies the implementation, and we hide the UI elements that would display that fallback 
  (plots, equations, etc.) We would otherwise need to handle (in many places) the case where there is no time-dependent
  solution.

Superposition states appear exclusively in the _Superposition_ screen, where there are two types of superposition state:
* **Preset** superposition states have state coefficients that cannot be changed by the user, see `PresetSuperpositionState`.
* **Custom** superposition states have state coefficients that can be edited by the user, see `CustomSuperpositionState`.

For more details, see the following in `SuperpositionModel`: 
* `presetSuperpositionStates: PresetSuperpositionState[]` - the complete set of preset superposition states
* `customSuperpositionStates: CustomSuperpositionState[]` - the complete set of custom superposition states
* `superpositionStateProperty: Property<SuperpositionState>` - the selected superposition state

Editing a custom superposition state involves opening a dialog, setting the magnitude and phase components of 
state coefficients, normalizing the coefficients, then saving. `CustomDialogModel` handles all of those responsibilities
by providing a temporary model of the superposition state while it is being edited. When the dialog is opened,
it loads the state coefficient values into magnitude and phase Properties that are controlled by spinners.
When the user chooses to "Normalize & Save" the superposition state, it handles the normalization, then writes the 
coefficient values back to the `CustomSuperpositionState` instances in `SuperpositionModel`. 

## View

As mentioned in [Top-Level Class Hierarchy](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/implementation-notes.md#top-level-class-hierarchy),
base class `QBSScreenView` handles everything that is common to all screens, including screens for
other simulations in the suite. The parts that differ are injected into QBSScreenView via PhET's Options pattern.
For details, see `SelfOptions` QBSScreenView.ts.

Most of the view components in the simulation are straightforward and will not be covered here.
We do note that subclassing is used heavily to encapsulate PhET-iO metadata and core description. 
(See for example `PhaseCheckbox`.)

The remainder of this section will highlight some of the more interesting view components.

### Charts and Plots

PhET's bamboo library is used to draw charts and plots, including the Energy Diagram, Probability Density Graph,
and Wave Function Graph. The implementation is optimized to use the Canvas API for all plots. A bamboo tutorial
is beyond the scope of this document. But the implementation pattern for render plots using bamboo and Canvas 
typically requires 3 types of classes: 

1. A top-level class that creates the framework for the chart - the ChartRectangle, ChartTransform, and decorations
   like axes, tick marks, gridlines, etc.  `EnergyDiagramNode`, `ProbabilityDensityGraphNode`, `WaveFunctionGraphNode`,
   and base class `QuantumStateGraphNode` handle these responsibilities.

2. A class for each plot. This class extends CanvasPainter and draws the plot by making Canvas API calls to a
   CanvasRenderingContext2D. These classes include:
   * `EnergyLevelsPlot` draws energy levels, optimized to draw horizontal lines.
   * `YCanvasLinePlot` is optimized to draw curves were the x-coordinates are fixed and the y-coordinates are mutable.
      It is used to draw the quantum potential and previews in Superposition State dialogs, and as a base class for 
      plotting wave function parts.
   * `RealPlot`, `ImaginaryPlot`, and `MagnitudePlot` are subclasses of `YCanvasLinePlot` that draw wave function parts.
   * `PhasePlot` draws the phase component of the wave function. It fills the area under the magnitude curve with a 
      series of thin polygon slices. Color of each polygon is determined using a mapping from phase value to
      the 'twilight' colormap. See `PhaseColormap` for details.

3. A subclass of `ChartCanvasNode` that provides the underlying Canvas in the DOM, manages the plots by updating their
   datasets, and tell the plots to repaint. `EnergyDiagramPlotsNode`,`ProbabilityDensityPlotsNode`, and `WaveFunctionPlotsNode`
   handle these responsibilities.

### Superposition State Dialogs

`PresetDialog` displays a preset superposition state. Coefficients are expressed in
[amplitude format](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/model.md#state-coefficients). 
Previews of the time-independent wave function for each coefficient are displayed, and the complete time-independent
wave function (the superposition of the individual wave functions) is displayed. 

`CustomDialog` displays a custom superposition state. It is a complicated dialog, intended for
teachers and other "power users", and it has its own model (see `CustomDialogModel` above). 
It supports editing, clearing, normalizing, and saving the superposition state.
A preview of the complete time-independent wave function is displayed, updated as coefficients are modified.

TODO https://github.com/phetsims/quantum-bound-states/issues/170 NumberField for entering coefficient values with keyboard.

### Time Controls

While many PhET sims have a user interface for controlling time, the user interface in this sim is
(by design) unusually complicated. `TimePanel` is the place to begin your exploration.

### Potential Handles

Potential handles are the double-headed arrows used to change the Properties (width, depth, etc.) of a quantum potential.
They may be the most complicated part of the view implementation, since they provide the user interface for
direct manipulation of quantum potentials. All code related to handles is found in `js/common/view/handles`.

All handles for a quantum potential instance are grouped under one parent Node, a subclass of `PotentialHandlesNode`.
These subclasses are responsible for creating the handles for the potential's Properties, and for controlling 
visibility of the handles. All potential types have an associated subclass of `PotentialHandlesNode`.
The class hierarchy is:

```text
PotentialHandlesNode
├── AsymmetricTriangleHandlesNode
├── CoulombHandlesNode
├── FiniteSquareHandlesNode
├── HarmonicOscillatorHandlesNode
├── InfiniteSquareHandlesNode
├── MorseHandlesNode
├── PoschlTellerHandlesNode
└── SteppedInfiniteHandlesNode
```

Individual handles are subclasses of `PotentialHandleNode` and each subclass is specific to some Property of
a quantum potential, as noted in the diagram below. A handle is responsible for creating the double-headed arrow and a label (e.g. "width = 0.7 nm"), 
managing the position of the arrow and label relative to the Energy Diagram, creating input listeners for dragging and
keyboard shortcuts, and queuing accessible responses. The class hierarchy is:

```text
PotentialHandleNode (abstract)
├── WellDepthHandleNode (abstract): wellDepthProperty
│   ├── AsymmetricTriangleDepthHandleNode
│   ├── FiniteSquareDepthHandleNode
│   ├── MorseDepthHandleNode
│   └── PoschlTellerDepthHandleNode
├── WellWidthHandleNode (abstract): wellWidthProperty
│   ├── AsymmetricTriangleWidthHandleNode
│   ├── FiniteSquareWidthHandleNode
│   ├── HarmonicOscillatorWidthHandleNode
│   ├── InfiniteSquareWidthHandleNode
│   ├── MorseWidthHandleNode
│   ├── PoschlTellerWidthHandleNode
│   └── SteppedInfiniteWidthHandleNode
├── FiniteSquareSeparationHandleNode: separationProperty
├── PoschlTellerSpacingHandleNode: spacingProperty
└── SteppedInfiniteStepHeightHandleNode: stepHeightProperty
```

Subclasses of `PotentialHandleDragListener` handle the interactions with handles. They are responsible for handling pointer 
and keyboard input, handling model-view transforms via the Energy Diagram's ChartTransform, updating the potential's
associated Property, and basic sound. The class hierarchy is:

```text
PotentialHandleDragListener
├── WellDepthDragListener
├── WellWidthDragListener
│   └── FiniteSquareWidthDragListener
├── FiniteSquareSeparationDragListener
├── PoschlTellerSpacingDragListener
└── SteppedInfiniteStepHeightDragListener
```

### Potential Markers

Potential markers are vertical lines that show the extents of some Property of a quantum potential. 
For example, the spacing between the wells of a Pöschl-Teller potential is denoted by 2 vertical lines that 
extend through the centers of adjacent wells. All code related to markers is found in `js/common/view/markers`.

Similar to handles, all markers for a quantum potential instance are grouped under one parent Node, a subclass of
`PotentialMarkersNode`. These subclasses are responsible for creating the markers and for controlling their
visibility. Not all potential types require markers. The class hierarchy is:

```text
PotentialMarkersNode
├── AsymmetricTriangleMarkersNode
├── CoulombMarkersNode
├── FiniteSquareMarkersNode
├── MorseMarkersNode
└── PoschlTellerMarkersNode
```

Individual markers are subclasses of `PotentialMarkerNode` and each subclass is specific to some Property of 
a quantum potential, as noted in the diagram below. A marker is responsible for creating a pair of vertical dashed 
lines, and managing the position of those lines relative to the Energy Diagram. Markers are not interactive. 
The class hierarchy is:

```text
PotentialMarkerNode
├── WellWidthMarkerNode: wellWidthProperty
├── FiniteSquareSeparationMarkerNode: separationProperty
└── PoschlTellerSpacingMarkerNode: spacingProperty
```

## Accessibility

Version 1.0 of this simulation supports Alternative Input and Core Description.

The order that elements appear in the PDOM (Parallel DOM) is determined in ScreenView subclasses. Search for
`pdomPlayAreaNode.pdomOrder` and `controlAreaNode.pdomOrder`

Description implementation is split into three kinds of files, found in `js/*/view/description/` subdirectories:

- **Screen Summary** provides a summary description for a screen and is added at the ScreenView level via option
  `screenSummaryContent`. See `OneWellScreenSummaryContent`, `TwoWellsScreenSummaryContent`,
  `ManyWellsScreenSummaryContent`, and `SuperpositionScreenSummaryContent`.
- **Describer** provides static methods that build syntactic constructs for descriptions: string Properties, 
  paragraphs, lists, etc. Examples: `QuantumPotentialDescriber`, `EnergyDiagramDescriber`
- **Description Node** is a Node that creates a description by combining multiple syntactic constructs, typically
  obtained from a Describer. This type of Node must be explicitly added to the PDOM by adding it to the scenegraph via
  `addChild`, then optionally adjusting `pdomOrder`. Examples: `StationaryStateWaveFunctionGraphDescriptionNode`,
  `CustomDialogDescriptionNode`

Note that throughout the simulation, localization of math equations and expressions is (by design) not support,
because math is considered to be a universal language.

## Sound

Version 1.0 of this simulation supports Basic Sound and Sonification of curves.

The majority of Basic Sound is provided by common-code UI components.

Potential handles and the Reference Line handle basic sound via tambo's `ValueChangeSoundPlayer`. For details, see
`PotentialHandleDragListener` and `ReferenceLineDragListener`.

TODO https://github.com/phetsims/quantum-bound-states/issues/170 Sonification

## PhET-iO

Version 1.0 of this simulation supports PhET-iO.

Dialogs are considered "transient" elements and are therefore not instrumented for PhET-iO. This includes the dialogs
that display equation details (Wave Function, Probability Density) and the Superposition State dialogs for preset and
custom states.

All other elements are instrumented for PhET-iO, are instantiated at startup, and do not require support for dynamic
elements (e.g., `PhetioGroup`, `PhetioCapsule`).

The following sim-specific IOTypes are provided:

| IOType                      | Class Serialized          | Serialization Type |
|:----------------------------|:--------------------------|:-------------------|
| `QuantumPotentialIO`        | `QuantumPotential`        | Reference          |
| `QuantumStateGraphIO`       | `QuantumStateGraph`       | Reference          |
| `SuperpositionStateIO`      | `SuperpositionState`      | Reference          |
| `StateCoefficientIO`        | `StateCoefficient`        | Data               |
| `TimeIndependentSolutionIO` | `TimeIndependentSolution` | Data               |
| `TimeDependentSolutionIO`   | `TimeDependentSolution`   | Data               |

Note that infinite values do appear in the PhET-iO data stream.
Specifically, `TimeIndependentSolutionIO.potentialEnergyValues`
will contain `Number.POSITIVE_INFINITY` wherever a potential is infinite.
The view implementation (and client wrappers) must be prepared to handle infinite potential values.

## Unit Tests

`js/quantum-bound-states-tests.ts` is the QUnit entry point. (`generatedUnitTests: true` in `package.json` generates the
`quantum-bound-states-tests.html` harness that loads it.) It currently pulls in one suite, `NumerovSolverTests.ts`,
which exercises `NumerovSolver`.

## Developer Features

This section documents developer-only features. You may find these features useful for testing and debugging.

**Potentials**: `js/common/view/debug` contains the implementation for a dialog that can be used to configure 
potentials. This dialog existed before the drag handles were implemented, and we've kept it around for posterity.
Running with `?dev` will add a red "gear" button in the top-right corner of the screen. Pressing that button 
opens a dialog for the selected potential, with a NumberControl for each Property of that potential. Note that 
the dialog allows you to change `xOffsetProperty`, which is not a feature of the simulation. `xOffsetProperty` 
was included as a possible future feature, and because the Java version's model also included (but did not expose)
x-offset.

**Magnifier**: Running with query parameter `?dev` adds 2 features to the magnifier.
The model coordinates of the probe's position will be displayed in the viewer; see `MagnifierViewerNode`.
And two gray circles will be rendered to indicate the Bézier control points for the wire that connects the magnifier's
probe and viewer; see `MagnifierWireNode`.

**Custom Superposition States**: Running with query parameter `?dev` adds the "Set All Magnitudes to 1" button to 
the custom Superposition State dialog. Pressing this button sets all coefficient magnitudes to 1, which can be 
useful for testing. Other values can be specified with query parameter `?setAllMagnitudes`.
See the instantiation of `SetAllMagnitudesButton` in `CustomButtonGroup`.

**Energy Levels**: In the _Superposition_ screen, the number of energy levels is typically shown in the Energy Diagram panel
as "Energy Levels E<sub>g</sub> to E<sub>∞</sub>", where "g" is the principal quantum number for the ground state.
The simulation actually computes a finite number of energy levels for infinite potentials, and it can be useful to 
see that number. Running with query parameter `?dev` shows "Energy Levels E<sub>g</sub> to E<sub>n</sub>",
where "n" is the principal quantum number for the maximum energy level computed by the simulation. See `EnergyLevelsText`.
