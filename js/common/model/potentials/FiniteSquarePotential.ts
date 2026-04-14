// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  numberOfWells?: number;
  separation?: number;
};

export type FiniteSquarePotentialOptions = SelfOptions &
  PickOptional<QuantumPotentialOptions, 'visualNameProperty' | 'tandemPrefix' | 'phetioDocumentation'> &
  PickRequired<QuantumPotentialOptions, 'tandem'>;

export default class FiniteSquarePotential extends QuantumPotential {

  //TODO Temporary constants, same as initial state of Java version.
  private readonly electricField = 0; //TODO Java [-1,1] V/nm

  public readonly numberOfWellsProperty: NumberProperty;
  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;
  public readonly separationProperty: NumberProperty; // distance between walls of adjacent wells

  public constructor( providedOptions: FiniteSquarePotentialOptions ) {

    const options = optionize<FiniteSquarePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      numberOfWells: 1,
      separation: 0.1,

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential',
      phetioDocumentation: 'A quantum potential composed of one or more finite square wells.'
    }, providedOptions );

    super( options );

    this.numberOfWellsProperty = new NumberProperty( options.numberOfWells, {
      numberType: 'Integer',
      range: QBSConstants.NUMBER_OF_WELLS_RANGE,
      tandem: options.tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.wellWidthProperty = new NumberProperty( 1, {
      units: nanometersUnit,
      range: new Range( 0.1, 6 ),
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.wellDepthProperty = new NumberProperty( 10, {
      units: electronVoltsUnit,
      range: new Range( 0.1, 20 ),
      tandem: options.tandem.createTandem( 'wellDepthProperty' ),
      phetioFeatured: true
    } );

    this.separationProperty = new NumberProperty( options.separation, {
      units: nanometersUnit,
      range: new Range( 0.05, 0.7 ),
      tandem: options.tandem.createTandem( 'separationProperty' ),
      phetioFeatured: true
    } );

    Multilink.multilink(
      [ this.numberOfWellsProperty, this.wellWidthProperty, this.wellDepthProperty, this.separationProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.numberOfWellsProperty.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
    this.separationProperty.reset();
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWellsProperty.value;
    const wellWidth = this.wellWidthProperty.value;
    const xOffset = this.xOffset;
    const yOffset = this.yOffset;
    const s = wellWidth + this.separationProperty.value;

    let pe = yOffset + this.wellDepthProperty.value;

    // From BSSquarePotential.java
    for ( let i = 1; i <= n; i++ ) {
      const xi = s * ( i - ( ( n + 1 ) / 2 ) );
      if ( ( ( x - xOffset ) >= xi - ( wellWidth / 2 ) ) && ( ( x - xOffset ) <= xi + ( wellWidth / 2 ) ) ) {
        pe = yOffset;
        break;
      }
    }

    // Apply electric field.
    pe += ( this.electricField * x );

    affirm( pe < 100000 );
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffset + this.wellDepthProperty.value;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 1,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 8,
      lineWidth: 2
    } );
  }
}
