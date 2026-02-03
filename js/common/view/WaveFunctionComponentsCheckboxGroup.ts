// Copyright 2026, University of Colorado Boulder

//TODO Stretch pointer areas so that they all have the same width.
/**
 * WaveFunctionComponentsCheckboxGroup is a group of checkboxes for controlling the visibility of various
 * components of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

const LINE_LENGTH = 30;
const LINE_WIDTH = 3;
const HBOX_SPACING = 10;
const TEXT_OPTIONS = {
  font: QBSConstants.CONTROL_FONT,
  maxWidth: 100
};
const BOX_WIDTH = new Text( 'X', TEXT_OPTIONS ).height;

export default class WaveFunctionComponentsCheckboxGroup extends VBox {

  public constructor( realPartVisibleProperty: Property<boolean>,
                      imaginaryPartVisibleProperty: Property<boolean>,
                      magnitudeVisibleProperty: Property<boolean>,
                      phaseVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // Real Part
    const realPartIcon = new HBox( {
      spacing: HBOX_SPACING,
      children: [
        new Text( QuantumBoundStatesFluent.realPartStringProperty, TEXT_OPTIONS ),
        new Line( 0, 0, LINE_LENGTH, 0, {
          lineWidth: LINE_WIDTH,
          stroke: QBSColors.realPartStrokeProperty
        } )
      ]
    } );
    const realPartCheckbox = new Checkbox( realPartVisibleProperty, realPartIcon, {
      boxWidth: BOX_WIDTH,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem.createTandem( 'realPartCheckbox' )
    } );

    // Imaginary Part
    const imaginaryPartIcon = new HBox( {
      spacing: HBOX_SPACING,
      children: [
        new Text( QuantumBoundStatesFluent.imaginaryPartStringProperty, TEXT_OPTIONS ),
        new Line( 0, 0, LINE_LENGTH, 0, {
          lineWidth: LINE_WIDTH,
          stroke: QBSColors.imaginaryPartStrokeProperty
        } )
      ]
    } );
    const imaginaryPartCheckbox = new Checkbox( imaginaryPartVisibleProperty, imaginaryPartIcon, {
      boxWidth: BOX_WIDTH,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem.createTandem( 'imaginaryPartCheckbox' )
    } );

    // Magnitude
    const magnitudeIcon = new HBox( {
      spacing: HBOX_SPACING,
      children: [
        new Text( QuantumBoundStatesFluent.magnitudeStringProperty, TEXT_OPTIONS ),
        new Line( 0, 0, LINE_LENGTH, 0, {
          lineWidth: LINE_WIDTH,
          stroke: QBSColors.magnitudeStrokeProperty
        } )
      ]
    } );
    const magnitudeCheckbox = new Checkbox( magnitudeVisibleProperty, magnitudeIcon, {
      boxWidth: BOX_WIDTH,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem.createTandem( 'magnitudeCheckbox' )
    } );

    // Phase
    const phaseIcon = new HBox( {
      spacing: HBOX_SPACING,
      children: [
        new Text( QuantumBoundStatesFluent.phaseStringProperty, TEXT_OPTIONS )
        //TODO phase icon
      ]
    } );
    const phaseCheckbox = new Checkbox( phaseVisibleProperty, phaseIcon, {
      layoutOptions: {
        leftMargin: BOX_WIDTH + HBOX_SPACING
      },
      boxWidth: BOX_WIDTH,
      visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem.createTandem( 'phaseCheckbox' )
    } );

    super( {
      children: [
        realPartCheckbox,
        imaginaryPartCheckbox,
        magnitudeCheckbox,
        phaseCheckbox
      ],
      spacing: 10,
      align: 'left',
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'WaveFunctionComponentsCheckboxGroup', WaveFunctionComponentsCheckboxGroup );