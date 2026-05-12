// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for inverse femtoseconds (fs^-1)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';

export const inverseFemtosecondsUnit = new PhetUnit<ReadOnlyProperty<string>>( 'fs^-1', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.inverseFemtoseconds.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.inverseFemtoseconds.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.inverseFemtoseconds.accessiblePattern
} );
