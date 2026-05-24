// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTrianglePotential is a quantum potential composed of 1 asymmetric triangle well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
  wellDepthRange?: RangeWithValue;
};

export type AsymmetricTrianglePotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'xOffsetRange' | 'yOffsetRange' | 'tandem'>;

export default class AsymmetricTrianglePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;

  public constructor( providedOptions: AsymmetricTrianglePotentialOptions ) {

    const options = optionize<AsymmetricTrianglePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: new RangeWithValue( 0.1, 6, 1 ),
      wellDepthRange: new RangeWithValue( 0.1, 20, 10 ),

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.asymmetricTriangleStringProperty,
      tandemPrefix: 'asymmetricTrianglePotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( options.wellWidthRange.defaultValue, {
      units: nanometersUnit,
      range: options.wellWidthRange,
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.wellDepthProperty = new NumberProperty( options.wellDepthRange.defaultValue, {
      units: electronVoltsUnit,
      range: options.wellDepthRange,
      tandem: options.tandem.createTandem( 'wellDepthProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty, this.wellDepthProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.changedEmitter.emit();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution where available.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( this.numberOfWellsProperty.value === 1 && this.electricFieldProperty.value === 0 ) {
      
      // TODO: this is not ready for prime time
      // return AsymmetricTriangleSolution.solve( xGrid, {
      //   numberOfWells: this.numberOfWellsProperty.value,
      //   energyMin: this.getMinSolverEnergy(),
      //   energyMax: this.getMaxSolverEnergy(),
      //   xOffset: this.xOffsetProperty.value,
      //   yOffset: this.yOffsetProperty.value,
      //   wellWidth: this.wellWidthProperty.value,
      //   wellDepth: this.wellDepthProperty.value,
      //   electronMasses: this.electronMassesProperty.value,
      //   electricField: this.electricFieldProperty.value
      // } );

      return super.solveBoundState( xGrid );
    }
    else {
      return super.solveBoundState( xGrid );
    }
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public override getPotentialEnergyAt( x: number ): number {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'AsymmetricTrianglePotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'AsymmetricTrianglePotential does not support electric field.' );
    }

    const wellWidth = this.wellWidthProperty.value;
    const wellDepth = this.wellDepthProperty.value;
    const xOffset = this.xOffsetProperty.value;
    const yOffset = this.yOffsetProperty.value;

    // From BSAsymmetricPotential.java
    let pe = yOffset + wellDepth;
    if ( Math.abs( x - xOffset ) <= wellWidth / 2 ) {
      pe = yOffset + ( wellDepth - ( Math.abs( xOffset + wellWidth / 2 - x ) * wellDepth / wellWidth ) );
    }

    affirm( pe < QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY );
    return pe;
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value + this.wellDepthProperty.value; // top of the well
  }

  public override createIcon(): Node {

    const wellWidth = 12;
    const wellDepth = 12;
    const edgeLength = 8; // horizontal length of the edges that extend to the left and right of the well

    // Described from left to right
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( edgeLength, 0 )
      .lineTo( edgeLength, wellDepth )
      .lineTo( edgeLength + wellWidth, 0 )
      .lineTo( edgeLength + wellWidth + edgeLength, 0 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
