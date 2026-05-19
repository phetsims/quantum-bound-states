// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightDragHandleNode is the drag handle for changing the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepHeightDragListener from './InfiniteStepHeightDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class InfiniteStepHeightDragHandleNode extends PotentialDragHandleNode {

  public constructor( potential: InfiniteStepPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    affirm( potential.numberOfWellsProperty.value === 1, 'InfiniteStepWidthDragHandleNode does not support multiple wells' );

    super( potential.stepHeightProperty, {
      orientation: 'vertical',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new InfiniteStepHeightDragListener( this, potential, energyDiagramNode, time, tandem ) );

    // Center the handle in the top of the step.
    const chartTransform = energyDiagramNode.chartTransform;
    Multilink.multilink(
      [ potential.stepHeightProperty, potential.wellWidthProperty, potential.xOffsetProperty, potential.yOffsetProperty ],
      ( stepHeight, wellWidth, xOffset, yOffset ) => {
        this.centerX = chartTransform.modelToViewX( xOffset + wellWidth / 4 );
        this.centerY = chartTransform.modelToViewY( yOffset + stepHeight );
      } );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}