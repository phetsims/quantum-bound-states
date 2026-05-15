// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/39 Delete if not used
/**
 * ResetEnergyOffsetButton resets the energy offset (y-offset) of the selected potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ResetButton from '../../../../scenery-phet/js/buttons/ResetButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSColors from '../../common/QBSColors.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class EnergyOffsetResetButton extends ResetButton {

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential>, tandem: Tandem ) {

    super( {
      isDisposable: false,
      listener: () => potentialProperty.value.yOffsetProperty.reset(),
      radius: 12,
      xMargin: 3,
      yMargin: 3,
      baseColor: QBSColors.resetEnergyOffsetButtonColorProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.energyOffsetResetButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyOffsetResetButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.energyOffsetResetButton.accessibleContextResponseStringProperty,
      tandem: tandem,
      enabledPropertyOptions: {
        phetioReadOnly: true
      }
    } );

    // Disable the button when the selected potential's offset is already zero.
    const yOffsetListener = ( yOffset: number ) => {
      this.enabled = ( yOffset !== 0 );
    };
    potentialProperty.link( ( potential, oldPotential ) => {
      if ( oldPotential && oldPotential.yOffsetProperty.hasListener( yOffsetListener ) ) {
        oldPotential.yOffsetProperty.unlink( yOffsetListener );
      }
      potential.yOffsetProperty.link( yOffsetListener );
    } );
  }
}
