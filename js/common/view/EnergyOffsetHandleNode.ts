// Copyright 2026, University of Colorado Boulder

//TODO Make this a child of EnergyDiagramNode and sort of coordinate transform problems.
/**
 * EnergyOffsetHandleNode is the drag handle used to change the y-offset of the selected potential and (as a side effect)
 * change the range of the y-axis for the Energy Diagram,
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
import EnergyOffsetHandleDragListener from './EnergyOffsetHandleDragListener.js';
import { HomeEndKeyboardListener } from './HomeEndKeyboardListener.js';

const ARROW_LENGTH = 35; //TODO move to QBSConstants and use for all drag handles?

export default class EnergyOffsetHandleNode extends InteractiveHighlighting( ArrowNode ) {

  private readonly centerYProperty: Property<number>;

  public constructor( potential: QuantumPotential,
                      potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagram: EnergyDiagram,
                      chartRectangleBounds: Bounds2,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    const options = combineOptions<ArrowNodeOptions>( {}, AccessibleDraggableOptions, QBSConstants.DRAG_ARROWS_OPTIONS, {

      // ArrowNodeOptions
      visibleProperty: new DerivedProperty( [ potentialProperty ], selectedPotential => selectedPotential === potential ),
      accessibleName: QuantumBoundStatesFluent.a11y.energyOffsetHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyOffsetHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.energyOffsetHandle.accessibleFocusObjectResponseStringProperty,
      tandem: tandem
    } );

    super( 0, -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, options );

    this.centerX = chartRectangleBounds.left;

    const pointerArea = this.localBounds.dilatedXY( 5, 5 );
    this.mouseArea = pointerArea;
    this.touchArea = pointerArea;

    this.centerYProperty = new NumberProperty( 0 );

    // Keep the handle connected to the center of the y-range for the potential.
    Multilink.multilink(
      [ potential.yOffsetProperty, energyDiagram.yRangeProperty ],
      ( yOffset, yRange ) => {
        this.centerYProperty.value = chartRectangleBounds.top + chartTransform.modelToViewY( potential.energyAxisRange.getCenter() );
      } );

    this.addInputListener( new EnergyOffsetHandleDragListener( this, potential.yOffsetProperty, chartRectangleBounds,
      chartTransform, tandem ) );

    this.addInputListener( new HomeEndKeyboardListener( potential.yOffsetProperty, {
      homeCallback: () => this.describeMoved(),
      endCallback: () => this.describeMoved(),
      tandem: tandem.createTandem( 'keyboardListener' )
    } ) );

    this.centerYProperty.link( centerY => {
      this.centerY = centerY;
    } );
  }

  /**
   * Describes the drag handle when it is moved.
   */
  public describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.energyOffsetHandle.accessibleObjectResponseStringProperty.value );
  }
}