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

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PDOMSectionNode from '../../../../scenery-phet/js/accessibility/PDOMSectionNode.js';
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
import CurvesVisibleToggleButton from './CurvesVisibleToggleButton.js';
import ConfigurePotentialButton from './debug/ConfigurePotentialButton.js';
import ProbabilityDensityGraphNode from './ProbabilityDensityGraphNode.js';
import QuantumStateGraphNode from './QuantumStateGraphNode.js';
import WaveFunctionGraphNode from './WaveFunctionGraphNode.js';

type SelfOptions = {

  // Creates a button for showing the complete Probability Density equation.
  createProbabilityDensityDetailsButton?: ( ( tandem: Tandem ) => Node ) | null;

  // Creates a button for showing the complete Wave Function equation.
  createWaveFunctionDetailsButton?: ( ( tandem: Tandem ) => Node ) | null;
};

export type QBSScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class QBSScreenView extends ScreenView {

  protected readonly screenViewRootNode: Node;
  protected readonly energyDiagramNode: Node;
  protected readonly energyDiagramRectangleBounds: Bounds2;

  public constructor( model: QBSModel, listboxParent: Node, energyDiagramControlPanel: Panel, providedOptions: QBSScreenViewOptions ) {

    const options = optionize<QBSScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // SelfOptions
      createProbabilityDensityDetailsButton: null,
      createWaveFunctionDetailsButton: null
    }, providedOptions );

    super( options );

    const legendPanel = new LegendPanel( options.tandem.createTandem( 'legendPanel' ) );

    const energyDiagramNode = new EnergyDiagramNode( model, options.tandem.createTandem( 'energyDiagramNode' ) );
    this.energyDiagramNode = energyDiagramNode;

    const quantumStateGraphNodesTandem = options.tandem.createTandem( 'quantumStateGraphNodes' );
    const quantumStateGraphNodes: QuantumStateGraphNode[] = [];

    const probabilityDensityGraphNode = new ProbabilityDensityGraphNode( model.probabilityDensityGraph,
      model.selectedGraphProperty, model.selectedEnergyLevelProperty, model.curvesVisibleProperty, {
        createEquationDetailsButton: options.createProbabilityDensityDetailsButton,
        tandem: quantumStateGraphNodesTandem.createTandem( 'probabilityDensityGraphNode' )
      } );
    quantumStateGraphNodes.push( probabilityDensityGraphNode );

    const waveFunctionGraphNode = new WaveFunctionGraphNode( model.waveFunctionGraph,
      model.selectedGraphProperty, model.selectedEnergyLevelProperty, model.curvesVisibleProperty, {
        createEquationDetailsButton: options.createWaveFunctionDetailsButton,
        tandem: quantumStateGraphNodesTandem.createTandem( 'waveFunctionGraphNode' )
      } );
    quantumStateGraphNodes.push( waveFunctionGraphNode );

    // Toggle button for showing/hiding the curves displayed by the visible Quantum State Graph.
    const curvesVisibleToggleButton = new CurvesVisibleToggleButton( model.curvesVisibleProperty,
      quantumStateGraphNodesTandem.createTandem( 'curvesVisibleToggleButton' ) );
    this.addChild( curvesVisibleToggleButton );

    const toolsPanel = new ToolsPanel( model.energyDiagram.valuesVisibleProperty, model.magnifier.visibleProperty,
      model.referenceLine.visibleProperty, options.tandem.createTandem( 'toolsPanel' ) );

    const quantumStateGraphControlPanel = new QuantumStateGraphControlPanel( model.selectedGraphProperty,
      model.probabilityDensityGraph, model.waveFunctionGraph, options.tandem.createTandem( 'quantumStateGraphControlPanel' ) );

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
    this.energyDiagramRectangleBounds = energyDiagramRectangleBounds;

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
      y: quantumStateGraphRectangleBounds.y + QBSConstants.QUANTUM_STATE_GRAPHS_VIEW_HEIGHT
    } );

    // Rendering order, from back to front
    this.screenViewRootNode = new Node( {
      children: [
        legendPanel,
        energyDiagramNode,
        probabilityDensityGraphNode,
        waveFunctionGraphNode,
        curvesVisibleToggleButton,
        energyDiagramControlPanel,
        quantumStateGraphControlPanel,
        toolsPanel,
        referenceLineWrapper,
        magnifierWrapper,
        timePanel,
        resetAllButton,
        listboxParent // on top of everything else
      ]
    } );
    this.addChild( this.screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      energyDiagramControlPanel,
      energyDiagramNode,
      magnifierNode,
      probabilityDensityGraphNode,
      waveFunctionGraphNode,
      curvesVisibleToggleButton,
      quantumStateGraphControlPanel,
      referenceLineNode
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      toolsPanel,
      timePanel,
      resetAllButton
    ];

    // Changes to these Properties will interrupt all interactions.
    Multilink.multilink( [ model.potentialProperty ], () => this.interruptSubtreeInput() );

    // Press this button to open a dialog for configuring the selected potential.
    //TODO Hide this button behind phet.chipper.queryParameters.dev
    const configurePotentialButton = new ConfigurePotentialButton( model.potentialProperty, model.time );
    this.screenViewRootNode.addChild( configurePotentialButton );
    configurePotentialButton.right = energyDiagramControlPanel.right;
    configurePotentialButton.bottom = energyDiagramControlPanel.top - 5;
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

  //TODO https://github.com/phetsims/scenery-phet/issues/979 Consider moving these methods to PDOMSectionNode.
  /**
   * Inserts node1 before node2 in the pdomOrder of a specific PDOM section.
   * Example: this.pdomOrderInsertBefore( this.pdomPlayAreaNode, someNewNode, this.someExistingNode );
   */
  protected pdomOrderInsertBefore( pdomSection: PDOMSectionNode, node1: Node, node2: Node ): void {
    const pdomOrder = pdomSection.getPDOMOrder();
    affirm( pdomOrder, 'expected pdomOrder to be defined' );
    const index = pdomOrder.indexOf( node2 );
    affirm( index !== -1, 'expected node2 to be in pdomOrder' );
    pdomOrder.splice( index + 1, 0, node1 );
    pdomSection.setPDOMOrder( pdomOrder );
  }

  /**
   * Inserts node2 after node1 in the pdomOrder of a specific PDOM section.
   * Example: this.pdomOrderInsertAfter( this.pdomPlayAreaNode, this.someExistingNode, someNewNode );
   */
  protected pdomOrderInsertAfter( pdomSection: PDOMSectionNode, node1: Node, node2: Node ): void {
    const pdomOrder = pdomSection.getPDOMOrder();
    affirm( pdomOrder, 'expected pdomOrder to be defined' );
    const index = pdomOrder.indexOf( node1 );
    affirm( index !== -1, 'expected node1 to be in pdomOrder' );
    pdomOrder.splice( index + 1, 0, node2 );
    pdomSection.setPDOMOrder( pdomOrder );
  }
}