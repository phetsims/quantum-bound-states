// Copyright 2026, University of Colorado Boulder

/**
 * QuantumPotentialDepth extends the QuantumPotential base class by adding wellDepthProperty.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

// 'up' - depth is measured upward from the bottom of the well
// 'down' - depth is measured downward from the top of the well
type DepthDirection = 'up' | 'down';

type SelfOptions = {

  // Range of wellDepthProperty in nm.
  wellDepthRange: RangeWithValue;

  // Direction that depth is measured.
  depthDirection: DepthDirection;
};

export type QuantumPotentialDepthOptions = SelfOptions & QuantumPotentialOptions;

export default abstract class QuantumPotentialDepth extends QuantumPotential {

  // Uniform depth of all wells, in eV.
  public readonly wellDepthProperty: NumberProperty;

  // Direction that depth is measured. See DepthDirection.
  public readonly depthDirection: DepthDirection;

  public constructor( providedOptions: QuantumPotentialDepthOptions ) {

    const options = providedOptions;

    super( options );

    this.depthDirection = options.depthDirection;

    this.wellDepthProperty = new NumberProperty( options.wellDepthRange.defaultValue, {
      units: electronVoltsUnit,
      range: options.wellDepthRange,
      tandem: options.tandem.createTandem( 'wellDepthProperty' ),
      phetioFeatured: true,
      phetioReadOnly: ( options.wellDepthRange.getLength() === 0 )
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellDepthProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.changedEmitter.emit();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.wellDepthProperty.reset();
  }
}
