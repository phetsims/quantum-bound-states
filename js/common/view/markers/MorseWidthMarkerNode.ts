// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/53 identical to CoulombWidthMarkerNode
/**
 * MorseWidthMarkerNode is the marker (pair of vertical dashed lines) that shows the well width of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../../kite/js/Shape.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import PotentialMarkerNode from './PotentialMarkerNode.js';

export default class MorseWidthMarkerNode extends PotentialMarkerNode<MorsePotential> {

  public constructor( potential: MorsePotential,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    super( potential, chartTransform, {
      tandem: tandem
    } );
  }

  /**
   * Update the 2 vertical lines.
   */
  protected override update(): void {
    const xMax = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    const xMin = xMax - this.chartTransform.modelToViewDeltaX( this.potential.wellWidthProperty.value );
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