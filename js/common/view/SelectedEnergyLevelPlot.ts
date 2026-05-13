// Copyright 2026, University of Colorado Boulder

/**
 * SelectedEnergyLevelPlot plots the selected energy level as a horizontal line decorated with triangle indicators
 * on the left and right ends.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import QBSColors from '../QBSColors.js';
import EnergyLevelsPlot from './EnergyLevelsPlot.js';

// Properties of equilateral triangle.
const TRIANGLE_SIDE_LENGTH = 15;
const TRIANGLE_HEIGHT = ( Math.sqrt( 3 ) / 2 ) * TRIANGLE_SIDE_LENGTH;

export default class SelectedEnergyLevelPlot extends Node {

  private readonly chartTransform: ChartTransform;
  private readonly energyLevelsPlot: EnergyLevelsPlot;
  private readonly trianglesPath: Path;
  private selectedEnergy: number;

  public constructor( chartTransform: ChartTransform, selectedEnergy: number ) {

    const energyLevelsPlot = new EnergyLevelsPlot( chartTransform, [ selectedEnergy ], {
      stroke: QBSColors.selectedEnergyLevelColorProperty,
      lineWidth: 2
    } );

    const trianglesPath = new Path( null, {
      fill: QBSColors.selectedEnergyLevelColorProperty
    } );

    super( {
      children: [ energyLevelsPlot, trianglesPath ]
    } );

    this.chartTransform = chartTransform;
    this.energyLevelsPlot = energyLevelsPlot;
    this.trianglesPath = trianglesPath;
    this.selectedEnergy = selectedEnergy;

    this.updateTriangles();

    // Update when the transform changes.
    const changedListener = () => this.updateTriangles();
    chartTransform.changedEmitter.addListener( changedListener );
    this.disposeEmitter.addListener( () => chartTransform.changedEmitter.removeListener( changedListener ) );
  }

  /**
   * Sets the selected energy level, in eV.
   */
  public setSelectedEnergy( selectedEnergy: number ): void {
    this.selectedEnergy = selectedEnergy;
    this.energyLevelsPlot.setEnergies( [ selectedEnergy ] ); // energyLevelsPlot handles its own updating.
    this.updateTriangles();
  }

  /**
   * Updates the triangles.
   */
  protected updateTriangles(): void {

    const xMin = this.chartTransform.modelToViewX( this.chartTransform.modelXRange.min );
    const xMax = this.chartTransform.modelToViewX( this.chartTransform.modelXRange.max );
    const y = this.chartTransform.modelToViewY( this.selectedEnergy );

    const shape = new Shape()
      // equilateral triangle at left end
      .moveTo( xMin, y + TRIANGLE_SIDE_LENGTH / 2 )
      .lineTo( xMin + TRIANGLE_HEIGHT, y )
      .lineTo( xMin, y - TRIANGLE_SIDE_LENGTH / 2 )
      .close()
      .newSubpath()
      // equilateral triangle at right end
      .moveTo( xMax, y + TRIANGLE_SIDE_LENGTH / 2 )
      .lineTo( xMax - TRIANGLE_HEIGHT, y )
      .lineTo( xMax, y - TRIANGLE_SIDE_LENGTH / 2 )
      .close();

    this.trianglesPath.shape = shape.makeImmutable();
  }
}