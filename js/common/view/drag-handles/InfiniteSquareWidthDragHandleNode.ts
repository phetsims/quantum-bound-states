// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthDragHandleNode is the drag handle for changing the width of an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import { HomeEndKeyboardListener } from '../HomeEndKeyboardListener.js';
import InfiniteSquareWidthDragListener from './InfiniteSquareWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class InfiniteSquareWidthDragHandleNode extends PotentialDragHandleNode {

  public constructor( potential: InfiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    affirm( potential.numberOfWellsProperty.value === 1, 'InfiniteSquareWidthDragHandleNode does not support multiple wells' );

    super( {
      orientation: 'horizontal',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem.createTandem( 'widthDragHandleNode' )
    } );

    this.addInputListener( new InfiniteSquareWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    this.addInputListener( new HomeEndKeyboardListener( potential.wellWidthProperty, {
      homeCallback: () => this.describeMoved(),
      endCallback: () => this.describeMoved(),
      tandem: tandem.createTandem( 'homeEndKeyboardListener' )
    } ) );

    // Keep the handle connected to the right wall of the rightmost well.
    const chartTransform = energyDiagramNode.chartTransform;
    Multilink.multilink(
      [ potential.wellWidthProperty, potential.xOffsetProperty, potential.yOffsetProperty ],
      ( wellWidth, xOffset, yOffset ) => {
        this.centerX = chartTransform.modelToViewX( wellWidth / 2 + xOffset );
        this.centerY = chartTransform.modelToViewY( yOffset + potential.energyAxisRange.getLength() / 2 );
      } );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}