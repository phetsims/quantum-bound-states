// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelsText indicates the range of energy levels for the selected quantum potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import BoundStateResult from '../../common/model/solvers/BoundStateResult.js';
import QBSConstants from '../../common/QBSConstants.js';

export default class EnergyLevelsText extends RichText {

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      boundStateResultProperty: TReadOnlyProperty<BoundStateResult>,
                      tandem: Tandem ) {

    //TODO localize
    const stringProperty = new DerivedStringProperty( [ potentialProperty, boundStateResultProperty ],
      ( potential, boundStateResult ) => {
        if ( boundStateResult.energies.length === 1 ) {
          return `Energy Levels: E<sub>${potential.groundStateIndex}</sub>`;
        }
        else {
          return `Energy Levels: E<sub>${potential.groundStateIndex}</sub> to E<sub>${potential.groundStateIndex + boundStateResult.energies.length - 1}</sub>`;
        }
      } );

    super( stringProperty, {
      fill: 'red', //TODO Remove if we keep this in the UI.
      font: QBSConstants.CONTROL_FONT,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}