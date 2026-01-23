// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLine is the model for the reference line, a vertical line that connects the same x-coordinate in all graphs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';

export default class ReferenceLine extends PhetioObject {

  // Whether the reference line is visible.
  public readonly visibleProperty: Property<boolean>;

  // The reference line's x position, in model coordinates.
  public readonly xProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.visibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'visibleProperty' ),
      phetioFeatured: true
    } );

    this.xProperty = new NumberProperty( 0, {
      range: QBSConstants.ALL_GRAPHS_X_RANGE,
      tandem: tandem.createTandem( 'xProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.visibleProperty.reset();
    this.xProperty.reset();
  }
}

quantumBoundStates.register( 'ReferenceLine', ReferenceLine );