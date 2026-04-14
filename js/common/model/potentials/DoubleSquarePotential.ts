// Copyright 2026, University of Colorado Boulder

//TODO More doc about why this class is required, and how it differs from other potentials in Superposition screen.
/**
 * DoubleSquarePotential is a quantum potential composed of 2 finite square wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import FiniteSquarePotential from './FiniteSquarePotential.js';

export default class DoubleSquarePotential extends FiniteSquarePotential {

  public constructor( tandem: Tandem ) {

    // Effectively constant
    const numberOfWellsProperty = new NumberProperty( 2, {
      numberType: 'Integer',
      range: new Range( 2, 2 ),
      tandem: tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.doubleSquareStringProperty,
      tandemPrefix: 'doubleSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with two finite square wells.'
    } );
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 2,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 4,
      wellSpacing: 6,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
