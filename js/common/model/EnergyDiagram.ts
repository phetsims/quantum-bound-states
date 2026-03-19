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
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import Potential from './potentials/Potential.js';
import FundamentalConstants from './solver/FundamentalConstants.js';
import NumerovSolver from './solver/NumerovSolver.js';

export default class EnergyDiagram {

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  // Points to approximate the selected potential.
  public readonly potentialPointsProperty: Property<Vector2[]>;

  public readonly eigenvaluesProperty: Property<number[]>;

  public constructor( potentialProperty: TReadOnlyProperty<Potential>,
                      tandem: Tandem ) {

    this.valuesVisibleProperty = new BooleanProperty( QBSQueryParameters.valuesVisible, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );

    //TODO BoundStateResult doesn't return the potential values that it computed, so we have to compute it separately.
    const xRange = QBSConstants.ALL_GRAPHS_X_RANGE;
    const numberOfPoints = 1000;
    this.potentialPointsProperty = new Property( potentialProperty.value.getPotentialPoints( xRange, numberOfPoints ), {
      //TODO PhET-iO
    } );
    potentialProperty.link( potential => {
      this.potentialPointsProperty.value = potential.getPotentialPoints( xRange, numberOfPoints );
    } );

    //TODO This will compute the potential energy curve a second time.
    const potentialFunction = ( x: number ) => potentialProperty.value.getPotentialEnergyAt( x ) * FundamentalConstants.EV_TO_JOULES; // J
    //TODO Change the model to use appropriate units, so that we are not constantly converting.
    const mass = 1 * FundamentalConstants.ELECTRON_MASS; // kg
    const gridConfig = {
      xMin: QBSConstants.ALL_GRAPHS_X_RANGE.min * FundamentalConstants.NM_TO_METERS,  // m
      xMax: QBSConstants.ALL_GRAPHS_X_RANGE.max * FundamentalConstants.NM_TO_METERS,  // m
      numPoints: 1001  // number of points
    };
    //TODO Why does NumerovSolver.test.js range from -10 to 0 eV?
    const energyMin = 0 * FundamentalConstants.EV_TO_JOULES; // J
    const energyMax = 10 * FundamentalConstants.EV_TO_JOULES; // J

    const boundStateResult = NumerovSolver.solveNumerov( potentialFunction, mass, gridConfig, energyMin, energyMax );
    //TODO There are 34 eigenvalues here. Java version had 6 values. What's wrong?
    console.log( 'boundStateResult.energies.length = ' + boundStateResult.energies.length ); //TODO delete

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