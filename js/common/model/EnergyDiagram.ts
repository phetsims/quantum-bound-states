// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagram is the model for the 'Energy' diagram.
 * An intentional design decision was to call this a "diagram", not a "graph".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import Potential from './potentials/Potential.js';
import NumerovSolver from './solver/NumerovSolver.js';
import XGrid from './solver/XGrid.js';

export default class EnergyDiagram {

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  public readonly xGrid: XGrid;
  public readonly potentialEnergiesProperty: Property<number[]>;
  public readonly eigenvaluesProperty: Property<number[]>;

  public constructor( xGrid: XGrid,
                      potentialProperty: TReadOnlyProperty<Potential>,
                      tandem: Tandem ) {

    this.valuesVisibleProperty = new BooleanProperty( QBSQueryParameters.valuesVisible, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );

    const potentialFunction = ( x: number ) => potentialProperty.value.getPotentialEnergyAt( x ); // nm => eV
    const mass = 1; // electron masses
    //TODO Range depends on the y-axis range and the type of potential. Only look for energy values in the range that's visible on the graph.
    const energyMin = 0; // eV
    const energyMax = 10; // eV

    const boundStateResult = NumerovSolver.solveNumerov( xGrid, potentialFunction, mass, energyMin, energyMax );

    this.xGrid = xGrid;

    this.potentialEnergiesProperty = new Property( boundStateResult.potentials, {
      //TODO PhET-iO
    } );

    this.eigenvaluesProperty = new Property<number[]>( boundStateResult.energies, {
      //TODO PhET-iO
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    //TODO Add additional Properties to reset.
  }
}

quantumBoundStates.register( 'EnergyDiagram', EnergyDiagram );