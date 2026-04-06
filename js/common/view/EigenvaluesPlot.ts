// Copyright 2026, University of Colorado Boulder

/**
 * EigenvaluesPlot plots a set of eigenvalues as horizontal lines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';

type SelfOptions = EmptySelfOptions;

export type EigenvaluesPlotOptions = SelfOptions & PathOptions;

export default class EigenvaluesPlot extends Path {

  private chartTransform: ChartTransform;
  private eigenvalues: number[];

  public constructor( chartTransform: ChartTransform,
                      eigenvalues: number[],
                      providedOptions?: EigenvaluesPlotOptions ) {

    const options = optionize<EigenvaluesPlotOptions, SelfOptions, PathOptions>()( {

      // Path options
      stroke: 'black'
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;
    this.eigenvalues = eigenvalues;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );
    this.disposeEmitter.addListener( () => chartTransform.changedEmitter.removeListener( changedListener ) );
  }

  /**
   * Sets the eigenvalues and redraws the plot.
   */
  public setEigenvalues( eigenvalues: number[] ): void {
    this.eigenvalues = eigenvalues;
    this.update();
  }

  /**
   * Recomputes the rendered shape.
   */
  private update(): void {
    const xMin = this.chartTransform.modelToViewX( this.chartTransform.modelXRange.min );
    const xMax = this.chartTransform.modelToViewX( this.chartTransform.modelXRange.max );
    const shape = new Shape();
    this.eigenvalues.forEach( eigenvalue => {
      const y = this.chartTransform.modelToViewY( eigenvalue );
      shape.moveTo( xMin, y );
      shape.lineTo( xMax, y );
    } );
    this.shape = shape.makeImmutable();
  }
}