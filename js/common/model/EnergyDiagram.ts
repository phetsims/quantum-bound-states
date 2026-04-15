// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagram is the model for the 'Energy' diagram.
 * An intentional design decision was to call this a "diagram", not a "graph".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      xGrid: XGrid,
                      boundStateResultProperty: TReadOnlyProperty<BoundStateResult>,
                      tandem: Tandem ) {

    this.xGrid = xGrid;
    this.boundStateResultProperty = boundStateResultProperty;

    this.yRangeProperty = new DerivedProperty( [ potentialProperty ],
      potential => potential.getEnergyAxisRange(), {
        tandem: tandem.createTandem( 'yRangeProperty' ),
        phetioValueType: Range.RangeIO,
        phetioFeatured: true
      } );

    this.valuesVisibleProperty = new BooleanProperty( QBSQueryParameters.valuesVisible, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    //TODO Add additional Properties to reset.
  }
}
