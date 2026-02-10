// Copyright 2026, University of Colorado Boulder

/**
 * PotentialWell is the base class for all potential wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import quantumBoundStates from '../../../quantumBoundStates.js';

type SelfOptions = {
  visualNameProperty: TReadOnlyProperty<string>;
  accessibleNameProperty: TReadOnlyProperty<string>;
};

export type PotentialWellOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PotentialWell extends PhetioObject {

  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;

  protected constructor( providedOptions: PotentialWellOptions ) {

    const options = optionize<PotentialWellOptions, SelfOptions, PhetioObjectOptions>()( {
      //TODO
    }, providedOptions );

    super( options );

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
  }
}

quantumBoundStates.register( 'PotentialWell', PotentialWell );