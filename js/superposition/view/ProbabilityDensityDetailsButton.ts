// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityDetailsButton is the button used to open a dialog that shows the expanded Probability Density equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import FunctionDetailsButton from './FunctionDetailsButton.js';

export default class ProbabilityDensityDetailsButton extends FunctionDetailsButton {

  public constructor( tandem: Tandem ) {
    super( {
      listener: () => new ProbabilityDensityDetailsDialog().show(),
      labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.probabilityDensityStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}