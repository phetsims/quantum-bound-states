// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerWidthDragListener is the drag listener for changing the well width of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PoschlTellerWidthHandleNode from './PoschlTellerWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerWidthDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerWidthHandleNode,
                      potential: PoschlTellerPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.spacingProperty ],
        ( xOffset, numberOfWells, spacing ) => {
          const minTotalWidth = ( ( numberOfWells - 1 ) * spacing ) + wellWidthProperty.range.min;
          const maxTotalWidth = ( ( numberOfWells - 1 ) * spacing ) + wellWidthProperty.range.max;
          return new Bounds2(
            chartTransform.modelToViewX( xOffset + minTotalWidth / 2 ),
            energyDiagramRectangleBounds.minY,
            chartTransform.modelToViewX( xOffset + maxTotalWidth / 2 ),
            energyDiagramRectangleBounds.maxY );
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousWellWidth = wellWidthProperty.value;

        // The handle is at getTotalWidth()/2, and getTotalWidth changes 1:1 with wellWidth.
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( viewDeltaX );
        wellWidthProperty.value = wellWidthProperty.range.constrainValue( previousWellWidth + deltaWidth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellWidthProperty.value, previousWellWidth );
      }
    } );
  }
}