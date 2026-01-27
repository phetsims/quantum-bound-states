// Copyright 2026, University of Colorado Boulder

/**
 * QBSGraphNode is the base class for graphs in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartRectangle, { ChartRectangleOptions } from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

const X_AXIS_LABEL_OFFSET = 20;
const Y_AXIS_LABEL_OFFSET = -30;

type SelfOptions = {

  // Dimensions of the graph in view coordinates.
  viewWidth: number;
  viewHeight: number;

  // Range of the axes in model coordinates.
  xRange: Range;
  yRange: Range;

  // Optional labels for the axes.
  xAxisLabelStringProperty?: TReadOnlyProperty<string> | null;
  yAxisLabelStringProperty?: TReadOnlyProperty<string> | null;

  // Whether the graph has ticks on the x-axis.
  hasXTicks?: boolean;

  // Whether the graph has tick labels on the y-axis.
  hasYTickLabels?: boolean;

  // Spacing of the tick marks.
  xTickSpacing?: number;
  yTickSpacing?: number;

  // Number of decimal places in tick labels.
  xTickLabelDecimals?: number;
  yTickLabelDecimals?: number;

  // Propagated to this.chartRectangle.
  chartRectangleOptions?: ChartRectangleOptions;
};

export type QBSGraphNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class QBSGraphNode extends Node {

  // bamboo model-view transform
  public readonly chartTransform: ChartTransform;

  // Outer rectangle of the chart
  private readonly chartRectangle: ChartRectangle;

  // Tick marks and labels
  private readonly xTickMarkSet?: TickMarkSet;
  private readonly xTickLabelSet?: TickLabelSet;
  private readonly yTickMarkSet?: TickMarkSet;
  private readonly yTickLabelSet?: TickLabelSet;

  // Grid lines
  private readonly verticalGridLines: GridLineSet;
  private readonly horizontalGridLines: GridLineSet;

  protected constructor( providedOptions: QBSGraphNodeOptions ) {

    const options = optionize<QBSGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      xAxisLabelStringProperty: null,
      yAxisLabelStringProperty: null,
      xTickSpacing: providedOptions.xRange.getLength(),
      yTickSpacing: providedOptions.yRange.getLength(),
      xTickLabelDecimals: 0,
      yTickLabelDecimals: 0,
      hasXTicks: true,
      hasYTickLabels: true,
      chartRectangleOptions: {
        fill: QBSColors.graphRectangleFillProperty,
        stroke: QBSColors.graphRectangleStrokeProperty
      }
    }, providedOptions );

    super();

    this.chartTransform = new ChartTransform( {
      viewWidth: options.viewWidth,
      viewHeight: options.viewHeight,
      modelXRange: options.xRange,
      modelYRange: options.yRange
    } );

    this.chartRectangle = new ChartRectangle( this.chartTransform, options.chartRectangleOptions );

    const decorations: Node[] = [];

    // grid lines
    this.verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, options.xTickSpacing, {
      lineWidth: 1,
      lineDash: [ 4, 4 ],
      stroke: QBSColors.gridLinesStrokeProperty
    } );
    decorations.push( this.verticalGridLines );
    this.horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      lineWidth: 1,
      lineDash: [ 4, 4 ],
      stroke: QBSColors.gridLinesStrokeProperty
    } );
    decorations.push( this.horizontalGridLines );

    // x-axis ticks
    if ( options.hasXTicks ) {
      this.xTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.HORIZONTAL, options.xTickSpacing, {
        edge: 'min'
      } );
      decorations.push( this.xTickMarkSet );

      this.xTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.HORIZONTAL, options.xTickSpacing, {
        edge: 'min',
        createLabel: ( value: number ) => new Text( toFixed( value, options.xTickLabelDecimals ), {
          font: QBSConstants.TICK_LABEL_FONT
        } )
      } );
      decorations.push( this.xTickLabelSet );
    }

    // y-axis ticks
    this.yTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      edge: 'min'
    } );
    decorations.push( this.yTickMarkSet );

    if ( options.hasYTickLabels ) {
      this.yTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
        edge: 'min',
        createLabel: ( value: number ) => new Text( toFixed( value, options.yTickLabelDecimals ), {
          font: QBSConstants.TICK_LABEL_FONT
        } )
      } );
      decorations.push( this.yTickLabelSet );
    }

    // x-axis label
    if ( options.xAxisLabelStringProperty ) {
      const xAxisLabelNode = new RichText( options.xAxisLabelStringProperty, {
        font: QBSConstants.AXIS_LABEL_FONT,
        maxWidth: 0.85 * this.chartRectangle.width
      } );
      decorations.push( xAxisLabelNode );
      xAxisLabelNode.boundsProperty.link( () => {
        xAxisLabelNode.centerTop = this.chartRectangle.centerBottom.addXY( 0, X_AXIS_LABEL_OFFSET );
      } );
    }

    // y-axis label
    if ( options.yAxisLabelStringProperty ) {
      const yAxisLabelNode = new RichText( options.yAxisLabelStringProperty, {
        font: QBSConstants.AXIS_LABEL_FONT,
        rotation: -Math.PI / 2,
        maxWidth: 0.85 * this.chartRectangle.height
      } );
      decorations.push( yAxisLabelNode );
      yAxisLabelNode.boundsProperty.link( () => {
        yAxisLabelNode.rightCenter = this.chartRectangle.leftCenter.addXY( Y_AXIS_LABEL_OFFSET, 0 );
      } );
    }

    // Parent for all non-interactive decorations.
    const decorationsNode = new Node( {
      children: decorations,
      pickable: false // optimization
    } );

    this.children = [
      this.chartRectangle,
      decorationsNode
    ];
  }

  public setXRange( xRange: Range ): void {
    this.chartTransform.setModelXRange( xRange );
  }

  public setYRange( yRange: Range ): void {
    this.chartTransform.setModelYRange( yRange );
  }

  public setXTickSpacing( spacing: number ): void {
    this.xTickMarkSet && this.xTickMarkSet.setSpacing( spacing );
    this.xTickLabelSet && this.xTickLabelSet.setSpacing( spacing );
    this.verticalGridLines.setSpacing( spacing );
  }

  public setYTickSpacing( spacing: number ): void {
    this.yTickMarkSet && this.yTickMarkSet.setSpacing( spacing );
    this.yTickLabelSet && this.yTickLabelSet.setSpacing( spacing );
    this.horizontalGridLines.setSpacing( spacing );
  }
}

quantumBoundStates.register( 'QBSGraphNode', QBSGraphNode );