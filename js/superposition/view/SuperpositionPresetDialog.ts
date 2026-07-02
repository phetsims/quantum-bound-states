// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPresetDialog is the dialog for viewing a preset superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';

export default class SuperpositionPresetDialog extends Dialog {

  public constructor( superpositionState: PresetSuperpositionState, groundStateIndex: number ) {

    // Title includes the visual name of the selected superposition state.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.superpositionStateDialogTitleStringProperty, {
      label: superpositionState.visualNameProperty
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 400
    } );

    const content = new SuperpositionPresetDialogContent( superpositionState, groundStateIndex );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      hideCallback: () => this.dispose()
    } );

    super( content, options );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'SuperpositionPresetDialog disposed' );
      titleStringProperty.dispose();
      titleNode.dispose();
      content.dispose();
    } );
  }
}

/**
 * SuperpositionPresetDialogContent encapsulates the content for SuperpositionPresetDialog.
 */
class SuperpositionPresetDialogContent extends Node {

  public constructor( superpositionState: PresetSuperpositionState, groundStateIndex: number ) {

    const text = new RichText( 'Under Construction', {
      font: QBSConstants.CONTROL_FONT
    } );

    super( {
      children: [ text ]
    } );

    this.disposeEmitter.addListener( () => {
      phet.log && phet.log( 'SuperpositionPresetDialogContent disposed' );
      text.dispose();
    } );
  }
}
