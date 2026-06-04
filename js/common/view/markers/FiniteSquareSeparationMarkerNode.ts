// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSeparationMarkerNode is the marker (pair of vertical dashed lines) that shows the separation between
 * wells of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../../kite/js/Shape.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import PotentialMarkerNode from './PotentialMarkerNode.js';

export default class FiniteSquareSeparationMarkerNode extends PotentialMarkerNode<FiniteSquarePotential> {

  public constructor( potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    super( potential, chartTransform, {
      visibleProperty: new DerivedProperty( [ potential.numberOfWellsProperty ], numberOfWells => numberOfWells > 1 ),
      tandem: tandem
    } );
  }

  /**
   * Update the 2 vertical lines.
   */
  protected override update(): void {
    const xHandle = ( this.potential.numberOfWellsProperty.value % 2 === 0 ) ?
                    this.potential.xOffsetProperty.value + this.potential.separationProperty.value / 2 :
                    this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 + this.potential.separationProperty.value;

    const xMax = this.chartTransform.modelToViewX( xHandle );
    const xMin = xMax - this.chartTransform.modelToViewDeltaX( this.potential.separationProperty.value );
    const yMin = 0;
    const yMax = this.chartTransform.viewHeight;
    const shape = new Shape()
      .moveTo( xMin, yMin )
      .lineTo( xMin, yMax )
      .newSubpath()
      .moveTo( xMax, yMin )
      .lineTo( xMax, yMax );
    this.setShape( shape );
  }
}