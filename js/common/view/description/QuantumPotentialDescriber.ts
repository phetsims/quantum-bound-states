// Copyright 2026, University of Colorado Boulder

/**
 * QuantumPotentialDescriber creates core descriptions for a QuantumPotential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { AccessibleListItem } from '../../../../../scenery-phet/js/accessibility/AccessibleList.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSConstants from '../../QBSConstants.js';

export default class QuantumPotentialDescriber {

  // The selected potential.
  private readonly potentialProperty: TReadOnlyProperty<QuantumPotential>;

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential> ) {
    this.potentialProperty = potentialProperty;
  }

  /**
   * Create AccessibleListItems, used in the Energy Diagram to describe quantum potentials in an AccessibleList.
   */
  public createAccessibleListItems( potential: QuantumPotential ): AccessibleListItem[] {
    let accessibleListItems: AccessibleListItem[] | null = null;
    if ( potential instanceof AsymmetricTrianglePotential ) {
      accessibleListItems = this.createAsymmetricTriangleListItems( potential );
    }
    else if ( potential instanceof CoulombPotential ) {
      accessibleListItems = this.createCoulombListItems( potential );
    }
    else if ( potential instanceof FiniteSquarePotential ) {
      accessibleListItems = this.createFiniteSquareListItems( potential );
    }
    else if ( potential instanceof HarmonicOscillatorPotential ) {
      accessibleListItems = this.createHarmonicOscillatorListItems( potential );
    }
    else if ( potential instanceof InfiniteSquarePotential ) {
      accessibleListItems = this.createInfiniteSquareListItems( potential );
    }
    else if ( potential instanceof InfiniteStepPotential ) {
      accessibleListItems = this.createInfiniteStepListItems( potential );
    }
    else if ( potential instanceof MorsePotential ) {
      accessibleListItems = this.createMorseListItems( potential );
    }
    else if ( potential instanceof PoschlTellerPotential ) {
      accessibleListItems = this.createPoschlTellerListItems( potential );
    }
    affirm( accessibleListItems !== null, 'unexpected potential type' );
    return accessibleListItems;
  }

  /**
   * Create AccessibleListItems for an Asymmetric Triangle potential. Items will be read in the order returns.
   */
  protected createAsymmetricTriangleListItems( potential: AsymmetricTrianglePotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty ),
      this.createWellDepthListItem( potential.wellDepthProperty, visibleProperty )
    ];
  }

  /**
   * Create AccessibleListItems for a Coulomb potential. Items will be read in the order returns.
   */
  protected createCoulombListItems( potential: CoulombPotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Finite Square potential. Items will be read in the order returns.
   */
  protected createFiniteSquareListItems( potential: FiniteSquarePotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    const separationVisibleProperty = new DerivedProperty( [ visibleProperty, potential.numberOfWellsProperty ],
      ( visible, numberOfWells ) => visible && numberOfWells > 1 );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty ),
      this.createWellDepthListItem( potential.wellDepthProperty, visibleProperty ),
      this.createSeparationListItem( potential.separationProperty, separationVisibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Harmonic Oscillator potential. Items will be read in the order returns.
   */
  protected createHarmonicOscillatorListItems( potential: HarmonicOscillatorPotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for an Infinite Square potential. Items will be read in the order returns.
   */
  protected createInfiniteSquareListItems( potential: InfiniteSquarePotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for an Infinite Step potential. Items will be read in the order returns.
   */
  protected createInfiniteStepListItems( potential: InfiniteStepPotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty ),
      this.createStepHeightListItem( potential.stepHeightProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Morse potential. Items will be read in the order returns.
   */
  protected createMorseListItems( potential: MorsePotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty ),
      this.createWellDepthListItem( potential.wellDepthProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Poschl-Teller potential. Items will be read in the order returns.
   */
  protected createPoschlTellerListItems( potential: PoschlTellerPotential ): AccessibleListItem[] {
    const visibleProperty = this.createAccessibleListItemVisibleProperty( potential );
    const spacingVisibleProperty = new DerivedProperty( [ visibleProperty, potential.numberOfWellsProperty ],
      ( visible, numberOfWells ) => visible && numberOfWells > 1 );
    return [
      this.createEnergyOffsetListItem( potential.yOffsetProperty, potential ),
      this.createWellWidthListItem( potential.wellWidthProperty, potential.wellWidthDecimalPlaces, visibleProperty ),
      this.createWellDepthListItem( potential.wellDepthProperty, visibleProperty ),
      this.createSpacingListItem( potential.spacingProperty, spacingVisibleProperty )
    ];
  }

  /**
   * Creates an AccessibleListItem for a potential's energy offset.
   */
  protected createEnergyOffsetListItem( energyOffsetProperty: TReadOnlyProperty<number>,
                                        potential: QuantumPotential ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.energyOffset.createProperty( {
        energyOffset: energyOffsetProperty.derived( energy => toFixed( energy, QBSConstants.Y_OFFSET_DECIMAL_PLACES ) )
      } ),
      visibleProperty: new DerivedProperty( [ this.potentialProperty ],
        thatPotential => ( thatPotential === potential ) && potential.yOffsetProperty.range.getLength() !== 0 )
    };
  }

  /**
   * Creates an AccessibleListItem for a potential's well width.
   */
  protected createWellWidthListItem( wellWidthProperty: TReadOnlyProperty<number>,
                                     wellWidthDecimalPlaces: number,
                                     visibleProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.width.createProperty( {
        width: wellWidthProperty.derived( wellWidth => toFixed( wellWidth, wellWidthDecimalPlaces ) )
      } ),
      visibleProperty: visibleProperty
    };
  }

  /**
   * Creates an AccessibleListItem for a potential's well depth.
   */
  protected createWellDepthListItem( wellDepthProperty: TReadOnlyProperty<number>,
                                     visibleProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.depth.createProperty( {
        depth: wellDepthProperty.derived( wellDepth => toFixed( wellDepth, QBSConstants.WELL_DEPTH_DECIMAL_PLACES ) )
      } ),
      visibleProperty: visibleProperty
    };
  }

  /**
   * Creates an AccessibleListItem for a Finite Square potential's separation.'
   */
  protected createSeparationListItem( separationProperty: TReadOnlyProperty<number>,
                                      visibleProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.separation.createProperty( {
        separation: separationProperty.derived( separation => toFixed( separation, QBSConstants.SEPARATION_DECIMAL_PLACES ) )
      } ),
      visibleProperty: visibleProperty
    };
  }

  /**
   * Creates an AccessibleListItem for a Poschl-Teller potential's spacing.'
   */
  protected createSpacingListItem( spacingProperty: TReadOnlyProperty<number>,
                                   visibleProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.spacing.createProperty( {
        spacing: spacingProperty.derived( spacing => toFixed( spacing, QBSConstants.SPACING_DECIMAL_PLACES ) )
      } ),
      visibleProperty: visibleProperty
    };
  }

  /**
   * Creates an AccessibleListItem for an Infinite Step potential's step height.'
   */
  protected createStepHeightListItem( stepHeightProperty: TReadOnlyProperty<number>,
                                      visibleProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.stepHeight.createProperty( {
        stepHeight: stepHeightProperty.derived( stepHeight => toFixed( stepHeight, QBSConstants.STEP_HEIGHT_DECIMAL_PLACES ) )
      } ),
      visibleProperty: visibleProperty
    };
  }

  /**
   * Creates the visibleProperty that determines whether an AccessibleListItem should be visible. The default is
   * to show the AccessibleListItem when the potentialProperty is selected.
   */
  protected createAccessibleListItemVisibleProperty( potential: QuantumPotential ): TReadOnlyProperty<boolean> {
    return this.potentialProperty.derived( thatPotential => potential === thatPotential );
  }
}