// Copyright 2026, University of Colorado Boulder

/**
 * PotentialHandlesNode is the base class for a set of handles related to a quantum potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

export type PotentialHandlesNodeOptions = SelfOptions & PickRequired<NodeOptions, 'children' | 'tandem'>;

export default class PotentialHandlesNode extends Node {

  protected constructor( potential: QuantumPotential,
                         selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                         providedOptions: PotentialHandlesNodeOptions ) {

    const options = optionize<PotentialHandlesNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false,

      // Handles for the potential are visible when the potential is selected.
      visibleProperty: selectedPotentialProperty.derived( selectedPotential => potential === selectedPotential ),

      // pdomOrder is determined by the initial order of children. Order of children will later be modified by moving
      // a handle to the front when interaction begins.
      pdomOrder: providedOptions.children
    }, providedOptions );

    super( options );
  }
}