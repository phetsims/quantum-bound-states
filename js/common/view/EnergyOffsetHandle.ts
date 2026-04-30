// Copyright 2026, University of Colorado Boulder

//TODO Make this a child of EnergyDiagramNode and sort of coordinate transform problems.
/**
 * EnergyOffsetHandle is the drag handle used to change the y-offset of the selected potential and (as a side effect)
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
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import EnergyDiagram from '../model/EnergyDiagram.js';
import QuantumPotential from '../model/potentials/QuantumPotential.js';
import QBSConstants from '../QBSConstants.js';
import EnergyAxisDragListener from './EnergyAxisDragListener.js';

const ARROW_LENGTH = 35; //TODO move to QBSConstants and use for all drag handles?

export default class EnergyOffsetHandle extends InteractiveHighlighting( ArrowNode ) {

  private readonly centerYProperty: Property<number>;

  public constructor( energyDiagram: EnergyDiagram,
                      potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartRectangleBounds: Bounds2,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    const options = combineOptions<ArrowNodeOptions>( {}, AccessibleDraggableOptions, QBSConstants.DRAG_ARROWS_OPTIONS, {
      accessibleName: QuantumBoundStatesFluent.a11y.energyAxisDragHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyAxisDragHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.energyAxisDragHandle.accessibleFocusObjectResponseStringProperty,
      tandem: tandem
    } );

    super( 0, -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, options );

    this.centerX = chartRectangleBounds.left;

    const pointerArea = this.localBounds.dilatedXY( 5, 5 );
    this.mouseArea = pointerArea;
    this.touchArea = pointerArea;

    this.centerYProperty = new NumberProperty( 0 );

    // Keep the handle connected to the center of the y-range for the selected potential.
    Multilink.multilink(
      [ potentialProperty, energyDiagram.yRangeProperty ],
      ( potential, yRange ) => {
        this.centerYProperty.value = chartRectangleBounds.top + chartTransform.modelToViewY( potential.energyAxisRange.getCenter() );
      } );

    this.addInputListener( new EnergyAxisDragListener( this, potentialProperty, chartRectangleBounds, chartTransform, tandem ) );

    this.centerYProperty.link( centerY => {
      this.centerY = centerY;
    } );
  }

  /**
   * Describes the drag handle when it is moved.
   */
  public describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.energyAxisDragHandle.accessibleObjectResponseStringProperty.value );
  }
}