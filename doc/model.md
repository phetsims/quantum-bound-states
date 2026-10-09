# Quantum Bound States - Model

This document is a high-level description of the model in PhET's _Quantum Bound States_ simulation, written for teachers
and others who want an overview of the simulation model. It is assumed that the reader has a background in quantum
physics.

A single quantum particle is confined by a one-dimensional quantum potential, made up of one or more identical wells.
Because the particle is confined, its energy is quantized. The sim computes the particle's **bound states**: the
discrete energies that the particle is allowed to have, and the wave function for each energy. The shape of the
potential determines both the allowed energies and the shapes of the wave functions.

The user can reshape the potential and change other settings, such as the particle's mass, the electric field, and the
superposition state. The sim shows how each change affects the wave function and probability density.

Two stacked graphs share the same x-axis (position). The **Energy Diagram** shows the potential energy curve and the
allowed energy levels. The **Quantum State Graph** below it shows either the probability density or the wave function,
for the selected energy level or superposition state.

## Screens

| Screen           | Focus                                                                                                                |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------|
| _One Well_       | How the shape of a single well and the particle's mass determine the energy levels and wave functions.               |
| _Two Wells_      | How the energy levels and wave functions change when two identical wells are placed close together.                  |
| _Many Wells_     | How the energy levels of a row of identical wells group into bands, and how an external electric field changes them. |
| _Superposition_  | How combining several energy levels produces a state that changes shape over time, unlike a single energy level.     |

# Terminology

Domain terminology:

**Quantum Potential**: The entire function V(x), made up of one or more identical wells. Often called simply "potential".

**Potential Well**: A localized dip in potential energy that traps a particle or object in a specific region, requiring
an external input of energy for that object to escape. Often called simply "well".

**Energy Level**: One of the discrete energies that a bound particle is allowed to have. Energy levels are
numbered by their principal quantum number *n*, for example, E<sub>1</sub>.

**Ground State**: The energy level with the lowest principal quantum number *n* and the lowest energy value. Varies by
quantum potential type.

**State Coefficient**: A complex number that determines how much one energy level contributes to a state.
Its magnitude determines the probability of measuring that level’s energy, and its phase affects quantum interference.
Like energy levels, state coefficients are numbered by n, for example, c<sub>1</sub>. The magnitude of c<sub>1</sub>
is written |c<sub>1</sub>|, and its phase is written ϕ<sub>1</sub>.

**Stationary State**: A quantum state with a single energy level and a single non-zero state coefficient.
Its probability density does not change over time. The _One Well_, _Two Wells_, and _Many Wells_ screens show only stationary states.

**Superposition State**: A quantum state involving two or more energy levels with non-zero state coefficients.
Its probability density changes over time. See the _Superposition_ screen.

## Units

The sim does not use SI units. It uses units suited to atomic-scale physics.

| Quantity                        | Unit              |
|:--------------------------------|:------------------|
| Position                        | nm                |
| Well Width                      | nm                |
| Well Separation                 | nm                |
| Well Spacing                    | nm                |
| Energy                          | eV                |
| Well Depth                      | eV                |
| Step Height                     | eV                |
| Mass                            | m<sub>e</sub>     |
| Electric Field                  | V/nm              |
| Time                            | fs                |
| Angular Frequency               | fs<sup>-1</sup>   |
| Probability Density amplitude † | nm<sup>-1</sup>   |
| Wave Function amplitude †       | nm<sup>-1/2</sup> |

† The sim does not display these units, but the model uses them.

## Quantum Potentials

The sim models several types of quantum potentials, named for the shape of their wells.
Each screen offers only some of these types, and lets the user change only some of their properties.
Potentials are reshaped by dragging handles on the potential energy curve.
Each screen restricts these adjustments to ranges that are pedagogically useful.
When a potential has more than one well, the wells are identical and evenly spaced.

| Well Type           | Adjustable Properties     | Shape and Significance                                                                                                                                           |
|:--------------------|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Infinite Square     | width                     | Flat floor, infinitely high walls. The textbook "particle in a box"; the particle can never escape and the wave function vanishes at the walls.                  |
| Finite Square       | width, depth, separation  | Flat floor, walls of finite height. The wave function leaks into the walls and the number of bound states is finite.                                             |
| Stepped Infinite    | width, depth, step height | An infinite well whose floor steps up halfway across.                                                                                                            |
| Asymmetric Triangle | width, depth              | One vertical wall and one sloping wall.                                                                                                                          |
| Harmonic Oscillator | width                     | A parabola — the quantum version of a mass on a spring, and the standard approximation to any smooth well near its minimum. Its energy levels are evenly spaced. |
| Pöschl-Teller       | width, depth, spacing     | A smooth, symmetric well, shaped like an upside-down bell.                                                                                                       |
| Morse               | width, depth              | An asymmetric well that models a diatomic molecular bond and its dissociation. Its energy levels get closer together near the top.                               |
| Coulomb             | width                     | A one-dimensional version of the electron-proton attraction, calibrated to reproduce the hydrogen atom's energy levels.                                          |
| Double Square       | width, depth, spacing     | Two identical finite square wells side by side.                                                                                                                  |

Separation is the distance between the walls of neighboring wells. Spacing is the distance between the centers of neighboring wells.

Depending on the screen, the user may also be able to change these properties. Except for Energy Offset, 
each one applies to every potential on the screen.

* **Number of Wells** - The number of identical wells in the potential.
* **Mass** - The mass of the particle, in electron masses. Increasing the mass lowers the
  energy levels and moves them closer together, except for Coulomb, where it moves them farther apart.
  In screens where mass is not adjustable, its value is 1 m<sub>e</sub>.
* **Energy Offset** - A vertical energy offset applied to the whole potential.  It shifts the potential and its energy
  levels by the same amount, so the spacing between levels does not change. Each type of potential has its own energy
  offset. In screens where energy offset is not adjustable, its value is 0 eV.
* **Electric Field** - The strength of an external electric field, which tilts the row of wells. In screens 
  where the electric field is not adjustable, its value is 0 V/nm.

## Energy Levels

An **energy level** is a specific, fixed amount of energy that a bound quantum system — such as an atom, ion, molecule,
or subatomic particle — is allowed to have.

Energy levels are numbered using their principal quantum number 'n', for example, E<sub>1</sub> for n = 1. The ground
state (lowest value of n, and the lowest energy) varies by potential type, n = 0 for some wells, and n = 1 for others.
This is worth pointing out to students since it makes a phrase like "the third level" ambiguous.

Some potentials have only a finite number of bound states, and the number of energy levels changes as the potential is
reshaped. Other potentials have an infinite number of energy levels, and the sim shows those energy levels that fit 
within the range of the Energy Diagram's y-axis. The exception is Coulomb, for which the sim computes only the lowest
10 levels (n = 1 to 10).

## Wave Functions

Each energy level has an associated **wave function**. Its square gives the probability density — the probability per
unit length of finding the particle near a given position — and the area under that curve is always one, since the
particle is somewhere.

The wave function is a complex-valued function. The sim can plot any combination of its real part, imaginary part,
and magnitude. A representation of the wave function phase can also be shown, drawn as a color gradient beneath the
magnitude curve, if enabled in Preferences.

To compute the wave function,
the simulation solves the **1D time-independent Schrödinger equation** for a grid of equally spaced position (x-axis)
values. The number of points in this grid is specific by `numberOfPoints` in QBSQueryParameters.ts (`3001` as
of this writing). The number of points was selected to ensure both model accuracy and high rendering quality for plots.
The grid range (`[-3.5, 3.5]` as of this writing) must be symmetric about x = 0. The number of grid points must be 
odd, so that the center grid point is at x = 0.

For a single-well potential with electric field = 0 V/nm, we used an available **analytical solution** or the solution 
of a transcendental equation specific to the potential type. For details, see the following files: InfiniteSquareSolution.ts,
FiniteSquareSolution.ts, SteppedInfiniteSolution.ts, AsymmetricTriangleSolution.ts, HarmonicOscillatorSolution.ts,
PoschlTellerSolution.ts, MorseSolution.ts, CoulombSolution.ts.

For multiple wells or a non-zero electric field, we solve the Schrödinger equation numerically, using the **Numerov numerical method**.
Numerov is the standard choice for 1D quantum eigenvalue problems and has been extensively validated in the literature.
Numerov is currently used for Finite Square and Pöschl-Teller potentials, the only cases that involve multiple wells or
a non-zero electric field. For details, see NumerovSolver.ts, FiniteSquarePotential.ts, and PoschlTellerPotential.ts.
Numerov’s method takes much more computation than an analytical solution. So on less powerful devices, the sim may
respond more slowly when the user changes one of these potentials.

## Stationary States versus Superposition States

On the _One Well_, _Two Wells_, and _Many Wells_ screens, the user selects a single energy level,
and the Quantum State Graph shows the wave function or probability density for that level.
The wave function of a specific energy level signifies a **stationary state** where a particle possesses fixed,
well-defined energy and a standing-wave probability distribution that does not change over time.

On the _Superposition_ screen, the user does not select an energy level. Instead, the user selects a superposition
state. It is a combination of two or more stationary states, and its probability density changes over time. The state
coefficients set how much each stationary state contributes. A superposition state requires at least two coefficients
with non-zero magnitude. With only one, it would be a stationary state.

A potential with a finite number of energy levels may have fewer energy levels than a superposition state requires. The sim
then shows "Incompatible Superposition State" instead of a plot, along with the number of energy levels that the state
requires and the number that the potential has. Widening or deepening the well adds energy levels, and usually makes
the state compatible.

The sim provides preset superposition states, whose coefficients cannot be changed, and custom superposition states,
whose coefficients can be edited. Most of the presets are straightforward, but the "Wave Packet"
preset deserves some explanation. The goal of the "Wave Packet" preset is to give an approximation (using 10 coefficients)
of a localized particle for the Harmonic Oscillator potential, which is generically considered a "Wave Packet".

## State Coefficients

The _Superposition_ screen uses two formats for state coefficients:

* **Magnitude & Phase format**: Represents the state coefficient as a magnitude `|c|` in the rage `[0,1]` and a phase `φ`
  in the range `[0π,2π]`. This format is used for custom superposition states that can be edited by the user.
* **Amplitude format**: Represents the state coefficient as an amplitude `a` in the range `[-1,1]`. The magnitude is the absolute
  value of the amplitude. Phase is determined by the sign of amplitude: positive → 0π, negative → 1π. This format is used
  for preset superposition states, which cannot be edited by the user.

## Time Dependence

Time can be paused, stepped, restarted, and run at a range of speeds.

Real bound-state evolution happens much too fast to see, so the sim slows time down. 
At the middle setting of the speed control, time is slowed down by a factor of 10<sup>15</sup>.
Something that takes 1 fs in reality will take 1 second in the simulation.

Restarting time sets the time to 0 fs without changing any other setting. Pausing the simulation and pressing
the restart button is an effective way to observe the wave function and probability density at t = 0 fs.

Time also restarts when the user changes the potential or one of its settings, selects an energy level, or selects a
superposition state.

## Tools

The **Magnifier** shows a magnified view for a small region of the Energy Diagram.
In the magnified view, the user can distinguish energy levels that are very close together.

The **Reference Line** is a vertical line that spans both graphs and marks the same position on each.
The user drags it left or right by its handle.

## Simplifications and Limitations

- For potentials with an infinite number of energy levels, such as the Harmonic Oscillator and the Infinite Square potentials, 
  the sim shows only a finite number of energy levels. On the _Superposition_ screen, up to 48 coefficients can be
  edited to create a custom superposition state.
- The wave function is computed on a fixed, finite position grid (`3001` points spanning `[-3.5, 3.5]` nm as of this writing),
  so results are only as accurate as that grid resolution and range allow. Calculations made outside the simulation
  with the same parameters but a different number of points will yield different solutions.
- When considering multiple wells, we set hard walls at the edge of the grid, i.e., the wavefunction ψ is forced to zero at
  x = ±3.5 nm. As a result, the bound states are well-defined mathematically, even with an electric field.
  Physically, there are resonances from which the particle would tunnel out down the tilt.
