// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquarePotential is a quantum potential composed of 1 infinite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js';  // eslint-disable-line phet/no-view-imported-from-model
import InfiniteSquareSolution from '../solver/analytical-solutions/InfiniteSquareSolution.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
};

export type InfiniteSquarePotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class InfiniteSquarePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;

  public constructor( providedOptions: InfiniteSquarePotentialOptions ) {

    const options = optionize<InfiniteSquarePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteSquareStringProperty,
      tandemPrefix: 'infiniteSquarePotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( options.wellWidthRange.defaultValue, {
      units: nanometersUnit,
      //TODO range.min should be 0.1, but wellWidth < 0.2 causes assertion failure, no eigenvalues
      // range: options.wellWidthRange,
      range: new Range( 0.2, 6 ),
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty ], () => this.propertyChangedEmitter.emit() );
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
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'InfiniteSquarePotential does not support multiple wells.' );
    affirm( this.electricFieldProperty.value === 0, 'InfiniteSquarePotential does not support electric field.' );

    const wellWidth = 2; //this.wellWidthProperty.value;
    const leftX = this.xOffset - wellWidth / 2;
    const rightX = this.xOffset + wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      pe = this.yOffsetProperty.value;
    }
    else {
      // outside the well
      pe = QBSConstants.EFFECTIVELY_INFINITE_ENERGY;
    }
    return pe;
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.energyAxisRange.max + this.yOffsetProperty.value; // top of the y-axis range
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid, electronMasses: number ): BoundStateResult {
    return InfiniteSquareSolution.solve(
      xGrid, this.wellWidthProperty.value, electronMasses,
      this.getMinSolverEnergy(), this.getMaxSolverEnergy(),
      this.xOffset, this.yOffsetProperty.value
    );
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new InfiniteSquareWellIcon( {
      wellWidth: 12,
      wellDepth: 12
    } );
  }
}
