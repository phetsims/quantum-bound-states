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
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential from './QuantumPotential.js';

export default class InfiniteStepPotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;

  // Height of the potential step V₀ in eV, applies to the right half of the well.
  public readonly stepHeightProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite step well.'
    } );

    this.wellWidthProperty = new NumberProperty( QBSConstants.WELL_WIDTH_RANGE.defaultValue, {
      units: nanometersUnit,
      //TODO range.min should be 0.1, but wellWidth < 0.2 causes assertion failure, no eigenvalues
      // range: QBSConstants.WELL_WIDTH_RANGE,
      range: new Range( 0.2, 6 ),
      tandem: tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.stepHeightProperty = new NumberProperty( QBSConstants.STEP_HEIGHT_RANGE.defaultValue, {
      units: electronVoltsUnit,
      range: QBSConstants.STEP_HEIGHT_RANGE,
      tandem: tandem.createTandem( 'stepHeightProperty' ),
      phetioFeatured: true
    } );

    Multilink.multilink( [ this.wellWidthProperty, this.stepHeightProperty ], () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.stepHeightProperty.reset();
  }

  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'InfiniteStepPotential does not support multiple wells.' );

    const wellWidth = this.wellWidthProperty.value;
    const leftX = this.xOffset - wellWidth / 2;
    const rightX = this.xOffset + wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      if ( x <= leftX + wellWidth / 2 ) {
        // to the left of the step
        pe = this.yOffset;
      }
      else {
        // at the step
        pe = this.yOffset + this.stepHeightProperty.value;
      }
    }
    else {
      // outside the well
      pe = QBSConstants.EFFECTIVELY_INFINITE_ENERGY;
    }
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
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
