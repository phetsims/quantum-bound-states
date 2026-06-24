// Copyright 2026, University of Colorado Boulder

//TODO Rename to 'Anharmonic Oscillator'?
/**
 * PoschlTellerPotential is a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import PoschlTellerSolution from '../solvers/analytical-solutions/PoschlTellerSolution.js';
import { BoundStateResult } from '../solvers/BoundStateResult.js';
import NumerovSolver from '../solvers/NumerovSolver.js';
import XGrid from '../solvers/XGrid.js';
import QuantumPotentialDepth, { QuantumPotentialDepthOptions } from './QuantumPotentialDepth.js';

type SelfOptions = {
  spacingRange?: RangeWithValue;
};

export type PoschlTellerPotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialDepthOptions, 'yOffsetRange' | 'wellWidthRange' | 'wellDepthRange'> &
  PickRequired<QuantumPotentialDepthOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class PoschlTellerPotential extends QuantumPotentialDepth {

  // Uniform spacing between centers of wells, in nm.
  public readonly spacingProperty: NumberProperty;

  public constructor( providedOptions: PoschlTellerPotentialOptions ) {

    const options = optionize<PoschlTellerPotentialOptions, SelfOptions, QuantumPotentialDepthOptions>()( {

      // SelfOptions
      spacingRange: new RangeWithValue( 0, 0, 0 ), // for 1 well, effectively constant zero

      // QuantumPotentialOptions
      groundStateIndex: 0,
      energyAxisRange: new Range( -15, 5 ).dilated( 0.5 ),
      wellWidthRange: new RangeWithValue( 0.1, 1, 0.5 ), // for 1 well
      wellDepthRange: new RangeWithValue( 1, 14, 10 ), // for 1 well
      depthDirection: 'down',
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.poschlTellerStringProperty,
      tandemPrefix: 'poschlTellerPotential' //TODO rename to 'anharmonicOscillatorPotential'?
    }, providedOptions );

    super( options );

    this.spacingProperty = new NumberProperty( options.spacingRange.defaultValue, {
      units: nanometersUnit,
      range: options.spacingRange,
      tandem: ( options.spacingRange.getLength() > 0 ) ? options.tandem.createTandem( 'spacingProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioReadOnly: ( options.spacingRange.getLength() === 0 )
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.spacingProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.changedEmitter.emit();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.spacingProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `xOffset=${this.xOffsetProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           `spacing=${this.spacingProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( this.numberOfWellsProperty.value === 1 && this.electricFieldProperty.value === 0 ) {

      // For single-well and zero electric field, use the analytical solution.
      return PoschlTellerSolution.solve( xGrid, {
        numberOfWells: this.numberOfWellsProperty.value,
        energyMin: this.getMinSolverEnergy(),
        energyMax: this.getMaxSolverEnergy(),
        xOffset: this.xOffsetProperty.value,
        yOffset: this.yOffsetProperty.value,
        wellWidth: this.wellWidthProperty.value,
        wellDepth: this.wellDepthProperty.value,
        electronMasses: this.electronMassesProperty.value,
        electricField: this.electricFieldProperty.value,
        spacing: 0
      } );
    }
    else {

      // For multi-well or with electric field, use Numerov.
      return NumerovSolver.solve(
        xGrid,
        PoschlTellerSolution.createPotentialFunction( {
          numberOfWells: this.numberOfWellsProperty.value,
          xOffset: this.xOffsetProperty.value,
          yOffset: this.yOffsetProperty.value,
          wellWidth: this.wellWidthProperty.value,
          wellDepth: this.wellDepthProperty.value,
          electricField: this.electricFieldProperty.value,
          spacing: this.spacingProperty.value
        } ),
        this.electronMassesProperty.value,
        this.getMinSolverEnergy(),
        this.getMaxSolverEnergy()
      );
    }
  }

  public override getMinSolverEnergy(): number {

    // Getting the precise min energy would be more performant, but that is a "chicken and egg" problem - it requires
    // knowing the potential energies, which currently involves knowing the min energy. But it's not essential that
    // we are precise here - we just need to pick an energy below the potential. So use 3 x wellDepth.
    //TODO Is this OK as a final solution? If not, see git history for previous implementation of getMinSolverEnergy.
    return this.getMaxSolverEnergy() - 3 * this.wellDepthProperty.value;
  }

  /**
   *  Without an electric field the potential asymptotes to yOffset on both sides, so no bound states exist above yOffset.
   *  With a non-zero electric field the Stark effect creates a finite tunneling barrier on the downhill side of the
   *  well: to the left of the leftmost well for E > 0, to the right for E < 0. Let's be conservative and find the
   *  value of the potential at the left most or right most position of our grid.
   */
  public override getMaxSolverEnergy(): number {

    const yOffset = this.yOffsetProperty.value;

    // Electric field will contribute the most where the absolute value of x is largest.
    const xMaxAbsolute = Math.max( Math.abs( QBSConstants.ALL_GRAPHS_X_RANGE.min ), Math.abs( QBSConstants.ALL_GRAPHS_X_RANGE.max ) );

    // Adjust downward by the largest electric field contribution.
    return yOffset - Math.abs( this.getElectricFieldOffset( xMaxAbsolute ) );
  }

  /**
   * Gets the total width of this potential.
   */
  public getTotalWidth(): number {
    return ( ( this.numberOfWellsProperty.value - 1 ) * this.spacingProperty.value ) + this.wellWidthProperty.value;
  }

  /**
   * Creates the icon for this potential. Always shows a single well regardless of numberOfWellsProperty.
   */
  public override createIcon(): Node {

    // Sampling parameters
    const numberOfPoints = 100;
    const xMin = -12;
    const xMax = 12;
    const dx = ( xMax - xMin ) / numberOfPoints;
    const wellWidth = 3;
    const wellDepth = 15;

    // Create the Shape by sampling the curve.
    const shape = new Shape();
    for ( let x = xMin; x <= xMax; x += dx ) {

      const coshValue = Math.cosh( x / wellWidth );
      let y = -wellDepth / ( coshValue * coshValue );

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