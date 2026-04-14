// Copyright 2026, University of Colorado Boulder

//TODO More doc about why this class is required, and how it differs from other potentials in Superposition screen.
/**
 * DoubleSquarePotential is a quantum potential composed of 2 finite square wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from './FiniteSquarePotential.js';

type SelfOptions = EmptySelfOptions;

type DoubleSquarePotentialOptions = SelfOptions & Pick<FiniteSquarePotentialOptions, 'electricFieldProperty' | 'tandem'>;

export default class DoubleSquarePotential extends FiniteSquarePotential {

  public constructor( providedOptions: DoubleSquarePotentialOptions ) {

    // Effectively constant
    const numberOfWellsProperty = new NumberProperty( 2, {
      numberType: 'Integer',
      range: new Range( 2, 2 ),
      tandem: providedOptions.tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const options = optionize<DoubleSquarePotentialOptions, SelfOptions, FiniteSquarePotentialOptions>()( {

      // FiniteSquarePotentialOptions
      numberOfWellsProperty: numberOfWellsProperty,
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.doubleSquareStringProperty,
      tandemPrefix: 'doubleSquarePotential',
      phetioDocumentation: 'A quantum potential with two finite square wells.'
    }, providedOptions );

    super( options );
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
