// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthDragHandleNode is the drag handle for changing the well width of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareWidthDragListener from './FiniteSquareWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class FiniteSquareWidthDragHandleNode extends PotentialDragHandleNode<FiniteSquarePotential> {

  public constructor( potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new FiniteSquareWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Vertically center the handle on the right wall of the rightmost well.
   */
  protected override updatePosition(): void {
    const numberOfWells = this.potential.numberOfWellsProperty.value;
    const potentialWidth = ( numberOfWells * this.potential.wellWidthProperty.value ) +
                           ( ( numberOfWells - 1 ) * this.potential.separationProperty.value );
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + potentialWidth / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.wellDepthProperty.value / 2 );
  }

  /**
   * Describes the drag handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}