// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityDetailsButton is the button used to open a dialog that shows the expanded Probability Density equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import EquationDetailsButton from './EquationDetailsButton.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';

export default class ProbabilityDensityDetailsButton extends EquationDetailsButton {

  public constructor( tandem: Tandem ) {
    super( {
      listener: () => new ProbabilityDensityDetailsDialog().show(),
      labelStringProperty: QuantumBoundStatesFluent.probabilityDensityDetailsButtonStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsButton.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}