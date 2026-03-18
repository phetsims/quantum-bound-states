// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramNode is the view for the 'Energy' diagram. The y-axis range and tick spacing are mutable, while all
 * other properties are fixed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import EnergyDiagram from '../model/EnergyDiagram.js';
import FundamentalConstants from '../model/solver/FundamentalConstants.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class EnergyDiagramNode extends Node {

  // bamboo model-view transform
  public readonly chartTransform: ChartTransform;

  // Outer rectangle of the chart
  private readonly chartRectangle: ChartRectangle;

  // y-axis decorations that are mutable
  private readonly yTickMarkSet: TickMarkSet;
  private readonly yTickLabelSet: TickLabelSet;
  private readonly horizontalGridLines: GridLineSet;

  public constructor( energyDiagram: EnergyDiagram, tandem: Tandem ) {

    super( {
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleParagraphStringProperty,
      tandem: tandem
    } );

    this.chartTransform = new ChartTransform( {
      viewWidth: QBSConstants.ENERGY_DIAGRAM_VIEW_WIDTH,
      viewHeight: QBSConstants.ENERGY_DIAGRAM_VIEW_HEIGHT,
      modelXRange: QBSConstants.ENERGY_DIAGRAM_X_RANGE,
      modelYRange: QBSConstants.ENERGY_DIAGRAM_Y_RANGE
    } );

    this.chartRectangle = new ChartRectangle( this.chartTransform, {
      fill: QBSColors.graphRectangleFillProperty,
      stroke: QBSColors.graphRectangleStrokeProperty,
      pickable: false // optimization
    } );

    this.yTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, QBSConstants.ENERGY_DIAGRAM_Y_TICK_SPACING, {
      edge: 'min'
    } );

    this.yTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.VERTICAL, QBSConstants.ENERGY_DIAGRAM_Y_TICK_SPACING, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( toFixed( value, 0 ), {
        font: QBSConstants.TICK_LABEL_FONT
      } )
    } );

    const yAxisLabelNode = new RichText( QuantumBoundStatesFluent.energy_eVStringProperty, {
      font: QBSConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: 0.5 * this.chartRectangle.height
    } );
    yAxisLabelNode.boundsProperty.link( () => {
      yAxisLabelNode.rightCenter = this.chartRectangle.leftCenter.addXY( QBSConstants.ENERGY_DIAGRAM_Y_AXIS_LABEL_OFFSET, 0 );
    } );

    this.horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, QBSConstants.ENERGY_DIAGRAM_Y_TICK_SPACING, {
      lineWidth: 1,
      lineDash: [ 4, 4 ],
      stroke: QBSColors.gridLinesStrokeProperty
    } );

    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, QBSConstants.ENERGY_DIAGRAM_X_TICK_SPACING, {
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
        this.yTickMarkSet,
        this.yTickLabelSet,
        yAxisLabelNode,
        this.chartRectangle,
        this.horizontalGridLines,
        verticalGridLines,
        xAxis
      ]
    } );

    // Plots the shape of the selected potential.
    const potentialPlot = new LinePlot( this.chartTransform, energyDiagram.potentialPointsProperty.value, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 3
    } );
    //TODO Reuse points, use Emitter to call energyPlot.update
    energyDiagram.potentialPointsProperty.lazyLink( points => potentialPlot.setDataSet( points ) );

    const eignevaluesDataSet: Array<Vector2 | null> = [];
    energyDiagram.eigenvaluesProperty.value.forEach( eigenValue => {

      // Draw a horizontal line from xMin to xMax at the eigenValue.
      eignevaluesDataSet.push( new Vector2( this.chartTransform.modelXRange.min, eigenValue * FundamentalConstants.JOULES_TO_EV ) );
      eignevaluesDataSet.push( new Vector2( this.chartTransform.modelXRange.max, eigenValue * FundamentalConstants.JOULES_TO_EV ) );

      // Move to the next line.
      eignevaluesDataSet.push( null );
    } );

    const eigenvaluesPlot = new LinePlot( this.chartTransform, eignevaluesDataSet, {
      stroke: QBSColors.totalEnergyColorProperty,
      lineWidth: 2
    } );

    const curveLayer = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ eigenvaluesPlot, potentialPlot ]
    } );

    this.children = [ pickableFalseNode, curveLayer ];
  }

  public setYRange( yRange: Range ): void {
    this.chartTransform.setModelYRange( yRange );
  }

  //TODO Delete if this method is not used.
  public setYTickSpacing( spacing: number ): void {
    this.yTickMarkSet.setSpacing( spacing );
    this.yTickLabelSet.setSpacing( spacing );
    this.horizontalGridLines.setSpacing( spacing );
  }

  /**
   * Gets the bounds of the chart rectangle in global coordinates.
   */
  public getChartRectangleGlobalBounds(): Bounds2 {
    return this.chartRectangle.localToGlobalBounds( this.chartRectangle.localBounds );
  }
}

quantumBoundStates.register( 'EnergyDiagramNode', EnergyDiagramNode );