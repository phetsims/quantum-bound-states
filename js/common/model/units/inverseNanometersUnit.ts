// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for inverse nanometers (nm^-1)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';

export const inverseNanometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'nm^-1', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.inverseNanometers.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.inverseNanometers.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.inverseNanometers.accessiblePattern
} );
