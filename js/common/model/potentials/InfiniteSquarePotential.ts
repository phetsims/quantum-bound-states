// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquarePotential is a quantum potential composed of 1 infinite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import InfiniteSquareSolution from '../solver/analytical-solutions/InfiniteSquareSolution.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

export type InfiniteSquarePotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'yOffsetRange'> &
  PickRequired<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class InfiniteSquarePotential extends QuantumPotential {

  public constructor( providedOptions: InfiniteSquarePotentialOptions ) {

    const options = optionize<InfiniteSquarePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      wellWidthRange: new RangeWithValue( 0.5, 6, 1 ), // for 1 well
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteSquareStringProperty,
      tandemPrefix: 'infiniteSquarePotential'
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
      affirm( this.numberOfWellsProperty.value === 1, 'InfiniteSquarePotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'InfiniteSquarePotential does not support electric field.' );
    }
    return InfiniteSquareSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy(),
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      wellWidth: this.wellWidthProperty.value,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value
    } );
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {

    // The infinite square well has infinitely many bound states, so there is no physical maximum energy.
    // Cap the search at a fixed energy above the well bottom, independent of the Energy diagram's viewport.
    return QBSConstants.MAX_SOLVER_ENERGY_ABOVE_WELL + this.yOffsetProperty.value;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new InfiniteSquareWellIcon( {
      wellWidth: 12,
      wellDepth: 12
    } );
  }
}
