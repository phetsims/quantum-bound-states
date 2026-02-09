// Copyright 2025, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for electron volts (eV)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../scenery-phet/js/PhetUnit.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export const electronVoltsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'eV', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.electronVolts.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.electronVolts.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.electronVolts.pattern
} );

quantumBoundStates.register( 'electronVoltsUnit', electronVoltsUnit );