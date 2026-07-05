// Copyright 2026, University of Colorado Boulder

/**
 * CustomDialog is the dialog for customizing a superposition state
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState, { CoefficientFormat } from '../model/CustomSuperpositionState.js';

export default class CustomDialog extends Dialog {

  public constructor( superpositionState: CustomSuperpositionState, groundStateIndex: number ) {

    // Title includes the visual name of the selected superposition state.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.superpositionStateDialogTitleStringProperty, {
      label: superpositionState.visualNameProperty
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 500
    } );

    const content = new CustomDialogContent( superpositionState, groundStateIndex );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      xSpacing: 20, // horizontal space between content and closeButton
      ySpacing: 15, // vertical space between title and content
      hideCallback: () => this.dispose()
    } );

    super( content, options );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'CustomDialog disposed' );
      titleStringProperty.dispose();
      titleNode.dispose();
      content.dispose();
    } );
  }
}

/**
 * CustomDialogContent encapsulates the content for CustomDialog.
 */
class CustomDialogContent extends Node {

  public constructor( superpositionState: CustomSuperpositionState, groundStateIndex: number ) {

    //TODO localize
    const numberOfCoefficientsText = new Text( 'Number of coefficients', {
      font: new PhetFont( 14 ),
      maxWidth: 200
    } );

    const numberOfCoefficientsProperty = superpositionState.numberOfCoefficientsProperty;
    const numberOfCoefficientsSpinner = new NumberSpinner( numberOfCoefficientsProperty, numberOfCoefficientsProperty.rangeProperty, {
      arrowsPosition: 'leftRight',
      arrowsScale: 1,
      numberDisplayOptions: {
        cornerRadius: 3,
        textOptions: {
          font: QBSConstants.CONTROL_FONT
        }
      }
    } );

    const numberOfCoefficientsHBox = new HBox( {
      children: [ numberOfCoefficientsText, numberOfCoefficientsSpinner ],
      spacing: 10
    } );

    //TODO localize
    const formatText = new Text( 'Format', {
      font: new PhetFont( 14 ),
      maxWidth: 200
    } );

    const formatRadioButtonGroup = new FormatRadioButtonGroup( superpositionState.coefficientFormatProperty );

    const formatHBox = new HBox( {
      children: [ formatText, formatRadioButtonGroup ],
      spacing: 10
    } );

    const topRow = new HBox( {
      children: [ numberOfCoefficientsHBox, formatHBox ],
      spacing: 50
    } );

    super( {
      children: [ topRow ]
    } );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'CustomDialogContent disposed' );
      numberOfCoefficientsText.dispose();
    } );
  }
}

//TODO Factor out to FormatRadioButtonGroup.ts
/**
 * TODO
 */
class FormatRadioButtonGroup extends RectangularRadioButtonGroup<CoefficientFormat> {

  public constructor( formatProperty: Property<CoefficientFormat> ) {

    const items: RectangularRadioButtonGroupItem<CoefficientFormat>[] = [
      {
        value: 'amplitude',
        //TODO localize
        createNode: () => new RichText( 'Amplitude (a)', { font: QBSConstants.CONTROL_FONT } )
      },
      {
        value: 'magnitudeAndPhase',
        //TODO localize
        createNode: () => new RichText( 'Magnitude (c) & Phase (φ)', { font: QBSConstants.CONTROL_FONT } )
      }
    ];

    super( formatProperty, items, {
      orientation: 'horizontal'
    } );
  }
}
