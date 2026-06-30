// Copyright 2026, University of Colorado Boulder

/**
 * PotentialMarkerNode is the base class for markers (vertical dashed lines) related to a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Path, { PathOptions } from '../../../../../scenery/js/nodes/Path.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';

type SelfOptions = EmptySelfOptions;

export type PotentialMarkerNodeOptions = SelfOptions &
  PickOptional<PathOptions, 'visibleProperty'> &
  PickRequired<PathOptions, 'tandem'>;

export default abstract class PotentialMarkerNode<T extends QuantumPotential> extends Path {

  protected readonly potential: T;
  protected readonly chartTransform: ChartTransform;

  protected constructor( potential: T,
                         chartTransform: ChartTransform,
                         providedOptions: PotentialMarkerNodeOptions ) {

    const options = optionize<PotentialMarkerNodeOptions, SelfOptions, PathOptions>()( {
      stroke: QBSColors.markerLinesStrokeProperty,
      lineWidth: QBSConstants.MARKER_LINE_WIDTH,
      lineDash: [ 6, 6 ]
    }, providedOptions );

    super( null, options );

    this.potential = potential;
    this.chartTransform = chartTransform;

    potential.changedEmitter.addListener( () => this.update() );
    chartTransform.changedEmitter.addListener( () => this.update() );
    this.update();
  }

  /**
   * Update the marker lines.
   */
  protected abstract update(): void;
}