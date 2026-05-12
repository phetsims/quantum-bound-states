// Copyright 2026, University of Colorado Boulder

/**
 * TimeEvolvedSuperposition is a data structure that represents the time-evolved superposition of a wave function at
 * a given energy level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import SchemaOrientedIOType from '../../../../tandem/js/types/SchemaOrientedIOType.js';
import type { CoreRecord } from '../../../../tandem/js/types/StateSchema.js';

const SCHEMA = {
  realPartValues: ArrayIO( NumberIO ),
  imaginaryPartValues: ArrayIO( NumberIO ),
  magnitudeValues: ArrayIO( NumberIO ),
  phaseValues: ArrayIO( NumberIO ),
  probabilityDensityValues: ArrayIO( NumberIO )
};

export type TimeEvolvedSuperposition = CoreRecord<typeof SCHEMA>;

// PhET-iO data-type serialization for TimeEvolvedSuperposition instances.
export const TimeEvolvedSuperpositionIO = new SchemaOrientedIOType<TimeEvolvedSuperposition, typeof SCHEMA>( 'TimeEvolvedSuperpositionIO', {
  documentation: 'Serialization for the time-evolved superposition of a wave function at a given energy level.',
  stateSchema: SCHEMA
} );