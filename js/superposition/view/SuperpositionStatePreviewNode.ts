// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionStatePreviewNode displays a preview of the wave function superposition state
 * in the dialog for superposition state presets.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';

const GRID_LINE_DASH = [ 2, 2 ];

type SelfOptions = {
  viewScale?: number;
  yRange?: Range;
  yGridLineSpacing?: number;
};

type SuperpositionStatePreviewNodeOptions = SelfOptions & PickOptional<NodeOptions, 'layoutOptions'>;

export default class SuperpositionStatePreviewNode extends Node {

  public readonly chartTransform: ChartTransform;

  public constructor( providedOptions?: SuperpositionStatePreviewNodeOptions ) {

    const options = optionize<SuperpositionStatePreviewNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      viewScale: 1,
      yRange: new Range( -1, 1 ).dilated( 0.05 ),
      yGridLineSpacing: 1000, // so that we only see the grid lines at y=0

      // NodeOptions
      pickable: false
    }, providedOptions );

    super( options );

    this.chartTransform = new ChartTransform( {
      viewWidth: options.viewScale * QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: options.viewScale * QBSConstants.QUANTUM_STATE_GRAPHS_VIEW_HEIGHT,
      modelXRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      modelYRange: options.yRange
    } );

    const chartRectangle = new ChartRectangle( this.chartTransform, {
      fill: QBSColors.chartRectangleFillProperty,
      stroke: QBSColors.chartRectangleStrokeProperty
    } );

    const horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.yGridLineSpacing, {
      lineWidth: QBSConstants.GRID_LINE_LINE_WIDTH,
      lineDash: GRID_LINE_DASH,
      stroke: QBSColors.gridLinesStrokeProperty
    } );

    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ALL_GRAPHS_X_TICK_SPACING, {
      lineWidth: QBSConstants.GRID_LINE_LINE_WIDTH,
      lineDash: GRID_LINE_DASH,
      stroke: QBSColors.gridLinesStrokeProperty
    } );

    this.children = [ chartRectangle, horizontalGridLines, verticalGridLines ];

    this.disposeEmitter.addListener( () => {
      //TODO dispose
    } );
  }
}