// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorPotential is a quantum potential composed of 1 harmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Shape from '../../../../../kite/js/Shape.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import Potential from './Potential.js';

export default class HarmonicOscillatorPotential extends Potential {

  //TODO Temporary constants, same as initial state of Java version.
  // Some of these should be Properties or ES5 setters.
  private readonly angularFrequency = 1; //TODO Java: [-5,15] fs^-1
  private readonly wellDepth = 10; //TODO Java: [0,20] eV and named 'height'
  private readonly yOffset = 0; //TODO Java [-5,15] eV, bottom of well
  private readonly centerX = 0; //TODO Constant 0 nm in Java

  private readonly massProperty: TReadOnlyProperty<number>;

  public constructor( massProperty: TReadOnlyProperty<number>, tandem: Tandem ) {

    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.harmonicOscillatorStringProperty,
      tandemPrefix: 'harmonicOscillatorPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one harmonic oscillator.'
    } );

    this.massProperty = massProperty;
  }

  public override getPotentialEnergyAt( x: number ): number {
    //TODO affirm 1 well

    const yOffset = this.yOffset;
    const centerX = this.centerX;
    const m = this.massProperty.value;
    const omega = this.angularFrequency;

    return yOffset + ( 0.5 * m * omega * omega * ( x - centerX ) * ( x - centerX ) );
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
