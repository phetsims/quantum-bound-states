// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog that allows the user to configure the Finite Square potential.
 * This is for debugging purposes, and not part of the public UI.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { nanometersUnit } from '../../../../scenery-phet/js/units/nanometersUnit.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FiniteSquarePotential from '../model/potentials/FiniteSquarePotential.js';
import { electronVoltsUnit } from '../model/units/electronVoltsUnit.js';
import QBSConstants from '../QBSConstants.js';

export default class ConfigureFiniteSquareDialog extends Dialog {

  public constructor( potential: FiniteSquarePotential ) {

    const titleText = new Text( 'Finite Square', {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200
    } );

    const wellWidthControl = new NumberControl( 'Well Width', potential.wellWidthProperty, potential.wellWidthProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -QBSConstants.WELL_WIDTH_DECIMAL_PLACES ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: QBSConstants.WELL_WIDTH_DECIMAL_PLACES,
            showTrailingZeros: true
          } )
        }
      } ) );

    const wellDepthControl = new NumberControl( 'Well Depth', potential.wellDepthProperty, potential.wellDepthProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -QBSConstants.WELL_DEPTH_DECIMAL_PLACES ),
        numberDisplayOptions: {
          numberFormatter: value => electronVoltsUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: QBSConstants.WELL_DEPTH_DECIMAL_PLACES,
            showTrailingZeros: true
          } )
        }
      } ) );

    const content = new VBox( {
      children: [
        wellWidthControl,
        wellDepthControl
      ],
      align: 'left',
      spacing: 10
    } );

    super( content, {
      title: titleText,
      ySpacing: 15
    } );
  }
}