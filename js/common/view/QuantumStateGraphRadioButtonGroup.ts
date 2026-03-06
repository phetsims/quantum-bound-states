// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphRadioButtonGroup is the radio button group for selecting which type of graph to display at
 * the bottom of the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import AverageProbabilityDensityOfBandGraph from '../model/AverageProbabilityDensityOfBandGraph.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSConstants from '../QBSConstants.js';

const TEXT_MAX_WIDTH = 165;

export default class QuantumStateGraphRadioButtonGroup extends AquaRadioButtonGroup<QuantumStateGraph> {

  public constructor( selectedGraphProperty: Property<QuantumStateGraph>, tandem: Tandem ) {

    const validValues = selectedGraphProperty.validValues;

    const items: AquaRadioButtonGroupItem<QuantumStateGraph>[] = [];

    // Average Probability Density of Band
    const averageProbabilityDensityOfBandGraph = _.find( validValues, value => value instanceof AverageProbabilityDensityOfBandGraph );
    if ( averageProbabilityDensityOfBandGraph ) {
      items.push( {
        value: averageProbabilityDensityOfBandGraph,
        createNode: tandem => new RichText( QuantumBoundStatesFluent.averageProbabilityDensityOfBandStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        tandemName: 'averageProbabilityDensityOfBandRadioButton'
      } );
    }

    // Probability Density
    const probabilityDensityGraph = _.find( validValues, value => value instanceof ProbabilityDensityGraph );
    if ( probabilityDensityGraph ) {
      items.push( {
        value: probabilityDensityGraph,
        createNode: tandem => new RichText( QuantumBoundStatesFluent.probabilityDensityStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        tandemName: 'probabilityDensityRadioButton'
      } );
    }

    // Wave Function
    const waveFunctionGraph = _.find( validValues, value => value instanceof WaveFunctionGraph );
    if ( waveFunctionGraph ) {
      items.push( {
        value: waveFunctionGraph,
        createNode: tandem => new RichText( QuantumBoundStatesFluent.waveFunctionStringProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } ),
        tandemName: 'wavefunctionRadioButton'
      } );
    }

    affirm( items.length > 1, 'At least 2 radio buttons are required.' );

    super( selectedGraphProperty, items, {
      spacing: 10,
      accessibleName: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.graphTypeRadioButtonGroup.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'QuantumStateGraphRadioButtonGroup', QuantumStateGraphRadioButtonGroup );