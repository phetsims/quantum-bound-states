// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureQuantumPotentialDialog is the base class for all dialogs used to configure a Quantum Potential.
 * These dialogs are for development purposes only and do NOT support core PhET features (localization, dynamic layout,
 * alt input, core description, PhET-iO, etc.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import ElectronVoltsControl from './ElectronVoltsControl.js';
import NanometersControl from './NanometersControl.js';

type SelfOptions = {

  // required
  xOffsetProperty: NumberProperty;
  yOffsetProperty: NumberProperty;

  // optional
  wellWidthProperty?: NumberProperty;
  wellDepthProperty?: NumberProperty;
  stepHeightProperty?: NumberProperty;
  separationProperty?: NumberProperty;
  spacingProperty?: NumberProperty;
};

export type ConfigureQuantumPotentialDialogOptions = SelfOptions;

export default class ConfigureQuantumPotentialDialog extends Dialog {

  protected constructor( titleString: string, time: QBSTime, options: ConfigureQuantumPotentialDialogOptions ) {

    const controls: Node[] = [];

    if ( options.xOffsetProperty && options.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new NanometersControl( 'xOffsetProperty', options.xOffsetProperty, QBSConstants.X_OFFSET_DECIMAL_PLACES, time ) );
    }

    if ( options.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new ElectronVoltsControl( 'yOffsetProperty', options.yOffsetProperty, QBSConstants.Y_OFFSET_DECIMAL_PLACES, time ) );
    }

    if ( options.wellWidthProperty && options.wellWidthProperty.range.getLength() > 0 ) {
      controls.push( new NanometersControl( 'wellWidthProperty', options.wellWidthProperty, QBSConstants.WELL_WIDTH_DECIMAL_PLACES, time ) );
    }

    if ( options.wellDepthProperty && options.wellDepthProperty.range.getLength() > 0 ) {
      controls.push( new ElectronVoltsControl( 'wellDepthProperty', options.wellDepthProperty, QBSConstants.WELL_DEPTH_DECIMAL_PLACES, time ) );
    }

    if ( options.stepHeightProperty && options.stepHeightProperty.range.getLength() > 0 ) {
      controls.push( new ElectronVoltsControl( 'stepHeightProperty', options.stepHeightProperty, QBSConstants.STEP_HEIGHT_DECIMAL_PLACES, time ) );
    }

    if ( options.separationProperty && options.separationProperty.range.getLength() > 0 ) {
      controls.push( new NanometersControl( 'separationProperty', options.separationProperty, QBSConstants.SEPARATION_DECIMAL_PLACES, time ) );
    }

    if ( options.spacingProperty && options.spacingProperty.range.getLength() > 0 ) {
      controls.push( new NanometersControl( 'spacingProperty', options.spacingProperty, QBSConstants.SPACING_DECIMAL_PLACES, time ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: controls
    } ) );

    const titleNode = new VBox( {
      children: [
        new Text( 'For development use only', {
          font: QBSConstants.TITLE_FONT,
          fill: 'red'
        } ),
        new Text( titleString, {
          font: QBSConstants.TITLE_FONT,
          maxWidth: 300
        } )
      ],
      align: 'center',
      spacing: 4
    } );

    super( content, {
      title: titleNode,
      ySpacing: 15,

      // In the upper right corner of the layoutBounds, so that it's not covering the Energy Diagram.
      layoutStrategy: ( dialog: Dialog, simBounds: Bounds2, screenBounds: Bounds2, scale: number ): void => {
        if ( dialog.layoutBounds ) {
          dialog.right = dialog.layoutBounds.right - QBSConstants.SCREEN_VIEW_X_MARGIN;
          dialog.top = dialog.layoutBounds.top + QBSConstants.SCREEN_VIEW_Y_MARGIN;
        }
      },
      hideCallback: () => this.dispose(),
      tandem: Tandem.OPT_OUT
    } );

    this.disposeEmitter.addListener( () => {
      controls.forEach( control => control.dispose() );
    } );
  }
}