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
import optionize from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
  wellDepthRange?: RangeWithValue;
  spacingRange?: RangeWithValue;
};

export type PoschlTellerPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class PoschlTellerPotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;
  public readonly spacingProperty: NumberProperty;

  //TODO spacingProperty

  public constructor( providedOptions: PoschlTellerPotentialOptions ) {

    const options = optionize<PoschlTellerPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,
      wellDepthRange: QBSConstants.WELL_DEPTH_RANGE,
      spacingRange: QBSConstants.SEPARATION_RANGE,

      // QuantumPotentialOptions
      groundStateIndex: 0,
      energyAxisRange: new Range( -20.5, 0.5 ),
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.poschlTellerStringProperty,
      tandemPrefix: 'poschlTellerPotential' //TODO rename to 'anharmonicOscillatorPotential'?
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

    this.spacingProperty = new NumberProperty( options.spacingRange.defaultValue, {
      units: nanometersUnit,
      range: options.spacingRange,
      tandem: options.tandem.createTandem( 'spacingProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink(
      [ this.wellWidthProperty, this.wellDepthProperty, this.spacingProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
    this.spacingProperty.reset();
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    //TODO add support for numberOfWells, electricField, yOffset, xOffset, spacing
    const V0 = this.wellDepthProperty.value;
    const a = this.wellWidthProperty.value;
    const coshVal = Math.cosh( x / a );
    let pe = -V0 / ( coshVal * coshVal );

    // Adjust for y-offset.
    pe += this.yOffsetProperty.value;

    //TODO Taken from FiniteSquarePotential, is this correct?
    // Apply electric field.
    pe += ( this.electricFieldProperty.value * x );

    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.energyAxisRange.min + this.yOffsetProperty.value; // bottom of the y-axis range
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffsetProperty.value; // top of the potential
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    //TODO icon for Poschl-Teller potential
    return new Text( 'icon?', {
      fill: QBSColors.potentialEnergyColorProperty,
      font: QBSConstants.CONTROL_FONT
    } );
  }
}