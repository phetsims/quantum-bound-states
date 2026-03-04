// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyDiagramNode from '../../common/view/EnergyDiagramNode.js';
import LegendPanel from '../../common/view/LegendPanel.js';
import MagnifierNode from '../../common/view/MagnifierNode.js';
import PotentialTypeComboBox from '../../common/view/PotentialTypeComboBox.js';
import { ProbabilityDensityGraphNode } from '../../common/view/ProbabilityDensityGraphNode.js';
import ReferenceLineNode from '../../common/view/ReferenceLineNode.js';
import TimePanel from '../../common/view/TimePanel.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import WaveFunctionGraphNode from '../../common/view/WaveFunctionGraphNode.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import OneWellModel from '../model/OneWellModel.js';
import OneWellControlPanel from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends ScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    super( {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );

    const listboxParent = new Node();

    const potentialTypeComboBox = new PotentialTypeComboBox( model.potentialProperty, listboxParent, tandem.createTandem( 'potentialTypeComboBox' ) );

    const legendPanel = new LegendPanel( tandem.createTandem( 'legendPanel' ) );

    const energyDiagramNode = new EnergyDiagramNode( tandem.createTandem( 'energyDiagramNode' ) );

    const probabilityDensityGraphNode = new ProbabilityDensityGraphNode( model, {
      visibleProperty: new DerivedProperty( [ model.selectedGraphProperty ], selectedGraph => selectedGraph === model.probabilityDensityGraph ),
      tandem: tandem.createTandem( 'probabilityDensityGraphNode' )
    } );

    const waveFunctionGraphNode = new WaveFunctionGraphNode( model, {
      visibleProperty: new DerivedProperty( [ model.selectedGraphProperty ], selectedGraph => selectedGraph === model.waveFunctionGraph ),
      tandem: tandem.createTandem( 'waveFunctionGraphNode' )
    } );

    const toolsPanel = new ToolsPanel( model.magnifier.visibleProperty,
      model.referenceLine.visibleProperty, tandem.createTandem( 'toolsPanel' ) );

    const controlPanel = new OneWellControlPanel( model, tandem.createTandem( 'controlPanel' ) );

    const timePanel = new TimePanel( model.time, tandem.createTandem( 'timePanel' ) );

    // Wrap magnifierNode in a Node so that the probe drags in the same coordinate frame as the graphs.
    const magnifierNode = new MagnifierNode( model.magnifier, tandem.createTandem( 'magnifierNode' ) );
    const magnifierWrapper = new Node( {
      children: [ magnifierNode ]
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Layout is relative to the Energy diagram and the graph below it.
    energyDiagramNode.left = this.layoutBounds.left + QBSConstants.SCREEN_VIEW_X_MARGIN;
    energyDiagramNode.top = this.layoutBounds.top + QBSConstants.SCREEN_VIEW_X_MARGIN + potentialTypeComboBox.height + 3;
    const energyDiagramChartRectangleBounds = this.globalToLocalBounds( energyDiagramNode.getChartRectangleGlobalBounds() );
    probabilityDensityGraphNode.x = energyDiagramChartRectangleBounds.left;
    probabilityDensityGraphNode.y = energyDiagramChartRectangleBounds.bottom + 5;

    // Static layout
    waveFunctionGraphNode.translation = probabilityDensityGraphNode.translation;
    controlPanel.left = energyDiagramChartRectangleBounds.right + 10;
    controlPanel.top = energyDiagramChartRectangleBounds.top;
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
      lineBottom: probabilityDensityGraphNode.bottom - QBSConstants.HANDLE_DIAMETER / 2,
      tandem: tandem.createTandem( 'referenceLineNode' )
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
        probabilityDensityGraphNode,
        waveFunctionGraphNode,
        controlPanel,
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
      probabilityDensityGraphNode,
      waveFunctionGraphNode,
      controlPanel,
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
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

quantumBoundStates.register( 'OneWellScreenView', OneWellScreenView );