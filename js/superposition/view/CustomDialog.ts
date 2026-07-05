// Copyright 2026, University of Colorado Boulder

/**
 * CustomDialog is the dialog for customizing a superposition state
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import QBSColors from '../../common/QBSColors.js';
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
class CustomDialogContent extends VBox {

  public constructor( superpositionState: CustomSuperpositionState, groundStateIndex: number ) {

    const amplitudeInstructionsString = 'Create a Superposition State by setting coefficients such that ' +
                                        'Ψ(x,t) = a<sub>1</sub>Ψ<sub>1</sub>(x,t) + a<sub>2</sub>Ψ<sub>2</sub>(x,t) + ... + a<sub>n</sub>Ψ<sub>n</sub>(x,t)';
    const magnitudeAndPhaseInstructionsString = 'Create a Superposition State by setting coefficients such that ' +
                                                'Ψ(x,t) = c<sub>1</sub>Ψ<sub>1</sub>(x,t) + c<sub>2</sub>Ψ<sub>2</sub>(x,t) + ... + c<sub>n</sub>Ψ<sub>n</sub>(x,t)';
    const instructionsStringProperty = new DerivedStringProperty( [ superpositionState.coefficientFormatProperty ],
      coefficientFormat => coefficientFormat === 'amplitude' ? amplitudeInstructionsString : magnitudeAndPhaseInstructionsString );
    const instructionsText = new RichText( instructionsStringProperty, {
      font: new PhetFont( 12 ),
      maxWidth: 800
    } );

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

    const pushButtonGroup = new PushButtonGroup();

    super( {
      children: [
        instructionsText,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        topRow,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        new Text( 'coefficients', { font: QBSConstants.CONTROL_FONT } ), //TODO
        new Text( 'pageSpinner', { font: QBSConstants.CONTROL_FONT } ), //TODO
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        pushButtonGroup
      ],
      spacing: 10,
      align: 'center'
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

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 200
    };

    const items: RectangularRadioButtonGroupItem<CoefficientFormat>[] = [
      {
        value: 'amplitude',
        //TODO localize
        createNode: () => new RichText( 'Amplitude (a)', richTextOptions )
      },
      {
        value: 'magnitudeAndPhase',
        //TODO localize
        createNode: () => new RichText( 'Magnitude (c) & Phase (φ)', richTextOptions )
      }
    ];

    super( formatProperty, items, {
      orientation: 'horizontal',
      radioButtonOptions: {
        xMargin: 15
      }
    } );
  }
}

class PushButtonGroup extends HBox {

  public constructor() {

    // To make all push buttons the same size.
    const alignGroup = new AlignGroup();

    // Styling shared by the labels on all push buttons.
    const textOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    };

    const xMargin = 20;

    const normalizeAndApplyButton = new RectangularPushButton( {
      content: alignGroup.createBox( new Text( 'Normalize & Apply', textOptions ) ),
      xMargin: xMargin
    } );

    const clearButton = new RectangularPushButton( {
      content: alignGroup.createBox( new Text( 'Clear', textOptions ) ),
      xMargin: xMargin
    } );

    super( {
      children: [ normalizeAndApplyButton, clearButton ],
      spacing: 15
    } );
  }
}
