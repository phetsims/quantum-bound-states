// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelDisplay displays an energy level identifier (E1, E2, etc.) and the corresponding energy value in eV.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BackgroundNode, { BackgroundNodeOptions } from '../../../../scenery-phet/js/BackgroundNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

// A large number of decimal places is indeed needed to differentiate between closely-spaced energy levels.
// For example, see E0 and E1 for Poschl-Teller in the Two Wells screen with depth=10 and spacing=3.
const NUMBER_OF_DECIMAL_PLACES_RANGE = new Range( 2, 13 );

type SelfOptions = EmptySelfOptions;

export type EnergyLevelDisplayOptions = SelfOptions & NodeTranslationOptions & PickRequired<BackgroundNode, 'tandem'>;

export default class EnergyLevelDisplay extends BackgroundNode {

  public constructor( model: QBSModel,
                      energyLevelIndexProperty: TReadOnlyProperty<number | null>,
                      chartTransform: ChartTransform,
                      providedOptions: EnergyLevelDisplayOptions ) {

    const options = optionize<EnergyLevelDisplayOptions, SelfOptions, BackgroundNodeOptions>()( {
      isDisposable: false,
      pickable: true, // So that we cannot pick through this to elements behind it.
      xMargin: 4,
      yMargin: 2,
      rectangleOptions: {
        cornerRadius: 3,
        fill: QBSColors.energyLevelDisplayBackgroundFillProperty,
        stroke: QBSColors.energyLevelDisplayBackgroundStrokeProperty,
        opacity: 1 // use alpha in fill
      },
      visibleProperty: energyLevelIndexProperty.derived( energyLevelIndex => energyLevelIndex !== null )
    }, providedOptions );

    // When 'Values' is checked, show the label and value for the energy level.
    // When 'Values' is not checked, show only the label.
    // See https://github.com/phetsims/quantum-bound-states/issues/82
    const stringProperty = new DerivedStringProperty(
      [ energyLevelIndexProperty, model.energyDiagram.valuesVisibleProperty, model.boundStateResultProperty ],
      ( energyLevelIndex, valuesVisible, boundStateResult ) => {
        if ( energyLevelIndex === null ) {
          return '';
        }
        else if ( valuesVisible ) {
          const decimalPlaces = EnergyLevelDisplay.getNumberOfDecimalPlaces( energyLevelIndex,
            model.potentialProperty.value.groundStateIndex, boundStateResult.energies );
          const energy = toFixed( model.getEnergyAtEnergyLevel( energyLevelIndex ), decimalPlaces );
          return `E<sub>${energyLevelIndex}</sub> = ${energy} eV`;
        }
        else {
          return `E<sub>${energyLevelIndex}</sub>`;
        }
      } );

    const content = new RichText( stringProperty, {
      font: QBSConstants.ENERGY_LEVEL_FONT
    } );

    super( content, options );

    // Position the label above its associated line in the Energy Diagram.
    Multilink.multilink(
      [ energyLevelIndexProperty, model.boundStateResultProperty, model.energyDiagram.yRangeProperty ],
      ( energyLevelIndex, boundStateResult, yRange ) => {
        if ( energyLevelIndex !== null && model.isValidEnergyLevelIndex( energyLevelIndex ) ) {
          const energy = model.getEnergyAtEnergyLevel( energyLevelIndex );
          this.bottom = chartTransform.modelToViewY( energy ) - 3;
        }
      } );
  }

  /**
   * Computes the number of decimal places needed to show the difference between a specified energy level and
   * the energy levels that are adjacent to it. This algorithm is a port from the Java version, see BSEigenstatesNode.java.
   */
  public static getNumberOfDecimalPlaces( energyLevelIndex: number, groundStateIndex: number, energies: number[] ): number {

    // Index and energy value that correspond to energyLevelIndex.
    const index = energyLevelIndex - groundStateIndex;
    affirm( index >= 0 && index < energies.length, `invalid index: ${index}` );
    const energy = energies[ index ];

    // Find the smallest difference between the selected energy level and the adjacent energy levels.
    let difference = 1000; // an arbitrarily large value, in eV

    // Adjacent lower energy level
    if ( index > 0 ) {
      difference = Math.abs( energy - energies[ index - 1 ] );
      affirm( difference !== 0,
        `Adjacent energy levels must have different energies: E${index}=${energy} E${index - 1}=${energies[ index - 1 ]}` );
    }

    // Adjacent higher energy level
    if ( index < energies.length - 1 ) {
      const difference2 = Math.abs( energy - energies[ index + 1 ] );
      affirm( difference2 !== 0,
        `Adjacent energy levels must have different energies: E${index}=${energy} E${index + 1}=${energies[ index + 1 ]}` );
      if ( difference2 < difference ) {
        difference = difference2;
      }
    }
    affirm( difference > 0, `difference must be positive: ${difference}` );

    // Determine the number of significant decimal places needed to show the energy difference.
    let decimalPlaces = 0;
    if ( difference >= 1 ) {

      // The number of decimal places is not important, and we can stop here.
      decimalPlaces = NUMBER_OF_DECIMAL_PLACES_RANGE.min;
    }
    else {

      // Convert the difference to a string. JavaScript converts integers with more than 21 digits to
      // scientific notation when used in a string context. So use toFixed instead of `${difference}`
      // so that we have decimal notation.
      const differenceString = toFixed( difference, 20 );

      // Count to the right of the decimal place until we find the first non-zero digit.
      const decimalPointIndex = differenceString.indexOf( '.' );
      for ( let i = decimalPointIndex + 1; i < differenceString.length; i++ ) {
        decimalPlaces++;
        if ( differenceString[ i ] !== '0' ) {
          break;
        }
      }

      // Constrain the number of decimal places to range.
      decimalPlaces = NUMBER_OF_DECIMAL_PLACES_RANGE.constrainValue( decimalPlaces );
    }
    affirm( NUMBER_OF_DECIMAL_PLACES_RANGE.contains( decimalPlaces ) && Number.isInteger( decimalPlaces ),
      `invalid decimalPlaces: ${decimalPlaces}` );

    return decimalPlaces;
  }
}