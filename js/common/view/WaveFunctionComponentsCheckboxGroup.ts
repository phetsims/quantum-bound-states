// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionComponentsCheckboxGroup is a group of checkboxes for controlling the visibility of various
 * components of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SpectrumNode from '../../../../scenery-phet/js/SpectrumNode.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

const LABEL_ICON_SPACING = 10;

export default class WaveFunctionComponentsCheckboxGroup extends VBox {

  public constructor( realPartVisibleProperty: Property<boolean>,
                      imaginaryPartVisibleProperty: Property<boolean>,
                      magnitudeVisibleProperty: Property<boolean>,
                      phaseVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // Real Part
    const realPartCheckbox = new Checkbox( realPartVisibleProperty,
      createLabeledLineIcon( QuantumBoundStatesFluent.realPartStringProperty, QBSColors.realPartStrokeProperty ),
      combineOptions<CheckboxOptions>( {
        accessibleHelpText: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleHelpTextStringProperty,
        tandem: tandem.createTandem( 'realPartCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    // Imaginary Part
    const imaginaryPartCheckbox = new Checkbox( imaginaryPartVisibleProperty,
      createLabeledLineIcon( QuantumBoundStatesFluent.imaginaryPartStringProperty, QBSColors.imaginaryPartStrokeProperty ),
      combineOptions<CheckboxOptions>( {
        accessibleHelpText: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty,
        tandem: tandem.createTandem( 'imaginaryPartCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    // Magnitude
    const magnitudeCheckbox = new Checkbox( magnitudeVisibleProperty,
      createLabeledLineIcon( QuantumBoundStatesFluent.magnitudeStringProperty, QBSColors.magnitudeStrokeProperty ),
      combineOptions<CheckboxOptions>( {
        accessibleHelpText: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleHelpTextStringProperty,
        tandem: tandem.createTandem( 'magnitudeCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    // Phase
    const phaseCheckbox = new Checkbox( phaseVisibleProperty, createPhaseIcon(),
      combineOptions<CheckboxOptions>( {
        layoutOptions: {
          leftMargin: 25
        },
        visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
        enabledProperty: magnitudeVisibleProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleHelpTextStringProperty,
        tandem: tandem.createTandem( 'phaseCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    super( {
      children: [
        realPartCheckbox,
        imaginaryPartCheckbox,
        magnitudeCheckbox,
        phaseCheckbox
      ],
      spacing: 10,
      align: 'left',
      stretch: true,
      tandem: tandem
    } );
  }
}

/**
 * Creates a checkbox icon that consists of a text label and a color-coded line.
 */
function createLabeledLineIcon( stringProperty: TReadOnlyProperty<string>, strokeProperty: ProfileColorProperty ): Node {
  return new HBox( {
    spacing: LABEL_ICON_SPACING,
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

/**
 * Creates the icon for the Phase checkbox.
 */
function createPhaseIcon(): Node {

  const phaseText = new Text( QuantumBoundStatesFluent.phaseStringProperty, {
    font: QBSConstants.CONTROL_FONT,
    maxWidth: 80
  } );

  const zeroNode = new Text( '0', {
    font: QBSConstants.CONTROL_FONT
  } );

  const spectrumNode = new SpectrumNode( {
    size: new Dimension2( 40, 0.75 * zeroNode.height ),
    minValue: VisibleColor.MIN_WAVELENGTH,
    maxValue: VisibleColor.MAX_WAVELENGTH,
    valueToColor: VisibleColor.wavelengthToColor
  } );

  const twoPiNode = new Text( '2\u03C0', {
    font: QBSConstants.CONTROL_FONT
  } );

  return new HBox( {
    spacing: LABEL_ICON_SPACING,
    children: [
      phaseText,
      new HBox( {
        spacing: 3,
        children: [ zeroNode, spectrumNode, twoPiNode ]
      } )
    ]
  } );
}

quantumBoundStates.register( 'WaveFunctionComponentsCheckboxGroup', WaveFunctionComponentsCheckboxGroup );