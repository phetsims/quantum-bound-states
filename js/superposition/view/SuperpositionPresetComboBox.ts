// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPresetComboBox is the combo box for selecting a preset superposition state configuration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class SuperpositionPresetComboBox extends ComboBox<number> {

  public constructor( superpositionPresetProperty: NumberProperty,
                      potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      listboxParent: Node,
                      alignGroup: AlignGroup,
                      tandem: Tandem ) {

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    //TODO These items are temporary. Info needs to come from a richer data type.
    let index = superpositionPresetProperty.range.min;
    const items: ComboBoxItem<number>[] = [

      // Preset 1
      {
        value: index++,
        accessibleName: new DerivedStringProperty( [
          potentialProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset1StringProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset1StringProperty
        ], ( potential, groundState0String, groundState1String ) => potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ),
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( new DerivedStringProperty( [
            potentialProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState0.preset1StringProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState1.preset1StringProperty
          ], ( potential, groundState0String, groundState1String ) =>
            potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ), richTextOptions ),
          alignBoxOptions )
      },

      // Preset 2
      {
        value: index++,
        accessibleName: new DerivedStringProperty( [
          potentialProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset2StringProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset2StringProperty
        ], ( potential, groundState0String, groundState1String ) => potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ),
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( new DerivedStringProperty( [
            potentialProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState0.preset2StringProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState1.preset2StringProperty
          ], ( potential, groundState0String, groundState1String ) =>
            potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ), richTextOptions ),
          alignBoxOptions )
      },

      // Preset 3
      {
        value: index++,
        accessibleName: new DerivedStringProperty( [
          potentialProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset3StringProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset3StringProperty
        ], ( potential, groundState0String, groundState1String ) => potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ),
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( new DerivedStringProperty( [
            potentialProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState0.preset3StringProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState1.preset3StringProperty
          ], ( potential, groundState0String, groundState1String ) =>
            potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ), richTextOptions ),
          alignBoxOptions )
      },

      // Preset 4
      {
        value: index++,
        accessibleName: new DerivedStringProperty( [
          potentialProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset4StringProperty,
          QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset4StringProperty
        ], ( potential, groundState0String, groundState1String ) => potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ),
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( new DerivedStringProperty( [
            potentialProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState0.preset4StringProperty,
            QuantumBoundStatesFluent.superpositionConfigurations.groundState1.preset4StringProperty
          ], ( potential, groundState0String, groundState1String ) =>
            potential.getGroundStateIndex() === 0 ? groundState0String : groundState1String ), richTextOptions ),
          alignBoxOptions )
      },

      // Preset 5
      {
        value: index++,
        tandemName: `preset${index}Item`,
        // accessibleName is discoverable from visual string.
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.preset5StringProperty, richTextOptions ),
          alignBoxOptions )
      }
    ];

    super( superpositionPresetProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
