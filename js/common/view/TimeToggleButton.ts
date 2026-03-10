// Copyright 2026, University of Colorado Boulder

/**
 * TimeToggleButton is the toggle button used to show/hide the time value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import EyeToggleButton from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';

export default class TimeToggleButton extends EyeToggleButton {

  public constructor( timeVisibleProperty: Property<boolean>, tandem: Tandem ) {

    super( timeVisibleProperty, {
      scale: 0.5,
      baseColor: new DerivedProperty(
        [ timeVisibleProperty, QBSColors.timeToggleButtonShownColorProperty, QBSColors.timeToggleButtonHiddenColorProperty ],
        ( visible, shownColor, hiddenColor ) => visible ? shownColor : hiddenColor ),
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      accessibleNameOn: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty,
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'TimeToggleButton', TimeToggleButton );