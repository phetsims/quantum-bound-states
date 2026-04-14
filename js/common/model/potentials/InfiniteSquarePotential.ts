// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquarePotential is a quantum potential composed of 1 infinite square well.
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
import QuantumPotential from './QuantumPotential.js';

export default class InfiniteSquarePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteSquareStringProperty,
      tandemPrefix: 'infiniteSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite square well.'
    } );

    this.wellWidthProperty = new NumberProperty( QBSConstants.WELL_WIDTH_RANGE.defaultValue, {
      units: nanometersUnit,
      //TODO range.min should be 0.1, but wellWidth < 0.2 causes assertion failure, no eigenvalues
      // range: QBSConstants.WELL_WIDTH_RANGE,
      range: new Range( 0.2, 6 ),
      tandem: tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    Multilink.multilink( [ this.wellWidthProperty ], () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'InfiniteSquarePotential does not support multiple wells.' );

    const wellWidth = 2; //this.wellWidthProperty.value;
    const leftX = this.xOffset - wellWidth / 2;
    const rightX = this.xOffset + wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      pe = this.yOffset;
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
      wellDepth: 12
    } );
  }
}
