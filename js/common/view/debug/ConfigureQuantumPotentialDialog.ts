// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureQuantumPotentialDialog is the base class for all dialogs used to configure a Quantum Potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumStateGraphControlPanel from '../QuantumStateGraphControlPanel.js';

export default class ConfigureQuantumPotentialDialog extends Dialog {

  public constructor( titleString: string, content: Node ) {

    super( content, {
      title: new Text( titleString, {
        font: QBSConstants.TITLE_FONT,
        maxWidth: 300
      } ),
      ySpacing: 15,

      // In the upper right corner of the layoutBounds, so that it's not covering the Energy Diagram.
      maxWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      layoutStrategy: ( dialog: Dialog, simBounds: Bounds2, screenBounds: Bounds2, scale: number ): void => {
        if ( dialog.layoutBounds ) {
          dialog.right = dialog.layoutBounds.right - QBSConstants.SCREEN_VIEW_X_MARGIN;
          dialog.top = dialog.layoutBounds.top + QBSConstants.SCREEN_VIEW_Y_MARGIN;
        }
      }
    } );
  }
}