// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandDetailsButton is the push button that appears in the top-right corner of the
 * 'Average Probability Density of Band' graph. Pushing this button opens a dialog that displays the equation
 * for the 'average probability density of band' equation.
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

export class AverageProbabilityDensityOfBandDetailsButton extends FunctionDetailsButton {

  public constructor( providedOptions: ProbabilityDensityEquationButtonOptions ) {

    const options = optionize<ProbabilityDensityEquationButtonOptions, SelfOptions, QBSFunctionButtonOptions>()( {
      labelStringProperty: QuantumBoundStatesFluent.averageProbabilityDensityOfBandDetailsButtonLabelStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'AverageProbabilityDensityOfBandDetailsButton', AverageProbabilityDensityOfBandDetailsButton );