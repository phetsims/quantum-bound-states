// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelDisplay displays an energy level identifier (E1, E2, etc.) and the corresponding energy value in eV.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
                      energyLevelProperty: TReadOnlyProperty<number | null>,
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
      visibleProperty: new DerivedProperty( [ energyLevelProperty ], energyLevel => energyLevel !== null )
    }, providedOptions );

    const stringProperty = new DerivedStringProperty(
      [ energyLevelProperty, model.energyDiagram.valuesVisibleProperty, model.boundStateResultProperty ],
      ( energyLevel, valuesVisible, boundStateResult ) => {
        if ( energyLevel === null ) {
          return '';
        }
        else if ( valuesVisible ) {
          const energy = toFixed( model.getEnergyAtEnergyLevel( energyLevel ), QBSConstants.ENERGY_LEVEL_DECIMALS );
          return `E<sub>${energyLevel}</sub> = ${energy} eV`;
        }
        else {
          return `E<sub>${energyLevel}</sub>`;
        }
      } );

    const content = new RichText( stringProperty, {
      font: QBSConstants.ENERGY_LEVEL_DISPLAY_FONT
    } );

    super( content, options );

    Multilink.multilink(
      [ energyLevelProperty, model.boundStateResultProperty, model.energyDiagram.yRangeProperty ],
      ( energyLevel, boundStateResult, yRange ) => {
        //TODO https://github.com/phetsims/quantum-bound-states/issues/40 Temporary patch
        if ( energyLevel !== null && model.selectedEnergyLevelProperty.range.min === model.potentialProperty.value.groundStateIndex ) {
          const energy = model.getEnergyAtEnergyLevel( energyLevel );
          this.bottom = chartTransform.modelToViewY( energy ) - 3;
        }
      } );
  }
}