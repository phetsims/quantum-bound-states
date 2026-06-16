// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionCustom is a superposition configuration whose coefficients can be customized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SuperpositionConfiguration, { SuperpositionConfigurationOptions } from './SuperpositionConfiguration.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionCustomOptions = SelfOptions &
  StrictOmit<SuperpositionConfigurationOptions, 'superpositionConfigurationType'>;

export default class SuperpositionCustom extends SuperpositionConfiguration {

  public constructor( providedOptions: SuperpositionCustomOptions ) {

    const options = optionize<SuperpositionCustomOptions, SelfOptions, SuperpositionConfigurationOptions>()( {
      superpositionConfigurationType: 'custom'
    }, providedOptions );

    super( options );
  }
}