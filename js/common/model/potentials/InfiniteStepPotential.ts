// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepPotential is a quantum potential composed of 1 infinite step well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { electronVoltsUnit } from '../../../../../scenery-phet/js/units/electronVoltsUnit.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteStepSolution from '../solvers/analytical-solutions/InfiniteStepSolution.js';
import BoundStateResult from '../solvers/BoundStateResult.js';
import XGrid from '../solvers/XGrid.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  stepHeightRange?: RangeWithValue;
};

export type InfiniteStepPotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'yOffsetRange'> &
  PickRequired<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class InfiniteStepPotential extends QuantumPotential {

  // Height of the potential step V₀ in eV, applies to the right half of the well.
  public readonly stepHeightProperty: NumberProperty;

  public constructor( providedOptions: InfiniteStepPotentialOptions ) {

    const options = optionize<InfiniteStepPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      stepHeightRange: new RangeWithValue( 0, 17, 3 ), // for 1 well

      // QuantumPotentialOptions
      yAxisRange: new Range( 0, 20 ).dilated( 0.5 ),
      wellWidthRange: new RangeWithValue( 0.2, 6, 1 ), // for 1 well
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential'
    }, providedOptions );

    super( options );

    this.stepHeightProperty = new NumberProperty( options.stepHeightRange.defaultValue, {
      units: electronVoltsUnit,
      range: options.stepHeightRange,
      tandem: options.tandem.createTandem( 'stepHeightProperty' ),
      phetioFeatured: true,
      phetioReadOnly: ( options.stepHeightRange.getLength() === 0 )
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.stepHeightProperty ], () => this.changedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.stepHeightProperty.reset();
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
      affirm( this.numberOfWellsProperty.value === 1, 'InfiniteStepPotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'InfiniteStepPotential does not support electric field.' );
    }
    return InfiniteStepSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy(),
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      wellWidth: this.wellWidthProperty.value,
      stepHeight: this.stepHeightProperty.value,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value
    } );
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {

    // The infinite step well has infinitely many bound states, so there is no physical maximum energy.
    // Cap the search at a fixed energy above the well bottom, independent of the Energy diagram's viewport.
    return QBSConstants.MAX_SOLVER_ENERGY_ABOVE_WELL + this.yOffsetProperty.value;
  }
}
