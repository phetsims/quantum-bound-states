// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelsPlot plots a set of energy levels as horizontal lines. The implementation uses the Canvas API to optimize
 * performance. Updating this plot and calling its paintCanvas method is the responsibility of a parent ChartCanvasNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasPainter, { CanvasPainterOptions } from '../../../../bamboo/js/CanvasPainter.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';

// Properties of equilateral triangle.
const TRIANGLE_SIDE_LENGTH = 15;
const TRIANGLE_HEIGHT = ( Math.sqrt( 3 ) / 2 ) * TRIANGLE_SIDE_LENGTH;

type SelfOptions = {
  lineWidth?: number;
  lineDash?: number[];
  strokeProperty: ProfileColorProperty;

  // Optional arrow heads at the ends of each energy level, used to distinguish the selected energy level.
  hasArrowHeads?: boolean;
};

export type EnergyLevelsPlotOptions = SelfOptions & CanvasPainterOptions;

export default class EnergyLevelsPlot extends CanvasPainter {

  private readonly chartTransform: ChartTransform;
  private energies: number[];
  public lineWidth: number;
  public lineDash: number[];
  private readonly strokeProperty: ProfileColorProperty;
  private readonly hasArrowHeads: boolean;

  public constructor( chartTransform: ChartTransform,
                      energies: number[],
                      providedOptions?: EnergyLevelsPlotOptions ) {

    const options = optionize<EnergyLevelsPlotOptions, SelfOptions, CanvasPainterOptions>()( {

      // SelfOptions
      lineWidth: 1,
      lineDash: [], // solid
      hasArrowHeads: false
    }, providedOptions );

    super( options );

    this.chartTransform = chartTransform;
    this.energies = energies;
    this.lineWidth = options.lineWidth;
    this.lineDash = options.lineDash;
    this.strokeProperty = options.strokeProperty;
    this.hasArrowHeads = options.hasArrowHeads;
  }

  /**
   * Sets the energy values and redraws the plot. The associated ChartCanvasNode must call update.
   */
  public setEnergies( energies: number[] ): void {
    this.energies = energies;
  }

  /**
   * Convenience method for setting 1 energy level.
   */
  public setEnergy( energy: number | null ): void {
    this.setEnergies( ( energy === null ) ? [] : [ energy ] );
  }

  /**
   * To be called by the update method of the associated ChartCanvasNode.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    if ( this.visible ) {

      context.beginPath();
      context.strokeStyle = this.strokeProperty.value.toCSS();
      context.lineWidth = this.lineWidth;
      context.setLineDash( this.lineDash );

      const xMin = this.chartTransform.modelToViewX( this.chartTransform.modelXRange.min );
      const xMax = this.chartTransform.modelToViewX( this.chartTransform.modelXRange.max );

      // Horizontal line at each energy level.
      this.energies.forEach( energy => {
        const y = this.chartTransform.modelToViewY( energy );
        context.moveTo( xMin, y );
        context.lineTo( xMax, y );
      } );
      context.stroke();

      // Optional arrow heads at both ends of each horizontal line.
      if ( this.hasArrowHeads ) {
        context.beginPath();
        this.energies.forEach( energy => {

          const y = this.chartTransform.modelToViewY( energy );

          // equilateral triangle at left end
          context.moveTo( xMin, y + TRIANGLE_SIDE_LENGTH / 2 );
          context.lineTo( xMin + TRIANGLE_HEIGHT, y );
          context.lineTo( xMin, y - TRIANGLE_SIDE_LENGTH / 2 );
          context.closePath();

            // equilateral triangle at right end
            context.moveTo( xMax, y + TRIANGLE_SIDE_LENGTH / 2 );
            context.lineTo( xMax - TRIANGLE_HEIGHT, y );
            context.lineTo( xMax, y - TRIANGLE_SIDE_LENGTH / 2 );
            context.closePath();
        } );
        context.fillStyle = this.strokeProperty.value.toCSS();
        context.fill();
      }
    }
  }
}