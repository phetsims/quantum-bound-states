// Copyright 2026, University of Colorado Boulder

/**
 * Potential is the base class for all potential potentials.
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
  accessibleNameProperty?: TReadOnlyProperty<string>;
  tandemPrefix: string;
};

export type PotentialWellOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Potential extends PhetioObject {

  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;

  protected constructor( providedOptions: PotentialWellOptions ) {

    const options = optionize<PotentialWellOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      accessibleNameProperty: providedOptions.visualNameProperty
    }, providedOptions );

    super( options );

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;
  }
}

quantumBoundStates.register( 'Potential', Potential );