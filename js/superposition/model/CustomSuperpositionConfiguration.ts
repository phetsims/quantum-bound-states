// Copyright 2026, University of Colorado Boulder

/**
 * CustomSuperpositionConfiguration is a superposition configuration whose coefficients can be customized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionCoefficients from '../../common/model/SuperpositionCoefficients.js';
import SuperpositionConfiguration, { SuperpositionConfigurationOptions } from './SuperpositionConfiguration.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionCustomOptions = SelfOptions &
  StrictOmit<SuperpositionConfigurationOptions, 'superpositionConfigurationType'>;

export default class CustomSuperpositionConfiguration extends SuperpositionConfiguration {

  public constructor( providedOptions: SuperpositionCustomOptions ) {

    const options = optionize<SuperpositionCustomOptions, SelfOptions, SuperpositionConfigurationOptions>()( {
      superpositionConfigurationType: 'custom'
    }, providedOptions );

    //TODO Not sure how this should be handled.
    const superpositionCoefficients = new SuperpositionCoefficients( [ SuperpositionCoefficient.GROUND_STATE_COEFFICIENT ] );

    super( superpositionCoefficients, options );
  }
}