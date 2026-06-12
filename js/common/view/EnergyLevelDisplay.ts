// Copyright 2026, University of Colorado Boulder

//TODO Change to EnergyLevelDisplay extends NumberDisplay
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
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = EmptySelfOptions;

export type EnergyLevelDisplayOptions = SelfOptions & NodeTranslationOptions & PickRequired<BackgroundNode, 'tandem'>;

export default class EnergyLevelDisplay extends BackgroundNode {

  //TODO Reduce coupling to QBSModel
  public constructor( model: QBSModel,
                      selectedEnergyLevelProperty: TReadOnlyProperty<number | null>,
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
      visibleProperty: new DerivedProperty( [ model.energyDiagram.valuesVisibleProperty, selectedEnergyLevelProperty ],
        ( valuesVisible, selectedEnergyLevel ) => valuesVisible && selectedEnergyLevel !== null )
    }, providedOptions );

    const stringProperty = new DerivedStringProperty(
      [ selectedEnergyLevelProperty, model.boundStateResultProperty ],
      ( selectedEnergyLevel, boundStateResult ) => {
        if ( selectedEnergyLevel === null ) {
          return '';
        }
        else {
          const energy = toFixed( model.getEnergyAtEnergyLevel( selectedEnergyLevel ), QBSConstants.ENERGY_LEVEL_DECIMALS );
          return `E<sub>${selectedEnergyLevel}</sub> = ${energy} eV`;
        }
      } );

    const content = new RichText( stringProperty, {
      font: QBSConstants.ENERGY_LEVEL_DISPLAY_FONT
    } );

    super( content, options );

    const updatePosition = () => {
      if ( selectedEnergyLevelProperty.value !== null ) {
        const energy = model.getEnergyAtEnergyLevel( selectedEnergyLevelProperty.value );
        this.bottom = chartTransform.modelToViewY( energy ) - 3;
      }
    };

    Multilink.multilink(
      [ selectedEnergyLevelProperty, model.boundStateResultProperty, model.energyDiagram.yRangeProperty ],
      () => {
        if ( !isSettingPhetioStateProperty.value ) {
          updatePosition();
        }
      } );

    // When PhET-iO state has been fully restored, position the display.
    if ( Tandem.PHET_IO_ENABLED ) {
      phetioStateSetEmitter.addListener( () => updatePosition() );
    }
  }
}