// Copyright 2026, University of Colorado Boulder

/**
 * RichTextOnBackgroundNode displays a string as RichText on a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import BackgroundNode, { BackgroundNodeOptions } from '../../../../scenery-phet/js/BackgroundNode.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = {
  richTextOptions?: RichTextOptions | null;
};

type RichTextOnBackgroundNodeOptions = SelfOptions & WithRequired<BackgroundNodeOptions, 'tandem'>;

export default class RichTextOnBackgroundNode extends BackgroundNode {

  public constructor( stringProperty: TReadOnlyProperty<string>, providedOptions: RichTextOnBackgroundNodeOptions ) {

    const richText = new RichText( stringProperty, {
      font: QBSConstants.EQUATION_TERM_FONT,
      fill: QBSColors.equationTermColorProperty
    } );

    const options = optionize<RichTextOnBackgroundNodeOptions, SelfOptions, BackgroundNodeOptions>()( {

      // SelfOptions
      richTextOptions: null,

      // BackgroundNodeOptions
      xMargin: 4,
      yMargin: 2,
      rectangleOptions: {
        cornerRadius: 5,
        fill: QBSColors.equationTermBackgroundColorProperty,
        opacity: 1 // use alpha in fill
      },
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    }, providedOptions );

    super( richText, options );
  }
}