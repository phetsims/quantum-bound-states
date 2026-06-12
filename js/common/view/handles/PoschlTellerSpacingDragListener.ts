// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingDragListener is the drag listener for changing spacing between wells of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import PoschlTellerSpacingHandleNode from './PoschlTellerSpacingHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerSpacingDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerSpacingHandleNode,
                      potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const spacingProperty = potential.spacingProperty;

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, spacingProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty(
        [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.wellWidthProperty ],
        ( xOffset, numberOfWells, wellWidth ) => {
          const minX = ( numberOfWells % 2 === 0 ) ?
                       xOffset + spacingProperty.range.min / 2 :
                       xOffset + wellWidth / 2 + spacingProperty.range.min;
          const maxX = ( numberOfWells % 2 === 0 ) ?
                       xOffset + spacingProperty.range.max / 2 :
                       xOffset + wellWidth / 2 + spacingProperty.range.max;

          return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousSpacing = spacingProperty.value;

        // Compute new value.
        const deltaSpacing = ( potential.numberOfWellsProperty.value % 2 === 0 ) ?
                             2 * chartTransform.viewToModelDeltaX( viewDeltaX ) :
                             chartTransform.viewToModelDeltaX( viewDeltaX );
        spacingProperty.value = spacingProperty.range.constrainValue( previousSpacing + deltaSpacing );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( spacingProperty.value, previousSpacing );
      }
    } );
  }
}