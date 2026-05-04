// Copyright 2026, University of Colorado Boulder

//TODO This needs a better name, 'grid' implies 2D. XSamples? PositionSamples?
/**
 * XGrid is a uniformly spaced 1D spatial grid for quantum mechanics calculations.
 * This class eliminates redundancy by computing derived properties (dx, x-coordinates)
 * from the fundamental grid parameters (xMin, xMax, numberOfPoints).
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {
 xMin: number; // Minimum x value (nm)
 xMax: number; // Maximum x value (nm)
 numberOfPoints: number; // Number of x coordinates.
};

type XGridOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class XGrid extends PhetioObject {

  // Provided values.
  public readonly xMin: number;
  public readonly xMax: number;
  public readonly numberOfPoints: number;

  // Uniform spacing between x-coordinates
  public readonly dx: number;

  // Uniformly spaced x-coordinates, in ascending order. These x-coordinates never change and are used for all graphs.
  // This is a Property so that the x-coordinates are available via PhET-iO.
  private readonly xCoordinatesProperty: TReadOnlyProperty<number[]>;

  public constructor( providedOptions: XGridOptions ) {

    const options = optionize<XGridOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    affirm( options.xMax > options.xMin, 'xMax must be greater than xMin' );
    affirm( options.numberOfPoints >= 2, 'Grid must have at least 2 points' );

    super( options );

    this.xMin = options.xMin;
    this.xMax = options.xMax;
    this.numberOfPoints = options.numberOfPoints;
    this.dx = ( this.xMax - this.xMin ) / ( this.numberOfPoints - 1 );

    const xCoordinates = [];
    for ( let i = 0; i < this.numberOfPoints; i++ ) {
      if ( i < this.numberOfPoints - 1 ) {
        xCoordinates.push( this.xMin + i * this.dx );
      }
      else {
        // Ensure that xMax is included in the grid.
        xCoordinates.push( this.xMax );
      }
    }
    affirm( xCoordinates.length === this.numberOfPoints, 'xCoordinates.length should be equal to numberOfPoints' );

    this.xCoordinatesProperty = new Property( xCoordinates, {
      units: nanometersUnit,
      validValues: [ xCoordinates ], // effectively constant
      tandem: options.tandem.createTandem( 'xCoordinatesProperty' ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
  }

  public get xCoordinates(): readonly number[] {
    return this.xCoordinatesProperty.value;
  }
}
