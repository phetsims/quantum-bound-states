// Copyright 2026, University of Colorado Boulder

/**
 * CustomEditButton is the button that opens the dialog for editing a custom superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import editRegularShape from '../../../../sherpa/js/fontawesome-5/editRegularShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import QBSColors from '../../common/QBSColors.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionEditButtonOptions = SelfOptions & PickRequired<RectangularPushButtonOptions, 'tandem' | 'listener'>;

export default class CustomEditButton extends RectangularPushButton {

  public constructor( providedOptions: SuperpositionEditButtonOptions ) {

    const options = optionize<SuperpositionEditButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: new Path( editRegularShape, {
        scale: 0.03,
        fill: QBSColors.superpositionCustomizationButtonIconColorProperty
      } ),
      baseColor: QBSColors.superpositionCustomizationButtonBaseColorProperty,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      accessibleName: QuantumBoundStatesFluent.a11y.customButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.customButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.customButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );

    // Tell assistive technology that this button will open a dialog.
    this.setPDOMAttribute( 'aria-haspopup', true );
  }
}
