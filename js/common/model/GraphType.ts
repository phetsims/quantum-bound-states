// Copyright 2026, University of Colorado Boulder

/**
 * GraphTypeValues is an enumeration of the types of graph that can be displayed at the bottom of the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const GraphTypeValues = [ 'averageProbabilityDensityOfBand', 'probabilityDensity', 'waveFunction' ] as const;
export type GraphType = ( typeof GraphTypeValues )[number];