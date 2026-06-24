// Copyright 2026, University of Colorado Boulder

/**
 * MorsePotential is a quantum potential based on the Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import MorseSolution from '../solvers/analytical-solutions/MorseSolution.js';
import { BoundStateResult } from '../solvers/BoundStateResult.js';
import XGrid from '../solvers/XGrid.js';
import { QuantumPotentialOptions } from './QuantumPotential.js';
import QuantumPotentialDepth, { QuantumPotentialDepthOptions } from './QuantumPotentialDepth.js';

type SelfOptions = EmptySelfOptions;

export type MorsePotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'yOffsetRange'> &
  PickRequired<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class MorsePotential extends QuantumPotentialDepth {

  public constructor( providedOptions: MorsePotentialOptions ) {

    const options = optionize<MorsePotentialOptions, SelfOptions, QuantumPotentialDepthOptions>()( {

      // QuantumPotentialOptions
      groundStateIndex: 0,
      xOffset: -2, // shift left so that more of the potential's tail is visible
      energyAxisRange: new Range( -15, 5 ).dilated( 0.5 ),
      wellWidthRange: new RangeWithValue( 0.1, 1, 0.5 ), // for 1 well
      wellDepthRange: new RangeWithValue( 1.5, 14, 9 ), // for 1 well
      depthDirection: 'down',
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.morseStringProperty,
      tandemPrefix: 'morsePotential'
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
           `wellDepth=${this.wellDepthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'MorsePotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'MorsePotential does not support electric field.' );
    }
    return MorseSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy(),
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      wellWidth: this.wellWidthProperty.value,
      wellDepth: this.wellDepthProperty.value,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value
    } );
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value - this.wellDepthProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value; // dissociation limit; no bound states above this
  }
}