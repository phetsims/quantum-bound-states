// Copyright 2026, University of Colorado Boulder

//TODO Factor out private classes into their own source files.
/**
 * CustomDialog is the dialog for customizing a superposition state
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState, { CoefficientFormat } from '../model/CustomSuperpositionState.js';
import SuperpositionStatePreviewNode from './SuperpositionStatePreviewNode.js';

const NUMBER_SPINNER_FIRE_ON_HOLD_INTERVAL = 35;
const PREVIEW_SCALE = 0.35;

export default class CustomDialog extends Dialog {

  public constructor( superpositionState: CustomSuperpositionState,
                      potential: QuantumPotential,
                      numberOfEnergyLevels: number ) {

    // Title includes the visual name of the selected superposition state.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.customSuperpositionStateDialogTitleStringProperty, {
      name: superpositionState.visualNameProperty
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 500
    } );

    const content = new CustomDialogContent( superpositionState, potential, numberOfEnergyLevels );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      xSpacing: 20, // horizontal space between content and closeButton
      ySpacing: 15, // vertical space between title and content
      fill: QBSColors.superpositionStateDialogFillProperty,
      hideCallback: () => this.dispose()
      //TODO Use layoutStrategy to anchor the top of the dialog while the dialog resizes?
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

  public constructor( superpositionState: CustomSuperpositionState, potential: QuantumPotential, numberOfEnergyLevels: number ) {

    // Instructions
    const instructionsText = new InstructionsText( superpositionState, potential.groundStateIndex );

    //TODO localize, handle singular/plural
    // const warningStringProperty = new StringProperty( superpositionState.getNumberOfCoefficients() > numberOfEnergyLevels ?
    //                           `\u26a0\ufe0f Selected potential has ${numberOfEnergyLevels} energy levels.` :
    //                           `Selected potential has ${numberOfEnergyLevels} energy levels.` );
    // const numberOfEnergyLevelsWarningText = new Text( warningStringProperty, {
    //   font: QBSConstants.CONTROL_FONT,
    //   maxWidth: 300
    // } );
    //
    //TODO localize
    // const formatText = new Text( 'Format', {
    //   font: new PhetFont( 14 ),
    //   maxWidth: 200
    // } );

    const formatRadioButtonGroup = new CoefficientFormatRadioButtonGroup( superpositionState.coefficientFormatProperty );

    // const formatHBox = new HBox( {
    //   children: [ formatText, formatRadioButtonGroup ],
    //   spacing: 10
    // } );
    //
    // const topRow = new HBox( {
    //   children: [ numberOfEnergyLevelsWarningText, formatHBox ],
    //   spacing: 50
    // } );

    const coefficientSpinnersGroup = new CoefficientSpinnersGroup( superpositionState.getNumberOfCoefficients(),
      superpositionState.coefficientFormatProperty, potential.groundStateIndex );

    const amplitudePageSpinner = new PageSpinner( 2, {
      visibleProperty: superpositionState.coefficientFormatProperty.derived( coefficientFormat => coefficientFormat === 'amplitude' )
    } );
    const magnitudeAndPhasePageSpinner = new PageSpinner( 4, {
      visibleProperty: superpositionState.coefficientFormatProperty.derived( coefficientFormat => coefficientFormat === 'magnitudeAndPhase' )
    } );

    const previewNode = new SuperpositionStatePreviewNode( {
      viewScale: PREVIEW_SCALE
    } );

    const pushButtonGroup = new PushButtonGroup();

    super( {
      children: [
        instructionsText,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        // topRow,
        formatRadioButtonGroup,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        coefficientSpinnersGroup,
        amplitudePageSpinner,
        magnitudeAndPhasePageSpinner,
        previewNode,
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
      instructionsText.dispose();
      // warningStringProperty.dispose();
      // numberOfEnergyLevelsWarningText.dispose();
      // formatText.dispose();
      formatRadioButtonGroup.dispose();
      coefficientSpinnersGroup.dispose();
      previewNode.dispose();
      pushButtonGroup.dispose();
    } );
  }
}

class InstructionsText extends RichText {

  public constructor( superpositionState: CustomSuperpositionState, groundStateIndex: number ) {

    // Instruction for amplitude format, with subscripts that match the selected potential's ground state.
    let subscript = groundStateIndex;
    //TODO localize
    const amplitudeInstructionsString = 'Create a Superposition State by setting coefficients such that ' +
                                        `Ψ(x,t) = a<sub>${subscript}</sub>Ψ<sub>${subscript++}</sub>(x,t) + ` +
                                        `a<sub>${subscript}</sub>Ψ<sub>${subscript++}</sub>(x,t) + ` +
                                        '... + a<sub>n</sub>Ψ<sub>n</sub>(x,t)';

    // Instruction for magnitude & phase format, with subscripts that match the selected potential's ground state.
    subscript = groundStateIndex;
    //TODO localize
    const magnitudeAndPhaseInstructionsString = 'Create a Superposition State by setting coefficients such that ' +
                                                `Ψ(x,t) = c<sub>${subscript}</sub>Ψ<sub>${subscript++}</sub>(x,t) + ` +
                                                `c<sub>${subscript}</sub>Ψ<sub>${subscript++}</sub>(x,t) + ` +
                                                '... + c<sub>n</sub>Ψ<sub>n</sub>(x,t)';

    const instructionsStringProperty = new DerivedStringProperty( [ superpositionState.coefficientFormatProperty ],
      coefficientFormat => coefficientFormat === 'amplitude' ? amplitudeInstructionsString : magnitudeAndPhaseInstructionsString );

    super( instructionsStringProperty, {
      font: new PhetFont( 12 ),
      maxWidth: 800
    } );

    this.disposeEmitter.addListener( () => {
      instructionsStringProperty.dispose();
    } );
  }
}

/**
 * TODO
 */
class CoefficientFormatRadioButtonGroup extends RectangularRadioButtonGroup<CoefficientFormat> {

  public constructor( formatProperty: Property<CoefficientFormat> ) {

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 200
    };

    const items: RectangularRadioButtonGroupItem<CoefficientFormat>[] = [
      {
        value: 'amplitude',
        createNode: () => new RichText( 'Amplitude (a)', richTextOptions ) //TODO localize
      },
      {
        value: 'magnitudeAndPhase',
        createNode: () => new RichText( 'Magnitude (c) & Phase (φ)', richTextOptions ) //TODO localize
      }
    ];

    super( formatProperty, items, {
      orientation: 'horizontal',
      spacing: 3,
      radioButtonOptions: {
        xMargin: 15,
        baseColor: 'white'
      }
    } );

    this.disposeEmitter.addListener( () => {
      //TODO Anything to dispose?
    } );
  }
}

class CoefficientSpinnersGroup extends GridBox {

  private readonly numberOfCoefficients: number;
  private readonly coefficientFormatProperty: TReadOnlyProperty<CoefficientFormat>;
  private readonly groundStateIndex: number;

  public constructor( numberOfCoefficients: number,
                      coefficientFormatProperty: TReadOnlyProperty<CoefficientFormat>,
                      groundStateIndex: number ) {
    super( {
      xSpacing: 35,
      ySpacing: 20,
      xAlign: 'right'
    } );

    this.numberOfCoefficients = numberOfCoefficients;
    this.coefficientFormatProperty = coefficientFormatProperty;
    this.groundStateIndex = groundStateIndex;

    coefficientFormatProperty.link( () => this.update() );

    this.disposeEmitter.addListener( () => {
      //TODO dispose
    } );
  }

  private update(): void {
    if ( this.coefficientFormatProperty.value === 'amplitude' ) {
      this.updateAmplitudeControls();
    }
    else {
      this.updateMagnitudeAndPhaseControls();
    }
  }

  private updateAmplitudeControls(): void {
    const rows: Node[][] = [];
    const numberOfColumns = 6;
    // for ( let i = 0; i < this.numberOfCoefficients; i++ ) {
    for ( let i = 0; i < 24; i++ ) {

      // Create a new row.
      if ( i % numberOfColumns === 0 ) {
        rows.push( [] );
      }

      // Amplitude label
      const amplitudeAlignGroup = new AlignGroup();
      const amplitudeLabel = amplitudeAlignGroup.createBox( new RichText( `a<sub>${this.groundStateIndex + i}</sub>`, {
        font: new PhetFont( 14 )
      } ) );

      // Amplitude spinner
      const amplitudeProperty = new NumberProperty( 0, {
        numberType: 'FloatingPoint',
        range: new Range( -1, 1 )
      } );
      amplitudeProperty.lazyLink( amplitude => console.log( `amplitudeProperty.value = ${amplitude}` ) );//TODO remove
      const amplitudeSpinner = new NumberSpinner( amplitudeProperty, amplitudeProperty.rangeProperty, {
        deltaValue: 0.01,
        arrowsScale: 1.6,
        //TODO NumberSpinner is buggy and we can't get to min and max.
        incrementFunction: value => toFixedNumber( value + 0.01, 2 ),
        decrementFunction: value => toFixedNumber( value - 0.01, 2 ),
        numberDisplayOptions: {
          decimalPlaces: 2,
          align: 'center',
          cornerRadius: 3,
          textOptions: {
            font: QBSConstants.CONTROL_FONT
          }
        },
        arrowButtonOptions: {
          fireOnHoldInterval: NUMBER_SPINNER_FIRE_ON_HOLD_INTERVAL
        }
      } );

      const amplitudeControl = new HBox( {
        children: [ amplitudeLabel, amplitudeSpinner ],
        spacing: 3
      } );

      // Add to the last row.
      rows[ rows.length - 1 ].push( amplitudeControl );
    }
    this.rows = rows;
    this.xSpacing = 40;
  }

  private updateMagnitudeAndPhaseControls(): void {
    const rows: Node[][] = [];
    const numberOfColumns = 3;
    // for ( let i = 0; i < this.numberOfCoefficients; i++ ) {
    for ( let i = 0; i < 12; i++ ) {

      // Create a new row.
      if ( i % numberOfColumns === 0 ) {
        rows.push( [] );
      }

      // Magnitude label
      const magnitudeAlignGroup = new AlignGroup();
      const magnitudeLabel = magnitudeAlignGroup.createBox( new RichText( `c<sub>${this.groundStateIndex + i}</sub>`, {
        font: new PhetFont( 14 )
      } ) );

      // Magnitude spinner
      const magnitudeProperty = new NumberProperty( 0, {
        numberType: 'FloatingPoint',
        range: new Range( 0, 1 )
      } );
      const magnitudeSpinner = new NumberSpinner( magnitudeProperty, magnitudeProperty.rangeProperty, {
        deltaValue: 0.01,
        arrowsScale: 1.6,
        //TODO NumberSpinner is buggy and we can't get to min and max.
        incrementFunction: value => toFixedNumber( value + 0.01, 2 ),
        decrementFunction: value => toFixedNumber( value - 0.01, 2 ),
        numberDisplayOptions: {
          decimalPlaces: 2,
          align: 'center',
          cornerRadius: 3,
          textOptions: {
            font: QBSConstants.CONTROL_FONT
          }
        },
        arrowButtonOptions: {
          fireOnHoldInterval: NUMBER_SPINNER_FIRE_ON_HOLD_INTERVAL
        }
      } );

      // Phase label
      const phaseAlignGroup = new AlignGroup();
      const phaseLabel = phaseAlignGroup.createBox( new RichText( `φ<sub>${this.groundStateIndex + i}</sub>`, {
        font: new PhetFont( 14 )
      } ) );

      // Phase spinner
      const phaseMultiplierProperty = new NumberProperty( 0, {
        numberType: 'FloatingPoint',
        range: new Range( 0, 1 )
      } );
      const phaseSpinner = new NumberSpinner( phaseMultiplierProperty, phaseMultiplierProperty.rangeProperty, {
        deltaValue: 0.01,
        arrowsScale: 1.6,
        //TODO NumberSpinner is buggy and we can't get to min and max due to floating-point error.
        incrementFunction: phaseMultiplier => toFixedNumber( phaseMultiplier + 0.01, 2 ),
        decrementFunction: phaseMultiplier => toFixedNumber( phaseMultiplier - 0.01, 2 ),
        numberDisplayOptions: {
          // Use toFixed to preserve trailing zeros. Add pi symbol.
          numberFormatter: phaseMultiplier => `${toFixed( phaseMultiplier, 2 )} π`,
          align: 'center',
          cornerRadius: 3,
          textOptions: {
            font: QBSConstants.CONTROL_FONT
          }
        },
        arrowButtonOptions: {
          fireOnHoldInterval: NUMBER_SPINNER_FIRE_ON_HOLD_INTERVAL
        }
      } );

      const magnitudeAndPhaseControl = new HBox( {
        children: [
          new HBox( {
            children: [ magnitudeLabel, magnitudeSpinner ],
            spacing: 3
          } ),
          new HBox( {
            children: [ phaseLabel, phaseSpinner ],
            spacing: 3
          } )
        ],
        spacing: 10
      } );

      // Add to the last row.
      rows[ rows.length - 1 ].push( magnitudeAndPhaseControl );
    }

    this.rows = rows;
    this.xSpacing = 55;
  }
}

class PageSpinner extends NumberSpinner {
  public constructor( numberOfPages: number, providedOptions: NumberSpinnerOptions ) {

    const pageNumberProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, numberOfPages )
    } );

    super( pageNumberProperty, pageNumberProperty.rangeProperty, combineOptions<NumberSpinnerOptions>( {
      arrowsPosition: 'leftRight',
      numberDisplayOptions: {
        numberFormatter: value => `${value} of ${numberOfPages}`,
        backgroundStroke: null,
        backgroundFill: null,
        textOptions: {
          font: QBSConstants.CONTROL_FONT
        }
      }
    }, providedOptions ) );
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

    const clearText = new Text( 'Clear', textOptions ); //TODO localize
    const clearButton = new RectangularPushButton( {
      content: alignGroup.createBox( clearText ),
      xMargin: xMargin
    } );

    const normalizeAndSaveText = new Text( 'Normalize & Save', textOptions ); //TODO localize
    const normalizeAndSaveButton = new RectangularPushButton( {
      content: alignGroup.createBox( normalizeAndSaveText ),
      xMargin: xMargin
    } );

    super( {
      children: [ clearButton, normalizeAndSaveButton ],
      spacing: 15
    } );

    this.disposeEmitter.addListener( () => {
      clearText.dispose();
      normalizeAndSaveText.dispose();
    } );
  }
}
