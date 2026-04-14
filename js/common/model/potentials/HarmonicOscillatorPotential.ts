// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorPotential is a quantum potential composed of 1 harmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

type HarmonicOscillatorPotentialOptions = SelfOptions & Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'tandem'>;

export default class HarmonicOscillatorPotential extends QuantumPotential {

  //TODO Temporary constants, same as initial state of Java version.
  private readonly angularFrequency = 1; //TODO Java: [-5,15] fs^-1

  private readonly electronMassesProperty: TReadOnlyProperty<number>;

  public constructor( electronMassesProperty: TReadOnlyProperty<number>, providedOptions: HarmonicOscillatorPotentialOptions ) {

    const options = optionize<HarmonicOscillatorPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.harmonicOscillatorStringProperty,
      tandemPrefix: 'harmonicOscillatorPotential',
      phetioDocumentation: 'A quantum potential with one harmonic oscillator.'
    }, providedOptions );

    super( options );

    this.electronMassesProperty = electronMassesProperty;
    // Do not trigger notification when electronMassesProperty changes, because it is owned by the top-level model.
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'HarmonicOscillatorPotential does not support multiple wells.' );

    const xOffset = this.xOffset;
    const yOffset = this.yOffset;
    const mass = this.electronMassesProperty.value * QBSConstants.ELECTRON_MASS;
    const omega = this.angularFrequency;

    // From BSHarmonicOscillatorPotential.java
    return yOffset + ( 0.5 * mass * omega * omega * ( x - xOffset ) * ( x - xOffset ) );
  }

  /**
   * Gets the index of the ground state.
   */
  public override getGroundStateIndex(): number {
    return 0;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max;
  }

  //TODO Used by HarmonicOscillatorSolution. This probably does not belong here.
  /**
   * Spring constant k = m * ω², in eV/nm².
   */
  public get springConstant(): number {
    const mass = this.electronMassesProperty.value * QBSConstants.ELECTRON_MASS;
    const omega = this.angularFrequency;
    return mass * omega * omega;
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 3 )
      .quadraticCurveTo( 8.5, 30, 17, 3 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
