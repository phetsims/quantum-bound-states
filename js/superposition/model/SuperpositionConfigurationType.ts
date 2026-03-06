// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionConfigurationType is an enumeration of the types of superposition configurations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const SuperpositionConfigurationTypeValues = [ 'preset', 'custom' ] as const;
export type SuperpositionConfigurationType = ( typeof SuperpositionConfigurationTypeValues )[number];
