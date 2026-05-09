// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramNode is the view for the 'Energy' diagram. The y-axis range and tick spacing are mutable, while all
 * other properties are fixed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import EnergyLevelDisplay from './EnergyLevelDisplay.js';
import EnergyLevelSelectionListener from './EnergyLevelSelectionListener.js';
import EnergyLevelsPlot from './EnergyLevelsPlot.js';
import YLinePlot from './YLinePlot.js';

export default class EnergyDiagramNode extends Node {

  // bamboo model-view transform
  public readonly chartTransform: ChartTransform;

  // Outer rectangle of the chart
  private readonly chartRectangle: ChartRectangle;

  // y-axis decorations that are mutable
  private readonly yTickMarkSet: TickMarkSet;
  private readonly yTickLabelSet: TickLabelSet;
  private readonly horizontalGridLines: GridLineSet;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleParagraphStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true
    } );

    this.chartTransform = new ChartTransform( {
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.ENERGY_DIAGRAM_VIEW_HEIGHT,
      modelXRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      modelYRange: model.energyDiagram.yRangeProperty.value
    } );

    this.chartRectangle = new ChartRectangle( this.chartTransform, {
      fill: QBSColors.chartRectangleFillProperty,
      stroke: QBSColors.chartRectangleStrokeProperty
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
      yAxisLabelNode.rightCenter = this.chartRectangle.leftCenter.addXY( QBSConstants.ALL_GRAPHS_Y_AXIS_LABEL_X_OFFSET, 0 );
    } );

    this.horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL,
      QBSConstants.ENERGY_DIAGRAM_Y_TICK_SPACING, QBSConstants.GRID_LINE_SET_OPTIONS );

    model.energyDiagram.yRangeProperty.lazyLink( yRange => this.chartTransform.setModelYRange( yRange ) );

    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL,
      QBSConstants.ALL_GRAPHS_X_TICK_SPACING, QBSConstants.GRID_LINE_SET_OPTIONS );

    // Plots the shape of the selected potential.
    const potentialPlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates, model.boundStateResultProperty.value.potentials, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 3
    } );
    model.boundStateResultProperty.lazyLink( boundStateResult => potentialPlot.setYCoordinates( boundStateResult.potentials ) );

    // Plots the energy levels of the selected potential.
    const energyLevelsPlot = new EnergyLevelsPlot( this.chartTransform, model.boundStateResultProperty.value.energies, {
      stroke: QBSColors.totalEnergyColorProperty,
      lineWidth: 2
    } );
    model.boundStateResultProperty.lazyLink( boundStateResult => energyLevelsPlot.setEnergies( boundStateResult.energies ) );

    // Plots the selected energy level.
    const selectedEnergyLevelPlot = new EnergyLevelsPlot( this.chartTransform, [ model.getEnergyAtEnergyLevel( model.selectedEnergyLevelProperty.value ) ], {
      stroke: QBSColors.selectedEnergyLevelColorProperty,
      lineWidth: 3
    } );
    Multilink.multilink( [ model.selectedEnergyLevelProperty, model.boundStateResultProperty ],
      ( selectedEnergyLevel, boundStateResult ) => selectedEnergyLevelPlot.setEnergies( [ model.getEnergyAtEnergyLevel( selectedEnergyLevel ) ] ) );

    // Plots the highlighted energy level.
    const highlightedEnergyLevelPlot = new EnergyLevelsPlot( this.chartTransform, [], {
      stroke: QBSColors.highlightedEnergyLevelColorProperty,
      lineWidth: 3
    } );
    model.highlightedEnergyLevelProperty.lazyLink( highlightedEnergyLevel => {

      // Change the cursor to a pointer when an energy level is highlighted.
      this.chartRectangle.cursor = ( highlightedEnergyLevel === null ) ? 'default' : 'pointer';

      // Update the plot to display the highlighted energy level.
      highlightedEnergyLevelPlot.setEnergies( ( highlightedEnergyLevel === null ) ? [] :
        [ model.getEnergyAtEnergyLevel( highlightedEnergyLevel ) ] );
    } );

    // Highlighting and selection of energy levels.
    this.chartRectangle.addInputListener( new EnergyLevelSelectionListener( model, this.chartRectangle,
      this.chartTransform, tandem.createTandem( 'energyLevelSelectionListener' ) ) );

    // Parent for elements that are clipped to the chartRectangle.
    const clippedLayer = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [
        energyLevelsPlot,
        highlightedEnergyLevelPlot,
        selectedEnergyLevelPlot,
        potentialPlot
      ]
    } );

    // Displays the selected energy level and its corresponding energy value.
    const selectedEnergyLevelDisplay = new EnergyLevelDisplay( model, model.selectedEnergyLevelProperty, this.chartTransform, {
      left: this.chartRectangle.left + 10,
      tandem: tandem.createTandem( 'selectedEnergyLevelDisplay' )
    } );

    // Displays the highlighted energy level and its corresponding energy value.
    const highlightedEnergyLevelDisplay = new EnergyLevelDisplay( model, model.highlightedEnergyLevelProperty, this.chartTransform, {
      left: selectedEnergyLevelDisplay.left,
      tandem: tandem.createTandem( 'highlightedEnergyLevelDisplay' )
    } );

    this.children = [
      this.yTickMarkSet,
      this.yTickLabelSet,
      yAxisLabelNode,
      this.chartRectangle,
      this.horizontalGridLines,
      verticalGridLines,
      clippedLayer,
      selectedEnergyLevelDisplay,
      highlightedEnergyLevelDisplay
    ];
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
    return this.chartRectangle.parentToGlobalBounds( this.chartRectangle.bounds );
  }
}
