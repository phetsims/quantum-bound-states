// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/quantum-bound-states/issues/53 Does not drag full range when electric field is non-zero.
/**
 * FiniteSquareDepthDragListener is the drag listener for changing the well depth of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareDepthHandleNode from './FiniteSquareDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareDepthDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareDepthHandleNode,
                      potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'vertical',
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.yOffsetProperty, potential.electricFieldProperty ],
        yOffset => {
        const x = handleNode.getModelX();
        const electricFieldOffset = potential.getElectricFieldOffset( x );
        return new Bounds2(
            energyDiagramRectangleBounds.minX,
            chartTransform.modelToViewY( yOffset + wellDepthProperty.range.max + electricFieldOffset ),
            energyDiagramRectangleBounds.maxX,
            chartTransform.modelToViewY( yOffset + wellDepthProperty.range.min + electricFieldOffset ) );
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaY = listener.modelDelta.y;

        // Remember the Property's previous value for sound feedback.
        const previousWellDepth = wellDepthProperty.value;

        // Update the Property.
        const deltaDepth = chartTransform.viewToModelDeltaY( viewDeltaY );
        wellDepthProperty.value = wellDepthProperty.range.constrainValue( previousWellDepth + deltaDepth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellDepthProperty.value, previousWellDepth );
      }
    } );
  }
}