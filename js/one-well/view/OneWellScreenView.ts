// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyGraphNode from '../../common/view/EnergyGraphNode.js';
import LegendNode from '../../common/view/LegendNode.js';
import ProbabilityDensityGraphNode from '../../common/view/ProbabilityDensityGraphNode.js';
import ReferenceLineNode from '../../common/view/ReferenceLineNode.js';
import ToolsCheckboxGroup from '../../common/view/ToolsCheckboxGroup.js';
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

    const legendNode = new LegendNode( tandem.createTandem( 'legendNode' ) );

    const energyGraphNode = new EnergyGraphNode( tandem.createTandem( 'energyGraphNode' ) );

    const probabilityDensityGraphNode = new ProbabilityDensityGraphNode( tandem.createTandem( 'probabilityDensityGraphNode' ) );

    const toolsCheckboxGroup = new ToolsCheckboxGroup( model.magnifierTool.visibleProperty,
      model.referenceLine.visibleProperty, tandem.createTandem( 'toolsCheckboxGroup' ) );

    const controlPanel = new OneWellControlPanel( model, tandem.createTandem( 'controlPanel' ) );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Layout
    energyGraphNode.left = this.layoutBounds.left + QBSConstants.SCREEN_VIEW_X_MARGIN;
    legendNode.right = energyGraphNode.right;
    legendNode.top = this.layoutBounds.top + QBSConstants.SCREEN_VIEW_Y_MARGIN;
    energyGraphNode.top = legendNode.bottom + 3;
    probabilityDensityGraphNode.left = energyGraphNode.left;
    probabilityDensityGraphNode.top = energyGraphNode.bottom + 3;
    controlPanel.right = this.layoutBounds.right - QBSConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.top = this.layoutBounds.top + QBSConstants.SCREEN_VIEW_Y_MARGIN;
    toolsCheckboxGroup.left = this.layoutBounds.left + ( 2 * QBSConstants.SCREEN_VIEW_X_MARGIN );
    toolsCheckboxGroup.bottom = this.layoutBounds.bottom - QBSConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = this.layoutBounds.maxX - QBSConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - QBSConstants.SCREEN_VIEW_Y_MARGIN;

    const referenceLineNode = new ReferenceLineNode( model.referenceLine, energyGraphNode.chartTransform, {
      lineTop: energyGraphNode.y,
      lineBottom: probabilityDensityGraphNode.bottom - QBSConstants.HANDLE_DIAMETER / 2,
      tandem: tandem.createTandem( 'referenceLineNode' )
    } );
    referenceLineNode.x = energyGraphNode.x; //TODO

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        legendNode,
        energyGraphNode,
        probabilityDensityGraphNode,
        controlPanel,
        toolsCheckboxGroup,
        referenceLineNode,
        resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      //TODO
      controlPanel,
      referenceLineNode
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      //TODO
      toolsCheckboxGroup,
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