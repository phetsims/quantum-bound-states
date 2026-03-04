// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDetailsButton is the push button that appears in the top-right corner of the 'Wave Function' graph.
 * Pushing this button opens a dialog that displays the equation for the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSFunctionButton, { QBSFunctionButtonOptions } from './QBSFunctionButton.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionButtonButtonOptions = SelfOptions & PickRequired<QBSFunctionButtonOptions, 'listener' | 'tandem'>;

export default class WaveFunctionDetailsButton extends QBSFunctionButton {

  public constructor( providedOptions: WaveFunctionButtonButtonOptions ) {

    const options = optionize<WaveFunctionButtonButtonOptions, SelfOptions, QBSFunctionButtonOptions>()( {
      labelStringProperty: QuantumBoundStatesFluent.waveFunctionButtonLabelStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.waveFunctionButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.waveFunctionButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'WaveFunctionDetailsButton', WaveFunctionDetailsButton );