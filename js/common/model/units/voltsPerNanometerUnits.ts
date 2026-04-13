// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for volts per nanometer (V/nm)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';

export const voltsPerNanometerUnits = new PhetUnit<ReadOnlyProperty<string>>( 'V/nm', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.voltsPerNanometer.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.voltsPerNanometer.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.voltsPerNanometer.accessiblePattern
} );
