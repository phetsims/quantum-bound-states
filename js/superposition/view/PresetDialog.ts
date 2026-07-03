// Copyright 2026, University of Colorado Boulder

/**
 * PresetDialog is the dialog for viewing a preset superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';

export default class PresetDialog extends Dialog {

  public constructor( superpositionState: PresetSuperpositionState, groundStateIndex: number ) {

    // Title includes the visual name of the selected superposition state.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.superpositionStateDialogTitleStringProperty, {
      label: superpositionState.visualNameProperty
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: QBSConstants.TITLE_FONT
      //TODO maxWidth
    } );

    const content = new PresetDialogContent( superpositionState, groundStateIndex );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      xSpacing: 20, // horizontal space between content and closeButton
      ySpacing: 15, // vertical space between title and content
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
class PresetDialogContent extends VBox {

  public constructor( superpositionState: PresetSuperpositionState, groundStateIndex: number ) {

    const hBoxes: Node[] = [];
    let equationString = 'Ψ(x,t) =';

    const coefficients = superpositionState.superpositionCoefficients.getCoefficients();
    coefficients.forEach( ( coefficient, index ) => {
      if ( coefficient.magnitude !== 0 ) {

        const subscript = index + groundStateIndex;
        const amplitude = coefficient.asAmplitude();
        const amplitudeString = toFixed( amplitude, QBSConstants.SUPERPOSITION_COEFFICIENT_AMPLITUDE_DECIMAL_PLACES );
        const magnitudeString = toFixed( coefficient.magnitude, QBSConstants.SUPERPOSITION_COEFFICIENT_AMPLITUDE_DECIMAL_PLACES );

        const coefficientText = new RichText( `c<sub>${subscript}</sub> = ${amplitudeString}`, {
          font: QBSConstants.CONTROL_FONT, //TODO create another font constant
          maxWidth: 200
        } );

        const previewNode = new WaveFunctionPreviewNode();

        hBoxes.push( new HBox( {
          children: [ coefficientText, previewNode ],
          align: 'center',
          spacing: 15
        } ) );

        if ( index > 0 ) {
          if ( amplitude > 0 ) {
            equationString += ` ${MathSymbols.PLUS}`;
          }
          else {
            equationString += ` ${MathSymbols.MINUS}`;
          }
        }

        equationString += ` ${magnitudeString}Ψ<sub>${subscript}</sub>(x,t)`;
      }
    } );

    const equationNode = new RichText( equationString, {
      font: QBSConstants.CONTROL_FONT //TODO create another font constant
      //TODO maxWidth?
    } );

    const previewNode = new WaveFunctionPreviewNode();

    const equationHBox = new HBox( {
      children: [ equationNode, previewNode ],
      align: 'center',
      spacing: 15
    } );

    const separator = new HSeparator( { stroke: 'black' } ); //TODO color profile

    super( {
      children: [ ...hBoxes, separator, equationHBox ],
      spacing: 10,
      align: 'right'
    } );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'PresetDialogContent disposed' );
      //TODO
    } );
  }
}

//TODO Placeholder
class WaveFunctionPreviewNode extends Node {

  public constructor() {

    const rectangle = new Rectangle( 0, 0, 150, 50, {
      fill: 'white',
      stroke: 'black'
    } );

    const text = new Text( 'Preview', {
      font: new PhetFont( 12 ),
      center: rectangle.center
    } );

    super( {
      children: [ rectangle, text ]
    } );

    this.disposeEmitter.addListener( () => {
      //TODO
    } );
  }
}
