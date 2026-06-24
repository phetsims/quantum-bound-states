// Copyright 2026, University of Colorado Boulder

/**
 * QuantumPotentialIconFactory is a collection of static methods that create icons for quantum potentials.
 *
 * Icons are intentionally NOT created using model classes because there is too much overhead for PhET-iO
 * and other features in those classes, and it's more difficult to tweak the look of the icons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import AsymmetricTrianglePotential from '../model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../model/potentials/CoulombPotential.js';
import DoubleSquarePotential from '../model/potentials/DoubleSquarePotential.js';
import FiniteSquarePotential from '../model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../model/potentials/InfiniteStepPotential.js';
import MorsePotential from '../model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../model/potentials/QuantumPotential.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import FiniteSquareWellsIcon from './FiniteSquareWellsIcon.js';
import InfiniteSquareWellIcon from './InfiniteSquareWellIcon.js';

export default class QuantumPotentialIconFactory {

  private constructor() {
    // Not intended for instantiation.
  }

  public static createIcon( potential: QuantumPotential ): Node {
    let icon;
    if ( potential instanceof AsymmetricTrianglePotential ) {
      icon = createAsymmetricTriangleIcon();
    }
    else if ( potential instanceof CoulombPotential ) {
      icon = createCoulombIcon();
    }
    else if ( potential instanceof DoubleSquarePotential ) {
      icon = createDoubleSquarePotential();
    }
    else if ( potential instanceof FiniteSquarePotential ) {
      icon = createFiniteSquareIcon();
    }
    else if ( potential instanceof HarmonicOscillatorPotential ) {
      icon = createHarmonicOscillatorIcon();
    }
    else if ( potential instanceof InfiniteSquarePotential ) {
      icon = createInfiniteSquareIcon();
    }
    else if ( potential instanceof InfiniteStepPotential ) {
      icon = createInfiniteStepIcon();
    }
    else if ( potential instanceof MorsePotential ) {
      icon = createMorseIcon();
    }
    else if ( potential instanceof PoschlTellerPotential ) {
      icon = createPoschlTellerIcon();
    }
    else {

      // fallback
      affirm( false, 'unsupported potential: ' + potential );
      icon = new RichText( '?', {
        font: new PhetFont( 18 )
      } );
    }
    return icon;
  }
}

// Asymmetric Triangle icon
function createAsymmetricTriangleIcon(): Node {

  const wellWidth = 12;
  const wellDepth = 12;
  const edgeLength = 8; // horizontal length of the edges that extend to the left and right of the well

  // Described from left to right
  const shape = new Shape()
    .moveTo( 0, 0 )
    .lineTo( edgeLength, 0 )
    .lineTo( edgeLength, wellDepth )
    .lineTo( edgeLength + wellWidth, 0 )
    .lineTo( edgeLength + wellWidth + edgeLength, 0 );

  return new Path( shape, {
    stroke: QBSColors.potentialEnergyColorProperty,
    lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
  } );
}

// Coulomb icon
function createCoulombIcon(): Node {

  // Shape ported from BSWellComboBox.java, values determined empirically.
  const shape = new Shape()
    .moveTo( 0, 4 )
    .quadraticCurveTo( 8, 5, 7, 16 )
    .moveTo( 10, 16 )
    .quadraticCurveTo( 11, 5, 17, 4 );

  return new Path( shape, {
    stroke: QBSColors.potentialEnergyColorProperty,
    lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
  } );
}

// Double Square icon
function createDoubleSquarePotential(): Node {
  return new FiniteSquareWellsIcon( {
    numberOfWells: 2,
    wellWidth: 12,
    wellDepth: 12,
    edgeLength: 4,
    wellSpacing: 6,
    lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
  } );
}

// Finite Square icon
function createFiniteSquareIcon(): Node {
  return new FiniteSquareWellsIcon( {
    numberOfWells: 1,
    wellWidth: 12,
    wellDepth: 12,
    edgeLength: 8,
    lineWidth: 2
  } );
}

// Harmonic Oscillator icon
function createHarmonicOscillatorIcon(): Node {

  // Shape ported from BSWellComboBox.java, values determined empirically.
  const shape = new Shape()
    .moveTo( 0, 3 )
    .quadraticCurveTo( 8.5, 30, 17, 3 );

  return new Path( shape, {
    stroke: QBSColors.potentialEnergyColorProperty,
    lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
  } );
}

// Infinite Square icon
function createInfiniteSquareIcon(): Node {
  return new InfiniteSquareWellIcon( {
    wellWidth: 12,
    wellDepth: 12
  } );
}

// Infinite Step icon
function createInfiniteStepIcon(): Node {
  return new InfiniteSquareWellIcon( {
    wellWidth: 12,
    wellDepth: 12,
    hasStep: true
  } );
}

// Morse icon
function createMorseIcon(): Node {

  // Sampling parameters
  const numberOfPoints = 50;
  const xMin = -1.4; // more negative shows more of the left edge that goes to infinity
  const xMax = 15;
  const dx = ( xMax - xMin ) / numberOfPoints;
  const wellWidth = 1.7;
  const wellDepth = 10.1;

  // Create the Shape by sampling the curve.
  const shape = new Shape();
  for ( let x = xMin; x <= xMax; x += dx ) {
    const term = 1 - Math.exp( -x / wellWidth );
    let y = ( wellDepth * term * term ) - wellDepth;
    y *= -1; // invert the y-axis to match scenery's coordinate frame
    if ( x === xMin ) {
      shape.moveTo( x, y );
    }
    else {
      shape.lineTo( x, y );
    }
  }

  return new Path( shape, {
    stroke: QBSColors.potentialEnergyColorProperty,
    lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
  } );
}

// Poschl-Teller icon
function createPoschlTellerIcon(): Node {

  // Sampling parameters
  const numberOfPoints = 100;
  const xMin = -12;
  const xMax = 12;
  const dx = ( xMax - xMin ) / numberOfPoints;
  const wellWidth = 3;
  const wellDepth = 15;

  // Create the Shape by sampling the curve.
  const shape = new Shape();
  for ( let x = xMin; x <= xMax; x += dx ) {
    const coshValue = Math.cosh( x / wellWidth );
    let y = -wellDepth / ( coshValue * coshValue );
    y *= -1; // invert the y-axis to match scenery's coordinate frame
    if ( x === xMin ) {
      shape.moveTo( x, y );
    }
    else {
      shape.lineTo( x, y );
    }
  }
  return new Path( shape, {
    stroke: QBSColors.potentialEnergyColorProperty,
    lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
  } );
}