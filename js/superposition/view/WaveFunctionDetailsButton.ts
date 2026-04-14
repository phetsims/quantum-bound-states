// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDetailsButton is the button used to open a dialog that shows the expanded Wave Function equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import EquationDetailsButton from './EquationDetailsButton.js';
import WaveFunctionDetailsDialog from './WaveFunctionDetailsDialog.js';

export default class WaveFunctionDetailsButton extends EquationDetailsButton {

  public constructor( tandem: Tandem ) {
    super( {
      listener: () => new WaveFunctionDetailsDialog().show(),
      labelStringProperty: QuantumBoundStatesFluent.waveFunctionDetailsButtonStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionDetailsButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.waveFunctionDetailsButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.waveFunctionDetailsButton.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}