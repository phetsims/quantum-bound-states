// Copyright 2026, University of Colorado Boulder

/**
 * MarkersLayer creates a layer that contains markers (vertical dashed line) that are related to potential handles.
 * Markers must be in a separate layer so that they are drawn behind the potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import CoulombMarkersNode from './CoulombMarkersNode.js';
import FiniteSquareMarkersNode from './FiniteSquareMarkersNode.js';

export default class MarkersLayer extends Node {

  public constructor( potentials: readonly QuantumPotential[],
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    const children: Node[] = [];

    potentials.forEach( potential => {

      const markersNodeTandem = tandem.createTandem( `${potential.tandemPrefix}MarkersNode` );

      if ( potential instanceof FiniteSquarePotential ) {
        children.push( new FiniteSquareMarkersNode( potential, selectedPotentialProperty, chartTransform, markersNodeTandem ) );
      }
      else if ( potential instanceof MorsePotential ) {
        //TODO
      }
      else if ( potential instanceof PoschlTellerPotential ) {
        //TODO
      }
      else if ( potential instanceof CoulombPotential ) {
        children.push( new CoulombMarkersNode( potential, selectedPotentialProperty, chartTransform, markersNodeTandem ) );
      }
    } );

    super( {
      children: children,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}