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
import QuantumPotential from './potentials/QuantumPotential.js';
import { BoundStateResult } from './solver/BoundStateResult.js';
import XGrid from './solver/XGrid.js';

export default class EnergyDiagram {

  public readonly xGrid: XGrid;
  public readonly boundStateResultProperty: TReadOnlyProperty<BoundStateResult>;

  public readonly yRangeProperty: TReadOnlyProperty<Range>;
  private readonly _yRangeProperty: Property<Range>;

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      xGrid: XGrid,
                      boundStateResultProperty: TReadOnlyProperty<BoundStateResult>,
                      tandem: Tandem ) {

    this.xGrid = xGrid;
    this.boundStateResultProperty = boundStateResultProperty;

    this._yRangeProperty = new Property( potentialProperty.value.energyAxisRange, {
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
      this._yRangeProperty.value = potentialProperty.value.energyAxisRange.shifted( yOffset );
    };
    potentialProperty.link( ( potential, oldPotential ) => {
      oldPotential && oldPotential.yOffsetProperty.unlink( yOffsetListener );
      potential && potential.yOffsetProperty.link( yOffsetListener );
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    //TODO Add additional Properties to reset.
  }
}
