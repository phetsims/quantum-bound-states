// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for electron volts per nanometer squared (eV/nm^2)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';

export const electronVoltsPerNanometerSquaredUnit = new PhetUnit<ReadOnlyProperty<string>>( 'eV/nm^2', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.electronVoltsPerNanometerSquared.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.electronVoltsPerNanometerSquared.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.electronVoltsPerNanometerSquared.accessiblePattern
} );
