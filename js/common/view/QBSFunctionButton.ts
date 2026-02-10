// Copyright 2026, University of Colorado Boulder

/**
 * QBSFunctionButton is the base class for buttons used to open dialogs that show expanded versions of functions.
 * This class exists solely to make all such buttons have the same size.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = {
  labelStringProperty: TReadOnlyProperty<string>;
};

export type QBSFunctionButtonOptions = SelfOptions &
  PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem' | 'accessibleName' | 'accessibleHelpText' | 'accessibleContextResponse'>;

export default class QBSFunctionButton extends RectangularPushButton {

  // For making all instances of this type of button have the same size.
  private static readonly alignGroup = new AlignGroup();

  protected constructor( providedOptions: QBSFunctionButtonOptions ) {

    const labelNode = QBSFunctionButton.alignGroup.createBox( new RichText( providedOptions.labelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } ) );

    const options = optionize<QBSFunctionButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: labelNode
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'QBSFunctionButton', QBSFunctionButton );