# Quantum Bound States - QA notes

This document contains notes that may be useful to the PhET QA team when testing the suite of Quantum Bound States 
simulations.

There are five simulations in the suite:

* Quantum Bound States
* Band Structure
* Bound State Superposition
* Double Wells and Covalent Bonds
* Particle in a Box

Quantum Bound States is the **primary simulation** and the other four are derived from it. For each derived simulation,
see its implementation-notes.md file for a description of how it differs from the primary simulation:

* [band-structure/implementation-notes.md](https://github.com/phetsims/totality/blob/main/band-structure/doc/implementation-notes.md)
* [bound-state-superposition/implementation-notes.md](https://github.com/phetsims/totality/blob/main/bound-state-superposition/doc/implementation-notes.md)
* [double-wells-and-covalent-bonds/implementation-notes.md](https://github.com/phetsims/totality/blob/main/double-wells-and-covalent-bonds/doc/implementation-notes.md)
* [particle-in-a-box/implementation-notes.md](https://github.com/phetsims/totality/blob/main/particle-in-a-box/doc/implementation-notes.md)

For the primary simulation, skim these two documents, especially their **Terminology** sections:

* [quantum-bound-states/model.md](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/model.md)
* [quantum-bound-states/implementation-notes.md](https://github.com/phetsims/totality/blob/main/quantum-bound-states/doc/implementation-notes.md)

## Public Query Parameters

Verify that public query parameters are working as expected.
They are documented in [QBSQueryParameters.ts](https://github.com/phetsims/totality/blob/main/quantum-bound-states/js/common/QBSQueryParameters.ts).

Private query parameters can be ignored.

## Multitouch

Verify that multitouch is disabled for all sims in the suite. 

If you're curious about why multitouch is disabled, see https://github.com/phetsims/quantum-bound-states/issues/65.

## Time Controls

Verify that the sim behaves as expected when time is playing and when time is paused.

Verify that time is restarted (set to 0 fs) whenever the state being shown is redefined — by changing or reshaping
the potential, by selecting an energy level, or by selecting/saving a superposition state.

## Potential Handles

Handles are the yellow arrows used to change some property of a quantum potential (width, depth, etc.)

Verify that using the arrow keys changes the value by 0.1.

For values with 2 decimal places, verify that Shift + arrow keys changes the value by 0.01.

For values with 1 decimal place, verify that Shift + arrow keys changes the value by 0.1.
That is, the behavior is the same with and without the Shift modifier.

## Incompatible Superposition State

In the _Superposition_ screen, it is possible to select or create a superposition state that is incompatible with 
the current potential. This means that the superposition state has coefficients for energy levels that are not present
in the quantum potential. For example, if the superposition state has non-zero values for |c<sub>1</sub>|,
|c<sub>3</sub>|, and |c<sub>5</sub>|, the quantum potential must have energy levels E<sub>1</sub> and E<sub>3</sub>, 
and E<sub>5</sub>. If that is not the case, then the superposition state is incompatible.

Incompatibility is noted via messages in the Quantum State Graph and Superposition State dialogs.
The remainder of this section provides tests for verifying the messages. All of these tests are performed
in the _Superposition_ screen.

### Preset Superposition States

1. Press the "reset all" button to return to the default state.
2. Choose "Finite Square" from the potential combo box.
3. Choose "Wave Packet" from the Superpositon State combo box.
4. Check the "Values" checkbox.
5. Set the potential's depth to 1.0 eV using the yellow handle.
6. Verify: In the Quantum State Graph, curves are hidden, and the following message appears:

```
   Incompatible Superposition State
⚠️ Superposition State requires 10 energy levels.
   The current potential has 3 energy levels.
```

7. Open the Superposition State dialog for "Wave Packet" by pressing the info button to the right of the Superposition State combo box.
8. Verify: The previews for a<sub>4</sub> through a<sub>10</sub> show a ⚠️ icon instead of a curve.
9. Verify: The preview for the complete wave function (Ψ = ...) shows a ⚠️ icon instead of a curve.
10. Verify: The following message appears at the bottom of the dialog:

```
⚠️ Superposition State requires 10 energy levels.
   The current potential has 3 energy levels.
```

11. Close the Superposition State dialog. 
12. Verify: Change the potential's depth to change the number of energy levels. Verify that the Quantum State Graph
shows curves when the superposition state is compatible and shows the "Incompatible Superposition State" when the 
superposition state is incompatible.
13. Verify: Repeat steps 1-12 for other potential types and preset superposition states.

### Custom Superposition States

1. Press the "reset all" button to return to the default state.
2. Choose "Finite Square" from the potential combo box. Note that it has 10 energy levels, E<sub>1</sub> through E<sub>10</sub>.
3. Choose "Custom 1" from the Superpositon State combo box.
4. Check the "Values" checkbox.
5. Open the Superposition State dialog for "Custom" by pressing the edit button to the right of the Superposition State combo box.
6. Set the |c<sub>11</sub>| spinner to a non-zero value. 
7. Verify: A ⚠️ icon appears to the left of the |c<sub>11</sub>| spinner.
8. Verify: A ⚠️ icon appears for the wave function preview and no curve is shown.
9. Verify: The following message appears at the bottom of the dialog:

```
⚠️ Superposition State requires 11 energy levels.
   The current potential has 10 energy levels.
```

10. Press the "Normalize & Save" button.
11. Close the Superposition State dialog.
12. Verify: In the Quantum State Graph, curves are hidden, and the following message appears:

```
   Incompatible Superposition State
⚠️ Superposition State requires 11 energy levels.
   The current potential has 10 energy levels.
```

13: Repeat steps 1-12 for other potential types and custom superposition states.

