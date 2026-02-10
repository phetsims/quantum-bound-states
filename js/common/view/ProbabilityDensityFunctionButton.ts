// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityFunctionButton is the push button that appears in the top-right corner of the 'Probability Density' graph.
 * Pushing this button opens a dialog that displays the equation for the probability density.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityEquationButtonOptions = SelfOptions & PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem'>;

export class ProbabilityDensityFunctionButton extends RectangularPushButton {

  public constructor( providedOptions: ProbabilityDensityEquationButtonOptions ) {

    const labelText = new RichText( QuantumBoundStatesFluent.probabilityDensityFunctionButtonLabelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = optionize<ProbabilityDensityEquationButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: labelText,
      accessibleName: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityFunctionButton', ProbabilityDensityFunctionButton );