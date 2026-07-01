// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramNode is the view for the 'Energy' diagram. The y-axis range and tick spacing are mutable, while all
 * other properties are fixed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import EnergyDiagramDescriber from './description/EnergyDiagramDescriber.js';
import EnergyDiagramPlotsNode from './EnergyDiagramPlotsNode.js';
import EnergyLevelDisplay from './EnergyLevelDisplay.js';
import EnergyLevelHighlightListener, { EnergyLevelHighlightListenerOptions } from './EnergyLevelHighlightListener.js';
import PotentialHandlesLayer from './handles/PotentialHandlesLayer.js';
import MarkersLayer from './markers/MarkersLayer.js';

type SelfOptions = EmptySelfOptions & PickOptional<EnergyLevelHighlightListenerOptions, 'hasEnergyLevelSelection'>;

export type EnergyDiagramNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

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
  public constructor( model: QBSModel, describer: EnergyDiagramDescriber, providedOptions: EnergyDiagramNodeOptions ) {

    const options = optionize<EnergyDiagramNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      hasEnergyLevelSelection: true,

      // NodeOptions
      isDisposable: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleHeadingStringProperty,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

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

    const energyDiagramPlotsNode = new EnergyDiagramPlotsNode( model, this.chartTransform );

    model.highlightedEnergyLevelIndexProperty.lazyLink( highlightedEnergyLevel => {

      // Change the cursor to a pointer when an energy level is highlighted.
      this.chartRectangle.cursor = ( highlightedEnergyLevel === null ) ? 'default' : 'pointer';
    } );

    // Highlighting and optional selection of energy levels.
    this.chartRectangle.addInputListener( new EnergyLevelHighlightListener( model, this.chartRectangle, this.chartTransform, {
      hasEnergyLevelSelection: options.hasEnergyLevelSelection,
      tandem: options.tandem.createTandem( 'energyLevelHighlightListener' )
    } ) );

    const potentials = model.potentialProperty.validValues!;
    affirm( potentials, 'potentialProperty.validValues is required.' );

    const handlesLayer = new PotentialHandlesLayer( potentials, model.potentialProperty, this.chartTransform,
      model.energyDiagram.valuesVisibleProperty, model.time, options.tandem.createTandem( 'handlesLayer' ) );

    const markersLayer = new MarkersLayer( potentials, model.potentialProperty, this.chartTransform,
      options.tandem.createTandem( 'markersLayer' ) );

    // Displays the selected energy level and its corresponding energy value.
    const selectedEnergyLevelDisplay = new EnergyLevelDisplay( model, model.selectedEnergyLevelIndexProperty, this.chartTransform, {
      left: this.chartRectangle.left + 10,
      tandem: options.tandem.createTandem( 'selectedEnergyLevelDisplay' )
    } );

    // Displays the highlighted energy level and its corresponding energy value.
    const highlightedEnergyLevelDisplay = new EnergyLevelDisplay( model, model.highlightedEnergyLevelIndexProperty, this.chartTransform, {
      left: selectedEnergyLevelDisplay.left,
      tandem: options.tandem.createTandem( 'highlightedEnergyLevelDisplay' )
    } );

    // Parent for elements that are clipped to the chartRectangle.
    const clippedLayer = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [
        markersLayer,
        energyDiagramPlotsNode
      ]
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
      highlightedEnergyLevelDisplay,
      handlesLayer
    ];

    this.setAccessibleTemplate( describer.getAccessibleTemplate() );
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
