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
  xAxisLabelStringProperty?: TReadOnlyProperty<string> | null;
  yAxisLabelStringProperty?: TReadOnlyProperty<string> | null;
  viewWidth: number;
  viewHeight: number;
  xRange: Range;
  yRange: Range;
  hasXTicks?: boolean;
  hasYTicks?: boolean;
  xTickSpacing: number;
  yTickSpacing: number;
  xTickLabelDecimals?: number;
  yTickLabelDecimals?: number;
  chartRectangleOptions?: ChartRectangleOptions;
};

export type QBSGraphNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class QBSGraphNode extends Node {

  // bamboo model-view transform
  private readonly chartTransform: ChartTransform;

  // Outer rectangle of the chart
  private readonly chartRectangle: ChartRectangle;

  // Tick marks and labels
  private readonly xTickMarkSet?: TickMarkSet;
  private readonly xTickLabelSet?: TickLabelSet;
  private readonly yTickMarkSet?: TickMarkSet;
  private readonly yTickLabelSet?: TickLabelSet;

  // Grid lines
  private readonly verticalGridLines: GridLineSet;

  protected constructor( providedOptions: QBSGraphNodeOptions ) {

    const options = optionize<QBSGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      xAxisLabelStringProperty: null,
      yAxisLabelStringProperty: null,
      xTickLabelDecimals: 0,
      yTickLabelDecimals: 0,
      hasXTicks: true,
      hasYTicks: true,
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
    if ( options.hasYTicks ) {
      this.yTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
        edge: 'min'
      } );
      decorations.push( this.yTickMarkSet );

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
        font: QBSConstants.GRAPH_LABEL_FONT,
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
        font: QBSConstants.GRAPH_LABEL_FONT,
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
  }
}

quantumBoundStates.register( 'QBSGraphNode', QBSGraphNode );