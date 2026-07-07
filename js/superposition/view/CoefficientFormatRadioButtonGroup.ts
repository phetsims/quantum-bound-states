// Copyright 2026, University of Colorado Boulder

/**
 * CoefficientFormatRadioButtonGroup is the radio button group in the Custom Superposition State dialog
 * that is used to select the format for specifying superposition coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import QBSConstants from '../../common/QBSConstants.js';
import { CoefficientFormat } from '../model/CustomSuperpositionState.js';

export class CoefficientFormatRadioButtonGroup extends RectangularRadioButtonGroup<CoefficientFormat> {

  public constructor( formatProperty: Property<CoefficientFormat> ) {

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 200
    };

    const items: RectangularRadioButtonGroupItem<CoefficientFormat>[] = [
      {
        value: 'amplitude',
        createNode: () => new RichText( 'Amplitude (a)', richTextOptions ) //TODO localize
      },
      {
        value: 'magnitudeAndPhase',
        createNode: () => new RichText( 'Magnitude (|c|) & Phase (φ)', richTextOptions ) //TODO localize
      }
    ];

    super( formatProperty, items, {
      orientation: 'horizontal',
      spacing: 3,
      radioButtonOptions: {
        xMargin: 15,
        baseColor: 'white'
      }
    } );

    this.disposeEmitter.addListener( () => {
      //TODO Anything to dispose?
    } );
  }
}