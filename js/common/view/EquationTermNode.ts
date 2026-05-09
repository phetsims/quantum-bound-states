// Copyright 2026, University of Colorado Boulder

/**
 * EquationTermNode displays one term from an equation in the Quantum State Graph.
 * For example, if energy level E3 is selected, the Wave Function graph shows 'Ψ<sub>3</sub>(x,t)'.
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

export default class EquationTermNode extends BackgroundNode {

  public constructor( stringProperty: TReadOnlyProperty<string>, providedOptions: RichTextOnBackgroundNodeOptions ) {

    const richText = new RichText( stringProperty, {
      font: QBSConstants.EQUATION_TERM_FONT,
      fill: QBSColors.equationTermColorProperty
    } );

    const options = optionize<RichTextOnBackgroundNodeOptions, SelfOptions, BackgroundNodeOptions>()( {

      // SelfOptions
      richTextOptions: null,

      // BackgroundNodeOptions
      isDisposable: false,
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