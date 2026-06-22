// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTrianglePotential is a quantum potential composed of 1 asymmetric triangle well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import AsymmetricTriangleSolution from '../solver/analytical-solutions/AsymmetricTriangleSolution.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import { QuantumPotentialOptions } from './QuantumPotential.js';
import QuantumPotentialDepth, { QuantumPotentialDepthOptions } from './QuantumPotentialDepth.js';

type SelfOptions = EmptySelfOptions;

type AsymmetricTrianglePotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'yOffsetRange'> &
  PickRequired<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class AsymmetricTrianglePotential extends QuantumPotentialDepth {

  public constructor( providedOptions: AsymmetricTrianglePotentialOptions ) {

    const options = optionize<AsymmetricTrianglePotentialOptions, SelfOptions, QuantumPotentialDepthOptions>()( {

      // QuantumPotentialOptions
      wellWidthRange: new RangeWithValue( 0.5, 6, 1 ), // for 1 well
      wellDepthRange: new RangeWithValue( 1, 18, 10 ), // for 1 well
      depthDirection: 'up',
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.asymmetricTriangleStringProperty,
      tandemPrefix: 'asymmetricTrianglePotential'
    }, providedOptions );

    super( options );
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `xOffset=${this.xOffsetProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'AsymmetricTrianglePotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'AsymmetricTrianglePotential does not support electric field.' );
    }

    return AsymmetricTriangleSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy(),
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      wellWidth: this.wellWidthProperty.value,
      wellDepth: this.wellDepthProperty.value,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value
    } );
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
