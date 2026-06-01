// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingDragListener is the drag listener for changing spacing between wells of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PoschlTellerSpacingHandleNode from './PoschlTellerSpacingHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerSpacingDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerSpacingHandleNode,
                      potential: PoschlTellerPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const spacingProperty = potential.spacingProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, spacingProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty, potential.numberOfWellsProperty ],
        ( xOffset, numberOfWells ) => {

          // Handle is to the left of the potential's center. So subtract from offset and reverse the use of
          // spacingProperty.range.min and spacingProperty.range.max.
          const minX = ( numberOfWells % 2 === 0 ) ?
                       xOffset - spacingProperty.range.max / 2 :
                       xOffset - spacingProperty.range.max;
          const maxX = ( numberOfWells % 2 === 0 ) ?
                       xOffset - spacingProperty.range.min / 2 :
                       xOffset - spacingProperty.range.min;

          return new Bounds2(
            chartTransform.modelToViewX( minX ),
            energyDiagramRectangleBounds.minY,
            chartTransform.modelToViewX( maxX ),
            energyDiagramRectangleBounds.maxY );
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousSpacing = spacingProperty.value;

        // Compute new value, taking into account the number of wells.
        // deltaSpacing is subtracted because the handle is to the left of the potential's center, so that it does
        // not conflict with the width handle, which is to the right of the potential's center.
        const deltaSpacing = ( potential.numberOfWellsProperty.value % 2 === 0 ) ?
                             2 * chartTransform.viewToModelDeltaX( viewDeltaX ) :
                             chartTransform.viewToModelDeltaX( viewDeltaX );
        spacingProperty.value = spacingProperty.range.constrainValue( previousSpacing - deltaSpacing );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( spacingProperty.value, previousSpacing );
      }
    } );
  }
}