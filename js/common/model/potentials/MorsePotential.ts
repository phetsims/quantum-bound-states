// Copyright 2026, University of Colorado Boulder

/**
 * MorsePotential is a quantum potential based on the Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

type MorsePotentialOptions = SelfOptions & Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'tandem'>;

export default class MorsePotential extends QuantumPotential {

  public constructor( providedOptions: MorsePotentialOptions ) {

    const options = optionize<MorsePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.morseStringProperty,
      tandemPrefix: 'morsePotential'
    }, providedOptions );

    super( options );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    return 0; //TODO implement getPotentialEnergyAt
  }

  /**
   * Gets the index of the ground state.
   */
  public override getGroundStateIndex(): number {
    return 0;
  }

  public override getMinPotentialEnergy(): number {
    return this.getEnergyAxisRange().min; //TODO incorrect
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max; //TODO incorrect
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {

    // Sampling parameters.
    const xMin = 0.2;
    const xMax = 10;
    const dx = 0.1;

    // Scaling parameters to fit the sampled data to the desired size for the icon, determined empirically.
    const xScale = 1.7;
    const yScale = -10.1; // negative to invert the y-axis to match scenery's coordinate frame.

    // Create the Shape by sampling the curve, then scaling xy-coordinates to fit the desired size and coordinate frame.
    const shape = new Shape();
    for ( let x = xMin; x <= xMax; x += dx ) {
      shape.lineTo( xScale * x, yScale * solveMorse( x ) );
    }

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}

/**
 * Use a Morse potential curve to approximate the potential shape.
 */
function solveMorse( x: number, wellDepth = 1, wellWidth = 1, xOffset = 1 ): number {
  const term = 1 - Math.exp( -( x - xOffset ) / wellWidth );
  return wellDepth * ( Math.pow( term, 2 ) - 1 );
}