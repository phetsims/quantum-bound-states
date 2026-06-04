// Copyright 2026, University of Colorado Boulder

/**
 * PotentialMarkerNode is the base class for markers (vertical dashed lines) related to a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSColors from '../../QBSColors.js';

export default abstract class PotentialMarkerNode extends Path {

  protected readonly potential: CoulombPotential;
  protected readonly chartTransform: ChartTransform;

  protected constructor( potential: CoulombPotential,
                         chartTransform: ChartTransform,
                         tandem: Tandem ) {

    super( null, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 1.5,
      lineDash: [ 6, 6 ],
      tandem: tandem
    } );

    this.potential = potential;
    this.chartTransform = chartTransform;

    potential.wellWidthProperty.link( () => this.update() );
    chartTransform.changedEmitter.addListener( () => this.update() );
  }

  /**
   * Update the marker lines.
   */
  protected abstract update(): void;
}