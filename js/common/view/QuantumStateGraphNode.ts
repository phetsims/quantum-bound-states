// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphNode is the base class for the various graphs that show a representation of the quantum state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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

  // Creates optional functionDetailsButton
  createFunctionDetailsButton?: ( ( tandem: Tandem ) => Node ) | null;
};

export type QuantumStateGraphNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'visibleProperty'> &
  PickRequired<NodeOptions, 'tandem' | 'accessibleHeading' | 'accessibleParagraph'>;

export default class QuantumStateGraphNode extends Node {

  // bamboo model-view transform
  protected readonly chartTransform: ChartTransform;

  // Outer rectangle of the chart
  private readonly chartRectangle: ChartRectangle;

  // Parent node for curves, clipped to chartRectangle.
  protected readonly curveLayer: Node;

  // y-axis decorations that are mutable
  private readonly yTickMarkSet: TickMarkSet;
  private readonly yTickLabelSet: TickLabelSet;
  private readonly horizontalGridLines: GridLineSet;

  protected constructor( curvesVisibleProperty: TReadOnlyProperty<boolean>, providedOptions: QuantumStateGraphNodeOptions ) {

    const options = optionize<QuantumStateGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      createFunctionDetailsButton: null
    }, providedOptions );

    super( options );

    this.chartTransform = new ChartTransform( {
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.QUANTUM_STATE_GRAPHS_VIEW_HEIGHT,
      modelXRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      modelYRange: options.yRange
    } );

    this.chartRectangle = new ChartRectangle( this.chartTransform, {
      fill: QBSColors.chartRectangleFillProperty,
      stroke: QBSColors.chartRectangleStrokeProperty,
      pickable: false // optimization
    } );

    const xAxisLabelNode = new RichText( QuantumBoundStatesFluent.position_nmStringProperty, {
      font: QBSConstants.AXIS_LABEL_FONT,
      maxWidth: 0.5 * this.chartRectangle.width
    } );
    xAxisLabelNode.boundsProperty.link( () => {
      xAxisLabelNode.centerTop = this.chartRectangle.centerBottom.addXY( 0, 28 );
    } );

    const xTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ALL_GRAPHS_X_TICK_SPACING, {
      edge: 'min',
      extent: 24
    } );

    const xTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ALL_GRAPHS_X_TICK_SPACING, {
      edge: 'min',
      extent: 24,
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
      yAxisLabelNode.rightCenter = this.chartRectangle.leftCenter.addXY( QBSConstants.ALL_GRAPHS_Y_AXIS_LABEL_X_OFFSET, 0 );
    } );

    this.yTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      edge: 'min'
    } );

    this.yTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( toFixed( value, options.yTickLabelDecimals ), {
        font: QBSConstants.TICK_LABEL_FONT
      } )
    } );

    this.horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.yTickSpacing,
      QBSConstants.GRID_LINE_SET_OPTIONS );

    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL,
      QBSConstants.ALL_GRAPHS_X_TICK_SPACING, QBSConstants.GRID_LINE_SET_OPTIONS );

    this.curveLayer = new Node( {
      clipArea: this.chartRectangle.getShape(),
      visibleProperty: curvesVisibleProperty
    } );

    // Parents for all non-interactive elements.
    const pickableFalseNode = new Node( {
      pickable: false, // optimization
      children: [
        xAxisLabelNode,
        xTickMarkSet,
        xTickLabelSet,
        yAxisLabelNode,
        this.yTickMarkSet,
        this.yTickLabelSet,
        this.chartRectangle,
        this.horizontalGridLines,
        verticalGridLines,
        this.curveLayer
      ]
    } );
    this.addChild( pickableFalseNode );

    // Button to open a dialog that shows the expanded function displayed by the graph.
    if ( options.createFunctionDetailsButton ) {

      const functionDetailsButton = options.createFunctionDetailsButton( options.tandem.createTandem( 'functionDetailsButton' ) );
      this.addChild( functionDetailsButton );

      // Dynamically position the button in the top-right corner of the chart rectangle.
      functionDetailsButton.boundsProperty.link( () => {
        functionDetailsButton.right = this.chartRectangle.right - 8;
        functionDetailsButton.top = this.chartRectangle.y + 8;
      } );
    }
  }

  /**
   * Gets the bounds of the chart rectangle in global coordinates.
   */
  public getChartRectangleGlobalBounds(): Bounds2 {
    return this.chartRectangle.parentToGlobalBounds( this.chartRectangle.bounds );
  }

  /**
   * Gets the range of the y-axis, in model coordinates.
   */
  public getYRange(): Range {
    return this.chartTransform.modelYRange;
  }

  /**
   * Sets the range of the y-axis, in model coordinates.
   */
  public setYRange( yRange: Range ): void {
    this.chartTransform.setModelYRange( yRange );
  }

  //TODO Delete if this method is not used.
  public setYTickSpacing( spacing: number ): void {
    this.yTickMarkSet.setSpacing( spacing );
    this.yTickLabelSet.setSpacing( spacing );
    this.horizontalGridLines.setSpacing( spacing );
  }
}
