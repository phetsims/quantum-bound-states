// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierTool is the model for the magnifier tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class MagnifierTool extends PhetioObject {

  // Whether the magnifier tool is visible.
  public readonly visibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.visibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'visibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.visibleProperty.reset();
  }
}

quantumBoundStates.register( 'MagnifierTool', MagnifierTool );