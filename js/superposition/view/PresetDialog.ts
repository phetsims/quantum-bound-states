// Copyright 2026, University of Colorado Boulder

//TODO Factor out private classes into their own source files.
/**
 * PresetDialog is the dialog for viewing a preset superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GridBox, { GridBoxOptions } from '../../../../scenery/js/layout/nodes/GridBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';

//TODO Move fonts to QBSConstants
const TITLE_FONT = QBSConstants.TITLE_FONT;
const COLUMN_HEADING_FONT = new PhetFont( { size: 14, weight: 'bold' } );
const COEFFICIENT_FONT = new PhetFont( 14 );
const EQUATION_FONT = new PhetFont( 14 );
const LEGEND_FONT = new PhetFont( 14 );

export default class PresetDialog extends Dialog {

  public constructor( superpositionState: PresetSuperpositionState, groundStateIndex: number ) {

    // Title includes the visual name of the selected superposition state.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.presetSuperpositionStateDialogTitleStringProperty, {
      label: superpositionState.visualNameProperty
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: TITLE_FONT,
      maxWidth: 500
    } );

    const content = new PresetDialogContent( superpositionState, groundStateIndex );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      xSpacing: 20, // horizontal space between content and closeButton
      ySpacing: 15, // vertical space between title and content
      fill: QBSColors.superpositionStateDialogFillProperty,
      hideCallback: () => this.dispose()
    } );

    super( content, options );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'PresetDialog disposed' );
      titleStringProperty.dispose();
      titleNode.dispose();
      content.dispose();
    } );
  }
}

/**
 * PresetDialogContent encapsulates the content for PresetDialog.
 */
class PresetDialogContent extends GridBox {

  public constructor( superpositionState: PresetSuperpositionState, groundStateIndex: number ) {

    const children: Node[] = [];

    let row = 0;

    const amplitudeText = new Text( QuantumBoundStatesFluent.amplitudeHeadingStringProperty, {
      font: COLUMN_HEADING_FONT,
      maxWidth: 200,
      layoutOptions: {
        row: row,
        column: 0,
        xAlign: 'right',
        yAlign: 'center'
      }
    } );
    children.push( amplitudeText );
    row++;

    // Localization of equationString is not supported.
    //TODO Should this be Ψ(x) since the previews are time-independent?
    let equationString = 'Ψ(x,t) =';

    const coefficients = superpositionState.getCoefficients();
    coefficients.forEach( ( coefficient, index ) => {
      if ( coefficient.magnitude !== 0 ) {

        const subscript = index + groundStateIndex;
        const amplitude = coefficient.asAmplitude();
        const amplitudeString = toFixed( amplitude, QBSConstants.SUPERPOSITION_COEFFICIENT_AMPLITUDE_DECIMAL_PLACES );
        const magnitudeString = toFixed( coefficient.magnitude, QBSConstants.SUPERPOSITION_COEFFICIENT_AMPLITUDE_DECIMAL_PLACES );

        // Localization is not supported.
        const coefficientText = new RichText( `a<sub>${subscript}</sub> = ${amplitudeString}`, {
          font: COEFFICIENT_FONT,
          maxWidth: 200,
          layoutOptions: {
            row: row,
            column: 0,
            xAlign: 'right',
            yAlign: 'center'
          }
        } );
        children.push( coefficientText );

        const previewNode = new WaveFunctionPreviewNode( {
          layoutOptions: {
            row: row,
            column: 1,
            xAlign: 'left',
            yAlign: 'center'
          }
        } );
        children.push( previewNode );

        if ( index > 0 ) {
          if ( amplitude > 0 ) {
            equationString += ` ${MathSymbols.PLUS}`;
          }
          else {
            equationString += ` ${MathSymbols.MINUS}`;
          }
        }

        if ( index > 0 && index % 4 === 0 ) {
          equationString += '<br>';
        }

        equationString += ` ${magnitudeString}Ψ<sub>${subscript}</sub>(x,t)`;

        row++;
      }
    } );

    const separator = new HSeparator( {
      stroke: QBSColors.separatorStrokeProperty,
      layoutOptions: {
        row: row,
        horizontalSpan: 2,
        stretch: true
      }
    } );
    children.push( separator );
    row++;

    const equationNode = new RichText( equationString, {
      font: EQUATION_FONT,
      maxWidth: 500,
      layoutOptions: {
        row: row,
        column: 0,
        xAlign: 'right',
        yAlign: 'center'
      }
    } );
    children.push( equationNode );

    const previewNode = new WaveFunctionPreviewNode( {
      layoutOptions: {
        row: row,
        column: 1,
        xAlign: 'left',
        yAlign: 'center'
      }
    } );
    children.push( previewNode );

    const legendNode = new PreviewLegendNode( {
      layoutOptions: {
        row: row,
        column: 2,
        xAlign: 'left',
        yAlign: 'center'
      }
    } );
    children.push( legendNode );
    row++;

    super( {
      children: children,
      xSpacing: 25,
      ySpacing: 10
    } );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'PresetDialogContent disposed' );
      amplitudeText.dispose();
      equationNode.dispose();
      previewNode.dispose();
      legendNode.dispose();
    } );
  }
}

//TODO Placeholder
/**
 * WaveFunctionPreviewNode is a preview of the time-independent wave function.
 */
class WaveFunctionPreviewNode extends Node {

  public constructor( providedOptions?: PickOptional<NodeOptions, 'layoutOptions'> ) {

    const rectangle = new Rectangle( 0, 0, 150, 50, {
      fill: 'white',
      stroke: 'black'
    } );

    const text = new Text( 'Preview', {
      font: new PhetFont( 12 ),
      center: rectangle.center
    } );

    super( combineOptions<NodeOptions>( {
      children: [ rectangle, text ]
    }, providedOptions ) );

    this.disposeEmitter.addListener( () => {
      //TODO
    } );
  }
}

/**
 * PreviewLegendNode is a legend that identifies the real and imaginary parts of the wave function shown in the previews.
 */
class PreviewLegendNode extends GridBox {

  public constructor( providedOptions?: PickOptional<NodeOptions, 'layoutOptions'> ) {

    const LINE_LENGTH = 25;
    const LINE_WIDTH = 3;
    const TEXT_MAX_WIDTH = 150;

    const realPartLine = new Line( 0, 0, LINE_LENGTH, 0, {
      lineWidth: LINE_WIDTH,
      stroke: QBSColors.realPartStrokeProperty,
      layoutOptions: {
        row: 0,
        column: 0,
        yAlign: 'center'
      }
    } );

    const realPartText = new Text( QuantumBoundStatesFluent.realPartStringProperty, {
      font: LEGEND_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      layoutOptions: {
        row: 0,
        column: 1,
        xAlign: 'left',
        yAlign: 'center'
      }
    } );

    const imaginaryPartLine = new Line( 0, 0, LINE_LENGTH, 0, {
      lineWidth: LINE_WIDTH,
      stroke: QBSColors.imaginaryPartStrokeProperty,
      layoutOptions: {
        row: 1,
        column: 0,
        yAlign: 'center'
      }
    } );

    const imaginaryPartText = new Text( QuantumBoundStatesFluent.imaginaryPartStringProperty, {
      font: LEGEND_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      layoutOptions: {
        row: 1,
        column: 1,
        xAlign: 'left',
        yAlign: 'center'
      }
    } );

    super( combineOptions<GridBoxOptions>( {
      children: [
        realPartLine, realPartText,
        imaginaryPartLine, imaginaryPartText
      ],
      xSpacing: 8,
      ySpacing: 6
    }, providedOptions ) );

    this.disposeEmitter.addListener( () => {
      realPartText.dispose();
      imaginaryPartText.dispose();
    } );
  }
}
