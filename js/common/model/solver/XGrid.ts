// Copyright 2026, University of Colorado Boulder

//TODO This needs a better name, 'grid' implies 2D. XSamples? PositionSamples?
/**
 * XGrid is a uniformly spaced 1D spatial grid for quantum mechanics calculations.
 * This class eliminates redundancy by computing derived properties (dx, width, x-coordinates)
 * from the fundamental grid parameters (xMin, xMax, numberOfPoints).
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class XGrid {

  // Provided values.
  public readonly xMin: number;
  public readonly xMax: number;
  public readonly numberOfPoints: number;

  // Derived values.
  public readonly width: number;
  public readonly dx: number;
  public readonly xCoordinates: number[];

  /**
   * @param xMin - Minimum x value (nm)
   * @param xMax - Maximum x value (nm)
   * @param numberOfPoints - Number of grid points
   */
  public constructor( xMin: number, xMax: number, numberOfPoints: number ) {
    affirm( numberOfPoints >= 2, 'Grid must have at least 2 points' );
    affirm( xMax > xMin, 'xMax must be greater than xMin' );

    this.xMin = xMin;
    this.xMax = xMax;
    this.numberOfPoints = numberOfPoints;
    this.width = this.xMax - this.xMin;
    this.dx = ( this.xMax - this.xMin ) / ( this.numberOfPoints - 1 );

    this.xCoordinates = [];
    for ( let i = 0; i < this.numberOfPoints; i++ ) {
      if ( i < this.numberOfPoints - 1 ) {
        this.xCoordinates.push( this.xMin + i * this.dx );
      }
      else {
        // Ensure that xMax is included in the grid.
        this.xCoordinates.push( this.xMax );
      }
    }
    affirm( this.xCoordinates.length === this.numberOfPoints, 'xCoordinates.length should be equal to numberOfPoints' );

    // Prevent further modifications to the array.
    Object.freeze( this.xCoordinates ); //TODO Is this OK?
  }
}
