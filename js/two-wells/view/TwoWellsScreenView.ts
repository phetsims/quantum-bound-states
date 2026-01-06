// Copyright 2025, University of Colorado Boulder

/**
 * TwoWellsScreenView is the top-level view for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import TwoWellsModel from '../model/TwoWellsModel.js';
import TwoWellsScreenSummaryContent from './TwoWellsScreenSummaryContent.js';

export default class TwoWellsScreenView extends ScreenView {

  public constructor( model: TwoWellsModel, tandem: Tandem ) {

    super( {
      screenSummaryContent: new TwoWellsScreenSummaryContent(),
      tandem: tandem
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - QBSConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - QBSConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        //TODO
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

quantumBoundStates.register( 'TwoWellsScreenView', TwoWellsScreenView );