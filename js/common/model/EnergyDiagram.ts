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
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../QBSConstants.js';
import QBSModel from './QBSModel.js';
import XGrid from './solvers/XGrid.js';

export default class EnergyDiagram extends PhetioObject {

  // x-axis values
  public readonly xGrid: XGrid;

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  public readonly yRangeProperty: TReadOnlyProperty<Range>;
  private readonly _yRangeProperty: Property<Range>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.xGrid = model.xGrid;

    // Defaults to false, see https://github.com/phetsims/quantum-bound-states/issues/100.
    this.valuesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );

    //TODO Is yRangeProperty a candidate for RangedDynamicProperty?
    this._yRangeProperty = new Property( model.potentialProperty.value.yAxisRange, {
      tandem: tandem.createTandem( 'yRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.yRangeProperty = this._yRangeProperty;

    // Set the Energy Diagram's y-axis range based on the y-offset of the selected potential.
    const yOffsetListener = ( yOffset: number ) => {
      const min = roundToInterval( model.potentialProperty.value.yAxisRange.min + yOffset, QBSConstants.Y_OFFSET_INTERVAL );
      const max = roundToInterval( model.potentialProperty.value.yAxisRange.max + yOffset, QBSConstants.Y_OFFSET_INTERVAL );
      this._yRangeProperty.value = new Range( min, max );
    };
    model.potentialProperty.link( ( potential, oldPotential ) => {
      if ( oldPotential && oldPotential.yOffsetProperty.hasListener( yOffsetListener ) ) {
        oldPotential.yOffsetProperty.unlink( yOffsetListener );
      }
      potential.yOffsetProperty.link( yOffsetListener );
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    //TODO Add additional Properties to reset.
  }
}
