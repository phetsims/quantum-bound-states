// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingDragListener is the drag listener for changing spacing between wells of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
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

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, spacingProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Adjust drag bounds. Since we are not providing a transform option value, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.wellWidthProperty ],
        ( xOffset, numberOfWells, wellWidth ) => {
          //TODO https://github.com/phetsims/quantum-bound-states/issues/53 dragBoundsProperty is incorrect. See PoschlTellerSpacingHandleNode.updatePosition
          return energyDiagramRectangleBounds;
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing a transform option value, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousSpacing = spacingProperty.value;

        // Compute new value, taking into account the number of wells.
        // deltaSpacing is subtracted because the handle is to the left of the potential's center, so that it does
        // not conflict with the width handle, which is to the right of the potential's center.
        const deltaSpacing = 2 * chartTransform.viewToModelDeltaX( viewDeltaX );
        spacingProperty.value = spacingProperty.range.constrainValue(
          previousSpacing - deltaSpacing / ( potential.numberOfWellsProperty.value - 1 ) );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( spacingProperty.value, previousSpacing );
      }
    } );
  }
}