// Copyright 2026, University of Colorado Boulder

//TODO Change to EnergyLevelDisplay extends NumberDisplay
/**
 * EnergyLevelDisplay displays an energy level identifier (E1, E2, etc.) and the corresponding energy value in eV.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BackgroundNode, { BackgroundNodeOptions } from '../../../../scenery-phet/js/BackgroundNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = EmptySelfOptions;

export type EnergyLevelDisplayOptions = SelfOptions & NodeTranslationOptions & PickRequired<BackgroundNode, 'tandem'>;

export default class EnergyLevelDisplay extends BackgroundNode {

  //TODO Reduce coupling to QBSModel
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
          const energy = toFixed( model.getEnergyAtEnergyLevel( energyLevelIndex ), QBSConstants.TOTAL_ENERGY_DECIMALS );
          return `E<sub>${energyLevelIndex}</sub> = ${energy} eV`;
        }
        else {
          return `E<sub>${energyLevelIndex}</sub>`;
        }
      } );

    const content = new RichText( stringProperty, {
      font: QBSConstants.ENERGY_LEVEL_DISPLAY_FONT
    } );

    super( content, options );

    Multilink.multilink(
      [ energyLevelIndexProperty, model.boundStateResultProperty, model.energyDiagram.yRangeProperty ],
      ( energyLevelIndex, boundStateResult, yRange ) => {
        //TODO https://github.com/phetsims/quantum-bound-states/issues/40 Temporary patch
        if ( energyLevelIndex !== null && model.selectedEnergyLevelIndexProperty.range.min === model.potentialProperty.value.groundStateIndex ) {
          const energy = model.getEnergyAtEnergyLevel( energyLevelIndex );
          this.bottom = chartTransform.modelToViewY( energy ) - 3;
        }
      } );
  }
}