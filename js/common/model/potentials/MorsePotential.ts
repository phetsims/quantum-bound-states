// Copyright 2026, University of Colorado Boulder

/**
 * MorsePotential is a quantum potential based on the Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import MorseSolution from '../solver/analytical-solutions/MorseSolution.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import QuantumPotentialDepth, { QuantumPotentialDepthOptions } from './QuantumPotentialDepth.js';

type SelfOptions = EmptySelfOptions;

export type MorsePotentialOptions = SelfOptions &
  Pick<QuantumPotentialDepthOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class MorsePotential extends QuantumPotentialDepth {

  public constructor( providedOptions: MorsePotentialOptions ) {

    const options = optionize<MorsePotentialOptions, SelfOptions, QuantumPotentialDepthOptions>()( {

      // QuantumPotentialOptions
      groundStateIndex: 0,
      xOffset: -2, // shift left so that more of the potential's tail is visible
      energyAxisRange: new Range( -15, 5 ).dilated( 0.5 ),
      wellWidthRange: new RangeWithValue( 0.1, 1, 1 ), // for 1 well
      wellDepthRange: new RangeWithValue( 1.5, 15, 10 ), // for 1 well
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.morseStringProperty,
      tandemPrefix: 'morsePotential'
    }, providedOptions );

    super( options );
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
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'MorsePotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'MorsePotential does not support electric field.' );
    }
    return MorseSolution.solve( xGrid, {
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
    return this.yOffsetProperty.value - this.wellDepthProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value; // dissociation limit; no bound states above this
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {

    // Sampling parameters
    const numberOfPoints = 50;
    const xMin = -1.4; // more negative shows more of the left edge that goes to infinity
    const xMax = 15;
    const dx = ( xMax - xMin ) / numberOfPoints;
    const wellWidth = 1.7;
    const wellDepth = 10.1;

    // Create the Shape by sampling the curve.
    const shape = new Shape();
    for ( let x = xMin; x <= xMax; x += dx ) {

      //TODO Duplication here with getPotentialEnergyAt
      const term = 1 - Math.exp( -x / wellWidth );
      let y = ( wellDepth * term * term ) - wellDepth;

      y *= -1; // invert the y-axis to match scenery's coordinate frame
      if ( x === xMin ) {
        shape.moveTo( x, y );
      }
      else {
        shape.lineTo( x, y );
      }
    }

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}