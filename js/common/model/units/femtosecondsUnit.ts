// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for femtoseconds (fs)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';

export const femtosecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'fs', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.femtoSeconds.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.femtoSeconds.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.femtoseconds.accessiblePattern
} );

quantumBoundStates.register( 'femtosecondsUnit', femtosecondsUnit );