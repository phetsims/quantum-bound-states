// Copyright 2026, University of Colorado Boulder

/**
 * FunctionDetailsButton is the button used to open a dialog that shows the expanded function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = {
  labelStringProperty: TReadOnlyProperty<string>;
};

export type FunctionDetailsButtonOptions = SelfOptions &
  PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem' | 'accessibleName' | 'accessibleHelpText' | 'accessibleContextResponse'>;

export default class FunctionDetailsButton extends RectangularPushButton {

  // For making all instances of this type of button have the same size.
  private static readonly alignGroup = new AlignGroup();

  public constructor( providedOptions: FunctionDetailsButtonOptions ) {

    const labelNode = FunctionDetailsButton.alignGroup.createBox( new RichText( providedOptions.labelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } ) );

    const options = optionize<FunctionDetailsButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: labelNode,
      baseColor: QBSColors.functionDetailsButtonColorProperty,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }, providedOptions );

    super( options );

    // Tell assistive technology that this button will open a dialog.
    this.setPDOMAttribute( 'aria-haspopup', true );
  }
}
