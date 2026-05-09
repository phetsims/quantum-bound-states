// Copyright 2026, University of Colorado Boulder

/**
 * HighlightedEnergyLevelDisplay displays the highlighted energy level and its corresponding energy value in eV.
 * The display appears above the highlighted energy level line, right-aligned with Energy Diagram's ChartRectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';
import EnergyLevelDisplay from './EnergyLevelDisplay.js';

export default class HighlightedEnergyLevelDisplay extends EnergyLevelDisplay {

  public constructor( model: QBSModel,
                      energyLevelProperty: TReadOnlyProperty<number | null>,
                      chartTransform: ChartTransform,
                      chartRectangle: ChartRectangle,
                      tandem: Tandem ) {

    super( model, energyLevelProperty, chartTransform, {
      tandem: tandem
    } );

    // Right-aligned with the chartRectangle.
    this.localBoundsProperty.link( () => {
      this.right = chartRectangle.right - 10;
    } );
  }
}