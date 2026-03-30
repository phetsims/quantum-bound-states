// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraph is the model for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class WaveFunctionGraph extends QuantumStateGraph {

  // Visibility of the wave function components
  public readonly realPartVisibleProperty: Property<boolean>;
  public readonly imaginaryPartVisibleProperty: Property<boolean>;
  public readonly magnitudeVisibleProperty: Property<boolean>;
  public readonly phaseVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.realPartVisibleProperty = new BooleanProperty( QBSQueryParameters.realPartVisible, {
      tandem: tandem.createTandem( 'realPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.imaginaryPartVisibleProperty = new BooleanProperty( QBSQueryParameters.imaginaryPartVisible, {
      tandem: tandem.createTandem( 'imaginaryPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.magnitudeVisibleProperty = new BooleanProperty( QBSQueryParameters.magnitudeVisible, {
      tandem: tandem.createTandem( 'magnitudeVisibleProperty' ),
      phetioFeatured: true
    } );

    this.phaseVisibleProperty = new BooleanProperty( QBSQueryParameters.phaseVisible, {
      tandem: tandem.createTandem( 'phaseVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.realPartVisibleProperty.reset();
    this.imaginaryPartVisibleProperty.reset();
    this.magnitudeVisibleProperty.reset();
    this.phaseVisibleProperty.reset();
  }
}
