// Copyright 2026, University of Colorado Boulder

//TODO Stretch pointer areas so that they all have the same width.
/**
 * WaveFunctionComponentsCheckboxGroup is a group of checkboxes for controlling the visibility of various
 * components of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import SpectrumNode from '../../../../scenery-phet/js/SpectrumNode.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
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
        new Text( QuantumBoundStatesFluent.phaseStringProperty, TEXT_OPTIONS ),
        createPhaseIcon()
      ]
    } );
    const phaseCheckbox = new Checkbox( phaseVisibleProperty, phaseIcon, {
      layoutOptions: {
        leftMargin: BOX_WIDTH + HBOX_SPACING
      },
      boxWidth: BOX_WIDTH,
      visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
      enabledProperty: magnitudeVisibleProperty,
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

function createPhaseIcon(): Node {
  const zeroNode = new Text( '0', {
    font: QBSConstants.CONTROL_FONT
  } );
  const phaseBandIcon = new SpectrumNode( {
    size: new Dimension2( 40, 0.75 * zeroNode.height ),
    minValue: VisibleColor.MIN_WAVELENGTH,
    maxValue: VisibleColor.MAX_WAVELENGTH,
    valueToColor: VisibleColor.wavelengthToColor
  } );
  const twoPiNode = new Text( '2\u03C0', {
    font: QBSConstants.CONTROL_FONT
  } );

  return new HBox( {
    spacing: 3,
    children: [ zeroNode, phaseBandIcon, twoPiNode ]
  } );
}

quantumBoundStates.register( 'WaveFunctionComponentsCheckboxGroup', WaveFunctionComponentsCheckboxGroup );