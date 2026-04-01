// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionPartsCheckbox is the base class for checkboxes that show/hide a component of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import QBSConstants from '../QBSConstants.js';

const DEFAULT_STROKE_PROPERTY = new Property<Color>( Color.BLACK );

type SelfOptions = {

  // Function to create the content for the checkbox.
  createContent?: ( stringProperty: TReadOnlyProperty<string>, strokeProperty: TReadOnlyProperty<Color> ) => Node;

  // String that is used to label the checkbox.
  stringProperty: TReadOnlyProperty<string>;

  // Color of the horizontal line.
  strokeProperty?: TReadOnlyProperty<Color>;

  enabledProperty: TReadOnlyProperty<boolean>;
};

export type WaveFunctionPartsCheckboxOptions = SelfOptions & CheckboxOptions & PickRequired<CheckboxOptions, 'tandem'>;

export default class WaveFunctionPartsCheckbox extends Checkbox {

  protected constructor( componentVisibleProperty: Property<boolean>,
                         providedOptions: WaveFunctionPartsCheckboxOptions ) {

    const options = optionize4<WaveFunctionPartsCheckboxOptions, SelfOptions, CheckboxOptions>()(
      {}, QBSConstants.CHECKBOX_OPTIONS, {

        // SelfOptions
        strokeProperty: DEFAULT_STROKE_PROPERTY,
        createContent: createContent,

        // CheckboxOptions
        isDisposable: false
      }, providedOptions );

    const content = options.createContent( options.stringProperty, options.strokeProperty );

    super( componentVisibleProperty, content, options );
  }
}

/**
 * Creates the default content for this class of checkbox. The default is a label and a horizontal line that serves as a legend.
 */
function createContent( stringProperty: TReadOnlyProperty<string>, strokeProperty: TReadOnlyProperty<Color> ): Node {
  return new HBox( {
    spacing: 10,
    children: [
      new Text( stringProperty, {
        font: QBSConstants.CONTROL_FONT,
        maxWidth: 120
      } ),
      new Line( 0, 0, 30, 0, {
        lineWidth: 3,
        stroke: strokeProperty
      } )
    ]
  } );
}
