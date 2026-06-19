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

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Create AccessibleListItems, used in the Energy Diagram to describe quantum potentials in an AccessibleList.
   */
  public static createAccessibleListItems( potential: QuantumPotential, potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    let accessibleListItems: AccessibleListItem[] | null = null;
    if ( potential instanceof AsymmetricTrianglePotential ) {
      accessibleListItems = QuantumPotentialDescriber.createAsymmetricTriangleListItems( potential, potentialProperty );
    }
    else if ( potential instanceof CoulombPotential ) {
      accessibleListItems = QuantumPotentialDescriber.createCoulombListItems( potential, potentialProperty );
    }
    else if ( potential instanceof FiniteSquarePotential ) {
      accessibleListItems = QuantumPotentialDescriber.createFiniteSquareListItems( potential, potentialProperty );
    }
    else if ( potential instanceof HarmonicOscillatorPotential ) {
      accessibleListItems = QuantumPotentialDescriber.createHarmonicOscillatorListItems( potential, potentialProperty );
    }
    else if ( potential instanceof InfiniteSquarePotential ) {
      accessibleListItems = QuantumPotentialDescriber.createInfiniteSquareListItems( potential, potentialProperty );
    }
    else if ( potential instanceof InfiniteStepPotential ) {
      accessibleListItems = QuantumPotentialDescriber.createInfiniteStepListItems( potential, potentialProperty );
    }
    else if ( potential instanceof MorsePotential ) {
      accessibleListItems = QuantumPotentialDescriber.createMorseListItems( potential, potentialProperty );
    }
    else if ( potential instanceof PoschlTellerPotential ) {
      accessibleListItems = QuantumPotentialDescriber.createPoschlTellerListItems( potential, potentialProperty );
    }
    affirm( accessibleListItems !== null, 'unexpected potential type' );
    return accessibleListItems;
  }

  /**
   * Create AccessibleListItems for an Asymmetric Triangle potential. Items will be read in the order returns.
   */
  protected static createAsymmetricTriangleListItems( potential: AsymmetricTrianglePotential,
                                                      potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty ),
      QuantumPotentialDescriber.createWellDepthListItem( potential.wellDepthProperty, visibleProperty )
    ];
  }

  /**
   * Create AccessibleListItems for a Coulomb potential. Items will be read in the order returns.
   */
  protected static createCoulombListItems( potential: CoulombPotential,
                                           potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Finite Square potential. Items will be read in the order returns.
   */
  protected static createFiniteSquareListItems( potential: FiniteSquarePotential,
                                                potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    const separationVisibleProperty = new DerivedProperty( [ visibleProperty, potential.numberOfWellsProperty ],
      ( visible, numberOfWells ) => visible && numberOfWells > 1 );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty ),
      QuantumPotentialDescriber.createWellDepthListItem( potential.wellDepthProperty, visibleProperty ),
      QuantumPotentialDescriber.createSeparationListItem( potential.separationProperty, separationVisibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Harmonic Oscillator potential. Items will be read in the order returns.
   */
  protected static createHarmonicOscillatorListItems( potential: HarmonicOscillatorPotential,
                                                      potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for an Infinite Square potential. Items will be read in the order returns.
   */
  protected static createInfiniteSquareListItems( potential: InfiniteSquarePotential,
                                                  potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for an Infinite Step potential. Items will be read in the order returns.
   */
  protected static createInfiniteStepListItems( potential: InfiniteStepPotential,
                                                potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty ),
      QuantumPotentialDescriber.createStepHeightListItem( potential.stepHeightProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Morse potential. Items will be read in the order returns.
   */
  protected static createMorseListItems( potential: MorsePotential,
                                         potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty ),
      QuantumPotentialDescriber.createWellDepthListItem( potential.wellDepthProperty, visibleProperty )
    ];
  }

  /**
   * Creates AccessibleListItems for a Poschl-Teller potential. Items will be read in the order returns.
   */
  protected static createPoschlTellerListItems( potential: PoschlTellerPotential,
                                                potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem[] {
    const visibleProperty = QuantumPotentialDescriber.createAccessibleListItemVisibleProperty( potential, potentialProperty );
    const spacingVisibleProperty = new DerivedProperty( [ visibleProperty, potential.numberOfWellsProperty ],
      ( visible, numberOfWells ) => visible && numberOfWells > 1 );
    return [
      QuantumPotentialDescriber.createEnergyOffsetListItem( potential.yOffsetProperty, potential, potentialProperty ),
      QuantumPotentialDescriber.createWellWidthListItem( potential.wellWidthProperty, visibleProperty ),
      QuantumPotentialDescriber.createWellDepthListItem( potential.wellDepthProperty, visibleProperty ),
      QuantumPotentialDescriber.createSpacingListItem( potential.spacingProperty, spacingVisibleProperty )
    ];
  }

  /**
   * Creates an AccessibleListItem for a potential's energy offset.
   */
  protected static createEnergyOffsetListItem( energyOffsetProperty: TReadOnlyProperty<number>,
                                               potential: QuantumPotential,
                                               potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.energyOffset.createProperty( {
        energyOffset: energyOffsetProperty.derived( energy => toFixed( energy, QBSConstants.Y_OFFSET_DECIMAL_PLACES ) )
      } ),
      visibleProperty: new DerivedProperty( [ potentialProperty ],
        thatPotential => ( thatPotential === potential ) && potential.yOffsetProperty.range.getLength() !== 0 )
    };
  }

  /**
   * Creates an AccessibleListItem for a potential's well width.
   */
  protected static createWellWidthListItem( wellWidthProperty: TReadOnlyProperty<number>,
                                            visibleProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.potentials.accessibleTemplate.listItems.width.createProperty( {
        width: wellWidthProperty.derived( wellWidth => toFixed( wellWidth, QBSConstants.WELL_WIDTH_DECIMAL_PLACES ) )
      } ),
      visibleProperty: visibleProperty
    };
  }

  /**
   * Creates an AccessibleListItem for a potential's well depth.
   */
  protected static createWellDepthListItem( wellDepthProperty: TReadOnlyProperty<number>,
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
  protected static createSeparationListItem( separationProperty: TReadOnlyProperty<number>,
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
  protected static createSpacingListItem( spacingProperty: TReadOnlyProperty<number>,
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
  protected static createStepHeightListItem( stepHeightProperty: TReadOnlyProperty<number>,
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
  protected static createAccessibleListItemVisibleProperty( potential: QuantumPotential,
                                                            potentialProperty: TReadOnlyProperty<QuantumPotential> ): TReadOnlyProperty<boolean> {
    return potentialProperty.derived( thatPotential => potential === thatPotential );
  }
}