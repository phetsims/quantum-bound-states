// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionComponentsCheckboxGroup is a group of checkboxes for controlling the visibility of various
 * components of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import PhaseCheckbox from './PhaseCheckbox.js';

const LABEL_ICON_SPACING = 10;

type SelfOptions = EmptySelfOptions;

type WaveFunctionComponentsCheckboxGroupOptions = SelfOptions &
  PickOptional<VBoxOptions, 'layoutOptions'> &
  PickRequired<VBoxOptions, 'enabledProperty' | 'tandem'>;

export default class WaveFunctionComponentsCheckboxGroup extends VBox {

  public constructor( realPartVisibleProperty: Property<boolean>,
                      imaginaryPartVisibleProperty: Property<boolean>,
                      magnitudeVisibleProperty: Property<boolean>,
                      phaseVisibleProperty: Property<boolean>,
                      providedOptions: WaveFunctionComponentsCheckboxGroupOptions ) {

    const options = optionize<WaveFunctionComponentsCheckboxGroupOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      isDisposable: false,
      spacing: 10,
      align: 'left',
      stretch: true
    }, providedOptions );

    // Real Part
    const realPartCheckbox = new Checkbox( realPartVisibleProperty,
      createLabeledLineIcon( QuantumBoundStatesFluent.realPartStringProperty, QBSColors.realPartStrokeProperty ),
      combineOptions<CheckboxOptions>( {
        accessibleHelpText: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleContextResponseUncheckedStringProperty,
        tandem: options.tandem.createTandem( 'realPartCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    // Imaginary Part
    const imaginaryPartCheckbox = new Checkbox( imaginaryPartVisibleProperty,
      createLabeledLineIcon( QuantumBoundStatesFluent.imaginaryPartStringProperty, QBSColors.imaginaryPartStrokeProperty ),
      combineOptions<CheckboxOptions>( {
        accessibleHelpText: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleContextResponseUncheckedStringProperty,
        tandem: options.tandem.createTandem( 'imaginaryPartCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    // Magnitude
    const magnitudeCheckbox = new Checkbox( magnitudeVisibleProperty,
      createLabeledLineIcon( QuantumBoundStatesFluent.magnitudeStringProperty, QBSColors.magnitudeStrokeProperty ),
      combineOptions<CheckboxOptions>( {
        accessibleHelpText: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleContextResponseUncheckedStringProperty,
        tandem: options.tandem.createTandem( 'magnitudeCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    // Phase
    const phaseCheckbox = new PhaseCheckbox( phaseVisibleProperty, {
      layoutOptions: {
        leftMargin: 25 // indent below magnitudeCheckbox
      },
      visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
      enabledProperty: magnitudeVisibleProperty,
      tandem: options.tandem.createTandem( 'phaseCheckbox' )
    } );

    options.children = [
      realPartCheckbox,
      imaginaryPartCheckbox,
      magnitudeCheckbox,
      phaseCheckbox
    ];

    super( options );
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

quantumBoundStates.register( 'WaveFunctionComponentsCheckboxGroup', WaveFunctionComponentsCheckboxGroup );