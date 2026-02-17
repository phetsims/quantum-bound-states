// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionToggleButton is the toggle button used to show/hide curves on the Wave Function graph.
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

export class WaveFunctionToggleButton extends EyeToggleButton {

  public constructor( curvesVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( curvesVisibleProperty, {
      scale: 0.5,
      baseColor: new DerivedProperty(
        [ curvesVisibleProperty, QBSColors.graphShownProperty, QBSColors.graphHiddenColorProperty ],
        ( visible, shownColor, hiddenColor ) => visible ? shownColor : hiddenColor ),
      accessibleNameOn: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: new DerivedProperty( [
        curvesVisibleProperty,
        QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleHelpTextOnStringProperty,
        QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleHelpTextOffStringProperty
      ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleContextResponseOffStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'WaveFunctionToggleButton', WaveFunctionToggleButton );