// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionStateType is an enumeration of the types of superposition states.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const SuperpositionStateTypeValues = [ 'preset', 'custom' ] as const;
export type SuperpositionStateType = ( typeof SuperpositionStateTypeValues )[number];
