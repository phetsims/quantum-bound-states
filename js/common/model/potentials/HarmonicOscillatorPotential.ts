// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorPotential is a quantum potential composed of 1 harmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import NumberIO from '../../../../../tandem/js/types/NumberIO.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QBSTime from '../QBSTime.js';
import HarmonicOscillatorSolution from '../solvers/analytical-solutions/HarmonicOscillatorSolution.js';
import { BoundStateResult } from '../solvers/BoundStateResult.js';
import XGrid from '../solvers/XGrid.js';
import { inverseFemtosecondsUnit } from '../../../../../scenery-phet/js/units/inverseFemtosecondsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

export type HarmonicOscillatorPotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'yOffsetRange'> &
  PickRequired<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'tandem'>;

export default class HarmonicOscillatorPotential extends QuantumPotential {

  // This is the y-coordinate where well width is measured, in eV above yOffset.
  public static readonly WIDTH_HANDLE_ENERGY = 4;

  // Angular frequency in fs^-1.
  public readonly angularFrequencyProperty: TReadOnlyProperty<number>;

  public constructor( electronMassesProperty: TReadOnlyProperty<number>, providedOptions: HarmonicOscillatorPotentialOptions ) {

    const options = optionize<HarmonicOscillatorPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      groundStateIndex: 0,
      wellWidthRange: new RangeWithValue( 0.1, 3, 1 ), // for 1 well
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.harmonicOscillatorStringProperty,
      tandemPrefix: 'harmonicOscillatorPotential'
    }, providedOptions );

    super( options );

    // Calculate the angular frequency: ω = (2/width)*sqrt(2E/m)
    this.angularFrequencyProperty = new DerivedProperty( [ this.wellWidthProperty, electronMassesProperty ],
      ( wellWidth, electronMasses ) => {
        const energy = HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY;

        // in rad/(natural time unit of 2.385 x10^-15 sec)
        const angularFrequency = ( 2 / wellWidth ) * Math.sqrt( 2 * energy / electronMasses );

        // Convert from 1/(natural time unit) to 1/femtoseconds
        return angularFrequency / QBSTime.NATURAL_TIME_UNIT_FS;
      }, {
        units: inverseFemtosecondsUnit,
        tandem: options.tandem.createTandem( 'angularFrequencyProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `xOffset=${this.xOffsetProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'HarmonicOscillatorPotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'HarmonicOscillatorPotential does not support electric field.' );
    }
    return HarmonicOscillatorSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      wellWidth: this.wellWidthProperty.value,
      energyAtWellWidth: HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY,
      electricField: this.electricFieldProperty.value,
      electronMasses: this.electronMassesProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy()
    } );
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {

    // The harmonic oscillator has infinitely many bound states, so there is no physical maximum energy.
    // Cap the search at a fixed energy above the well bottom, independent of the Energy diagram's viewport.
    return QBSConstants.MAX_SOLVER_ENERGY_ABOVE_WELL + this.yOffsetProperty.value;
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 3 )
      .quadraticCurveTo( 8.5, 30, 17, 3 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
