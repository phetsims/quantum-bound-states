// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionComponentCheckbox is the base class for checkboxes that show/hide a component of the wave function.
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
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';

const DEFAULT_STROKE_PROPERTY = new Property<Color>( Color.BLACK );

type SelfOptions = {
  stringProperty: TReadOnlyProperty<string>;
  strokeProperty?: TReadOnlyProperty<Color>;
  createContent?: ( stringProperty: TReadOnlyProperty<string>, strokeProperty: TReadOnlyProperty<Color> ) => Node;
};

export type WaveFunctionComponentCheckboxOptions = SelfOptions & CheckboxOptions & PickRequired<CheckboxOptions, 'tandem'>;

export default class WaveFunctionComponentCheckbox extends Checkbox {

  protected constructor( componentVisibleProperty: Property<boolean>,
                         providedOptions: WaveFunctionComponentCheckboxOptions ) {

    const options = optionize4<WaveFunctionComponentCheckboxOptions, SelfOptions, CheckboxOptions>()(
      {}, QBSConstants.CHECKBOX_OPTIONS, {
        strokeProperty: DEFAULT_STROKE_PROPERTY,
        createContent: createContent
      }, providedOptions );

    const content = options.createContent( options.stringProperty, options.strokeProperty );

    super( componentVisibleProperty, content, options );
  }
}

function createContent( stringProperty: TReadOnlyProperty<string>, strokeProperty: TReadOnlyProperty<Color> ): Node {
  return new HBox( {
    spacing: 10,
    children: [
      new Text( stringProperty, {
        font: QBSConstants.CONTROL_FONT,
        maxWidth: 140
      } ),
      new Line( 0, 0, 30, 0, {
        lineWidth: 3,
        stroke: strokeProperty
      } )
    ]
  } );
}

quantumBoundStates.register( 'WaveFunctionComponentCheckbox', WaveFunctionComponentCheckbox );