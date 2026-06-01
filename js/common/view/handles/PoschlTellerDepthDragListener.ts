// Copyright 2026, University of Colorado Boulder

//TODO This is identical to MorseDepthDragListener except for the type of @param potential.
/**
 * MorseDepthDragListener is the drag listener for changing the well depth of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PoschlTellerDepthHandleNode from './PoschlTellerDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerDepthDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerDepthHandleNode,
                      potential: PoschlTellerPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;
    const chartTransform = energyDiagramNode.chartTransform;

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'vertical',
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      // Dependencies that appear to be unused are actually used by getModelX and getElectricFieldOffset.
      dragBoundsProperty: new DerivedProperty(
        [ potential.numberOfWellsProperty, potential.xOffsetProperty, potential.yOffsetProperty,
          potential.wellWidthProperty, potential.spacingProperty, potential.electricFieldProperty ],
        () => {
          const x = handleNode.getModelX();
          const electricFieldOffset = potential.getElectricFieldOffset( x );
          const yOffset = potential.yOffsetProperty.value;
          const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();
          const bounds = new Bounds2(
            energyDiagramRectangleBounds.minX,
            chartTransform.modelToViewY( yOffset - wellDepthProperty.range.min + electricFieldOffset ),
            energyDiagramRectangleBounds.maxX,
            chartTransform.modelToViewY( yOffset - wellDepthProperty.range.max + electricFieldOffset ) );
          return bounds;
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaY = listener.modelDelta.y;

        // Remember the Property's previous value for sound feedback.
        const previousWellDepth = wellDepthProperty.value;

        // Update the Property.
        const deltaDepth = chartTransform.viewToModelDeltaY( -viewDeltaY ); // Negative because depth is downward for Poschl-Teller.
        wellDepthProperty.value = wellDepthProperty.range.constrainValue( previousWellDepth + deltaDepth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellDepthProperty.value, previousWellDepth );
      }
    } );
  }
}