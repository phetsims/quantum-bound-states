// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthDragHandleNode is the drag handle for changing the width of an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareWidthDragListener from './FiniteSquareWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class FiniteSquareWidthDragHandleNode extends PotentialDragHandleNode {

  public constructor( potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential.wellWidthProperty, {
      orientation: 'horizontal',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem.createTandem( 'widthDragHandleNode' )
    } );

    this.addInputListener( new FiniteSquareWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    // Keep the handle vertically centered on the right wall of the rightmost well.
    const chartTransform = energyDiagramNode.chartTransform;
    Multilink.multilink(
      [ potential.numberOfWellsProperty, potential.separationProperty, potential.wellWidthProperty,
        potential.wellDepthProperty, potential.xOffsetProperty, potential.yOffsetProperty ],
      ( numberOfWells, separation, wellWidth, wellDepth, xOffset, yOffset ) => {
        const potentialWidth = ( numberOfWells * wellWidth ) + ( ( numberOfWells - 1 ) * separation );
        this.centerX = chartTransform.modelToViewX( xOffset + potentialWidth / 2 );
        this.centerY = chartTransform.modelToViewY( yOffset + wellDepth / 2 );
      } );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}