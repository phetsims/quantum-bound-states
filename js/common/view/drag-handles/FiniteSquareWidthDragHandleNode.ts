// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthDragHandleNode is the drag handle for changing the well width of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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
      tandem: tandem
    } );

    this.addInputListener( new FiniteSquareWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    const chartTransform = energyDiagramNode.chartTransform;

    // Vertically center the handle on the right wall of the rightmost well.
    const updatePosition = () => {
      const numberOfWells = potential.numberOfWellsProperty.value;
      const potentialWidth = ( numberOfWells * potential.wellWidthProperty.value ) + ( ( numberOfWells - 1 ) * potential.separationProperty.value );
      this.centerX = chartTransform.modelToViewX( potential.xOffsetProperty.value + potentialWidth / 2 );
      this.centerY = chartTransform.modelToViewY( potential.yOffsetProperty.value + potential.wellDepthProperty.value / 2 );
    };

    chartTransform.changedEmitter.addListener( () => updatePosition() );
    potential.propertyChangedEmitter.addListener( () => updatePosition() );
    updatePosition();
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}