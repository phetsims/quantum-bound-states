// Copyright 2026, University of Colorado Boulder

/**
 * AnharmonicOscillatorPotential is a quantum potential composed of 1 anharmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import Shape from '../../../../../kite/js/Shape.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  electricFieldProperty: ReadOnlyProperty<number>;
};

export type AnharmonicOscillatorPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'tandem'>;

export default class AnharmonicOscillatorPotential extends QuantumPotential {

  //TODO Added by MV
  private readonly wellDepth = 10; // Dissociation energy D_e in eV
  private readonly wellWidth = 0.5; // w = 1/a in nm

  private readonly electricFieldProperty: ReadOnlyProperty<number>;

  public constructor( providedOptions: AnharmonicOscillatorPotentialOptions ) {

    const options = optionize<AnharmonicOscillatorPotentialOptions,
      StrictOmit<SelfOptions, 'electricFieldProperty'>, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.anharmonicOscillatorStringProperty,
      tandemPrefix: 'anharmonicOscillatorPotential',
      phetioDocumentation: 'A quantum potential with one anharmonic oscillator.'
    }, providedOptions );

    super( options );

    this.electricFieldProperty = options.electricFieldProperty;
    // Do not trigger notification when electricFieldProperty changes, because it is owned by the top-level model.
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