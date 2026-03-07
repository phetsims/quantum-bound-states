// Copyright 2026, University of Colorado Boulder

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
import PotentialTypeComboBox from '../../common/view/PotentialTypeComboBox.js';
import QuantumStateGraphControlPanel from '../../common/view/QuantumStateGraphControlPanel.js';
import ReferenceLineNode from '../../common/view/ReferenceLineNode.js';
import TimePanel from '../../common/view/TimePanel.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import WaveFunctionGraphNode from '../../common/view/WaveFunctionGraphNode.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSModel from '../model/QBSModel.js';
import AverageProbabilityDensityOfBandGraphNode from './AverageProbabilityDensityOfBandGraphNode.js';
import ProbabilityDensityGraphNode from './ProbabilityDensityGraphNode.js';
import QuantumStateGraphNode from './QuantumStateGraphNode.js';

type SelfOptions = {
  listboxParent?: Node;
};

export type QBSScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class QBSScreenView extends ScreenView {

  public constructor( model: QBSModel, energyDiagramControlPanel: Panel, providedOptions: QBSScreenViewOptions ) {

    const options = optionize<QBSScreenViewOptions, StrictOmit<SelfOptions, 'listboxParent'>, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    const listboxParent = options.listboxParent || new Node();

    const potentialTypeComboBox = new PotentialTypeComboBox( model.potentialProperty, listboxParent,
      options.tandem.createTandem( 'potentialTypeComboBox' ) );

    const legendPanel = new LegendPanel( options.tandem.createTandem( 'legendPanel' ) );

    const energyDiagramNode = new EnergyDiagramNode( options.tandem.createTandem( 'energyDiagramNode' ) );

    const graphNodes = createGraphNodes( model, options.tandem.createTandem( 'graphNodes' ) );

    const toolsPanel = new ToolsPanel( model.magnifier.visibleProperty,
      model.referenceLine.visibleProperty, options.tandem.createTandem( 'toolsPanel' ) );

    const quantumStateGraphControlPanel = new QuantumStateGraphControlPanel( model.selectedGraphProperty,
      model.waveFunctionGraph, options.tandem.createTandem( 'quantumStateGraphControlPanel' ) );

    const timePanel = new TimePanel( model.time, options.tandem.createTandem( 'timePanel' ) );

    // Wrap magnifierNode in a Node so that the probe drags in the same coordinate frame as the graphs.
    const magnifierNode = new MagnifierNode( model.magnifier, options.tandem.createTandem( 'magnifierNode' ) );
    const magnifierWrapper = new Node( {
      children: [ magnifierNode ]
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Layout is relative to the Energy diagram.
    energyDiagramNode.left = this.layoutBounds.left + QBSConstants.SCREEN_VIEW_X_MARGIN;
    energyDiagramNode.top = this.layoutBounds.top + QBSConstants.SCREEN_VIEW_X_MARGIN + potentialTypeComboBox.height + 3;
    const energyDiagramChartRectangleBounds = this.globalToLocalBounds( energyDiagramNode.getChartRectangleGlobalBounds() );

    // All graphs occupy the same position below the Energy diagram. Only one of them is visible at a time.
    graphNodes.forEach( graphNode => {
      graphNode.x = energyDiagramChartRectangleBounds.left;
      graphNode.y = energyDiagramChartRectangleBounds.bottom + 5;
    } );

    affirm( graphNodes.length > 0, 'At least one Quantum State graph is required.' );
    const graphChartRectangleBounds = this.globalToLocalBounds( graphNodes[ 0 ].getChartRectangleGlobalBounds() );

    // Static layout
    energyDiagramControlPanel.left = energyDiagramChartRectangleBounds.right + 10;
    energyDiagramControlPanel.top = energyDiagramChartRectangleBounds.top;
    quantumStateGraphControlPanel.left = energyDiagramChartRectangleBounds.right + 10;
    quantumStateGraphControlPanel.top = graphChartRectangleBounds.top;
    toolsPanel.left = this.layoutBounds.left + ( 2 * QBSConstants.SCREEN_VIEW_X_MARGIN );
    toolsPanel.bottom = this.layoutBounds.bottom - QBSConstants.SCREEN_VIEW_Y_MARGIN;
    magnifierWrapper.right = energyDiagramChartRectangleBounds.x + QBSConstants.ALL_GRAPHS_VIEW_WIDTH - 5;
    magnifierWrapper.y = energyDiagramChartRectangleBounds.y + 5;
    resetAllButton.right = this.layoutBounds.maxX - QBSConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - QBSConstants.SCREEN_VIEW_Y_MARGIN;

    // Dynamic Layout
    potentialTypeComboBox.boundsProperty.link( () => {
      potentialTypeComboBox.left = energyDiagramChartRectangleBounds.left;
      potentialTypeComboBox.bottom = energyDiagramChartRectangleBounds.top - 3;
    } );
    legendPanel.boundsProperty.link( () => {
      legendPanel.right = energyDiagramChartRectangleBounds.right;
      legendPanel.bottom = energyDiagramChartRectangleBounds.top - 3;
    } );
    timePanel.boundsProperty.link( () => {
      timePanel.right = energyDiagramChartRectangleBounds.right;
      timePanel.bottom = this.layoutBounds.bottom - QBSConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    const referenceLineNode = new ReferenceLineNode( model.referenceLine, energyDiagramNode.chartTransform, {
      lineTop: energyDiagramChartRectangleBounds.y,
      lineBottom: graphChartRectangleBounds.bottom + 35,
      tandem: options.tandem.createTandem( 'referenceLineNode' )
    } );

    // Wrap referenceLineNode in a Node so that it drags in the same coordinate frame as the graphs.
    const referenceLineWrapper = new Node( {
      children: [ referenceLineNode ],
      x: energyDiagramChartRectangleBounds.x,
      y: 0
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        potentialTypeComboBox,
        legendPanel,
        energyDiagramNode,
        ...graphNodes,
        energyDiagramControlPanel,
        quantumStateGraphControlPanel,
        toolsPanel,
        magnifierWrapper,
        referenceLineWrapper,
        timePanel,
        resetAllButton,
        listboxParent // on top of everything else
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      potentialTypeComboBox,
      energyDiagramNode,
      ...graphNodes,
      energyDiagramControlPanel,
      quantumStateGraphControlPanel,
      magnifierNode,
      referenceLineNode
    ];

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
 * Creates a set of graph Nodes for the specified model. Order is not important because only one graph Node is visible at a time.
 */
function createGraphNodes( model: QBSModel, parentTandem: Tandem ): QuantumStateGraphNode[] {

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

quantumBoundStates.register( 'QBSScreenView', QBSScreenView );