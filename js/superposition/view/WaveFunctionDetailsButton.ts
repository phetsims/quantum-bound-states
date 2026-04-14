// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDetailsButton is the button used to open a dialog that shows the expanded Wave Function equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import WaveFunctionDetailsDialog from '../../common/view/WaveFunctionDetailsDialog.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import FunctionDetailsButton from './FunctionDetailsButton.js';

export default class WaveFunctionDetailsButton extends FunctionDetailsButton {

  public constructor( tandem: Tandem ) {
    super( {
      listener: () => new WaveFunctionDetailsDialog().show(),
      labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.waveFunctionStringProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}