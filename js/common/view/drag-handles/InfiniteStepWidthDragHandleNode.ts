// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepWidthDragHandleNode is the drag handle for changing the well width of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepWidthDragListener from './InfiniteStepWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class InfiniteStepWidthDragHandleNode extends PotentialDragHandleNode {

  public constructor( potential: InfiniteStepPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    affirm( potential.numberOfWellsProperty.value === 1, 'InfiniteStepWidthDragHandleNode does not support multiple wells' );

    super( potential.wellWidthProperty, {
      orientation: 'horizontal',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new InfiniteStepWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    // Vertically center the handle on the right wall of the well, halfway down to the step.
    const chartTransform = energyDiagramNode.chartTransform;
    Multilink.multilink(
      [ potential.wellWidthProperty, potential.stepHeightProperty, potential.xOffsetProperty, potential.yOffsetProperty ],
      ( wellWidth, stepHeight, xOffset, yOffset ) => {
        this.centerX = chartTransform.modelToViewX( xOffset + wellWidth / 2 );
        this.centerY = chartTransform.modelToViewY( yOffset + ( potential.energyAxisRange.getLength() / 2 ) + ( stepHeight / 2 ) );
      } );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}