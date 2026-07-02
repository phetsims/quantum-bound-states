// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPresetDialog is the dialog for viewing a preset superposition configuration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionConfiguration from '../model/CustomSuperpositionConfiguration.js';
import PresetSuperpositionConfiguration from '../model/PresetSuperpositionConfiguration.js';

export default class SuperpositionPresetDialog extends Dialog {

  public constructor( superpositionPresetProperty: Property<PresetSuperpositionConfiguration> ) {

    // Title includes the visual name of the selected configuration.
    const titleStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.superpositionStateDialogTitleStringProperty, {
      label: new DynamicProperty<string, string, CustomSuperpositionConfiguration>( superpositionPresetProperty, {
        derive: configuration => configuration.visualNameProperty
      } )
    } );

    const titleNode = new RichText( titleStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 400
    } );

    //TODO Create dialog content.
    const content = new RichText( 'Under Construction', {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode
    } );

    super( content, options );
  }

  //TODO dispose?
}
