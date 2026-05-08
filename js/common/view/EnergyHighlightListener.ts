// Copyright 2026, University of Colorado Boulder

/**
 * EnergyHighlightListener highlights the energy level that is under the cursor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TInputListener from '../../../../scenery/js/input/TInputListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';

export default class EnergyHighlightListener implements TInputListener {

  //TODO Reduce coupling to QBSModel
  public constructor( model: QBSModel,
                      highlightedEigenvalueProperty: Property<number | null>,
                      chartRectangle: ChartRectangle,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {
    //TODO Set highlightedEigenvalueProperty
  }
}