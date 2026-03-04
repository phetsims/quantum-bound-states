// Copyright 2026, University of Colorado Boulder

/**
 * GraphTypeValues is an enumeration of the possible representations of quantum state that can be displayed
 * by the graphs at the bottom of the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const QuantumStateRepresentationValues = [ 'averageProbabilityDensityOfBand', 'probabilityDensity', 'waveFunction' ] as const;
export type QuantumStateRepresentation = ( typeof QuantumStateRepresentationValues )[number];