// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPresetDialog is the dialog for viewing a preset superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState from '../model/CustomSuperpositionState.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';

export default class SuperpositionPresetDialog extends Dialog {

  public constructor( superpositionPresetProperty: TReadOnlyProperty<PresetSuperpositionState> ) {

    // Title includes the visual name of the selected superposition state.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.superpositionStateDialogTitleStringProperty, {
      label: new DynamicProperty<string, string, CustomSuperpositionState>( superpositionPresetProperty, {
        derive: superpositionState => superpositionState.visualNameProperty
      } )
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 400
    } );

    const content = new SuperpositionPresetDialogContent( superpositionPresetProperty );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      isDisposable: false,
      title: titleNode
    } );

    super( content, options );
  }
}

/**
 * SuperpositionPresetDialogContent encapsulates the content for SuperpositionPresetDialog.
 * It updates dynamically to match the selected preset.
 */
class SuperpositionPresetDialogContent extends Node {

  public constructor( superpositionPresetProperty: TReadOnlyProperty<PresetSuperpositionState> ) {

    const text = new RichText( 'Under Construction', {
      font: QBSConstants.CONTROL_FONT
    } );

    super( {
      children: [ text ]
    } );
  }
}
