// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingMarkerNode is the marker (pair of vertical dashed lines) that shows the spacing between
 * wells of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../../kite/js/Shape.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import PotentialMarkerNode from './PotentialMarkerNode.js';

export default class PoschlTellerSpacingMarkerNode extends PotentialMarkerNode<PoschlTellerPotential> {

  public constructor( potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    super( potential, chartTransform, {
      visibleProperty: potential.numberOfWellsProperty.derived( numberOfWells => numberOfWells > 1 ),
      tandem: tandem
    } );
  }

  /**
   * Update the 2 vertical lines.
   */
  protected override update(): void {

    const xHandle = ( this.potential.numberOfWellsProperty.value % 2 === 0 ) ?
              this.potential.xOffsetProperty.value + this.potential.spacingProperty.value / 2 :
              this.potential.xOffsetProperty.value + this.potential.spacingProperty.value;

    const xMax = this.chartTransform.modelToViewX( xHandle );
    const xMin = xMax - this.chartTransform.modelToViewDeltaX( this.potential.spacingProperty.value );
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