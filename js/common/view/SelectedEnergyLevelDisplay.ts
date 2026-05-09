// Copyright 2026, University of Colorado Boulder

/**
 * SelectedEnergyLevelDisplay displays the selected energy level and its corresponding energy value in eV.
 * The display appears above the highlighted energy level line, left-aligned with Energy Diagram's ChartRectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';
import EnergyLevelDisplay from './EnergyLevelDisplay.js';

export default class SelectedEnergyLevelDisplay extends EnergyLevelDisplay {

  public constructor( model: QBSModel,
                      energyLevelProperty: TReadOnlyProperty<number | null>,
                      chartTransform: ChartTransform,
                      chartRectangle: ChartRectangle,
                      tandem: Tandem ) {

    super( model, energyLevelProperty, chartTransform, {

      // Left-aligned with the chartRectangle.
      left: chartRectangle.left + 10,
      tandem: tandem
    } );
  }
}