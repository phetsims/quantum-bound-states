// Copyright 2026, University of Colorado Boulder

/**
 * CoulombPotential is a quantum potential composed of 1 Coulomb well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
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

  public readonly wellWidthProperty: NumberProperty;

  public constructor( providedOptions: CoulombPotentialOptions ) {

    const options = optionize<CoulombPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: new RangeWithValue( 0.1, 6, 1 ), // for 1 well

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
      wellWidth: this.wellWidthProperty.value,
      electronMasses: this.electronMassesProperty.value,
      electricField: this.electricFieldProperty.value
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
