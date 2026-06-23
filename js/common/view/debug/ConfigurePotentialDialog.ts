// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePotentialDialog is the base class for all dialogs used to configure a Quantum Potential.
 * These dialogs are for development purposes only and do NOT support core PhET features (localization, dynamic layout,
 * alt input, core description, PhET-iO, etc.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PotentialPropertyControl from './PotentialPropertyControl.js';

type SelfOptions = {
  wellDepthProperty?: NumberProperty | null;
  stepHeightProperty?: NumberProperty | null;
  separationProperty?: NumberProperty | null;
  spacingProperty?: NumberProperty | null;
};

export type ConfigureQuantumPotentialDialogOptions = SelfOptions;

export default class ConfigurePotentialDialog extends Dialog {

  protected constructor( titleString: string, potential: QuantumPotential, time: QBSTime, providedOptions?: ConfigureQuantumPotentialDialogOptions ) {

    const options = optionize<ConfigureQuantumPotentialDialogOptions, SelfOptions>()( {

      // SelfOptions
      wellDepthProperty: null,
      stepHeightProperty: null,
      separationProperty: null,
      spacingProperty: null
    }, providedOptions );

    const controls: Node[] = [];

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'xOffsetProperty', potential.xOffsetProperty, QBSConstants.X_OFFSET_DECIMAL_PLACES, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'yOffsetProperty', potential.yOffsetProperty, QBSConstants.Y_OFFSET_DECIMAL_PLACES, time ) );
    }

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'wellWidthProperty', potential.wellWidthProperty, potential.wellWidthDecimalPlaces, time ) );
    }

    if ( options.wellDepthProperty && options.wellDepthProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'wellDepthProperty', options.wellDepthProperty, QBSConstants.WELL_DEPTH_DECIMAL_PLACES, time ) );
    }

    if ( options.stepHeightProperty && options.stepHeightProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'stepHeightProperty', options.stepHeightProperty, QBSConstants.STEP_HEIGHT_DECIMAL_PLACES, time ) );
    }

    if ( options.separationProperty && options.separationProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'separationProperty', options.separationProperty, QBSConstants.SEPARATION_DECIMAL_PLACES, time ) );
    }

    if ( options.spacingProperty && options.spacingProperty.range.getLength() > 0 ) {
      controls.push( new PotentialPropertyControl( 'spacingProperty', options.spacingProperty, QBSConstants.SPACING_DECIMAL_PLACES, time ) );
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