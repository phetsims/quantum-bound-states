// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPreset is a superposition configuration whose coefficients cannot be changed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SuperpositionConfiguration, { SuperpositionConfigurationOptions } from './SuperpositionConfiguration.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionPresetOptions = SelfOptions &
  StrictOmit<SuperpositionConfigurationOptions, 'superpositionConfigurationType'>;

export default class SuperpositionPreset extends SuperpositionConfiguration {

  public constructor( providedOptions: SuperpositionPresetOptions ) {

    const options = optionize<SuperpositionPresetOptions, SelfOptions, SuperpositionConfigurationOptions>()( {
      superpositionConfigurationType: 'preset'
    }, providedOptions );

    super( options );
  }
}