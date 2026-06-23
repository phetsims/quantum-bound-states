// Copyright 2026, University of Colorado Boulder

/**
 * CoulombPotential is a quantum potential composed of 1 Coulomb well.
*
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import CoulombSolution from '../solvers/analytical-solutions/CoulombSolution.js';
import { BoundStateResult } from '../solvers/BoundStateResult.js';
import XGrid from '../solvers/XGrid.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

export type CoulombPotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'yOffsetRange'> &
  PickRequired<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class CoulombPotential extends QuantumPotential {

  // The energy (eV above the well minimum) at which the classical turning-point width is measured.
  // At that energy the turning point is r = coupling / WIDTH_HANDLE_ENERGY, giving
  // full width w = 2r, so coupling = w * WIDTH_HANDLE_ENERGY / 2.
  public static readonly WIDTH_HANDLE_ENERGY = 4; // eV

  // Lower bound (eV below the dissociation limit) of the energy window searched by the bound-state solver.
  // The Coulomb potential has infinitely many bound states that accumulate toward the dissociation limit from
  // below, so there is no physical minimum energy. The search is capped at a fixed depth below the limit, deep
  // enough to include the ground state (E_1 = -13.6 eV for the default coupling) with generous margin. This is
  // deliberately decoupled from the Energy diagram's viewport so the set of computed states stays stable when
  // the y-axis is zoomed. See https://github.com/phetsims/quantum-bound-states/issues/63
  public static readonly MIN_SOLVER_ENERGY_BELOW_LIMIT = 60; // eV

  public constructor( providedOptions: CoulombPotentialOptions ) {

    const options = optionize<CoulombPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      energyAxisRange: new Range( -15, 5 ).dilated( 0.5 ),

      // Range of well widths, in nm. Default width gives coupling = 0.72 * 4 / 2 = 1.44 eV·nm (the physical ke²).
      // It is worth noting that the coupling is proportional to the well width, so the range of well widths corresponds
      // to a range of couplings. For example, the default width of 0.72 nm gives a coupling of 1.44 eV·nm,
      // which is the physical value of ke² and reproduces the standard behavior. (E_1 =-13.6 eV, E_2 =-3.4 eV, etc)
      // Therefore do not change the default without talking to a designer,
      // as it would change the default coupling and thus the default behavior of the simulation.
      // The Java reference did not have a well width parameter, but the coupling was effectively 1.44 eV·nm, so the default width is set to give that coupling.
      // A more physical model would tune the bohr radius, but this is not a good UI fit for the sim's scale
      //TODO https://github.com/phetsims/quantum-bound-states/issues/64 0.72 is problematic because we show 1 decimal place for well width. Can we use 0.7?
      wellWidthRange: new RangeWithValue( 0.2, 0.72, 0.72 ),
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.coulombStringProperty,
      tandemPrefix: 'coulombPotential'
    }, providedOptions );

    super( options );
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `xOffset=${this.xOffsetProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'CoulombPotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'CoulombPotential does not support electric field.' );
    }
    return CoulombSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy(),
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      wellWidth: this.wellWidthProperty.value,
      energyAtWellWidth: CoulombPotential.WIDTH_HANDLE_ENERGY,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value
    } );
  }

  public override getMinSolverEnergy(): number {

    // States accumulate toward the dissociation limit (yOffset) from below, so there is no physical minimum
    // energy. Search down to a fixed depth below the limit, independent of the Energy diagram's viewport.
    return this.yOffsetProperty.value - CoulombPotential.MIN_SOLVER_ENERGY_BELOW_LIMIT;
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value; // top of the potential
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 4 )
      .quadraticCurveTo( 8, 5, 7, 16 )
      .moveTo( 10, 16 )
      .quadraticCurveTo( 11, 5, 17, 4 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
