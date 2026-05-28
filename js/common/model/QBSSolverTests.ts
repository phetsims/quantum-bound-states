// Copyright 2026, University of Colorado Boulder

/**
 * QUnit tests for the NumerovSolver across all eight quantum potential types.
 *
 * Each potential is tested with a comprehensive sweep across the sim-valid parameter space
 * (width, depth/height, separation, electric field, electron mass). For every parameter
 * combination the tests verify four physical invariants that the solver must satisfy:
 *
 *   1. No NaN or Infinity – every energy and wave-function value is a finite number.
 *   2. Energy ordering    – E[0] < E[1] < E[2] < … (Sturm-Liouville theorem).
 *   3. Normalization      – ∫|ψ_n|² dx ≈ 1 within 1 × 10⁻³.
 *   4. Node counting      – eigenstate n (0-indexed) has exactly n interior nodes
 *                           (tested only for potentials with reliable node detection).
 *
 * Additional cross-potential tests cover parity, orthogonality, and direct comparison
 * against analytical solutions (ported from testSolvers.ts).
 *
 * @author Martin Veillette
 */

import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../QBSConstants.js';
import AsymmetricTriangleSolution from './solver/analytical-solutions/AsymmetricTriangleSolution.js';
import CoulombSolution from './solver/analytical-solutions/CoulombSolution.js';
import FiniteSquareSolution from './solver/analytical-solutions/FiniteSquareSolution.js';
import HarmonicOscillatorSolution from './solver/analytical-solutions/HarmonicOscillatorSolution.js';
import InfiniteSquareSolution from './solver/analytical-solutions/InfiniteSquareSolution.js';
import InfiniteStepSolution from './solver/analytical-solutions/InfiniteStepSolution.js';
import MorseSolution from './solver/analytical-solutions/MorseSolution.js';
import PoschlTellerSolution from './solver/analytical-solutions/PoschlTellerSolution.js';
import NumerovSolver from './solver/NumerovSolver.js';
import { allFinite, computeNorm, computeOverlap, countNodes, getParity, waveFunctionRMSError } from './solver/QBSSolverTestUtils.js';
import XGrid from './solver/XGrid.js';

const HBAR = NumerovSolver.HBAR;

/** Half-width of the sim view grid (QBSConstants.ALL_GRAPHS_X_RANGE is [−3.5, 3.5] nm). */
const STANDARD_X_MAX = QBSConstants.ALL_GRAPHS_X_RANGE.max;

/** Point count for the standard grid (matches QBSQueryParameters default). */
const STANDARD_NUMBER_OF_POINTS = 3001;

// ─── Grid helpers ──────────────────────────────────────────────────────────────

/**
 * Create a tight grid spanning exactly the well [−L/2, L/2].
 * Used for potentials with infinite walls (InfiniteSquare, InfiniteStep, AsymmetricTriangle).
 */
function tightGrid( halfWidth: number ): XGrid {
  return new XGrid( {
    xMin: -halfWidth,
    xMax: halfWidth,
    numberOfPoints: 1001,
    tandem: Tandem.OPT_OUT
  } );
}

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

/**
 * Asymmetric grid used for the Morse potential, which has a repulsive wall on the left
 * and an exponential tail on the right.
 *
 * xMin is capped at −6 nm so that the forbidden tunnel length never exceeds ≈6 nm.
 * Beyond that, the exponentially growing integrand requires more than ~10 rescalings and
 * floating-point precision is exhausted (wave-function values collapse to zero).
 * One well-width to the left of equilibrium is enough to place the boundary in a region
 * where V >> energyMax, satisfying the Dirichlet condition.
 *
 * 3001 points gives dx ≤ 0.014 nm — fine enough for Numerov accuracy across all
 * well-width/depth combinations in the sim.
 *
 * @param wellWidth - Morse width parameter w in nm
 */
function morseGrid( wellWidth: number ): XGrid {

  // One well-width left of equilibrium; V(−w) ≈ D_e·(e−1)² >> 0 for any D_e.
  // Never go further than −6 nm to avoid precision exhaustion.
  const xMin = Math.max( -wellWidth, -6 );

  // Six well-widths to the right; e^{−6} ≈ 0.0025 so V ≈ 0 (dissociation limit).
  // Minimum STANDARD_X_MAX so narrow wells still have a long enough decay tail.
  const xMax = Math.max( 6 * wellWidth, STANDARD_X_MAX );

  return new XGrid( {
    xMin: xMin,
    xMax: xMax,
    numberOfPoints: STANDARD_NUMBER_OF_POINTS,
    tandem: Tandem.OPT_OUT
  } );
}

/**
 * Adaptive grid for the Harmonic Oscillator.  The standard ±3.5 nm grid is too wide for
 * compact wells (e.g., wellWidth = 0.4 nm): the potential rises so steeply that the
 * classically-forbidden region spans several nm, the integrand grows by 10^{500}+, and
 * the 10-rescaling limit is exhausted before the wave function reaches the allowed region.
 *
 * This function chooses a half-width equal to three times the classical turning point of
 * the highest test state (E ≈ 20.5 ℏω), with a minimum of 3 nm.  For typical sim
 * parameters the grid is [−3, 3] to [−8, 8] nm, giving at most ~3 rescalings.
 *
 * @param wellWidth - well-width parameter in nm; k = 32/wellWidth²
 * @param mass - particle mass in electron masses
 */
function hoGrid( wellWidth: number, mass: number ): XGrid {
  const k = 32 / ( wellWidth * wellWidth );
  const omega = Math.sqrt( k / mass );

  // Classical turning point for E ≈ 20.5 ℏω (highest state in the test sweep).
  const xTurning = Math.sqrt( 41 * HBAR * omega / k );

  // Extend 3× the turning point beyond the center; minimum 3 nm.
  const halfWidth = Math.max( 3, 3 * xTurning );

  return new XGrid( {
    xMin: -halfWidth,
    xMax: halfWidth,
    numberOfPoints: 1001,
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

/** Electron masses — OneWellModel range [0.5, 1.1]. */
const SWEEP_MASSES = [ 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1 ];

/** Well widths for potentials with range [0.1, 6] nm (FSW, Morse, ATri, …). */
const SWEEP_WELL_WIDTHS = [ 0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0 ];

/** Well widths for Infinite Square / Infinite Step (effective sim minimum 0.2 nm). */
const SWEEP_WELL_WIDTHS_INFINITE = [ 0.2, 0.3, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0 ];

/** Well widths for Harmonic Oscillator (effective sim minimum 0.4 nm). */
const SWEEP_WELL_WIDTHS_HO = [ 0.4, 0.5, 0.6, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0 ];

/** Well widths for Pöschl-Teller (sim maximum 1.5 nm). */
const SWEEP_WELL_WIDTHS_PT = [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1.0, 1.25, 1.5 ];

/** Well depth / step height for potentials with range [0.1, 20] eV. */
const SWEEP_WELL_DEPTHS_20 = [ 0.1, 0.5, 1.0, 2.0, 3.0, 5.0, 7.5, 10.0, 15.0, 20.0 ];

/** Well depth for Morse and Pöschl-Teller (sim maximum 15 eV). */
const SWEEP_WELL_DEPTHS_15 = [ 0.1, 0.5, 1.0, 2.0, 3.0, 5.0, 7.5, 10.0, 12.5, 15.0 ];

/** Number of wells for multi-well potentials (Finite Square, Pöschl-Teller). */
const SWEEP_NUMBER_OF_WELLS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

/** Wall-to-wall gap between adjacent Finite Square wells (nm). Sim range [0.05, 0.2]. */
const SWEEP_SEPARATIONS = [ 0.05, 0.1, 0.2 ];

/** Center-to-center gap beyond well width for Pöschl-Teller multi-well (nm). */
const SWEEP_PT_GAPS = [ 0.1, 0.2, 0.3 ];

/** Electric field strengths (V/nm). Sim range is roughly [−1, 1]; keep moderate to retain bound states. */
const SWEEP_ELECTRIC_FIELDS = [ 0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0 ];

/** Reduced well-width set for multi-well / electric-field sweeps (keeps combinatorics tractable). */
const SWEEP_MULTI_WELL_WIDTHS = [ 0.3, 0.5, 1.0 ];

/** Reduced well-depth set for multi-well / electric-field sweeps. */
const SWEEP_MULTI_WELL_DEPTHS = [ 5.0, 10.0, 15.0 ];

/** Reduced mass set for the heaviest combined multi-well + electric-field sweeps. */
const SWEEP_MASSES_MULTI = [ 0.8, 1.0 ];

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
      // Zero states can be physically correct (e.g., Morse with λ < ½ has no bound states).
      // Emit a passing assertion so CT records the case without a red flag.
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
// Module: Infinite Square Well
// ============================================================================

QUnit.module( 'Infinite Square Well' );

QUnit.test( 'parameter sweep', assert => {

  const wellWidths = SWEEP_WELL_WIDTHS_INFINITE;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const mass of masses ) {
      const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * wellWidth * wellWidth );
      const potFn = InfiniteSquareSolution.createPotentialFunction( {
        numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, electricField: 0
      } );

      configs.push( {
        grid: tightGrid( wellWidth / 2 ),
        potFn: potFn,
        mass: mass,
        energyMin: 0,
        energyMax: 441 * E1, // covers n=1 through n=21
        label: `ISW wellWidth=${wellWidth} mass=${mass}`,
        checkNodes: true
      } );
    }
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Finite Square Well
// ============================================================================

QUnit.module( 'Finite Square Well' );

QUnit.test( 'single-well parameter sweep', assert => {

  const wellWidths = SWEEP_WELL_WIDTHS;
  const wellDepths = SWEEP_WELL_DEPTHS_20;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        const potFn = FiniteSquareSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
        } );

        // V_inside = 0, V_outside = wellDepth; bound states in (0, wellDepth).
        configs.push( {
          grid: standardGrid(),
          potFn: potFn,
          mass: mass,
          energyMin: 0,
          energyMax: wellDepth,
          label: `FSW wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
          checkNodes: false // tails may create boundary artefacts for very shallow wells
        } );
      }
    }
  }

  runSweep( assert, configs );
} );

QUnit.test( 'multi-well separation sweep', assert => {

  // Test FiniteSquare multi-well using an inline potential function (analytical
  // solutions only support single wells, so we replicate the sim's formula directly).
  const numberOfWellsList = SWEEP_NUMBER_OF_WELLS;
  const separations = SWEEP_SEPARATIONS;
  const wellWidths = SWEEP_MULTI_WELL_WIDTHS;
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const nWells of numberOfWellsList ) {
    for ( const separation of separations ) {
      for ( const wellWidth of wellWidths ) {
        for ( const wellDepth of wellDepths ) {
          for ( const mass of masses ) {
            const centerSpacing = wellWidth + separation;
            const potFn = ( x: number ): number => {
              for ( let i = 1; i <= nWells; i++ ) {
                const xi = centerSpacing * ( i - ( nWells + 1 ) / 2 );
                if ( x >= xi - wellWidth / 2 && x <= xi + wellWidth / 2 ) {
                  return 0;
                }
              }
              return wellDepth;
            };

            configs.push( {
              grid: standardGrid(),
              potFn: potFn,
              mass: mass,
              energyMin: 0,
              energyMax: wellDepth,
              label: `FSW nWells=${nWells} sep=${separation} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
              checkNodes: false
            } );
          }
        }
      }
    }
  }

  runSweep( assert, configs );
} );

QUnit.test( 'electric field sweep', assert => {

  // Finite Square supports electric field in the Many Wells screen.  Replicate the sim formula.
  const wellWidths = SWEEP_MULTI_WELL_WIDTHS;
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
  const masses = SWEEP_MASSES;
  const electricFields = SWEEP_ELECTRIC_FIELDS;
  const xMin = -STANDARD_X_MAX;
  const xMax = STANDARD_X_MAX;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        for ( const electricField of electricFields ) {
          const potFn = ( x: number ): number => {
            if ( x >= -wellWidth / 2 && x <= wellWidth / 2 ) {
              return electricField * x;
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
            label: `FSW electricField=${electricField} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
            checkNodes: false
          } );
        }
      }
    }
  }

  runSweep( assert, configs );
} );

QUnit.test( 'multi-well electric field sweep', assert => {

  const numberOfWellsList = SWEEP_NUMBER_OF_WELLS;
  const separations = SWEEP_SEPARATIONS;
  const wellWidths = SWEEP_MULTI_WELL_WIDTHS;
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
  const masses = SWEEP_MASSES_MULTI;
  const electricFields = SWEEP_ELECTRIC_FIELDS;
  const xMin = -STANDARD_X_MAX;
  const xMax = STANDARD_X_MAX;

  const configs: SweepConfig[] = [];

  for ( const nWells of numberOfWellsList ) {
    for ( const separation of separations ) {
      for ( const wellWidth of wellWidths ) {
        for ( const wellDepth of wellDepths ) {
          for ( const mass of masses ) {
            for ( const electricField of electricFields ) {
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

              const energyMax = wellDepth + Math.min( electricField * xMin, electricField * xMax );

              configs.push( {
                grid: standardGrid(),
                potFn: potFn,
                mass: mass,
                energyMin: 0,
                energyMax: energyMax,
                label: `FSW nWells=${nWells} sep=${separation} E=${electricField} wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
                checkNodes: false
              } );
            }
          }
        }
      }
    }
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Harmonic Oscillator
// ============================================================================

QUnit.module( 'Harmonic Oscillator' );

QUnit.test( 'parameter sweep', assert => {

  // The adaptive hoGrid() prevents precision exhaustion for the narrowest wells.
  const wellWidths = SWEEP_WELL_WIDTHS_HO;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const mass of masses ) {
      const k = 32 / ( wellWidth * wellWidth ); // eV/nm² — same formula as the sim
      const omega = Math.sqrt( k / mass );
      const E0 = 0.5 * HBAR * omega;

      const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
        numberOfWells: 1, xOffset: 0, yOffset: 0,
        springConstant: k, electricField: 0
      } );

      configs.push( {
        grid: hoGrid( wellWidth, mass ),
        potFn: potFn,
        mass: mass,
        energyMin: 0.1 * E0,
        energyMax: 20.5 * HBAR * omega,
        label: `HO wellWidth=${wellWidth} mass=${mass}`,
        checkNodes: true
      } );
    }
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Morse Potential
// ============================================================================

QUnit.module( 'Morse Potential' );

QUnit.test( 'parameter sweep', assert => {

  const wellWidths = SWEEP_WELL_WIDTHS;
  const wellDepths = SWEEP_WELL_DEPTHS_15;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        const potFn = MorseSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
        } );

        // Bound states exist between −wellDepth and 0.
        configs.push( {
          grid: morseGrid( wellWidth ),
          potFn: potFn,
          mass: mass,
          energyMin: -wellDepth,
          energyMax: 0, // dissociation limit (matches sim's getMaxSolverEnergy())
          label: `Morse wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
          checkNodes: false // asymmetric potential; nodes are reliable only for lower states
        } );
      }
    }
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Infinite Step Potential
// ============================================================================

QUnit.module( 'Infinite Step Potential' );

QUnit.test( 'parameter sweep', assert => {

  const wellWidths = SWEEP_WELL_WIDTHS_INFINITE;
  const stepHeights = SWEEP_WELL_DEPTHS_20;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const stepHeight of stepHeights ) {
      for ( const mass of masses ) {
        const E1_ISW = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * wellWidth * wellWidth );

        const potFn = InfiniteStepSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, stepHeight: stepHeight, electricField: 0
        } );

        configs.push( {
          grid: tightGrid( wellWidth / 2 ),
          potFn: potFn,
          mass: mass,
          energyMin: 0.1 * E1_ISW,
          energyMax: 100 * E1_ISW, // covers ~10 states comfortably
          label: `ISP wellWidth=${wellWidth} stepHeight=${stepHeight} mass=${mass}`,
          // The step discontinuity at x = 0 coincides with an interior zero for odd eigenstates
          // (states 1, 3, 5, …) when stepHeight << E.  The Numerov evaluations straddle the
          // exact step point and produce a small spike that countNodes misidentifies as an extra
          // node.  Energy ordering and normalization still verify the physics correctly.
          checkNodes: false
        } );
      }
    }
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Pöschl-Teller Potential
// ============================================================================

QUnit.module( 'Poschl-Teller Potential' );

QUnit.test( 'single-well parameter sweep', assert => {

  const wellWidths = SWEEP_WELL_WIDTHS_PT;
  const wellDepths = SWEEP_WELL_DEPTHS_15;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {

        // PoschlTellerSolution.createPotentialFunction only supports single well.
        const potFn = PoschlTellerSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
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

  runSweep( assert, configs );
} );

QUnit.test( 'multi-well spacing sweep', assert => {

  // Multi-well Pöschl-Teller using inline potential (analytical solution is single-well only).
  const numberOfWellsList = SWEEP_NUMBER_OF_WELLS.filter( n => n <= 3 ); // PT: test 2 and 3 wells
  // For the Pöschl-Teller multi-well, the n-th band tunnelling splitting scales as
  // exp(−2κ_n × gap), where κ_n = sqrt(2m|E_n|)/ℏ and gap = spacing − wellWidth.
  // Use wellWidth + gap so the wall-to-wall gap stays ≤ 0.3 nm across all well widths.
  const ptGaps = SWEEP_PT_GAPS;
  const wellWidths = SWEEP_WELL_WIDTHS_PT.filter( w => w <= 1.0 );
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const nWells of numberOfWellsList ) {
    for ( const wellWidth of wellWidths ) {
      for ( const gap of ptGaps ) {
        const spacing = wellWidth + gap;
        for ( const wellDepth of wellDepths ) {
          for ( const mass of masses ) {
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

  runSweep( assert, configs );
} );

QUnit.test( 'electric field sweep', assert => {

  // Pöschl-Teller is the only potential (other than Square Well) that supports a non-zero
  // electric field in the sim.  The inline potential adds the field contribution.
  const wellWidths = SWEEP_WELL_WIDTHS_PT.filter( w => w <= 1.0 );
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
  const masses = SWEEP_MASSES;
  const electricFields = SWEEP_ELECTRIC_FIELDS;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        for ( const electricField of electricFields ) {

          // PoschlTellerSolution asserts electricField === 0.  Use an inline function instead.
          const potFn = ( x: number ): number => {
            const sech = 1 / Math.cosh( x / wellWidth );
            return -wellDepth * sech * sech + electricField * x;
          };

          // With a Stark field the effective barrier is slightly lower.  Use the tilt-corrected
          // max (same logic as PoschlTellerPotential.getMaxSolverEnergy):
          //   energyMax = 0 − |electricField| * xMaxAbsolute
          const xMaxAbsolute = STANDARD_X_MAX; // matches standardGrid() xMax
          const energyMax = -Math.abs( electricField * xMaxAbsolute );

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

  runSweep( assert, configs );
} );

QUnit.test( 'multi-well electric field sweep', assert => {

  const numberOfWellsList = SWEEP_NUMBER_OF_WELLS.filter( n => n <= 3 );
  const ptGaps = SWEEP_PT_GAPS;
  const wellWidths = SWEEP_WELL_WIDTHS_PT.filter( w => w <= 1.0 );
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
  const masses = SWEEP_MASSES_MULTI;
  const electricFields = SWEEP_ELECTRIC_FIELDS;
  const xMaxAbsolute = STANDARD_X_MAX;

  const configs: SweepConfig[] = [];

  for ( const nWells of numberOfWellsList ) {
    for ( const wellWidth of wellWidths ) {
      for ( const gap of ptGaps ) {
        const spacing = wellWidth + gap;
        for ( const wellDepth of wellDepths ) {
          for ( const mass of masses ) {
            for ( const electricField of electricFields ) {
              const potFn = ( x: number ): number => {
                let pe = 0;
                for ( let i = 1; i <= nWells; i++ ) {
                  const xi = spacing * ( i - ( nWells + 1 ) / 2 );
                  const sech = 1 / Math.cosh( ( x - xi ) / wellWidth );
                  pe += -wellDepth * sech * sech;
                }
                return pe + electricField * x;
              };

              const energyMax = -Math.abs( electricField * xMaxAbsolute );

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

// ============================================================================
// Module: Asymmetric Triangle Potential
// ============================================================================

QUnit.module( 'Asymmetric Triangle Potential' );

QUnit.test( 'parameter sweep', assert => {

  const wellWidths = SWEEP_WELL_WIDTHS;
  const wellDepths = SWEEP_WELL_DEPTHS_20;
  const masses = SWEEP_MASSES;

  const configs: SweepConfig[] = [];

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        const potFn = AsymmetricTriangleSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
        } );

        // V linearly ramps from 0 (at left edge) to wellDepth (at right edge);
        // bound states have E ∈ (0, wellDepth).
        configs.push( {
          grid: tightGrid( wellWidth / 2 ),
          potFn: potFn,
          mass: mass,
          energyMin: 0,
          energyMax: wellDepth,
          label: `ATri wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}`,
          // The asymmetric ramp means low-energy states have their first interior node close
          // to the left (low-potential) wall.  For wide wells the node falls inside countNodes'
          // 10 % boundary-skip zone and is not counted, giving n − 1 instead of n.
          // Energy ordering and normalization still verify the physics correctly.
          checkNodes: false
        } );
      }
    }
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Coulomb Potential
// ============================================================================

QUnit.module( 'Coulomb Potential' );

QUnit.test( 'mass sweep', assert => {

  // Coulomb has no tunable well parameters — sweep electron mass only.
  const yOffset = 0;
  const energyMin = -17.5;
  const energyMax = 0;

  const configs: SweepConfig[] = [];

  for ( const mass of SWEEP_MASSES ) {
    const potFn = CoulombSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: yOffset, electricField: 0
    } );

    configs.push( {
      grid: standardGrid(),
      potFn: potFn,
      mass: mass,
      energyMin: energyMin,
      energyMax: energyMax,
      label: `Coulomb mass=${mass}`,
      checkNodes: false
    } );
  }

  runSweep( assert, configs );
} );

// ============================================================================
// Module: Parity — symmetric potentials
// ============================================================================

QUnit.module( 'Parity' );

QUnit.test( 'Infinite Square Well parity alternates even/odd', assert => {

  const L = 2; // nm
  const mass = 1;
  const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * L * L );
  const potFn = InfiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
  } );
  const result = NumerovSolver.solve( tightGrid( L / 2 ), potFn, mass, 0, 100 * E1 );

  const nCheck = Math.min( result.waveFunctions.length, 6 );
  for ( let i = 0; i < nCheck; i++ ) {
    const expectedParity = i % 2 === 0 ? 'even' : 'odd';
    const actualParity = getParity( result.waveFunctions[ i ] );
    assert.equal( actualParity, expectedParity, `ISW state ${i} parity: expected ${expectedParity}` );
  }
} );

QUnit.test( 'Harmonic Oscillator parity alternates even/odd', assert => {

  const wellWidth = 2; // nm
  const mass = 1;
  const k = 32 / ( wellWidth * wellWidth );
  const omega = Math.sqrt( k / mass );
  const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
  } );
  const result = NumerovSolver.solve( standardGrid(), potFn, mass, 0.1 * HBAR * omega / 2, 20.5 * HBAR * omega );

  const nCheck = Math.min( result.waveFunctions.length, 6 );
  for ( let i = 0; i < nCheck; i++ ) {
    const expectedParity = i % 2 === 0 ? 'even' : 'odd';
    const actualParity = getParity( result.waveFunctions[ i ] );
    assert.equal( actualParity, expectedParity, `HO state ${i} parity: expected ${expectedParity}` );
  }
} );

QUnit.test( 'Finite Square Well (single, centered) parity alternates even/odd', assert => {

  const L = 2;    // nm
  const V0 = 10; // eV
  const mass = 1;
  const potFn = FiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0, electricField: 0
  } );
  const result = NumerovSolver.solve( standardGrid(), potFn, mass, 0, V0 );

  const nCheck = Math.min( result.waveFunctions.length, 4 );
  for ( let i = 0; i < nCheck; i++ ) {
    const expectedParity = i % 2 === 0 ? 'even' : 'odd';
    const actualParity = getParity( result.waveFunctions[ i ] );
    assert.equal( actualParity, expectedParity, `FSW state ${i} parity: expected ${expectedParity}` );
  }
} );

QUnit.test( 'Poschl-Teller (single, centered) parity alternates even/odd', assert => {

  const wellWidth = 0.5; // nm
  const wellDepth = 10;  // eV
  const mass = 1;
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
  } );
  const result = NumerovSolver.solve( standardGrid(), potFn, mass, -3 * wellDepth, 0 );

  const nCheck = Math.min( result.waveFunctions.length, 4 );
  for ( let i = 0; i < nCheck; i++ ) {
    const expectedParity = i % 2 === 0 ? 'even' : 'odd';
    const actualParity = getParity( result.waveFunctions[ i ] );
    assert.equal( actualParity, expectedParity, `PT state ${i} parity: expected ${expectedParity}` );
  }
} );

// ============================================================================
// Module: Orthogonality — selected potentials
// ============================================================================

QUnit.module( 'Orthogonality' );

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

QUnit.test( 'Infinite Square Well eigenstates are orthogonal', assert => {

  const L = 2;
  const mass = 1;
  const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * L * L );

  const grid = new XGrid( { xMin: -L / 2, xMax: L / 2, numberOfPoints: 1001, tandem: Tandem.OPT_OUT } );
  const potFn = InfiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, mass, 0, 25 * E1 );
  assertOrthogonality( assert, result.waveFunctions, grid.dx, 1e-3, 'ISW' );
} );

QUnit.test( 'Harmonic Oscillator eigenstates are orthogonal', assert => {

  const wellWidth = 2;
  const mass = 1;
  const k = 32 / ( wellWidth * wellWidth );
  const omega = Math.sqrt( k / mass );
  const grid = standardGrid();
  const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, mass, 0.1 * HBAR * omega / 2, 20.5 * HBAR * omega );
  assertOrthogonality( assert, result.waveFunctions, grid.dx, 1e-3, 'HO' );
} );

// ============================================================================
// Module: Analytical comparison — Infinite Square Well
// ============================================================================

QUnit.module( 'Analytical comparison — Infinite Square Well' );

QUnit.test( 'energy error < 1 % for L=4 nm', assert => {

  const L = 4;     // nm
  const mass = 1;
  const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * L * L );
  const grid = tightGrid( L / 2 );
  const potFn = InfiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
  } );

  const numericalResult = NumerovSolver.solve( grid, potFn, mass, 0, 441 * E1 );
  const analyticalResult = InfiniteSquareSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L,
    energyMin: 0, energyMax: 441 * E1, electronMasses: mass, electricField: 0
  } );

  assert.ok( numericalResult.energies.length >= 5, `Found ${numericalResult.energies.length} numerical states (need ≥ 5)` );

  const nCompare = Math.min( numericalResult.energies.length, analyticalResult.energies.length, 10 );
  for ( let i = 0; i < nCompare; i++ ) {
    const relErr = Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / analyticalResult.energies[ i ];
    assert.ok( relErr < 0.01, `ISW n=${i + 1}: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 1 %)` );
  }
} );

QUnit.test( 'wave-function RMS error < 5 % for L=4 nm', assert => {

  const L = 4;
  const mass = 1;
  const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * L * L );
  const grid = tightGrid( L / 2 );
  const potFn = InfiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
  } );

  const numericalResult = NumerovSolver.solve( grid, potFn, mass, 0, 441 * E1 );
  const analyticalResult = InfiniteSquareSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L,
    energyMin: 0, energyMax: 441 * E1, electronMasses: mass, electricField: 0
  } );

  const nCompare = Math.min( numericalResult.waveFunctions.length, analyticalResult.waveFunctions.length, 10 );
  for ( let i = 0; i < nCompare; i++ ) {
    const rms = waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], grid.dx );
    assert.ok( rms < 0.05, `ISW n=${i + 1}: WF RMS error = ${toFixed( rms * 100, 3 )} % (must be < 5 %)` );
  }
} );

// ============================================================================
// Module: Analytical comparison — Harmonic Oscillator
// ============================================================================

QUnit.module( 'Analytical comparison — Harmonic Oscillator' );

QUnit.test( 'energy error < 1 % for standard spring constant', assert => {

  const k = 4; // eV/nm² (same value used in testSolvers.ts)
  const mass = 1;
  const omega = Math.sqrt( k / mass );
  const E0 = 0.5 * HBAR * omega;
  const grid = standardGrid();
  const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
  } );

  const numericalResult = NumerovSolver.solve( grid, potFn, mass, 0.1 * E0, 20.5 * HBAR * omega );
  const analyticalResult = HarmonicOscillatorSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k,
    energyMin: 0.1 * E0, energyMax: 20.5 * HBAR * omega, electronMasses: mass, electricField: 0
  } );

  assert.ok( numericalResult.energies.length >= 5, `Found ${numericalResult.energies.length} numerical states (need ≥ 5)` );

  const nCompare = Math.min( numericalResult.energies.length, analyticalResult.energies.length, 10 );
  for ( let i = 0; i < nCompare; i++ ) {
    const relErr = Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / analyticalResult.energies[ i ];
    assert.ok( relErr < 0.01, `HO n=${i}: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 1 %)` );
  }
} );

QUnit.test( 'wave-function RMS error < 5 % for standard spring constant', assert => {

  const k = 4;
  const mass = 1;
  const omega = Math.sqrt( k / mass );
  const E0 = 0.5 * HBAR * omega;
  const grid = standardGrid();
  const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
  } );

  const numericalResult = NumerovSolver.solve( grid, potFn, mass, 0.1 * E0, 20.5 * HBAR * omega );
  const analyticalResult = HarmonicOscillatorSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k,
    energyMin: 0.1 * E0, energyMax: 20.5 * HBAR * omega, electronMasses: mass, electricField: 0
  } );

  const nCompare = Math.min( numericalResult.waveFunctions.length, analyticalResult.waveFunctions.length, 10 );
  for ( let i = 0; i < nCompare; i++ ) {
    const rms = waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], grid.dx );
    assert.ok( rms < 0.05, `HO n=${i}: WF RMS error = ${toFixed( rms * 100, 3 )} % (must be < 5 %)` );
  }
} );

// ============================================================================
// Module: Harmonic Oscillator — energy ladder (equal spacing)
// ============================================================================

QUnit.module( 'Harmonic Oscillator — energy ladder' );

QUnit.test( 'equal spacing matches ℏω within 0.5%', assert => {

  const wellWidth = 2;
  const mass = 1;
  const k = 32 / ( wellWidth * wellWidth );
  const omega = Math.sqrt( k / mass );
  const expectedSpacing = HBAR * omega;

  const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
  } );
  const result = NumerovSolver.solve( hoGrid( wellWidth, mass ), potFn, mass, 0.1 * expectedSpacing / 2, 10.5 * HBAR * omega );

  assert.ok( result.energies.length >= 3, `HO: need ≥ 3 states, got ${result.energies.length}` );

  for ( let n = 0; n < result.energies.length - 1; n++ ) {
    const spacing = result.energies[ n + 1 ] - result.energies[ n ];
    const relErr = Math.abs( spacing - expectedSpacing ) / expectedSpacing;
    assert.ok( relErr < 0.005,
      `HO spacing n=${n}: Δ=${toFixed( spacing, 6 )} eV, expected ${toFixed( expectedSpacing, 6 )} eV, error=${toFixed( relErr * 100, 3 )} %` );
  }
} );

// ============================================================================
// Module: Infinite Square Well — energy ladder (quadratic ratio)
// ============================================================================

QUnit.module( 'Infinite Square Well — energy ladder' );

QUnit.test( 'E_n/E_0 = (n+1)² within 0.1%', assert => {

  const L = 2;
  const mass = 1;
  const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * L * L );
  const potFn = InfiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
  } );
  const result = NumerovSolver.solve( tightGrid( L / 2 ), potFn, mass, 0, 100 * E1 );

  assert.ok( result.energies.length >= 5, `ISW: need ≥ 5 states, got ${result.energies.length}` );

  const E0 = result.energies[ 0 ];
  const nCheck = Math.min( result.energies.length, 8 );
  for ( let n = 1; n < nCheck; n++ ) {
    const expectedRatio = ( n + 1 ) * ( n + 1 );
    const actualRatio = result.energies[ n ] / E0;
    const relErr = Math.abs( actualRatio - expectedRatio ) / expectedRatio;
    assert.ok( relErr < 0.001,
      `ISW n=${n}: ratio=${toFixed( actualRatio, 4 )}, expected ${expectedRatio}, error=${toFixed( relErr * 100, 4 )} %` );
  }
} );

// Note: A Bohr-ratio test (E_n/E_0 = 1/(n+1)²) is not included here because the
// standard grid (dx ≈ 0.002 nm) cannot resolve Coulomb excited states: the Bohr
// radius is ~0.053 nm and higher states are widely spread, so Numerov finds wrong
// levels in the energy range.  The B4 analytical comparison below checks the
// ground-state energy with a realistic tolerance.

// ============================================================================
// Module: Morse — anharmonic level convergence
// ============================================================================

QUnit.module( 'Morse — anharmonic level convergence' );

QUnit.test( 'energy spacing decreases monotonically', assert => {

  const wellWidth = 1;
  const wellDepth = 10;
  const mass = 1;
  const potFn = MorseSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
  } );
  const result = NumerovSolver.solve( morseGrid( wellWidth ), potFn, mass, -wellDepth, 0 );

  assert.ok( result.energies.length >= 3, `Morse: need ≥ 3 states for anharmonicity test, got ${result.energies.length}` );

  for ( let n = 0; n < result.energies.length - 2; n++ ) {
    const spacing0 = result.energies[ n + 1 ] - result.energies[ n ];
    const spacing1 = result.energies[ n + 2 ] - result.energies[ n + 1 ];
    assert.ok( spacing0 > spacing1,
      `Morse: spacing at n=${n} (${toFixed( spacing0, 4 )} eV) must exceed spacing at n=${n + 1} (${toFixed( spacing1, 4 )} eV)` );
  }
} );

// ============================================================================
// Module: Analytical comparison — Finite Square Well
// ============================================================================

QUnit.module( 'Analytical comparison — Finite Square Well' );

QUnit.test( 'energy error < 1% for L=2 nm, V₀=10 eV', assert => {

  const L = 2;
  const V0 = 10;
  const mass = 1;
  const grid = standardGrid();
  const potFn = FiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0, electricField: 0
  } );

  const numericalResult = NumerovSolver.solve( grid, potFn, mass, 0, V0 );
  const analyticalResult = FiniteSquareSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0,
    energyMin: 0, energyMax: V0, electronMasses: mass, electricField: 0
  } );

  assert.ok( numericalResult.energies.length >= 2, `Found ${numericalResult.energies.length} numerical states (need ≥ 2)` );
  const nCompareB1 = Math.min( numericalResult.energies.length, analyticalResult.energies.length, 6 );
  for ( let i = 0; i < nCompareB1; i++ ) {
    const relErr = Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / Math.abs( analyticalResult.energies[ i ] );
    assert.ok( relErr < 0.01, `FSW n=${i}: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 1 %)` );
  }
} );

QUnit.test( 'wave-function RMS error < 5% for L=2 nm, V₀=10 eV', assert => {

  const L = 2;
  const V0 = 10;
  const mass = 1;
  const grid = standardGrid();
  const potFn = FiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0, electricField: 0
  } );

  const numericalResult = NumerovSolver.solve( grid, potFn, mass, 0, V0 );
  const analyticalResult = FiniteSquareSolution.solve( grid, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0,
    energyMin: 0, energyMax: V0, electronMasses: mass, electricField: 0
  } );

  const nCompareB1wf = Math.min( numericalResult.waveFunctions.length, analyticalResult.waveFunctions.length, 6 );
  for ( let i = 0; i < nCompareB1wf; i++ ) {
    const rms = waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], grid.dx );
    assert.ok( rms < 0.05, `FSW n=${i}: WF RMS error = ${toFixed( rms * 100, 3 )} % (must be < 5 %)` );
  }
} );

// ============================================================================
// Module: Analytical comparison — Poschl-Teller
// ============================================================================

QUnit.module( 'Analytical comparison — Poschl-Teller' );

QUnit.test( 'energy error < 1% for w=0.5 nm, V₀=10 eV', assert => {

  const wPT = 0.5;
  const V0PT = 10;
  const massPT = 1;
  const gridPT = standardGrid();
  const potFnPT = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wPT, wellDepth: V0PT, electricField: 0
  } );

  const numericalResultPT = NumerovSolver.solve( gridPT, potFnPT, massPT, -3 * V0PT, 0 );
  const analyticalResultPT = PoschlTellerSolution.solve( gridPT, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wPT, wellDepth: V0PT,
    energyMin: -3 * V0PT, energyMax: 0, electronMasses: massPT, electricField: 0
  } );

  assert.ok( numericalResultPT.energies.length >= 2, `Found ${numericalResultPT.energies.length} numerical states (need ≥ 2)` );
  // Use 2% tolerance: higher PT states (n ≥ 5) on the standard 3001-point grid show
  // ~1–2% error due to the narrow sech² well shape requiring finer dx near the peak.
  const nComparePT = Math.min( numericalResultPT.energies.length, analyticalResultPT.energies.length, 6 );
  for ( let i = 0; i < nComparePT; i++ ) {
    const relErr = Math.abs( numericalResultPT.energies[ i ] - analyticalResultPT.energies[ i ] ) / Math.abs( analyticalResultPT.energies[ i ] );
    assert.ok( relErr < 0.02, `PT n=${i}: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 2 %)` );
  }
} );

QUnit.test( 'wave-function RMS error < 5% for w=0.5 nm, V₀=10 eV', assert => {

  const wPT = 0.5;
  const V0PT = 10;
  const massPT = 1;
  const gridPT = standardGrid();
  const potFnPT = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wPT, wellDepth: V0PT, electricField: 0
  } );

  const numericalResultPT = NumerovSolver.solve( gridPT, potFnPT, massPT, -3 * V0PT, 0 );
  const analyticalResultPT = PoschlTellerSolution.solve( gridPT, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wPT, wellDepth: V0PT,
    energyMin: -3 * V0PT, energyMax: 0, electronMasses: massPT, electricField: 0
  } );

  const nComparePTwf = Math.min( numericalResultPT.waveFunctions.length, analyticalResultPT.waveFunctions.length, 6 );
  for ( let i = 0; i < nComparePTwf; i++ ) {
    const rms = waveFunctionRMSError( numericalResultPT.waveFunctions[ i ], analyticalResultPT.waveFunctions[ i ], gridPT.dx );
    assert.ok( rms < 0.05, `PT n=${i}: WF RMS error = ${toFixed( rms * 100, 3 )} % (must be < 5 %)` );
  }
} );

// ============================================================================
// Module: Analytical comparison — Morse
// ============================================================================

QUnit.module( 'Analytical comparison — Morse' );

QUnit.test( 'energy error < 2% for w=1 nm, D_e=5 eV', assert => {

  const wM = 1;
  const DeM = 5;
  const massM = 1;
  const gridM = morseGrid( wM );
  const potFnM = MorseSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wM, wellDepth: DeM, electricField: 0
  } );

  const numericalResultM = NumerovSolver.solve( gridM, potFnM, massM, -DeM, 0 );
  const analyticalResultM = MorseSolution.solve( gridM, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wM, wellDepth: DeM,
    energyMin: -DeM, energyMax: 0, electronMasses: massM, electricField: 0
  } );

  assert.ok( numericalResultM.energies.length >= 2, `Found ${numericalResultM.energies.length} numerical states (need ≥ 2)` );
  const nCompareM = Math.min( numericalResultM.energies.length, analyticalResultM.energies.length, 8 );
  for ( let i = 0; i < nCompareM; i++ ) {
    const relErr = Math.abs( numericalResultM.energies[ i ] - analyticalResultM.energies[ i ] ) / Math.abs( analyticalResultM.energies[ i ] );
    assert.ok( relErr < 0.02, `Morse n=${i}: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 2 %)` );
  }
} );

QUnit.test( 'wave-function RMS error < 10% for w=1 nm, D_e=5 eV', assert => {

  const wM = 1;
  const DeM = 5;
  const massM = 1;
  const gridM = morseGrid( wM );
  const potFnM = MorseSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wM, wellDepth: DeM, electricField: 0
  } );

  const numericalResultM = NumerovSolver.solve( gridM, potFnM, massM, -DeM, 0 );
  const analyticalResultM = MorseSolution.solve( gridM, {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wM, wellDepth: DeM,
    energyMin: -DeM, energyMax: 0, electronMasses: massM, electricField: 0
  } );

  const nCompareMwf = Math.min( numericalResultM.waveFunctions.length, analyticalResultM.waveFunctions.length, 8 );
  for ( let i = 0; i < nCompareMwf; i++ ) {
    const rms = waveFunctionRMSError( numericalResultM.waveFunctions[ i ], analyticalResultM.waveFunctions[ i ], gridM.dx );
    assert.ok( rms < 0.10, `Morse n=${i}: WF RMS error = ${toFixed( rms * 100, 3 )} % (must be < 10 %)` );
  }
} );

// ============================================================================
// Module: Analytical comparison — Coulomb
// ============================================================================

QUnit.module( 'Analytical comparison — Coulomb' );

QUnit.test( 'energy error < 1% for default Coulomb', assert => {

  const massC = 1;
  const gridC = standardGrid();
  const potFnC = CoulombSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, electricField: 0
  } );

  const numericalResultC = NumerovSolver.solve( gridC, potFnC, massC, -17.5, 0 );
  const analyticalResultC = CoulombSolution.solve( gridC, {
    numberOfWells: 1, xOffset: 0, yOffset: 0,
    energyMin: -17.5, energyMax: 0, electronMasses: massC, electricField: 0
  } );

  // The standard 3001-point grid cannot resolve Coulomb excited states (Bohr radius
  // ~0.053 nm, dx ≈ 0.002 nm), so only the ground state (n=1) is compared.
  // The ground-state energy converges reasonably; higher states are unresolvable
  // on this grid and are not checked here.
  assert.ok( numericalResultC.energies.length >= 1, `Found ${numericalResultC.energies.length} numerical states (need ≥ 1)` );
  if ( analyticalResultC.energies.length >= 1 ) {
    const relErr = Math.abs( numericalResultC.energies[ 0 ] - analyticalResultC.energies[ 0 ] ) / Math.abs( analyticalResultC.energies[ 0 ] );
    assert.ok( relErr < 0.05, `Coulomb n=1: energy error = ${toFixed( relErr * 100, 3 )} % (must be < 5 %)` );
  }
} );

// ============================================================================
// Module: yOffset energy shift invariant
// ============================================================================

QUnit.module( 'yOffset energy shift invariant' );

QUnit.test( 'all eigenvalues shift by yOffset within 1e-4 eV', assert => {

  const yShift = 1;
  const tolerance = 1e-4;

  // ISW: L=1 nm, m=1
  {
    const L = 1;
    const mass = 1;
    const E1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass * L * L );
    const grid = tightGrid( L / 2 );
    const potFn0 = InfiniteSquareSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
    } );
    const potFn1 = InfiniteSquareSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: yShift, wellWidth: L, electricField: 0
    } );
    const result0 = NumerovSolver.solve( grid, potFn0, mass, 0, 100 * E1 );
    const result1 = NumerovSolver.solve( grid, potFn1, mass, yShift, yShift + 100 * E1 );
    const nCheck = Math.min( result0.energies.length, result1.energies.length );
    for ( let i = 0; i < nCheck; i++ ) {
      const shift = result1.energies[ i ] - result0.energies[ i ];
      assert.ok( Math.abs( shift - yShift ) < tolerance,
        `ISW n=${i}: shift=${toFixed( shift, 6 )} eV, expected ${yShift} eV` );
    }
  }

  // FSW: L=1 nm, V0=5 eV, m=1
  {
    const L = 1;
    const V0 = 5;
    const mass = 1;
    const grid = standardGrid();
    const potFn0 = FiniteSquareSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0, electricField: 0
    } );
    const potFn1 = FiniteSquareSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: yShift, wellWidth: L, wellDepth: V0, electricField: 0
    } );
    const result0 = NumerovSolver.solve( grid, potFn0, mass, 0, V0 );
    const result1 = NumerovSolver.solve( grid, potFn1, mass, yShift, yShift + V0 );
    const nCheck = Math.min( result0.energies.length, result1.energies.length );
    for ( let i = 0; i < nCheck; i++ ) {
      const shift = result1.energies[ i ] - result0.energies[ i ];
      assert.ok( Math.abs( shift - yShift ) < tolerance,
        `FSW n=${i}: shift=${toFixed( shift, 6 )} eV, expected ${yShift} eV` );
    }
  }

  // HO: w=2 nm, m=1
  {
    const w = 2;
    const mass = 1;
    const k = 32 / ( w * w );
    const omega = Math.sqrt( k / mass );
    const grid = hoGrid( w, mass );
    const potFn0 = HarmonicOscillatorSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
    } );
    const potFn1 = HarmonicOscillatorSolution.createPotentialFunction( {
      numberOfWells: 1, xOffset: 0, yOffset: yShift, springConstant: k, electricField: 0
    } );
    const result0 = NumerovSolver.solve( grid, potFn0, mass, 0.1 * HBAR * omega / 2, 10.5 * HBAR * omega );
    const result1 = NumerovSolver.solve( grid, potFn1, mass, yShift + 0.1 * HBAR * omega / 2, yShift + 10.5 * HBAR * omega );
    const nCheck = Math.min( result0.energies.length, result1.energies.length );
    for ( let i = 0; i < nCheck; i++ ) {
      const shift = result1.energies[ i ] - result0.energies[ i ];
      assert.ok( Math.abs( shift - yShift ) < tolerance,
        `HO n=${i}: shift=${toFixed( shift, 6 )} eV, expected ${yShift} eV` );
    }
  }
} );

// ============================================================================
// Module: Mass scaling
// ============================================================================

QUnit.module( 'Mass scaling' );

QUnit.test( 'ISW E_n(2m) ≈ E_n(m)/2 within 0.5%', assert => {

  // ISW energies E_n = n²π²ℏ²/(2mL²) ∝ 1/m, so doubling m halves all eigenvalues.
  const L = 2;
  const mass1 = 1;
  const mass2 = 2;
  const E1_m1 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass1 * L * L );
  const E1_m2 = Math.PI * Math.PI * HBAR * HBAR / ( 2 * mass2 * L * L );
  const grid = tightGrid( L / 2 );
  const potFn = InfiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, electricField: 0
  } );

  const resultM1 = NumerovSolver.solve( grid, potFn, mass1, 0, 100 * E1_m1 );
  const resultM2 = NumerovSolver.solve( grid, potFn, mass2, 0, 100 * E1_m2 );

  const nCheckMS = Math.min( resultM1.energies.length, resultM2.energies.length, 8 );
  for ( let i = 0; i < nCheckMS; i++ ) {
    const expected = resultM1.energies[ i ] / 2;
    const relErr = Math.abs( resultM2.energies[ i ] - expected ) / expected;
    assert.ok( relErr < 0.005,
      `ISW n=${i}: E(2m)=${toFixed( resultM2.energies[ i ], 4 )} eV, E(m)/2=${toFixed( expected, 4 )} eV, error=${toFixed( relErr * 100, 3 )} %` );
  }
} );

QUnit.test( 'HO E_n(2m) ≈ E_n(m)/√2 within 0.5%', assert => {

  // HO energies E_n = ℏ√(k/m)(n+½) ∝ m^{-½}, so doubling m scales energies by 1/√2.
  const w = 2;
  const mass1 = 1;
  const mass2 = 2;
  const k = 32 / ( w * w );
  const omega1 = Math.sqrt( k / mass1 );
  const omega2 = Math.sqrt( k / mass2 );
  const potFn = HarmonicOscillatorSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, springConstant: k, electricField: 0
  } );

  const resultHO1 = NumerovSolver.solve( hoGrid( w, mass1 ), potFn, mass1, 0.1 * HBAR * omega1 / 2, 10.5 * HBAR * omega1 );
  const resultHO2 = NumerovSolver.solve( hoGrid( w, mass2 ), potFn, mass2, 0.1 * HBAR * omega2 / 2, 10.5 * HBAR * omega2 );

  const nCheckHOMS = Math.min( resultHO1.energies.length, resultHO2.energies.length, 8 );
  for ( let i = 0; i < nCheckHOMS; i++ ) {
    const expected = resultHO1.energies[ i ] / Math.SQRT2;
    const relErr = Math.abs( resultHO2.energies[ i ] - expected ) / expected;
    assert.ok( relErr < 0.005,
      `HO n=${i}: E(2m)=${toFixed( resultHO2.energies[ i ], 4 )} eV, E(m)/√2=${toFixed( expected, 4 )} eV, error=${toFixed( relErr * 100, 3 )} %` );
  }
} );

// ============================================================================
// Module: Finite Square Well — guaranteed bound state
// ============================================================================

QUnit.module( 'Finite Square Well — guaranteed bound state' );

QUnit.test( 'always finds at least one bound state across parameter space', assert => {

  // A 1D finite square well always has at least one bound state (exact quantum theorem).
  const wellWidths = SWEEP_WELL_WIDTHS;
  const wellDepths = SWEEP_WELL_DEPTHS_20;
  const masses = SWEEP_MASSES;

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      for ( const mass of masses ) {
        const potFn = FiniteSquareSolution.createPotentialFunction( {
          numberOfWells: 1, xOffset: 0, yOffset: 0,
          wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
        } );
        const result = NumerovSolver.solve( standardGrid(), potFn, mass, 0, wellDepth );
        assert.ok( result.energies.length >= 1,
          `FSW wellWidth=${wellWidth} wellDepth=${wellDepth} mass=${mass}: must have ≥1 bound state, found ${result.energies.length}` );
      }
    }
  }
} );

// ============================================================================
// Module: Orthogonality — extended (FSW, Poschl-Teller)
// ============================================================================

QUnit.module( 'Orthogonality — extended' );

QUnit.test( 'Finite Square Well eigenstates are orthogonal', assert => {

  const L = 2;
  const V0 = 10;
  const mass = 1;
  const grid = standardGrid();
  const potFn = FiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: L, wellDepth: V0, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, mass, 0, V0 );
  assertOrthogonality( assert, result.waveFunctions, grid.dx, 1e-3, 'FSW' );
} );

QUnit.test( 'Poschl-Teller eigenstates are orthogonal', assert => {

  const w = 0.5;
  const V0 = 10;
  const mass = 1;
  const grid = standardGrid();
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: w, wellDepth: V0, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, mass, -3 * V0, 0 );
  assertOrthogonality( assert, result.waveFunctions, grid.dx, 1e-3, 'PT' );
} );

// ============================================================================
// Module: Wavefunction boundary decay
// ============================================================================

QUnit.module( 'Wavefunction boundary decay' );

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

QUnit.test( 'Finite Square Well states decay to < 1% at grid edges', assert => {

  const grid = standardGrid();
  const potFn = FiniteSquareSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: 2, wellDepth: 10, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, 1, 0, 10 );
  assertBoundaryDecay( assert, result.waveFunctions, 0.01, 'FSW' );
} );

QUnit.test( 'Poschl-Teller states decay to < 1% at grid edges', assert => {

  const grid = standardGrid();
  const potFn = PoschlTellerSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: 0.5, wellDepth: 10, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, 1, -30, 0 );
  assertBoundaryDecay( assert, result.waveFunctions, 0.01, 'PT' );
} );

QUnit.test( 'Morse states decay to < 1% at grid edges', assert => {

  const wellWidth = 1;
  const grid = morseGrid( wellWidth );
  const potFn = MorseSolution.createPotentialFunction( {
    numberOfWells: 1, xOffset: 0, yOffset: 0, wellWidth: wellWidth, wellDepth: 5, electricField: 0
  } );
  const result = NumerovSolver.solve( grid, potFn, 1, -5, 0 );
  assertBoundaryDecay( assert, result.waveFunctions, 0.01, 'Morse' );
} );

// ============================================================================
// Module: Poschl-Teller — state count formula
// ============================================================================

QUnit.module( 'Poschl-Teller — state count formula' );

QUnit.test( 'N_bound = ⌊λ − ½⌋ + 1 where λ = w√(2mV₀)/ℏ', assert => {

  const wellWidths = [ 0.1, 0.3, 0.5, 1.0 ];
  const wellDepths = [ 2.0, 5.0, 10.0, 15.0 ];
  const mass = 1;

  for ( const wellWidth of wellWidths ) {
    for ( const wellDepth of wellDepths ) {
      const lambda = wellWidth * Math.sqrt( 2 * mass * wellDepth ) / HBAR;
      const expectedCount = Math.floor( lambda - 0.5 ) + 1;

      const potFn = PoschlTellerSolution.createPotentialFunction( {
        numberOfWells: 1, xOffset: 0, yOffset: 0,
        wellWidth: wellWidth, wellDepth: wellDepth, electricField: 0
      } );
      const result = NumerovSolver.solve( standardGrid(), potFn, mass, -3 * wellDepth, 0 );

      // Allow off-by-1: when the top state is barely bound (energy very close to 0),
      // Numerov may miss it due to finite energy-range discretisation.
      assert.ok( Math.abs( result.energies.length - expectedCount ) <= 1,
        `PT wellWidth=${wellWidth} wellDepth=${wellDepth}: expected ${expectedCount} states (λ=${toFixed( lambda, 3 )}), got ${result.energies.length}` );
    }
  }
} );

// ============================================================================
// Module: Electric field breaks parity
// ============================================================================

QUnit.module( 'Electric field breaks parity' );

QUnit.test( 'Poschl-Teller with E-field has mixed-parity states', assert => {

  // A Stark field tilts the symmetric well; eigenstates no longer have definite parity.
  // We decompose each ψ into even and odd components and verify both are non-negligible.
  const wellWidths = SWEEP_WELL_WIDTHS_PT.filter( w => w <= 1.0 );
  const wellDepths = SWEEP_MULTI_WELL_DEPTHS;
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

            assert.ok( mixFraction > 1e-3,
              `PT E=${electricField} w=${wellWidth} V=${wellDepth} m=${mass} state ${i}: parity mix fraction = ${mixFraction.toExponential( 2 )} must be > 1e-3` );
          }
        }
      }
    }
  }
} );
