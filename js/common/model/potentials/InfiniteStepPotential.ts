// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepPotential is a quantum potential composed of 1 infinite step well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

type InfiniteStepPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'tandem'>;

export default class InfiniteStepPotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;

  // Height of the potential step V₀ in eV, applies to the right half of the well.
  public readonly stepHeightProperty: NumberProperty;

  public constructor( providedOptions: InfiniteStepPotentialOptions ) {

    const options = optionize<InfiniteStepPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( QBSConstants.WELL_WIDTH_RANGE.defaultValue, {
      units: nanometersUnit,
      //TODO range.min should be 0.1, but wellWidth < 0.2 causes assertion failure, no eigenvalues
      // range: QBSConstants.WELL_WIDTH_RANGE,
      range: new Range( 0.2, 6 ),
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.stepHeightProperty = new NumberProperty( QBSConstants.STEP_HEIGHT_RANGE.defaultValue, {
      units: electronVoltsUnit,
      range: QBSConstants.STEP_HEIGHT_RANGE,
      tandem: options.tandem.createTandem( 'stepHeightProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty, this.stepHeightProperty ], () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.stepHeightProperty.reset();
  }

  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'InfiniteStepPotential does not support multiple wells.' );
    affirm( this.electricFieldProperty.value === 0, 'InfiniteStepPotential does not support electric field.' );

    const wellWidth = this.wellWidthProperty.value;
    const leftX = this.xOffset - wellWidth / 2;
    const rightX = this.xOffset + wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      if ( x <= leftX + wellWidth / 2 ) {
        // to the left of the step
        pe = this.yOffsetProperty.value;
      }
      else {
        // at the step
        pe = this.yOffsetProperty.value + this.stepHeightProperty.value;
      }
    }
    else {
      // outside the well
      pe = QBSConstants.EFFECTIVELY_INFINITE_ENERGY;
    }
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffsetProperty.value;
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new InfiniteSquareWellIcon( {
      wellWidth: 12,
      wellDepth: 12,
      hasStep: true
    } );
  }
}
