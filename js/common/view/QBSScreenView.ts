// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSScreenView is the base class for all ScreenViews in this sim.
 *
 * All ScreenViews in this sim have the same UI components and layout, with two exceptions:
 * 1. The control panel positioned to the right of the Energy diagram is specific to each screen.
 * 2. The set of available Quantum State graphs is specific to each screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyDiagramNode from '../../common/view/EnergyDiagramNode.js';
import LegendPanel from '../../common/view/LegendPanel.js';
import MagnifierNode from '../../common/view/MagnifierNode.js';
import QuantumStateGraphControlPanel from '../../common/view/QuantumStateGraphControlPanel.js';
import ReferenceLineNode from '../../common/view/ReferenceLineNode.js';
import TimePanel from '../../common/view/TimePanel.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import QBSModel from '../model/QBSModel.js';
import AverageProbabilityDensityOfBandGraphNode from './AverageProbabilityDensityOfBandGraphNode.js';
import CurvesVisibleToggleButton from './CurvesVisibleToggleButton.js';
import ProbabilityDensityGraphNode from './ProbabilityDensityGraphNode.js';
import QuantumStateGraphNode from './QuantumStateGraphNode.js';
import WaveFunctionGraphNode from './WaveFunctionGraphNode.js';

type SelfOptions = {

  // Creates optional zoom buttons for the y-axis.
  createYAxisZoomButtonGroup?: ( tandem: Tandem ) => Node;
};

export type QBSScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class QBSScreenView extends ScreenView {

  public constructor( model: QBSModel, listboxParent: Node, energyDiagramControlPanel: Panel, providedOptions: QBSScreenViewOptions ) {

    const options = optionize<QBSScreenViewOptions, StrictOmit<SelfOptions, 'createYAxisZoomButtonGroup'>, ScreenViewOptions>()(
      {}, providedOptions );

    super( options );

    const legendPanel = new LegendPanel( options.tandem.createTandem( 'legendPanel' ) );

    const energyDiagramNode = new EnergyDiagramNode( model.energyDiagram, options.tandem.createTandem( 'energyDiagramNode' ) );

    // Create yAxisZoomButtonGroup for the Energy Diagram and make it look like a child of the Energy Diagram for PhET-iO.
    let yAxisZoomButtonGroup: Node | undefined;
    if ( options.createYAxisZoomButtonGroup ) {
      yAxisZoomButtonGroup = options.createYAxisZoomButtonGroup( energyDiagramNode.tandem.createTandem( 'yAxisZoomButtonGroup' ) );
    }

    const quantumStateGraphNodesTandem = options.tandem.createTandem( 'quantumStateGraphNodes' );
    const quantumStateGraphNodes = createQuantumStateGraphNodes( model, quantumStateGraphNodesTandem );

    // Toggle button for showing/hiding the curves displayed by the visible Quantum State Graph.
    const curvesVisibleToggleButton = new CurvesVisibleToggleButton( model.curvesVisibleProperty,
      quantumStateGraphNodesTandem.createTandem( 'curvesVisibleToggleButton' ) );
    this.addChild( curvesVisibleToggleButton );

    const toolsPanel = new ToolsPanel( model.energyDiagram.valuesVisibleProperty, model.magnifier.visibleProperty,
      model.referenceLine.visibleProperty, options.tandem.createTandem( 'toolsPanel' ) );

    const quantumStateGraphControlPanel = new QuantumStateGraphControlPanel( model.quantumStateGraphProperty,
      model.waveFunctionGraph, options.tandem.createTandem( 'quantumStateGraphControlPanel' ) );

    const timePanel = new TimePanel( model.time, options.tandem.createTandem( 'timePanel' ) );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Layout is relative to the Energy diagram.
    energyDiagramNode.left = this.layoutBounds.left + QBSConstants.SCREEN_VIEW_X_MARGIN;
    energyDiagramNode.top = this.layoutBounds.top + QBSConstants.SCREEN_VIEW_X_MARGIN + legendPanel.height + 3;
    const energyDiagramRectangleBounds = this.globalToParentBounds( energyDiagramNode.getChartRectangleGlobalBounds() );

    // Constrain the Energy Diagram control panel to the height of the Energy diagram.
    energyDiagramControlPanel.maxHeight = energyDiagramRectangleBounds.height;

    // All graphs occupy the same position below the Energy diagram. Only one of them is visible at a time.
    quantumStateGraphNodes.forEach( graphNode => {
      graphNode.x = energyDiagramNode.x;
      graphNode.y = energyDiagramRectangleBounds.bottom + 5;
    } );

    affirm( quantumStateGraphNodes.length > 0, 'At least one Quantum State graph is required.' );
    const quantumStateGraphRectangleBounds = this.globalToParentBounds( quantumStateGraphNodes[ 0 ].getChartRectangleGlobalBounds() );

    // Static layout
    energyDiagramControlPanel.left = energyDiagramRectangleBounds.right + 10;
    energyDiagramControlPanel.top = energyDiagramRectangleBounds.top;
    quantumStateGraphControlPanel.left = quantumStateGraphRectangleBounds.right + 10;
    quantumStateGraphControlPanel.top = quantumStateGraphRectangleBounds.top;
    curvesVisibleToggleButton.left = quantumStateGraphRectangleBounds.left + 8;
    curvesVisibleToggleButton.top = quantumStateGraphRectangleBounds.top + 8;
    toolsPanel.left = quantumStateGraphRectangleBounds.left;
    toolsPanel.bottom = this.layoutBounds.bottom - QBSConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = this.layoutBounds.maxX - QBSConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - QBSConstants.SCREEN_VIEW_Y_MARGIN;
    if ( yAxisZoomButtonGroup ) {
      yAxisZoomButtonGroup.right = energyDiagramRectangleBounds.left - 20;
      yAxisZoomButtonGroup.bottom = energyDiagramRectangleBounds.bottom;
    }

    // Dynamic Layout
    legendPanel.boundsProperty.link( () => {
      legendPanel.left = energyDiagramRectangleBounds.left;
      legendPanel.bottom = energyDiagramRectangleBounds.top - 3;
    } );
    timePanel.boundsProperty.link( () => {
      timePanel.right = energyDiagramRectangleBounds.right;
      timePanel.bottom = this.layoutBounds.bottom - QBSConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    const magnifierNode = new MagnifierNode( model.magnifier, energyDiagramNode.chartTransform,
      options.tandem.createTandem( 'magnifierNode' ) );

    // Wrap magnifierNode in a Node so that the probe drags in the same coordinate frame as the graphs.
    // Caution! Positioning is very specific to account for the lineWidth of the stroke around the ChartRectangles.
    const magnifierWrapper = new Node( {
      children: [ magnifierNode ],
      x: energyDiagramNode.x,
      y: energyDiagramNode.y
    } );

    const referenceLineNode = new ReferenceLineNode( model.referenceLine, energyDiagramNode.chartTransform, {
      // -2 so that line is inside stroke of chartRectangles
      lineLength: Math.abs( energyDiagramRectangleBounds.top - quantumStateGraphRectangleBounds.bottom ) - 2,
      tandem: options.tandem.createTandem( 'referenceLineNode' )
    } );

    // Wrap referenceLineNode in a Node so that it drags in the same coordinate frame as the graphs.
    // Caution! Positioning is very specific to account for the lineWidth of the stroke around the ChartRectangles.
    const referenceLineWrapper = new Node( {
      children: [ referenceLineNode ],
      x: energyDiagramNode.x,
      y: quantumStateGraphRectangleBounds.y + QBSConstants.ALL_GRAPHS_VIEW_HEIGHT
    } );

    // Rendering order, from back to front
    const screenViewChildren = [
      legendPanel,
      energyDiagramNode,
      ...quantumStateGraphNodes,
      curvesVisibleToggleButton,
      energyDiagramControlPanel,
      quantumStateGraphControlPanel,
      toolsPanel,
      referenceLineWrapper,
      magnifierWrapper,
      timePanel,
      resetAllButton,
      listboxParent // on top of everything else
    ];
    if ( yAxisZoomButtonGroup ) {
      screenViewChildren.splice( screenViewChildren.indexOf( energyDiagramNode ), 0, yAxisZoomButtonGroup );
    }

    const screenViewRootNode = new Node( {
      children: screenViewChildren
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    const playAreaPDOMOrder = [
      energyDiagramControlPanel,
      energyDiagramNode,
      magnifierNode,
      ...quantumStateGraphNodes,
      curvesVisibleToggleButton,
      quantumStateGraphControlPanel,
      referenceLineNode
    ];
    if ( yAxisZoomButtonGroup ) {
      playAreaPDOMOrder.splice( playAreaPDOMOrder.indexOf( energyDiagramNode ), 0, yAxisZoomButtonGroup );
    }
    this.pdomPlayAreaNode.pdomOrder = playAreaPDOMOrder;

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      toolsPanel,
      timePanel,
      resetAllButton
    ];
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO Implement reset
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    super.step( dt );
    //TODO Implement step
  }
}

/**
 * Creates a set of QuantumStateGraphNodes for the specified model.
 * Order is not important because only one graph Node is visible at a time.
 */
function createQuantumStateGraphNodes( model: QBSModel, parentTandem: Tandem ): QuantumStateGraphNode[] {

  const graphNodes: QuantumStateGraphNode[] = [];

  if ( model.averageProbabilityDensityOfBandGraph ) {
    const averageProbabilityDensityOfBandGraphNode = new AverageProbabilityDensityOfBandGraphNode( model,
      parentTandem.createTandem( 'averageProbabilityDensityOfBandGraphNode' ) );
    graphNodes.push( averageProbabilityDensityOfBandGraphNode );
  }

  if ( model.probabilityDensityGraph ) {
    const probabilityDensityGraphNode = new ProbabilityDensityGraphNode( model, parentTandem.createTandem( 'probabilityDensityGraphNode' ) );
    graphNodes.push( probabilityDensityGraphNode );
  }

  if ( model.waveFunctionGraph ) {
    const waveFunctionGraphNode = new WaveFunctionGraphNode( model, parentTandem.createTandem( 'waveFunctionGraphNode' ) );
    graphNodes.push( waveFunctionGraphNode );
  }

  return graphNodes;
}
