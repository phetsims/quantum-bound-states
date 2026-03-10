// Copyright 2026, University of Colorado Boulder

/**
 * CurvesVisibleToggleButton is the toggle button used to show/hide curves on a graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EyeToggleButton, { EyeToggleButtonOptions } from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSColors from '../QBSColors.js';

type SelfOptions = EmptySelfOptions;

export type CurvesVisibleToggleButtonOptions = SelfOptions &
  PickRequired<EyeToggleButtonOptions, 'tandem' | 'accessibleNameOn' | 'accessibleNameOff' | 'accessibleHelpText' | 'accessibleContextResponseOn' | 'accessibleContextResponseOff'>;

export class CurvesVisibleToggleButton extends EyeToggleButton {

  public constructor( curvesVisibleProperty: Property<boolean>, providedOptions: CurvesVisibleToggleButtonOptions ) {

    const options = optionize<CurvesVisibleToggleButtonOptions, SelfOptions, EyeToggleButtonOptions>()( {
      scale: 0.5,
      baseColor: new DerivedProperty(
        [ curvesVisibleProperty, QBSColors.curvesVisibleToggleButtonOnColorProperty, QBSColors.curvesVisibleToggleButtonOffColorProperty ],
        ( visible, shownColor, hiddenColor ) => visible ? shownColor : hiddenColor )
    }, providedOptions );

    super( curvesVisibleProperty, options );
  }
}

quantumBoundStates.register( 'CurvesVisibleToggleButton', CurvesVisibleToggleButton );