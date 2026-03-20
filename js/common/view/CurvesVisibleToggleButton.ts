// Copyright 2026, University of Colorado Boulder

/**
 * CurvesVisibleToggleButton is the toggle button used to show/hide curves on the Quantum State Graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import EyeToggleButton from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';

export default class CurvesVisibleToggleButton extends EyeToggleButton {

  public constructor( curvesVisibleProperty: Property<boolean>, tandem: Tandem ) {

    super( curvesVisibleProperty, {

      // Change the base color to emphasize when curves are hidden.
      baseColor: new DerivedProperty(
        [ curvesVisibleProperty, QBSColors.curvesVisibleToggleButtonShownColorProperty, QBSColors.curvesVisibleToggleButtonHiddenColorProperty ],
        ( visible, shownColor, hiddenColor ) => visible ? shownColor : hiddenColor ),
      iconScale: 0.35,
      xMargin: 6,
      yMargin: 4,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      accessibleNameOn: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: new DerivedProperty( [
        curvesVisibleProperty,
        QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.accessibleHelpTextOnStringProperty,
        QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.accessibleHelpTextOffStringProperty
      ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.accessibleContextResponseOffStringProperty,
      tandem: tandem
    } );
  }
}
