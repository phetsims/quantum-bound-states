// Copyright 2026, University of Colorado Boulder

/**
 * EquationDetailsButton is the base class for buttons used to open a dialog that shows an expanded equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';

type SelfOptions = {
  labelStringProperty: TReadOnlyProperty<string>;
};

export type EquationDetailsButtonOptions = SelfOptions &
  PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem' | 'accessibleName' | 'accessibleHelpText' | 'accessibleContextResponse'>;

export default class EquationDetailsButton extends RectangularPushButton {

  // For making all instances of this type of button have the same size.
  private static readonly alignGroup = new AlignGroup();

  protected constructor( providedOptions: EquationDetailsButtonOptions ) {

    const labelNode = EquationDetailsButton.alignGroup.createBox( new RichText( providedOptions.labelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } ) );

    const options = optionize<EquationDetailsButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: labelNode,
      baseColor: QBSColors.equationDetailsButtonColorProperty,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }, providedOptions );

    super( options );

    // Tell assistive technology that this button will open a dialog.
    this.setPDOMAttribute( 'aria-haspopup', true );
  }
}
