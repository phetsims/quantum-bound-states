// Copyright 2026, University of Colorado Boulder

/**
 * GraphTypeRadioButtonGroup is the radio button group for selecting which type of graph to display at
 * the bottom of the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { GraphType } from '../model/GraphType.js';
import QBSConstants from '../QBSConstants.js';

const TEXT_MAX_WIDTH = 165;

export default class GraphTypeRadioButtonGroup extends AquaRadioButtonGroup<GraphType> {

  public constructor( graphTypeProperty: StringUnionProperty<GraphType>, tandem: Tandem ) {

    const validValues = graphTypeProperty.validValues;

    const items: AquaRadioButtonGroupItem<GraphType>[] = [];

    // Average Probability Density of Band
    if ( validValues?.includes( 'averageProbabilityDensityOfBand' ) ) {
      items.push( {
        value: 'averageProbabilityDensityOfBand',
        createNode: tandem => new RichText( QuantumBoundStatesFluent.averageProbabilityDensityOfBandStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        options: {
          accessibleHelpText: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.averageProbabilityDensityOfBandRadioButton.accessibleHelpTextStringProperty
        },
        tandemName: 'averageProbabilityDensityOfBandRadioButton'
      } );
    }

    // Probability Density
    if ( validValues?.includes( 'probabilityDensity' ) ) {
      items.push( {
        value: 'probabilityDensity',
        createNode: tandem => new RichText( QuantumBoundStatesFluent.probabilityDensityStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        options: {
          accessibleHelpText: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.probabilityDensityRadioButton.accessibleHelpTextStringProperty
        },
        tandemName: 'probabilityDensityRadioButton'
      } );
    }

    // Wave Function
    if ( validValues?.includes( 'waveFunction' ) ) {
      items.push( {
        value: 'waveFunction',
        createNode: tandem => new RichText( QuantumBoundStatesFluent.waveFunctionStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        options: {
          accessibleHelpText: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.wavefunctionRadioButton.accessibleHelpTextStringProperty
        },
        tandemName: 'wavefunctionRadioButton'
      } );
    }

    super( graphTypeProperty, items, {
      spacing: 10,
      accessibleName: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'GraphTypeRadioButtonGroup', GraphTypeRadioButtonGroup );