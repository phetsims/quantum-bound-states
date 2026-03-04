// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphNode is the base class for the various graphs that show a representation of the quantum state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = {

  // y-axis range
  yRange: Range;

  // y-axis label
  yAxisLabelStringProperty: TReadOnlyProperty<string>;

  // Spacing of y-axis tick marks
  yTickSpacing: number;

  // Number of decimal places in y-axis tick labels.
  yTickLabelDecimals: number;
};

export type QBSGraphNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'visibleProperty'> &
  PickRequired<NodeOptions, 'tandem' | 'accessibleHeading' | 'accessibleParagraph'>;

export default class QuantumStateGraphNode extends Node {

  // bamboo model-view transform
  public readonly chartTransform: ChartTransform;

  // Outer rectangle of the chart, public for layout.
  public readonly chartRectangle: Node;

  protected constructor( providedOptions: QBSGraphNodeOptions ) {

    const options = optionize<QBSGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    this.chartTransform = new ChartTransform( {
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.ALL_GRAPHS_VIEW_HEIGHT,
      modelXRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      modelYRange: options.yRange
    } );

    this.chartRectangle = new ChartRectangle( this.chartTransform, {
      fill: QBSColors.graphRectangleFillProperty,
      stroke: QBSColors.graphRectangleStrokeProperty,
      pickable: false // optimization
    } );

    const xAxisLabelNode = new RichText( QuantumBoundStatesFluent.position_nmStringProperty, {
      font: QBSConstants.AXIS_LABEL_FONT,
      maxWidth: 0.5 * this.chartRectangle.width
    } );
    xAxisLabelNode.boundsProperty.link( () => {
      xAxisLabelNode.centerTop = this.chartRectangle.centerBottom.addXY( 0, 20 );
    } );

    const xTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ALL_GRAPHS_X_TICK_SPACING, {
      edge: 'min'
    } );

    const xTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ALL_GRAPHS_X_TICK_SPACING, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( toFixed( value, 0 ), {
        font: QBSConstants.TICK_LABEL_FONT
      } )
    } );

    const yAxisLabelNode = new RichText( options.yAxisLabelStringProperty, {
      font: QBSConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: 0.85 * this.chartRectangle.height
    } );
    yAxisLabelNode.boundsProperty.link( () => {
      yAxisLabelNode.rightCenter = this.chartRectangle.leftCenter.addXY( QBSConstants.ALL_GRAPHS_Y_AXIS_LABEL_OFFSET, 0 );
    } );

    const yTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      edge: 'min'
    } );

    const yTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( toFixed( value, options.yTickLabelDecimals ), {
        font: QBSConstants.TICK_LABEL_FONT
      } )
    } );

    const horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      lineWidth: 1,
      lineDash: [ 4, 4 ],
      stroke: QBSColors.gridLinesStrokeProperty
    } );

    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ALL_GRAPHS_X_TICK_SPACING, {
      lineWidth: 1,
      lineDash: [ 4, 4 ],
      stroke: QBSColors.gridLinesStrokeProperty
    } );

    const xAxis = new AxisLine( this.chartTransform, Orientation.HORIZONTAL, {
      extension: 0,
      lineWidth: 1,
      stroke: QBSColors.xAxisStrokeProperty
    } );

    // Parents for all non-interactive elements.
    const pickableFalseNode = new Node( {
      pickable: false, // optimization
      children: [
        xAxisLabelNode,
        xTickMarkSet,
        xTickLabelSet,
        yAxisLabelNode,
        yTickMarkSet,
        yTickLabelSet,
        this.chartRectangle,
        horizontalGridLines,
        verticalGridLines,
        xAxis
      ]
    } );

    this.children = [ pickableFalseNode ];
  }
}

quantumBoundStates.register( 'QuantumStateGraphNode', QuantumStateGraphNode );