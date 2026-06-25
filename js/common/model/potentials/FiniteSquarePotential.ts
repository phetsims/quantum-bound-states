// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareSolution from '../solvers/analytical-solutions/FiniteSquareSolution.js';
import BoundStateResult from '../solvers/BoundStateResult.js';
import NumerovSolver from '../solvers/NumerovSolver.js';
import XGrid from '../solvers/XGrid.js';
import QuantumPotentialDepth, { QuantumPotentialDepthOptions } from './QuantumPotentialDepth.js';

type SelfOptions = {
  separationRange?: RangeWithValue;
};

export type FiniteSquarePotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialDepthOptions, 'yOffsetRange' | 'wellWidthRange' | 'wellWidthDecimalPlaces' | 'wellDepthRange' | 'visualNameProperty' | 'tandemPrefix'> &
  PickRequired<QuantumPotentialDepthOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class FiniteSquarePotential extends QuantumPotentialDepth {

  // Distance between walls of adjacent wells, in nm.
  public readonly separationProperty: NumberProperty;

  public constructor( providedOptions: FiniteSquarePotentialOptions ) {

    const options = optionize<FiniteSquarePotentialOptions, SelfOptions, QuantumPotentialDepthOptions>()( {

      // SelfOptions
      separationRange: new RangeWithValue( 0, 0, 0 ), // for 1 well, effectively constant zero

      // QuantumPotentialOptions
      yAxisRange: new Range( 0, 20 ).dilated( 0.5 ),
      wellDepthRange: new RangeWithValue( 1, 19, 10 ), // for 1 well
      wellWidthRange: new RangeWithValue( 0.5, 6, 1 ), // for 1 well
      depthDirection: 'up',
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential'
    }, providedOptions );

    super( options );

    this.separationProperty = new NumberProperty( options.separationRange.defaultValue, {
      units: nanometersUnit,
      range: options.separationRange,
      tandem: ( options.separationRange.getLength() > 0 ) ? options.tandem.createTandem( 'separationProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.separationProperty ], () => this.changedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.separationProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `xOffset=${this.xOffsetProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           `separation=${this.separationProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( this.numberOfWellsProperty.value === 1 && this.electricFieldProperty.value === 0 ) {

      // For single-well without electric field, use the analytical solution.
      return FiniteSquareSolution.solve( xGrid, {
        numberOfWells: this.numberOfWellsProperty.value,
        energyMin: this.getMinSolverEnergy(),
        energyMax: this.getMaxSolverEnergy(),
        xOffset: this.xOffsetProperty.value,
        yOffset: this.yOffsetProperty.value,
        wellWidth: this.wellWidthProperty.value,
        wellDepth: this.wellDepthProperty.value,
        electronMasses: this.electronMassesProperty.value,
        electricField: this.electricFieldProperty.value,
        separation: 0
      } );
    }
    else {

      // For multi-well or with electric field, use Numerov.
      return NumerovSolver.solve(
        xGrid,
        FiniteSquareSolution.createPotentialFunction( {
          numberOfWells: this.numberOfWellsProperty.value,
          xOffset: this.xOffsetProperty.value,
          yOffset: this.yOffsetProperty.value,
          wellWidth: this.wellWidthProperty.value,
          wellDepth: this.wellDepthProperty.value,
          electricField: this.electricFieldProperty.value,
          separation: this.separationProperty.value
        } ),
        this.electronMassesProperty.value,
        this.getMinSolverEnergy(),
        this.getMaxSolverEnergy()
      );
    }
  }

  public override getMinSolverEnergy(): number {
    const yOffset = this.yOffsetProperty.value;
    const xMin = QBSConstants.ALL_GRAPHS_X_RANGE.min;
    const xMax = QBSConstants.ALL_GRAPHS_X_RANGE.max;

    // The bottom of the well, adjusted for the electric field at the domain boundaries.
    // With an electric field, the well bottom is tilted as V(x) = yOffset + electricField * x, so the deepest
    // point is lowered by the most negative field offset at the edges of the domain. Without a field this
    // reduces to yOffset.
    return yOffset + Math.min( this.getElectricFieldOffset( xMin ), this.getElectricFieldOffset( xMax ) );
  }

  public override getMaxSolverEnergy(): number {
    const yOffset = this.yOffsetProperty.value;
    const wellDepth = this.wellDepthProperty.value;
    const xMin = QBSConstants.ALL_GRAPHS_X_RANGE.min;
    const xMax = QBSConstants.ALL_GRAPHS_X_RANGE.max;

    // The top of the well, adjusted for the electric field at the domain boundaries.
    // With an electric field, the asymptotic potential outside the well is tilted as V(x) = yOffset + wellDepth + electricField * x.
    // Bound states can only exist below the lower of the two asymptotic barriers at the edges of the domain.
    return yOffset + wellDepth + Math.min( this.getElectricFieldOffset( xMin ), this.getElectricFieldOffset( xMax ) );
  }

  /**
   * Gets the total width of this potential, the sum of the well widths and the spacing between the wells.
   */
  public getTotalWidth(): number {
    return ( this.numberOfWellsProperty.value * this.wellWidthProperty.value ) +
           ( ( this.numberOfWellsProperty.value - 1 ) * this.separationProperty.value );
  }
}
