// Copyright 2026, University of Colorado Boulder

/**
 * PreviewLegendNode is a legend that identifies the real and imaginary parts of the wave function shown in the previews.
 * It appears in the Preset and Custom Superposition State dialogs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GridBox, { GridBoxOptions } from '../../../../scenery/js/layout/nodes/GridBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import QBSColors from '../../common/QBSColors.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

const LEGEND_FONT = new PhetFont( 14 );
const LINE_LENGTH = 25;
const LINE_WIDTH = 3;
const TEXT_MAX_WIDTH = 100;

export class PreviewLegendNode extends GridBox {

  public constructor( providedOptions?: PickOptional<NodeOptions, 'layoutOptions'> ) {

    const textOptions: TextOptions = {
      font: LEGEND_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      layoutOptions: {
        xAlign: 'left'
      }
    };

    const realPartLine = new Line( 0, 0, LINE_LENGTH, 0, {
      lineWidth: LINE_WIDTH,
      stroke: QBSColors.realPartStrokeProperty
    } );

    const realPartText = new Text( QuantumBoundStatesFluent.realPartStringProperty, textOptions );

    const imaginaryPartLine = new Line( 0, 0, LINE_LENGTH, 0, {
      lineWidth: LINE_WIDTH,
      stroke: QBSColors.imaginaryPartStrokeProperty
    } );

    const imaginaryPartText = new Text( QuantumBoundStatesFluent.imaginaryPartStringProperty, textOptions );

    super( combineOptions<GridBoxOptions>( {
      rows: [
        [ realPartLine, realPartText ],
        [ imaginaryPartLine, imaginaryPartText ]
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