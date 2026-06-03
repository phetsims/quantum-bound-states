// Copyright 2026, University of Colorado Boulder

/**
 * PotentialHandleLabelNode is the label that appears on a potential handle.
 * It identifies the parameter that the handle controls and the current value of that parameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import BackgroundNode from '../../../../../scenery-phet/js/BackgroundNode.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';

export default class PotentialHandleLabelNode extends BackgroundNode {

  public constructor( labelStringProperty: TReadOnlyProperty<string> ) {

    const labelText = new RichText( labelStringProperty, {
      font: QBSConstants.HANDLE_FONT
    } );

    super( labelText, {
      xMargin: 6,
      yMargin: 2,
      rectangleOptions: {
        opacity: 1,
        cornerRadius: 3,
        fill: QBSColors.handleLabelFillProperty,
        stroke: QBSColors.handleLabelStrokeProperty
      }
    } );
  }
}