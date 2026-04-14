// Copyright 2026, University of Colorado Boulder

/**
 * DoubleSquarePotential is a quantum potential composed of 2 finite square wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from './FiniteSquarePotential.js';

type SelfOptions = EmptySelfOptions;

type DoubleSquarePotentialOptions = SelfOptions &
  PickRequired<FiniteSquarePotentialOptions, 'tandem'>;

export default class DoubleSquarePotential extends FiniteSquarePotential {

  public constructor( providedOptions: DoubleSquarePotentialOptions ) {

    const options = optionize<DoubleSquarePotentialOptions, SelfOptions, FiniteSquarePotentialOptions>()( {

      // FiniteSquarePotentialOptions
      numberOfWells: 2,
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
