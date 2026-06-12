// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareWidthDragListener is the drag listener for changing the well width of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import FiniteSquareWidthHandleNode from './FiniteSquareWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareWidthDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareWidthHandleNode,
                      potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty(
      [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.separationProperty ],
      ( xOffset, numberOfWells, separation ) => {
        const minTotalWidth = ( numberOfWells * wellWidthProperty.range.min ) + ( ( numberOfWells - 1 ) * separation );
        const maxTotalWidth = ( numberOfWells * wellWidthProperty.range.max ) + ( ( numberOfWells - 1 ) * separation );
        const minX = xOffset + minTotalWidth / 2;
        const maxX = xOffset + maxTotalWidth / 2;
        return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } );

    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm
      dragBoundsProperty: dragBoundsProperty,

      // Update the Property while dragging.
      updateProperty: viewDelta => {
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( viewDelta.x );
        wellWidthProperty.value = wellWidthProperty.range.constrainValue(
          wellWidthProperty.value + deltaWidth / potential.numberOfWellsProperty.value );
      }
    } );
  }
}