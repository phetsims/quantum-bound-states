// Copyright 2026, University of Colorado Boulder

/**
 * PresetCustomSwitch switches between preset and custom superposition states.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ABSwitch, { ABSwitchOptions } from '../../../../sun/js/ABSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { SuperpositionConfigurationType } from '../model/SuperpositionConfigurationType.js';

export default class PresetCustomSwitch extends ABSwitch<SuperpositionConfigurationType> {

  public constructor( superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>, tandem: Tandem ) {

    const textOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 60
    };

    // Size the switch to match the height of the font.
    const switchHeight = new Text( 'X', { font: textOptions.font } ).height;

    const options: ABSwitchOptions = {
      isDisposable: false,
      centerOnSwitch: false,
      toggleSwitchOptions: {
        size: new Dimension2( 40, switchHeight ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 6,
        phetioVisiblePropertyInstrumented: false,
        phetioEnabledPropertyInstrumented: false
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.presetCustomSwitch.accessibleHelpTextStringProperty,
      valueAAccessibleName: QuantumBoundStatesFluent.a11y.presetCustomSwitch.valueAAccessibleNameStringProperty,
      valueBAccessibleName: QuantumBoundStatesFluent.a11y.presetCustomSwitch.valueBAccessibleNameStringProperty,
      tandem: tandem
    };

    const presetText = new Text( QuantumBoundStatesFluent.presetStringProperty, textOptions );
    const customText = new Text( QuantumBoundStatesFluent.customStringProperty, textOptions );

    super( superpositionConfigurationTypeProperty, 'preset', presetText, 'custom', customText, options );
  }
}

quantumBoundStates.register( 'PresetCustomSwitch', PresetCustomSwitch );