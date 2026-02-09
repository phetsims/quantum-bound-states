// Copyright 2025, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for electron masses (m<sub>e</sub>)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../scenery-phet/js/PhetUnit.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export const electronMassesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'm<sub>e</sub>', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.electronMasses.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.electronMasses.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.electronMasses.pattern
} );

quantumBoundStates.register( 'electronMassesUnit', electronMassesUnit );