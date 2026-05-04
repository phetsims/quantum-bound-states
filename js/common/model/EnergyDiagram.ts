// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagram is the model for the 'Energy' diagram.
 * An intentional design decision was to call this a "diagram", not a "graph".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import QBSModel from './QBSModel.js';

export default class EnergyDiagram {

  public readonly yRangeProperty: TReadOnlyProperty<Range>;
  private readonly _yRangeProperty: Property<Range>;

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    this._yRangeProperty = new Property( model.potentialProperty.value.energyAxisRange, {
      tandem: tandem.createTandem( 'yRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.yRangeProperty = this._yRangeProperty;

    this.valuesVisibleProperty = new BooleanProperty( QBSQueryParameters.valuesVisible, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );

    const yOffsetListener = ( yOffset: number ) => {
      this._yRangeProperty.value = model.potentialProperty.value.energyAxisRange.shifted( yOffset );
    };
    model.potentialProperty.link( ( potential, oldPotential ) => {
      oldPotential && oldPotential.yOffsetProperty.unlink( yOffsetListener );
      potential && potential.yOffsetProperty.link( yOffsetListener );
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    //TODO Add additional Properties to reset.
  }
}
