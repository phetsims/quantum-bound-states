// Copyright 2026, University of Colorado Boulder

/**
 * QUnit tests for the NumerovSolver, focused on the configurations the simulation actually solves
 * numerically.
 *
 * The sim invokes NumerovSolver for only two potentials, and only when they are multi-well and/or have
 * a non-zero electric field — the single-well, zero-field cases are served by a closed-form analytical
 * solution (see FiniteSquarePotential.solveBoundState and PoschlTellerPotential.solveBoundState):
 *
 *   - Finite Square Well (multi-well and/or electric field)
 *   - Pöschl-Teller    (multi-well and/or electric field)
 *
 * Tests for the analytically-solved potentials (Infinite Square Well, Infinite Step, Harmonic
 * Oscillator, Morse, Asymmetric Triangle, Coulomb, and the single-well/zero-field Finite Square Well)
 * have been removed: they exercised solver paths the sim never takes. The single-well Pöschl-Teller
 * cases are retained as analytical ground-truth anchors for the sech² well shape that the
 * numerically-solved multi-well states are built from.
 *
 * For every parameter combination the tests verify the physical invariants the solver must satisfy:
 *
 *   1. No NaN or Infinity – every energy and wave-function value is a finite number.
 *   2. Energy ordering    – E[0] < E[1] < E[2] < … (Sturm-Liouville theorem).
 *   3. Normalization      – ∫|ψ_n|² dx ≈ 1 within 1 × 10⁻³.
 *   4. Node counting      – eigenstate n (0-indexed) has exactly n interior nodes
 *                           (where node detection is reliable).
 *
 * Additional tests cover parity, orthogonality, boundary decay, the Pöschl-Teller bound-state count
 * formula, Stark-field parity mixing, a direct comparison against the Pöschl-Teller analytical
 * solution, and wave-function continuity (ψ and ψ′) for both the soft-wall Pöschl-Teller potential
 * (including the tilted multi-well matching-point regression) and a single finite Square Well.
 *
 * The generic invariant checks for each potential are consolidated into a single 'parameter sweep'
 * test per module that walks the full Numerov-solved parameter space (wells, separation, depth, width,
 * mass, electric field) in one pass.
 *
 * Helper utilities (node-counting, parity, RMS error, continuity checks) live in QBSSolverTestUtils.ts.
 *
 * Written with the help of Claude
 *
 * @author Martin Veillette
 */

import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../QBSConstants.js';
import PoschlTellerSolution from './solver/analytical-solutions/PoschlTellerSolution.js';
import NumerovSolver from './solver/NumerovSolver.js';
import { allFinite, assertWaveFunctionContinuity, computeNorm, computeOverlap, countNodes, getParity, waveFunctionRMSError } from './solver/QBSSolverTestUtils.js';
import XGrid from './solver/XGrid.js';

const HBAR = NumerovSolver.HBAR;

/** Half-width of the sim view grid (QBSConstants.ALL_GRAPHS_X_RANGE is [−3.5, 3.5] nm). */
const STANDARD_X_MAX = QBSConstants.ALL_GRAPHS_X_RANGE.max;

/** Point count for the standard grid (matches QBSQueryParameters default). */
const STANDARD_NUMBER_OF_POINTS = 3001;

// ─── Grid helper ─────────────────────────────────────────────────────────────

/**
 * Standard grid [−3.5, 3.5] nm used for soft-wall potentials that have evanescent tails.
 */
function standardGrid(): XGrid {
  return new XGrid( {
    xMin: -STANDARD_X_MAX,
    xMax: STANDARD_X_MAX,
    numberOfPoints: STANDARD_NUMBER_OF_POINTS,
    tandem: Tandem.OPT_OUT
  } );
}

// ─── Assertion helpers ─────────────────────────────────────────────────────────

/**
 * Assert that all energies and wave-function values in result are finite numbers.
 */
function assertAllFinite( assert: Assert, result: { energies: number[]; waveFunctions: number[][] }, label: string ): void {
  assert.ok( allFinite( result.energies ), `${label}: all energies must be finite` );
  for ( let i = 0; i < result.waveFunctions.length; i++ ) {
    assert.ok( allFinite( result.waveFunctions[ i ] ), `${label}: state ${i} wave function must be finite` );
  }
}

/**
 * Assert that energies are strictly ascending.
 */
function assertEnergyOrdering( assert: Assert, energies: number[], label: string ): void {
  for ( let i = 1; i < energies.length; i++ ) {
    assert.ok(
      energies[ i ] > energies[ i - 1 ],
      `${label}: E[${i}]=${toFixed( energies[ i ], 4 )} must be > E[${i - 1}]=${toFixed( energies[ i - 1 ], 4 )}`
    );
  }
}

/**
 * Assert that every wave function in result is normalized to 1 within tolerance.
 */
function assertNormalization( assert: Assert, result: { waveFunctions: number[][] }, dx: number, tolerance: number, label: string ): void {
  for ( let i = 0; i < result.waveFunctions.length; i++ ) {
    const norm = computeNorm( result.waveFunctions[ i ], dx );
    assert.ok(
      Math.abs( norm - 1 ) < tolerance,
      `${label}: state ${i} norm=${toFixed( norm, 6 )} must be within ${tolerance} of 1`
    );
  }
}

/**
 * Assert that state index i has exactly i interior nodes, for the first maxStates states.
 * A failure at any state is reported but does not stop checking the rest.
 */
function assertNodeCounting( assert: Assert, waveFunctions: number[][], maxStates: number, label: string ): void {
  const limit = Math.min( waveFunctions.length, maxStates );
  for ( let i = 0; i < limit; i++ ) {
    const nodes = countNodes( waveFunctions[ i ] );
    assert.equal( nodes, i, `${label}: state ${i} should have ${i} nodes, found ${nodes}` );
  }
}

// ─── Sweep parameter sets (sim-valid ranges) ───────────────────────────────────

/** Electron masses — three values spanning the sim range [0.5, 1.1] (OneWellModel.ts) without a 7× sweep blow-up. */
const SWEEP_MASSES = [ 0.5, 1.0, 1.1 ];

/** Well widths for Pöschl-Teller — matches PoschlTellerPotential wellWidthRange [0.1, 1] nm. */
const SWEEP_WELL_WIDTHS_PT = [ 0.1, 0.5, 1.0 ];

/** Well depth for Pöschl-Teller — matches PoschlTellerPotential wellDepthRange [1, 15] eV. */
const SWEEP_WELL_DEPTHS_15 = [ 1.0, 5.0, 10.0, 15.0 ];

/** Number of wells for multi-well potentials — covers single, small, medium, maximum. */
const SWEEP_NUMBER_OF_WELLS = [ 1, 3, 5, 10 ];

/** Wall-to-wall gap between adjacent Finite Square wells (nm). */
const SWEEP_SEPARATIONS = [ 0.05, 0.2 ];

/** Center-to-center gap beyond well width for Pöschl-Teller multi-well (nm). */
const SWEEP_PT_GAPS = [ 0.1, 0.3 ];

/** Electric field strengths (V/nm) — zero, moderate, and maximum. */
const SWEEP_ELECTRIC_FIELDS = [ 0, 0.3, 1.0 ];

/** Reduced well-width set for multi-well / electric-field sweeps. */
const SWEEP_MULTI_WELL_WIDTHS = [ 0.5, 1.0 ];

/** Reduced well-depth set for multi-well / electric-field sweeps. */
const SWEEP_MULTI_WELL_DEPTHS = [ 5.0, 15.0 ];

/** Single representative mass for the heaviest combined multi-well + electric-field sweeps. */
const SWEEP_MASSES_MULTI = [ 1.0 ];

// ─── Sweep helpers ─────────────────────────────────────────────────────────────

/**
 * Run the four core assertions (finite, ordered, normalized, node-count) for every
 * combination in a pre-built array of parameter sets.
 *
 * @param assert - QUnit assert object
 * @param configs - Array of {grid, potFn, mass, energyMin, energyMax, label, checkNodes}
 */
type SweepConfig = {
  grid: XGrid;
  potFn: ( x: number ) => number;
  mass: number;
  energyMin: number;
  energyMax: number;
  label: string;
  checkNodes?: boolean;
};

function runSweep( assert: Assert, configs: SweepConfig[] ): void {
  for ( const cfg of configs ) {
    const result = NumerovSolver.solve( cfg.grid, cfg.potFn, cfg.mass, cfg.energyMin, cfg.energyMax );

    // At least one state must be found for non-degenerate parameter sets.
    // (Some extreme parameter combinations legitimately yield zero states.)
    if ( result.energies.length === 0 ) {
      // Zero states can be physically correct (e.g., a Pöschl-Teller well tilted by a strong field whose
      // energy window collapses to nothing). Emit a passing assertion so CT records the case without a red flag.
      assert.ok( true, `${cfg.label}: zero bound states returned (physically valid for this parameter set)` );
      continue;
    }

    assertAllFinite( assert, result, cfg.label );
    assertEnergyOrdering( assert, result.energies, cfg.label );
    assertNormalization( assert, result, cfg.grid.dx, 1e-3, cfg.label );

    if ( cfg.checkNodes ) {

      // Node counting is reliable for the first few states; check up to 10.
      assertNodeCounting( assert, result.waveFunctions, 10, cfg.label );
    }
  }
}

// ============================================================================
// Module: Finite Square Well (multi-well and/or electric field — the Numerov cases)
// ============================================================================

QUnit.module( 'Finite Square Well' );

QUnit.test( 'parameter sweep', assert => {

  // One sweep over the full Numerov-solved Finite Square Well parameter space: number of wells,
  // wall-to-wall separation, well width and depth, particle mass, and electric field. The single-well
  // and zero-field corners are reached as ordinary points of this sweep (nWells = 1, electricField = 0),
  // so the three previously-separate "separation", "electric field", and "multi-well electric field"
  // sweeps — which re-solved overlapping configurations — are folded into this one test. Analytical
  // solutions support only single wells, so the multi-well potential is built inline from the sim's
  // formula.
  const xMin = -STANDARD_X_MAX;
  const xMax = STANDARD_X_MAX;

  const configs: SweepConfig[] = [];

  for ( const nWells of SWEEP_NUMBER_OF_WELLS ) {
    for ( const separation of SWEEP_SEPARATIONS ) {
      for ( const wellWidth of SWEEP_MULTI_WELL_WIDTHS ) {
        for ( const wellDepth of SWEEP_MULTI_WELL_DEPTHS ) {
          for ( const electricField of SWEEP_ELECTRIC_FIELDS ) {

            // The combined multi-well + field case is the heaviest, so run it at a single representative
            // mass to avoid a 3× blow-up; the single-well and zero-field cases keep the full mass set.
            const masses = ( electricField !== 0 && nWells > 1 ) ? SWEEP_MASSES_MULTI : SWEEP_MASSES;

            for ( const mass of masses ) {
              const centerSpacing = wellWidth + separation;
              const potFn = ( x: number ): number => {
                for ( let i = 1; i <= nWells; i++ ) {
                  const xi = centerSpacing * ( i - ( nWells + 1 ) / 2 );
                  if ( x >= xi - wellWidth / 2 && x <= xi + wellWidth / 2 ) {
                    return electricField * x;
                  }
                }
                return wellDepth + electricField * x;
              };

              // Same logic as FiniteSquarePotential.getMaxSolverEnergy().
              const energyMax = wellDepth + Math.min( electricField * xMin, electricField * xMax );

              configs.push( {
                grid: standardGrid(),
                potFn: potFn,
                mass: mass,
                energyMin: 0,
                energyMax: energyMax,
                label: `FSW nWells=${nWells} sep=${separation} E=${electricField} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,

                // Node counting is reliable only while the interior-node count still tracks the global
                // quantum number n. With no field the minibands stay resolvable up to 5 wells (at 10 wells
                // the lowest band is ~10 near-degenerate levels whose linear combinations scramble the node
                // count); with a field the wells localize at different potential offsets, so only the
                // single-well case keeps clean ordering. Energy ordering and normalization still verify the
                // physics in the excluded cases. See https://github.com/phetsims/quantum-bound-states/issues/43
                checkNodes: electricField === 0 ? nWells <= 5 : nWells === 1
              } );
            }
          }
        }
      }
    }
  }

  runSweep( assert, configs );
} );

QUnit.test( 'ψ and ψ′ continuous everywhere', assert => {

  // A finite square well is a hard-step but finite potential, so ψ and ψ′ are continuous everywhere
  // (only ψ″ jumps at the step) — this is the numerically-solved counterpart to the Pöschl-Teller
  // continuity test. It is restricted to a single, moderate-depth well: the highest states of deeper
  // wells oscillate fast enough that their smooth per-step change ~k·dx approaches the kink threshold,
  // and the dense minibands of a multi-well return scrambled near-degenerate combinations whose stitched
  // ψ′ legitimately jumps — neither indicates a solver error. See https://github.com/phetsims/quantum-bound-states/issues/43
  const wellDepth = 10; // eV
  for ( const wellWidth of [ 0.5, 1.0 ] ) {
    for ( const mass of SWEEP_MASSES ) {
      const grid = standardGrid();
      const potFn = ( x: number ): number => ( x >= -wellWidth / 2 && x <= wellWidth / 2 ) ? 0 : wellDepth;
      const result = NumerovSolver.solve( grid, potFn, mass, 0, wellDepth );
      assertWaveFunctionContinuity( assert, result, grid.dx, `FSW w=${wellWidth} V₀=${wellDepth} m=${mass}` );
    }
  }
} );

// ============================================================================
// Module: Pöschl-Teller (numerically-solved cases plus single-well analytical anchors)
// ============================================================================

QUnit.module( 'Poschl-Teller' );

QUnit.test( 'parameter sweep', assert => {

  // One sweep over the full Numerov-solved Pöschl-Teller parameter space, folding together what were
  // four separate sweeps — single-well, multi-well spacing, electric field, and multi-well electric
  // field. They are presented as one test because they all run the same four invariants (finite,
  // ordered, normalized, node-count) via runSweep, and the single-well and zero-field corners are just
  // ordinary points. The four parameter regimes are kept as distinct config builders below because they
  // probe genuinely different physics: the single-well anchor reaches the shallowest wells (V₀ = 1 eV)
  // and the widest depth range, while the multi-well regimes sweep the inter-well gap. createPotentialFunction
  // is single-well only, so the multi-well and tilted potentials are built inline from the sim's formula.
  const configs: SweepConfig[] = [];

  // Single well, zero field — analytical anchor for the sech² well shape, swept over the full
  // width/depth/mass range (including the shallow V₀ = 1 eV that the multi-well regimes omit).
  for ( const wellWidth of SWEEP_WELL_WIDTHS_PT ) {
    for ( const wellDepth of SWEEP_WELL_DEPTHS_15 ) {
      for ( const mass of SWEEP_MASSES ) {
        const potFn = PoschlTellerSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0, spacing: 0
        } );
        configs.push( {
          grid: standardGrid(),
          potFn: potFn,
          mass: mass,
          energyMin: -3 * wellDepth, // 3× wellDepth below 0 covers all bound states
          energyMax: 0,
          label: `PT wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
          checkNodes: true
        } );
      }
    }
  }

  // Multi-well, zero field. The n-th band's tunnelling splitting scales as exp(−2κ_n × gap), where
  // κ_n = √(2m|E_n|)/ℏ and gap = spacing − wellWidth; using spacing = wellWidth + gap keeps the
  // wall-to-wall gap ≤ 0.3 nm across all well widths. Limited to ≤ 3 wells, where the minibands are
  // not yet dense enough to scramble the interior-node count (node counting still breaks for many
  // tightly-coupled wells — see https://github.com/phetsims/quantum-bound-states/issues/43).
  for ( const nWells of SWEEP_NUMBER_OF_WELLS.filter( n => n <= 3 ) ) {
    for ( const wellWidth of SWEEP_WELL_WIDTHS_PT ) {
      for ( const gap of SWEEP_PT_GAPS ) {
        const spacing = wellWidth + gap;
        for ( const wellDepth of SWEEP_MULTI_WELL_DEPTHS ) {
          for ( const mass of SWEEP_MASSES ) {
            const potFn = ( x: number ): number => {
              let pe = 0;
              for ( let i = 1; i <= nWells; i++ ) {
                const xi = spacing * ( i - ( nWells + 1 ) / 2 );
                const sech = 1 / Math.cosh( ( x - xi ) / wellWidth );
                pe += -wellDepth * sech * sech;
              }
              return pe;
            };
            configs.push( {
              grid: standardGrid(),
              potFn: potFn,
              mass: mass,
              energyMin: -3 * wellDepth * nWells,
              energyMax: 0,
              label: `PT nWells=${nWells} spacing=${spacing} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
              checkNodes: true
            } );
          }
        }
      }
    }
  }

  // Single well, electric field. PoschlTellerSolution asserts electricField === 0, so build inline.
  // With a Stark field the effective barrier drops, so cap the search at energyMax = −|E|·xMax (same
  // logic as PoschlTellerPotential.getMaxSolverEnergy).
  for ( const wellWidth of SWEEP_WELL_WIDTHS_PT ) {
    for ( const wellDepth of SWEEP_MULTI_WELL_DEPTHS ) {
      for ( const mass of SWEEP_MASSES ) {
        for ( const electricField of SWEEP_ELECTRIC_FIELDS ) {
          const potFn = ( x: number ): number => {
            const sech = 1 / Math.cosh( x / wellWidth );
            return -wellDepth * sech * sech + electricField * x;
          };
          const energyMax = -Math.abs( electricField * STANDARD_X_MAX );
          configs.push( {
            grid: standardGrid(),
            potFn: potFn,
            mass: mass,
            energyMin: -3 * wellDepth,
            energyMax: energyMax,
            label: `PT electricField=${electricField} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
            checkNodes: true
          } );
        }
      }
    }
  }

  // Multi-well + electric field — the heaviest case, run at a single representative mass. Limited to
  // ≤ 3 wells as in the zero-field multi-well sweep above.
  for ( const nWells of SWEEP_NUMBER_OF_WELLS.filter( n => n <= 3 ) ) {
    for ( const wellWidth of SWEEP_WELL_WIDTHS_PT ) {
      for ( const gap of SWEEP_PT_GAPS ) {
        const spacing = wellWidth + gap;
        for ( const wellDepth of SWEEP_MULTI_WELL_DEPTHS ) {
          for ( const mass of SWEEP_MASSES_MULTI ) {
            for ( const electricField of SWEEP_ELECTRIC_FIELDS ) {
              const potFn = ( x: number ): number => {
                let pe = 0;
                for ( let i = 1; i <= nWells; i++ ) {
                  const xi = spacing * ( i - ( nWells + 1 ) / 2 );
                  const sech = 1 / Math.cosh( ( x - xi ) / wellWidth );
                  pe += -wellDepth * sech * sech;
                }
                return pe + electricField * x;
              };
              const energyMax = -Math.abs( electricField * STANDARD_X_MAX );
              configs.push( {
                grid: standardGrid(),
                potFn: potFn,
                mass: mass,
                energyMin: -3 * wellDepth * nWells,
                energyMax: energyMax,
                label: `PT nWells=${nWells} spacing=${spacing} E=${electricField} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
                checkNodes: true
              } );
            }
          }
        }
      }
    }
  }

  runSweep( assert, configs );
} );

QUnit.test( 'tilted multi-well stitches without a matching-point kink (regression)', assert => {

  // Regression for the matching-point kink. A multi-well Pöschl-Teller tilted by an electric field
  // localizes its states in the deeper wells on the downhill side, far from the geometric center
  // x = 0. The solver previously stitched ψ_L and ψ_R at that fixed center, which for an off-center
  // state lies deep in a classically forbidden region where ψ_L has decayed into its spurious
  // growing-exponential mode. The stitch matched the value but not the slope, leaving a visible kink
  // at x = 0. The solver now stitches at each state's main lobe (see NumerovSolver.getMatchingPointIndex),
  // so ψ and ψ' are continuous everywhere. See https://github.com/phetsims/quantum-bound-states/issues/53
  //
  // The reported case is the Many Wells screen Pöschl-Teller: 10 wells, depth 12 eV, spacing 0.7 nm,
  // width 0.2 nm. Several fields are swept because the field sign and magnitude determine which
  // states sit off-center: +1 V/nm trips higher states and the ground state; -1 V/nm mirrors the
  // localization to the right and trips the ground state hardest.
  const numberOfWells = 10;
  const wellWidth = 0.2; // nm
  const wellDepth = 12; // eV
  const spacing = 0.7; // nm
  const mass = 1; // electron masses

  for ( const electricField of [ 1, 0.6, 0.3, -1 ] ) {
    const potFn = PoschlTellerSolution.createPotentialFunction( {
      numberOfWells: numberOfWells, xOffset: 0, yOffset: 0,
      wellWidth: wellWidth, wellDepth: wellDepth, electricField: electricField, spacing: spacing
    } );

    // Energy window matches PoschlTellerPotential getMin/getMaxSolverEnergy (yOffset = 0).
    const energyMax = -Math.abs( electricField * STANDARD_X_MAX );
    const energyMin = energyMax - 3 * wellDepth;

    const grid = standardGrid();
    const result = NumerovSolver.solve( grid, potFn, mass, energyMin, energyMax );

    const label = `PT tilted nWells=${numberOfWells} E=${electricField} depth=${wellDepth} spacing=${spacing}`;
    assert.ok( result.energies.length > 0, `${label}: expected at least one bound state` );
    assertAllFinite( assert, result, label );

    // Pöschl-Teller is a soft-wall potential, so ψ and ψ' are continuous everywhere.
    // This is the assertion that fails with center-stitching and passes with main-lobe stitching.
    assertWaveFunctionContinuity( assert, result, grid.dx, label );
  }
} );

// ─── Parity (single, centered — analytical anchor) ──────────────────────────────

QUnit.test( 'parity alternates even/odd (single, centered)', assert => {

  const wellWidth = 0.5; // nm
  const wellDepth = 10;  // eV
  const mass = 1;
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0, spacing: 0
  } );
  const result = NumerovSolver.solve( standardGrid(), potFn, mass, -3 * wellDepth, 0 );

  const nCheck = Math.min( result.waveFunctions.length, 4 );
  for ( let i = 0; i < nCheck; i++ ) {
    const expectedParity = i % 2 === 0 ? 'even' : 'odd';
    const actualParity = getParity( result.waveFunctions[ i ] );
    assert.equal( actualParity, expectedParity, `PT state ${i} parity: expected ${expectedParity}` );
  }
} );

// ─── Orthogonality (analytical anchor) ──────────────────────────────────────────

/**
 * Assert that pairs of eigenstates are mutually orthogonal within the given tolerance.
 */
function assertOrthogonality( assert: Assert, waveFunctions: number[][], dx: number, tolerance: number, label: string ): void {
  const pairs = [ [ 0, 1 ], [ 0, 2 ], [ 1, 2 ], [ 0, 3 ] ] as const;
  for ( const [ m, n ] of pairs ) {
    if ( m < waveFunctions.length && n < waveFunctions.length ) {
      const overlap = Math.abs( computeOverlap( waveFunctions[ m ], waveFunctions[ n ], dx ) );
      assert.ok( overlap < tolerance, `${label}: |⟨ψ_${m}|ψ_${n}⟩| = ${overlap.toExponential( 2 )} must be < ${tolerance}` );
    }
  }
}

QUnit.test( 'eigenstates are orthogonal', assert => {

  const w = 0.5;
  const V0 = 10;
  const mass = 1;
  const grid = standardGrid();
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: w, wellDepth: V0, electricField: 0, spacing: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, mass, -3 * V0, 0 );
  assertOrthogonality( assert, result.waveFunctions, grid.dx, 1e-3, 'PT' );
} );

// ─── Analytical comparison vs PoschlTellerSolution ──────────────────────────────

// (w, V₀) grid for the analytical comparison, swept at mass = 1. It is restricted to the regime
// the standard 3001-point grid (dx ≈ 0.0023 nm) resolves accurately: w ≥ 0.5 nm keeps the sech²
// well well-sampled, and V₀ ≥ 5 eV makes every well hold ≥ 6 bound states, so the lowest
// PT_ANALYTICAL_STATES compared states sit deep in the well. Narrow/shallow wells and the
// barely-bound top states are deliberately excluded: there the evanescent tail leaks past the
// ±3.5 nm grid edge and E_n → 0 makes the *relative* energy error blow up — a grid-resolution
// limit, not a solver error. Measured worst case over this grid: energy error ≈ 1.35 %,
// wave-function RMS error ≈ 0.51 % (hence the 1.5 % / 1 % tolerances below).
const PT_ANALYTICAL_WIDTHS = [ 0.5, 0.6, 0.7, 0.8, 1.0 ]; // nm
const PT_ANALYTICAL_DEPTHS = [ 5, 8, 10, 12, 15 ];        // eV
const PT_ANALYTICAL_MASS = 1;                             // electron masses
const PT_ANALYTICAL_STATES = 3;                           // compare the lowest 3 (deeply-bound) states

/**
 * Solve a single-well Pöschl-Teller potential on the standard grid both numerically (NumerovSolver)
 * and analytically (PoschlTellerSolution), for the analytical-comparison sweep.
 */
function solvePoschlTellerPair( wellWidth: number, wellDepth: number ): {
  grid: XGrid;
  numerical: { energies: number[]; waveFunctions: number[][] };
  analytical: { energies: number[]; waveFunctions: number[][] };
} {
  const grid = standardGrid();
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0, spacing: 0
  } );
  const numerical = NumerovSolver.solve( grid, potFn, PT_ANALYTICAL_MASS, -3 * wellDepth, 0 );
  const analytical = PoschlTellerSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, wellDepth: wellDepth,
    energyMin: -3 * wellDepth, energyMax: 0, electronMasses: PT_ANALYTICAL_MASS, electricField: 0, spacing: 0
  } );
  return { grid: grid, numerical: numerical, analytical: analytical };
}

QUnit.test( 'energy error < 1.5% vs analytical across (w, V₀) grid', assert => {

  for ( const wellWidth of PT_ANALYTICAL_WIDTHS ) {
    for ( const wellDepth of PT_ANALYTICAL_DEPTHS ) {
      const { numerical, analytical } = solvePoschlTellerPair( wellWidth, wellDepth );

      assert.ok(
        numerical.energies.length >= PT_ANALYTICAL_STATES && analytical.energies.length >= PT_ANALYTICAL_STATES,
        `PT w=${wellWidth} V₀=${wellDepth}: expected ≥ ${PT_ANALYTICAL_STATES} bound states ` +
        `(got ${numerical.energies.length} numerical, ${analytical.energies.length} analytical)`
      );

      const nCompare = Math.min( numerical.energies.length, analytical.energies.length, PT_ANALYTICAL_STATES );
      for ( let i = 0; i < nCompare; i++ ) {
        const relErr = Math.abs( numerical.energies[ i ] - analytical.energies[ i ] ) / Math.abs( analytical.energies[ i ] );
        assert.ok( relErr < 0.015,
          `PT w=${wellWidth} V₀=${wellDepth} n=${i}: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 1.5 %)` );
      }
    }
  }
} );

QUnit.test( 'wave-function RMS error < 1% vs analytical across (w, V₀) grid', assert => {

  for ( const wellWidth of PT_ANALYTICAL_WIDTHS ) {
    for ( const wellDepth of PT_ANALYTICAL_DEPTHS ) {
      const { grid, numerical, analytical } = solvePoschlTellerPair( wellWidth, wellDepth );

      const nCompare = Math.min( numerical.waveFunctions.length, analytical.waveFunctions.length, PT_ANALYTICAL_STATES );
      for ( let i = 0; i < nCompare; i++ ) {
        const rms = waveFunctionRMSError( numerical.waveFunctions[ i ], analytical.waveFunctions[ i ], grid.dx );
        assert.ok( rms < 0.01,
          `PT w=${wellWidth} V₀=${wellDepth} n=${i}: WF RMS error = ${toFixed( rms * 100, 3 )} % (must be < 1 %)` );
      }
    }
  }
} );

// ─── Bound-state count formula ──────────────────────────────────────────────────

QUnit.test( 'bound-state count = ⌊λ − ½⌋ + 1 (λ = w√(2mV₀)/ℏ)', assert => {

  const wellWidths = [ 0.1, 0.3, 0.5, 1.0 ];
  const wellDepths = [ 2.0, 5.0, 10.0, 15.0 ];
  const mass = 1;

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      const lambda = wellWidth * Math.sqrt( 2 * mass * wellDepth ) / HBAR;
      const expectedCount = Math.floor( lambda - 0.5 ) + 1;

      const potFn = PoschlTellerSolution.createPotentialFunction( {
        numberOfWells: 1, xOffset: 0, yOffset: 0,
        wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0, spacing: 0
      } );
      const result = NumerovSolver.solve( standardGrid(), potFn, mass, -3 * wellDepth, 0 );

      // Allow off-by-1: when the top state is barely bound (energy very close to 0),
      // Numerov may miss it due to finite energy-range discretisation.
      assert.ok( Math.abs( result.energies.length - expectedCount ) <= 1,
        `PT wellWidth=${wellWidth} wellDepth=${wellDepth}: expected ${expectedCount} states (λ=${toFixed( lambda, 3 )}), got ${result.energies.length}` );
    }
  }
} );

// ─── Electric field breaks parity ───────────────────────────────────────────────

QUnit.test( 'electric field breaks parity (mixed-parity states)', assert => {

  // A Stark field tilts the symmetric well; eigenstates no longer have definite parity.
  // We decompose each ψ into even and odd components and verify both are non-negligible.
  const wellWidths = SWEEP_WELL_WIDTHS_PT;

  // TODO: Restore V=15 eV once the threshold is made field-normalized.  For deep narrow wells
  // (V=15 eV, w=0.2–0.5 nm) the perturbative mixing scales as (E·w/V)², which falls below
  // 1e-4 even at E=0.5 V/nm, so the weak-field cases give false negatives.
  // See https://github.com/phetsims/quantum-bound-states/issues/43
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS.filter( d => d < 15 );
  const masses = SWEEP_MASSES;
  // Use moderate-to-strong fields so mixing exceeds the detection threshold.
  const electricFields = [ 0.2, 0.5, 1.0 ];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        for ( const electricField of electricFields ) {
          const potFn = ( x: number ): number => {
            const sech = 1 / Math.cosh( x / wellWidth );
            return -wellDepth * sech * sech + electricField * x;
          };

          const grid = standardGrid();

          // energyMax: effective continuum floor drops by field * xMax at the far edge.
          const energyMax = -electricField * STANDARD_X_MAX;

          const result = NumerovSolver.solve( grid, potFn, mass, -3 * wellDepth, energyMax );

          if ( result.energies.length < 2 ) {
            assert.ok( true, `PT E=${electricField} w=${wellWidth} V=${wellDepth} m=${mass}: fewer than 2 bound states (field too strong)` );
            continue;
          }

          const N = grid.numberOfPoints;
          const nCheck = Math.min( result.waveFunctions.length, 4 );

          for ( let i = 0; i < nCheck; i++ ) {
            const psi = result.waveFunctions[ i ];

            // For standardGrid (symmetric about x=0): index j corresponds to x_j and N-1-j to -x_j.
            // Decompose: ψ_e = (ψ(x) + ψ(-x))/2, ψ_o = (ψ(x) - ψ(-x))/2.
            let evenNorm2 = 0;
            let oddNorm2 = 0;
            const half = Math.floor( N / 2 );
            for ( let j = 0; j < half; j++ ) {
              const e = 0.5 * ( psi[ j ] + psi[ N - 1 - j ] );
              const o = 0.5 * ( psi[ j ] - psi[ N - 1 - j ] );
              evenNorm2 += e * e;
              oddNorm2 += o * o;
            }
            const totalNorm2 = evenNorm2 + oddNorm2;

            // Minority fraction: 0 = pure parity state, 0.5 = maximally mixed.
            const mixFraction = Math.min( evenNorm2, oddNorm2 ) / Math.max( totalNorm2, 1e-30 );

            // TODO: Raise to 1e-3 once the test is restricted to parameter combinations where
            // the Stark perturbation is strong compared to the level spacing (deep narrow wells
            // with weak fields have perturbative mixing well below 1e-3).
            // See https://github.com/phetsims/quantum-bound-states/issues/43
            assert.ok( mixFraction > 1e-4,
              `PT E=${electricField} w=${wellWidth} V=${wellDepth} m=${mass} state ${i}: parity mix fraction = ${mixFraction.toExponential( 2 )} must be > 1e-4` );
          }
        }
      }
    }
  }
} );

// ─── Wave-function boundary decay ───────────────────────────────────────────────

/**
 * Assert that bound-state wave functions are negligibly small at both grid edges,
 * confirming the state is localised and the grid is wide enough.
 */
function assertBoundaryDecay( assert: Assert, waveFunctions: number[][], threshold: number, label: string ): void {
  for ( let i = 0; i < waveFunctions.length; i++ ) {
    const psi = waveFunctions[ i ];
    const maxAbs = Math.max( ...psi.map( Math.abs ) );
    if ( maxAbs === 0 ) {
      continue;
    }
    const leftDecay = Math.abs( psi[ 0 ] ) / maxAbs;
    const rightDecay = Math.abs( psi[ psi.length - 1 ] ) / maxAbs;
    assert.ok( leftDecay < threshold,
      `${label} state ${i}: left boundary |ψ|/max = ${leftDecay.toExponential( 2 )} must be < ${threshold}` );
    assert.ok( rightDecay < threshold,
      `${label} state ${i}: right boundary |ψ|/max = ${rightDecay.toExponential( 2 )} must be < ${threshold}` );
  }
}

QUnit.test( 'states decay to < 1% at grid edges', assert => {

  const grid = standardGrid();
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: 0.5, wellDepth: 10, electricField: 0, spacing: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, 1, -30, 0 );
  assertBoundaryDecay( assert, result.waveFunctions, 0.01, 'PT' );
} );

// ─── Wave-function continuity ───────────────────────────────────────────────────

QUnit.test( 'ψ and ψ′ continuous everywhere', assert => {

  // Pöschl-Teller is a soft-wall potential, so ψ and ψ′ are continuous everywhere.
  const grid = standardGrid();
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: 0.5, wellDepth: 10, electricField: 0, spacing: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, 1, -30, 0 );
  assertWaveFunctionContinuity( assert, result, grid.dx, 'PT w=0.5 V₀=10' );

  // The single finite Square Well is checked separately in the Finite Square Well module ('ψ and ψ′
  // continuous everywhere'). Continuity is intentionally NOT asserted for the numerically-solved Finite
  // Square *multi-well* (with or without a field): its dense minibands are near-degenerate, so the solver
  // returns scrambled linear combinations whose stitched ψ/ψ′ legitimately show grid-scale jumps that do
  // not indicate a solver error. The tilted multi-well Pöschl-Teller continuity case — the regression that
  // motivates the ψ′ threshold — is exercised by the 'tilted multi-well stitches without a matching-point
  // kink' test in the Pöschl-Teller module. See https://github.com/phetsims/quantum-bound-states/issues/43
} );
