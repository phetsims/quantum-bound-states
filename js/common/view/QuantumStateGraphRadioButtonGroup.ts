// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphRadioButtonGroup is the radio button group for selecting which type of graph to display at
 * the bottom of the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSConstants from '../QBSConstants.js';

const TEXT_MAX_WIDTH = 165;

export default class QuantumStateGraphRadioButtonGroup extends AquaRadioButtonGroup<QuantumStateGraph> {

  public constructor( selectedGraphProperty: Property<QuantumStateGraph>,
                      probabilityDensityGraph: ProbabilityDensityGraph,
                      waveFunctionGraph: WaveFunctionGraph,
                      tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<QuantumStateGraph>[] = [

      // Probability Density
      {
        value: probabilityDensityGraph,
        createNode: tandem => new RichText( QuantumBoundStatesFluent.probabilityDensityStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        tandemName: 'probabilityDensityRadioButton'
      },

      // Wave Function
      {
        value: waveFunctionGraph,
        createNode: tandem => new RichText( QuantumBoundStatesFluent.waveFunctionStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        tandemName: 'waveFunctionRadioButton'
      }
    ];

    super( selectedGraphProperty, items, {
      isDisposable: false,
      spacing: 10,
      accessibleName: QuantumBoundStatesFluent.a11y.quantumStateGraphRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.quantumStateGraphRadioButtonGroup.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
