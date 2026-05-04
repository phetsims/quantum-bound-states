// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandDetailsButton is the button used to open a dialog that shows the expanded
 * Average Probability Density of Band equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import AverageProbabilityDensityOfBandDetailsDialog from './AverageProbabilityDensityOfBandDetailsDialog.js';
import EquationDetailsButton from './EquationDetailsButton.js';

export default class AverageProbabilityDensityOfBandDetailsButton extends EquationDetailsButton {

  public constructor( tandem: Tandem ) {
    super( {
      listener: () => new AverageProbabilityDensityOfBandDetailsDialog().show(),
      labelStringProperty: QuantumBoundStatesFluent.averageProbabilityDensityOfBandDetailsButtonStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}