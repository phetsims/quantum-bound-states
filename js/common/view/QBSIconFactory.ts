// Copyright 2026, University of Colorado Boulder

/**
 * QBSIconFactory is a set of factory methods for creating icons for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSColors from '../QBSColors.js';

export default class QBSIconFactory {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the icon for the 'One Well' screen.
   */
  public static createOneWellScreenIcon(): ScreenIcon {
    return new ScreenIcon( QBSIconFactory.createSquareWellsIcon( 1, 30, 30 ), {
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 0.85,
      fill: QBSColors.screenBackgroundColorProperty
    } );
  }

  /**
   * Creates the icon for the 'Two Wells' screen.
   */
  public static createTwoWellsScreenIcon(): ScreenIcon {
    return new ScreenIcon( QBSIconFactory.createSquareWellsIcon( 2, 15, 30 ), {
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 0.85,
      fill: QBSColors.screenBackgroundColorProperty
    } );
  }

  /**
   * Creates the icon for the 'Many Wells' screen.
   */
  public static createManyWellsScreenIcon(): ScreenIcon {
    return new ScreenIcon( QBSIconFactory.createSquareWellsIcon( 4, 7.5, 30 ), {
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 0.85,
      fill: QBSColors.screenBackgroundColorProperty
    } );
  }

  private static createSquareWellsIcon( numberOfWells: number, wellWidth: number, wellDepth: number ): Node {
    affirm( numberOfWells > 0, 'numberOfWells must be > 0' );
    affirm( wellWidth > 0, 'wellWidth must be > 0' );
    affirm( wellDepth > 0, 'wellDepth must be > 0' );

    const squareWellShape = new Shape().moveTo( 0, 0 ).lineTo( wellWidth, 0 );

    let x = wellWidth;
    for ( let i = 0; i < numberOfWells; i++ ) {
      squareWellShape.lineTo( x, wellDepth );
      x += wellWidth;
      squareWellShape.lineTo( x, wellDepth );
      squareWellShape.lineTo( x, 0 );
      x += wellWidth;
      squareWellShape.lineTo( x, 0 );
    }

    return new Path( squareWellShape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 3
    } );
  }
}

quantumBoundStates.register( 'QBSIconFactory', QBSIconFactory );