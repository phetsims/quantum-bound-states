// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepPotential is a quantum potential composed of 1 infinite step well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential from './QuantumPotential.js';

export default class InfiniteStepPotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;

  // Height of the potential step V₀ in eV, applies to the right half of the well.
  public readonly stepHeightProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite step well.'
    } );

    this.wellWidthProperty = new NumberProperty( 1, {
      units: nanometersUnit,
      range: new Range( 0.1, 6 ),
      tandem: tandem.createTandem( 'wellWidthProperty' )
    } );

    this.stepHeightProperty = new NumberProperty( 3, {
      units: electronVoltsUnit,
      range: new Range( 0.1, 10 ),
      tandem: tandem.createTandem( 'stepHeightProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.stepHeightProperty.reset();
  }

  public override getPotentialEnergyAt( x: number ): number {
    //TODO affirm 1 well
    const wellWidth = this.wellWidthProperty.value;
    const leftX = this.xOffset - wellWidth / 2;
    const rightX = this.xOffset + wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      if ( x <= leftX + wellWidth / 2 ) {
        // to the left of the step
        pe = this.yOffset;
      }
      else {
        // at the step
        pe = this.yOffset + this.stepHeightProperty.value;
      }
    }
    else {
      // outside the well
      pe = QBSConstants.EFFECTIVELY_INFINITE_ENERGY;
    }
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new InfiniteSquareWellIcon( {
      wellWidth: 12,
      wellDepth: 12,
      hasStep: true
    } );
  }
}
