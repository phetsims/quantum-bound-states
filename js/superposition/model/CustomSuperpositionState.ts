// Copyright 2026, University of Colorado Boulder

/**
 * CustomSuperpositionState is a superposition state whose coefficients can be customized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionCoefficients from '../../common/model/SuperpositionCoefficients.js';
import SuperpositionState, { SuperpositionStateOptions } from './SuperpositionState.js';

type SelfOptions = EmptySelfOptions;

type CustomSuperpositionStateOptions = SelfOptions & StrictOmit<SuperpositionStateOptions, 'superpositionStateType'>;

export default class CustomSuperpositionState extends SuperpositionState {

  public constructor( providedOptions: CustomSuperpositionStateOptions ) {

    const options = optionize<CustomSuperpositionStateOptions, SelfOptions, SuperpositionStateOptions>()( {
      superpositionStateType: 'custom'
    }, providedOptions );

    //TODO Not sure how this should be handled.
    const superpositionCoefficients = new SuperpositionCoefficients( [ SuperpositionCoefficient.GROUND_STATE_COEFFICIENT ] );

    super( superpositionCoefficients, options );
  }
}