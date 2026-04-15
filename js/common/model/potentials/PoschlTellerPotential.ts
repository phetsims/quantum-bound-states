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
  wellWidth?: number;
  wellWidthRange?: Range;
  //TODO spacing - This is problematic because width and spacing are related.
};

export type PoschlTellerPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'groundStateIndex' | 'numberOfWellsProperty' | 'electricFieldProperty' | 'tandem'>;

export default class PoschlTellerPotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;

  //TODO spacingProperty

  public constructor( providedOptions: PoschlTellerPotentialOptions ) {

    const options = optionize<PoschlTellerPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidth: QBSConstants.WELL_WIDTH_RANGE.defaultValue,
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,

      // QuantumPotentialOptions
      groundStateIndex: 0,
      initialEnergyAxisRange: new Range( -20.5, 0.5 ),
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.poschlTellerStringProperty,
      tandemPrefix: 'poschlTellerPotential' //TODO rename to 'anharmonicOscillatorPotential'?
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( options.wellWidth, {
      units: nanometersUnit,
      range: options.wellWidthRange,
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.wellDepthProperty = new NumberProperty( QBSConstants.WELL_DEPTH_RANGE.defaultValue, {
      units: electronVoltsUnit,
      range: QBSConstants.WELL_DEPTH_RANGE,
      tandem: options.tandem.createTandem( 'wellDepthProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    //TODO add spacingProperty
    Multilink.multilink(
      [ this.wellWidthProperty, this.wellDepthProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    //TODO add support for numberOfWells, electricField, yOffset, xOffset, spacing?
    const V0 = this.wellDepthProperty.value;
    const a = this.wellWidthProperty.value;
    const coshVal = Math.cosh( x / a );
    return -V0 / ( coshVal * coshVal );
  }

  public override getMinPotentialEnergy(): number {
    return this.energyAxisRangeProperty.value.min; // bottom of the y-axis range
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffsetProperty.value; // top of the potential
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    //TODO icon for Poschl-Teller potential
    return new Text( '?', {
      fill: QBSColors.potentialEnergyColorProperty,
      font: QBSConstants.CONTROL_FONT
    } );
  }
}