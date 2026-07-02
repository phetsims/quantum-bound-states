// Copyright 2026, University of Colorado Boulder

/**
 * CustomSuperpositionState is a superposition state whose coefficients can be customized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionCoefficients from '../../common/model/SuperpositionCoefficients.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import SuperpositionState, { SuperpositionStateOptions } from './SuperpositionState.js';

type SelfOptions = EmptySelfOptions;

type CustomSuperpositionStateOptions = SelfOptions & SuperpositionStateOptions;

export default class CustomSuperpositionState extends SuperpositionState {

  public constructor( providedOptions: CustomSuperpositionStateOptions ) {

    //TODO Not sure how this should be handled.
    const superpositionCoefficients = new SuperpositionCoefficients( [ SuperpositionCoefficient.GROUND_STATE_COEFFICIENT ] );

    super( superpositionCoefficients, providedOptions );
  }

  /**
   * Creates the complete set of custom superposition states.
   */
  public static createStates( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): CustomSuperpositionState[] {
    let customIndex = 1;
    return [
      //TODO Lots of work to do here.
      //TODO Is groundStateIndexProperty needed?
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom1StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom2StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom3StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom4StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom5StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } )
    ];
  }
}