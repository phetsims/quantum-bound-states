// Copyright 2026, University of Colorado Boulder

/**
 * EnergyAxisDragHandle is the drag handle used to change the y-offset of the selected potential and (as a side effect)
 * change the range of the y-axis for the Energy Diagram,
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnergyDiagram from '../../common/model/EnergyDiagram.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSConstants from '../../common/QBSConstants.js';

const ARROW_LENGTH = 35; //TODO move to QBSConstants and use for all drag handles?

export default class EnergyAxisDragHandle extends InteractiveHighlighting( ArrowNode ) {

  private readonly centerYProperty: Property<number>;

  public constructor( energyDiagram: EnergyDiagram,
                      potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramRectangleBounds: Bounds2,
                      energyDiagramChartTransform: ChartTransform,
                      tandem: Tandem ) {

    const options = combineOptions<ArrowNodeOptions>( {}, AccessibleDraggableOptions, QBSConstants.DRAG_ARROWS_OPTIONS, {
      tandem: tandem
    } );

    super( 0, -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, options );

    this.centerX = energyDiagramRectangleBounds.left;

    this.centerYProperty = new NumberProperty( 0 );

    // Keep the handle connected to the center of the y-range for the selected potential.
    Multilink.multilink(
      [ potentialProperty, energyDiagram.yRangeProperty ],
      ( potential, yRange ) => {
        this.centerYProperty.value = energyDiagramRectangleBounds.top + energyDiagramChartTransform.modelToViewY( potential.energyAxisRange.getCenter() );
      } );

    potentialProperty.lazyLink( potential => this.interruptSubtreeInput() );

    this.addInputListener( new EnergyAxisDragListener( potentialProperty, energyDiagramRectangleBounds, energyDiagramChartTransform, tandem ) );

    this.centerYProperty.link( centerY => {
      this.centerY = centerY;
    } );
  }
}

class EnergyAxisDragListener extends SoundRichDragListener {
  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramRectangleBounds: Bounds2,
                      energyDiagramChartTransform: ChartTransform,
                      tandem: Tandem ) {

    // Create a positionProperty so that we can get listener.modelDelta.y.
    const positionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // Constrain the drag bounds to the y dimension of the Energy Diagram rectangle.
    const dragBoundsProperty = new Property( new Bounds2(
      energyDiagramRectangleBounds.minX,
      energyDiagramRectangleBounds.minY,
      energyDiagramRectangleBounds.minX,
      energyDiagramRectangleBounds.maxY ) );

    super( {
      tandem: tandem,
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      drag: ( event, listener ) => {
        const dy = energyDiagramChartTransform.viewToModelDeltaY( listener.modelDelta.y );
        let yOffset = potentialProperty.value.yOffsetProperty.value - dy;
        yOffset = clamp( yOffset, potentialProperty.value.yOffsetProperty.range.min, potentialProperty.value.yOffsetProperty.range.max );
        potentialProperty.value.yOffsetProperty.value = yOffset;
      },
      keyboardDragListenerOptions: {
        dragDelta: -energyDiagramChartTransform.modelToViewDeltaY( 0.5 ),
        shiftDragDelta: -energyDiagramChartTransform.modelToViewDeltaY( 0.1 ),
        moveOnHoldInterval: 20
      }
    } );
  }
}