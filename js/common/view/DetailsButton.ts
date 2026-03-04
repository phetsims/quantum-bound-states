// Copyright 2026, University of Colorado Boulder

/**
 * DetailsButton is the button used to open a dialog that shows the expanded versions of a function.
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

export type DetailsButtonOptions = SelfOptions &
  PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem' | 'accessibleName' | 'accessibleHelpText' | 'accessibleContextResponse'>;

export default class DetailsButton extends RectangularPushButton {

  // For making all instances of this type of button have the same size.
  private static readonly alignGroup = new AlignGroup();

  public constructor( providedOptions: DetailsButtonOptions ) {

    const labelNode = DetailsButton.alignGroup.createBox( new RichText( providedOptions.labelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } ) );

    const options = optionize<DetailsButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: labelNode
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'DetailsButton', DetailsButton );