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
import quantumBoundStates from '../../quantumBoundStates.js';
import OneWellModel from '../model/OneWellModel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends ScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    super( {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );

    const energyGraphNode = new EnergyGraphNode( tandem.createTandem( 'energyGraphNode' ) );

    const probabilityDensityGraphNode = new ProbabilityDensityGraphNode( tandem.createTandem( 'probabilityDensityGraphNode' ) );

    const legendNode = new LegendNode( tandem.createTandem( 'legendNode' ) );

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
    energyGraphNode.top = legendNode.bottom + 5;
    probabilityDensityGraphNode.left = energyGraphNode.left;
    probabilityDensityGraphNode.top = energyGraphNode.bottom + 5;
    resetAllButton.right = this.layoutBounds.maxX - QBSConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - QBSConstants.SCREEN_VIEW_Y_MARGIN;

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        legendNode,
        energyGraphNode,
        probabilityDensityGraphNode,
        resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      //TODO
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      //TODO
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