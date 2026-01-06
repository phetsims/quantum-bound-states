// Copyright 2025, University of Colorado Boulder

/**
 * SuperpositionScreenView is the top-level view for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import SuperpositionModel from '../model/SuperpositionModel.js';
import SuperpositionScreenSummaryContent from './SuperpositionScreenSummaryContent.js';

export default class SuperpositionScreenView extends ScreenView {

  public constructor( model: SuperpositionModel, tandem: Tandem ) {

    super( {
      screenSummaryContent: new SuperpositionScreenSummaryContent(),
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

quantumBoundStates.register( 'SuperpositionScreenView', SuperpositionScreenView );