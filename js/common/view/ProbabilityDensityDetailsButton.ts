// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityDetailsButton is the push button that appears in the top-right corner of the 'Probability Density' graph.
 * Pushing this button opens a dialog that displays the equation for the probability density.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import FunctionDetailsButton, { QBSFunctionButtonOptions } from './FunctionDetailsButton.js';

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityEquationButtonOptions = SelfOptions & PickRequired<QBSFunctionButtonOptions, 'listener' | 'tandem'>;

export class ProbabilityDensityDetailsButton extends FunctionDetailsButton {

  public constructor( providedOptions: ProbabilityDensityEquationButtonOptions ) {

    const options = optionize<ProbabilityDensityEquationButtonOptions, SelfOptions, QBSFunctionButtonOptions>()( {
      labelStringProperty: QuantumBoundStatesFluent.probabilityDensityFunctionButtonLabelStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityDetailsButton', ProbabilityDensityDetailsButton );