// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionCustomizationButton is the button that opens the dialog for editing a custom superposition configuration.
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

export default class SuperpositionCustomizationButton extends RectangularPushButton {

  public constructor( providedOptions: SuperpositionEditButtonOptions ) {

    const options = optionize<SuperpositionEditButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      content: new Path( editRegularShape, {
        scale: 0.03,
        fill: QBSColors.superpositionCustomizationButtonIconColorProperty
      } ),
      baseColor: QBSColors.superpositionCustomizationButtonBaseColorProperty,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomizationButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionCustomizationButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.superpositionCustomizationButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );

    // Tell assistive technology that this button will open a dialog.
    this.setPDOMAttribute( 'aria-haspopup', true );
  }
}
