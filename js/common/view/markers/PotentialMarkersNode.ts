// Copyright 2026, University of Colorado Boulder

/**
 * PotentialMarkersNode is the base class for a set of markers (vertical dashed lines) related to a quantum potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

export type PotentialMarkersNodeOptions = SelfOptions & PickRequired<NodeOptions, 'children' | 'tandem'>;

export default class PotentialMarkersNode extends Node {

  protected constructor( potential: QuantumPotential,
                         selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                         providedOptions: PotentialMarkersNodeOptions ) {

    const options = optionize<PotentialMarkersNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false,
      visibleProperty: new DerivedProperty( [ selectedPotentialProperty ], selectedPotential => potential === selectedPotential )
    }, providedOptions );

    super( options );
  }
}