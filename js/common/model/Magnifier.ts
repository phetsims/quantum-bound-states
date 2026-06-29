// Copyright 2026, University of Colorado Boulder

/**
 * Magnifier is the model for the magnifier.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class Magnifier extends PhetioObject {

  // Whether the magnifier is visible.
  public readonly visibleProperty: Property<boolean>;
  
  // Center of the magnifier probe.
  public readonly probePositionProperty: Property<Vector2>;

  // Top-left corner of the magnifier viewer.
  //TODO What should be consider the positon of the viewer?
  public readonly viewerPositionProperty: Property<Vector2>;

  //TODO Does this need to be dynamic or is a single power sufficient?
  public static readonly MAGNIFICATION_POWER = 10;

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

    //TODO probePositionProperty must be updated when energyDiagram.yRangeProperty changes.
    this.probePositionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'probePositionProperty' ),
      phetioFeatured: true
    } );

    //TODO viewerPositionProperty must be updated when energyDiagram.yRangeProperty changes.
    this.viewerPositionProperty = new Vector2Property( new Vector2( 1.65, 15 ), {
      tandem: tandem.createTandem( 'viewerPositionProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.visibleProperty.reset();
    this.probePositionProperty.reset();
    this.viewerPositionProperty.reset();
  }
}
