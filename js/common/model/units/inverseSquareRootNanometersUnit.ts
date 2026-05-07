// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/11 Move to scenery-phet/js/units/
/**
 * Unit for inverse square root nanometers (nm^-½)
 *
 * @author @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';

export const inverseSquareRootNanometersUnit = new PhetUnit<ReadOnlyProperty<string>>( 'nm^-1/2', {
  visualSymbolStringProperty: QuantumBoundStatesFluent.units.inverseSquareRootNanometers.symbolStringProperty,
  visualSymbolPatternStringProperty: QuantumBoundStatesFluent.units.inverseSquareRootNanometers.symbolPatternStringProperty,
  accessiblePattern: QuantumBoundStatesFluent.a11y.units.inverseSquareRootNanometers.accessiblePattern
} );
