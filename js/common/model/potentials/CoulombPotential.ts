// Copyright 2026, University of Colorado Boulder

/**
 * CoulombPotential is a quantum potential composed of 1 Coulomb well.
*
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
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
import CoulombSolution from '../solver/analytical-solutions/CoulombSolution.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
};

export type CoulombPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electronMassesProperty' | 'electricFieldProperty' | 'xOffsetRange' | 'yOffsetRange' | 'tandem'>;

export default class CoulombPotential extends QuantumPotential {

  // The energy (eV above the well minimum) at which the classical turning-point width is measured.
  // At that energy the turning point is r = coupling / WIDTH_HANDLE_ENERGY, giving
  // full width w = 2r, so coupling = w * WIDTH_HANDLE_ENERGY / 2.
  public static readonly WIDTH_HANDLE_ENERGY = 4; // eV

  public readonly wellWidthProperty: NumberProperty;
  private readonly couplingProperty: TReadOnlyProperty<number>;

  public constructor( providedOptions: CoulombPotentialOptions ) {

    const options = optionize<CoulombPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      // Range of well widths, in nanometemers. Default width gives coupling = 0.72 * 4 / 2 = 1.44 eV·nm (the physical ke²).
      // It is worth noting that the coupling is proportional to the well width, so the range of well widths corresponds 
      // to a range of couplings. For example, the default width of 0.72 nm gives a coupling of 1.44 eV·nm, 
      // which is the physical value of ke² and reproduces the standard behavior. (E_1 =-13.6 eV, E_2 =-3.4 eV, etc) 
      // Therefore do not change the default without talking to a designer,
      // as it would change the default coupling and thus the default behavior of the simulation.
      // The Java reference did not have a well width parameter, but the coupling was effectively 1.44 eV·nm, so the default width is set to give that coupling.
      // A more physical model would tune the bohr radius, but this is not a good UI fit for the sim's scale
      //TODO https://github.com/phetsims/quantum-bound-states/issues/64 0.72 is problematic because we show 1 decimal place for well width. Can we use 0.7?
      wellWidthRange: new RangeWithValue( 0.2, 0.72, 0.72 ),

      // QuantumPotentialOptions
      energyAxisRange: new Range( -15, 5 ).dilated( 0.5 ),
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.coulombStringProperty,
      tandemPrefix: 'coulombPotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( options.wellWidthRange.defaultValue, {
      units: nanometersUnit,
      range: options.wellWidthRange,
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    // coupling K = w * E_ref / 2, where w is the well width and E_ref = WIDTH_HANDLE_ENERGY.
    this.couplingProperty = new DerivedProperty( [ this.wellWidthProperty ],
      wellWidth => wellWidth * CoulombPotential.WIDTH_HANDLE_ENERGY / 2
    );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.changedEmitter.emit();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'CoulombPotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'CoulombPotential does not support electric field.' );
    }
    return CoulombSolution.solve( xGrid, {
      numberOfWells: this.numberOfWellsProperty.value,
      energyMin: this.getMinSolverEnergy(),
      energyMax: this.getMaxSolverEnergy(),
      xOffset: this.xOffsetProperty.value,
      yOffset: this.yOffsetProperty.value,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value,
      coupling: this.couplingProperty.value
    } );
  }

  public override getMinSolverEnergy(): number {
    return this.energyAxisRange.min + this.yOffsetProperty.value; // bottom of the y-axis range
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value; // top of the potential
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 4 )
      .quadraticCurveTo( 8, 5, 7, 16 )
      .moveTo( 10, 16 )
      .quadraticCurveTo( 11, 5, 17, 4 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
