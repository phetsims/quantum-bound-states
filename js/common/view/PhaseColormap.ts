// Copyright 2026, University of Colorado Boulder

/**
 * PhaseColormap provides methods for mapping phase to colors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author WebStorm AI Assistant
 */

import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toDegrees } from '../../../../dot/js/util/toDegrees.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Color from '../../../../scenery/js/util/Color.js';

export default class PhaseColormap {

  private constructor() {
    //TODO Not intended for instantiation
  }

  /**
   * phaseToRainbow implements a mapping to 'rainbow' colors using HSL colorspace. The Java version used HSV colorspace,
   * which scenery does not support.
   */
  public static phaseToRainbow( radians: number ): Color {
    return new Color( 0, 0, 0 ).setHSLA( toDegrees( radians ), 100, 50, 1 );
  }

  /**
   * phaseToTwilight implements the twilight colormap using an interpolated lookup table. Twilight is a popular colormap
   * for visualizing phase space, included with matplotlib. Perceptual lightness contrast and color contrast are uniform
   * over the entire value range. So it prints nicely in white-black-white, and works well for color blindness.
   * See https://matplotlib.org/stable/gallery/color/colormap_reference.html.
   */
  public static phaseToTwilight( radians: number ): Color {
    const twoPi = 2 * Math.PI;
    const normalizedRadians = ( ( radians % twoPi ) + twoPi ) % twoPi;
    const normalizedDegrees = Math.floor( normalizedRadians / twoPi * 360 );
    return TWILIGHT_COLORS_360[ normalizedDegrees ];
  }
}

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
const TWILIGHT_COLORS_360: Color[] = Array.from( { length: 360 }, ( _, degrees ) => {
  return sampleTwilightColor( degrees );
} );

function sampleTwilightColor( degrees: number ): Color {
  affirm( degrees >= 0 && degrees <= 360, `invalid degrees: ${degrees}` );

  const scaled = ( degrees / 360 ) * ( TWILIGHT_PALETTE.length - 1 );
  const index = Math.floor( scaled );
  const fraction = scaled - index;

  const color0 = TWILIGHT_PALETTE[ index ];
  const color1 = TWILIGHT_PALETTE[ Math.min( index + 1, TWILIGHT_PALETTE.length - 1 ) ];

  const r = toByte( interpolate( color0[ 0 ], color1[ 0 ], fraction ) );
  const g = toByte( interpolate( color0[ 1 ], color1[ 1 ], fraction ) );
  const b = toByte( interpolate( color0[ 2 ], color1[ 2 ], fraction ) );

  return new Color( r, g, b );
}

function interpolate( a: number, b: number, fraction: number ): number {
  return a + ( b - a ) * fraction;
}

function toByte( value: number ): number {
  return roundSymmetric( Math.max( 0, Math.min( 1, value ) ) * 255 );
}