// Copyright 2026, University of Colorado Boulder

/**
 * Experiments with the twilight colormap, a popular colormap for visualizing phase space that is included with matplotlib.
 * See https://matplotlib.org/stable/gallery/color/colormap_reference.html.
 *
 * Advantages of the Twilight colorspace (according to Google AI Overview): Perceptual lightness contrast and color
 * contrast are uniform over the whole value range. So it prints nicely in white-black-white, and works well for
 * color blindness.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';

/**
 * Implements the twilight colormap using an interpolated lookup table.
 *
 * @author WebStorm AI Assistant
 */

// Data structure for RBG color components
type RGB = readonly [ number, number, number ];

// A minimal set of color samples for the twilight colormap. Ordered from lowest to highest phase, equally spaced.
const TWILIGHT_PALETTE: RGB[] = [
  [ 0.885750, 0.850009, 0.887973 ],
  [ 0.786704, 0.736551, 0.875285 ],
  [ 0.659225, 0.614799, 0.824051 ],
  [ 0.521328, 0.491902, 0.745531 ],
  [ 0.384072, 0.368671, 0.642999 ],
  [ 0.261122, 0.246140, 0.514349 ],
  [ 0.190631, 0.174639, 0.371857 ],
  [ 0.184880, 0.079425, 0.213076 ],
  [ 0.277935, 0.050344, 0.094963 ],
  [ 0.417642, 0.090719, 0.079160 ],
  [ 0.562738, 0.177596, 0.119724 ],
  [ 0.695029, 0.299631, 0.183620 ],
  [ 0.808892, 0.446809, 0.287795 ],
  [ 0.894493, 0.618705, 0.457609 ],
  [ 0.941512, 0.779133, 0.674998 ],
  [ 0.885750, 0.850009, 0.887973 ]
];

// Precompute a 360-entry lookup table of CSS color strings by interpolating through TWILIGHT_PALETTE.
// The table can be indexed by integer degrees in the range [0,359].
const TWILIGHT_COLORS_360: string[] = Array.from( { length: 360 }, ( _, degrees ) => {
  return sampleTwilightColor( degrees );
} );

function sampleTwilightColor( degrees: number ): string {
  affirm( degrees >= 0 && degrees <= 360, `invalid degrees: ${degrees}` );

  const scaled = ( degrees / 360 ) * ( TWILIGHT_PALETTE.length - 1 );
  const index = Math.floor( scaled );
  const fraction = scaled - index;

  const color0 = TWILIGHT_PALETTE[ index ];
  const color1 = TWILIGHT_PALETTE[ Math.min( index + 1, TWILIGHT_PALETTE.length - 1 ) ];

  const r = interpolate( color0[ 0 ], color1[ 0 ], fraction );
  const g = interpolate( color0[ 1 ], color1[ 1 ], fraction );
  const b = interpolate( color0[ 2 ], color1[ 2 ], fraction );

  return `rgb(${toByte( r )}, ${toByte( g )}, ${toByte( b )})`;
}

function interpolate( a: number, b: number, fraction: number ): number {
  return a + ( b - a ) * fraction;
}

function toByte( value: number ): number {
  return roundSymmetric( Math.max( 0, Math.min( 1, value ) ) * 255 );
}

/**
 * Maps an angle in radians to one of 360 twilight colors.
 * Each integer degree in the range [0,359] maps to a distinct color entry.
 * Returns a CSS color string.
 */
export function phaseToColorLookupTable( radians: number ): string {
  const twoPi = 2 * Math.PI;
  const normalizedRadians = ( ( radians % twoPi ) + twoPi ) % twoPi;
  const normalizedDegrees = Math.floor( normalizedRadians / twoPi * 360 );
  return TWILIGHT_COLORS_360[ normalizedDegrees ];
}

/**
 * Implements the twilight colormap using linear regression.
 *
 * @author Martin Viellette
 */

export function phaseToColorLinearRegression( radians: number ): string {
  const r = 0.544 + 0.412 * Math.cos( radians );
  const g = 0.471 + 0.449 * Math.cos( radians );
  const b = 0.559 + 0.399 * Math.cos( radians );
  return new Color( r * 255, g * 255, b * 255 ).toCSS();
}

/**
 * PhaseColormapNode displays the complete spectrum of a phase colormap.
 * To test, add something like this to a ScreenView:
 *
 *     const node1 = new PhaseColormapNode( phaseToColorLookupTable );
 *     node1.center = new Vector2( this.layoutBounds.centerX, this.layoutBounds.top + 100 );
 *     this.addChild( node1 );
 *
 *     const node2 = new PhaseColormapNode( phaseToColorLinearRegression );
 *     node2.center = new Vector2( this.layoutBounds.centerX, this.layoutBounds.bottom - 100 );
 *     this.addChild( node2 );
 */
export class PhaseColormapNode extends Node {

  public constructor( phaseToColor: ( phase: number ) => string ) {

    const polygons: Node[] = [];
    const width = 2;
    const height = 100;
    const overlap = 0.1;

    let x = 0;
    for ( let degrees = 0; degrees < 360; degrees++ ) {

      const shape = new Shape()
        .moveTo( x, 0 )
        .lineTo( x + width + overlap, 0 )
        .lineTo( x + width + overlap, height )
        .lineTo( x, height )
        .close();

      const polygon = new Path( shape, {
        fill: phaseToColor( toRadians( degrees ) )
      } );
      polygons.push( polygon );

      x += width;
    }

    super( {
      children: polygons
    } );
  }
}