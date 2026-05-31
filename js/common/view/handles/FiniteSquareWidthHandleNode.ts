// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthHandleNode is the handle for changing the well width of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareWidthDragListener from './FiniteSquareWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class FiniteSquareWidthHandleNode extends PotentialHandleNode<FiniteSquarePotential> {

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

    potential.electricFieldProperty.link( () => this.updatePosition() );
  }

  /**
   * Vertically center the handle on the right wall of the rightmost well.
   */
  protected override updatePosition(): void {
    const x = this.potential.xOffsetProperty.value + this.potential.getTotalWidth() / 2;
    this.x = this.chartTransform.modelToViewX( x );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                               this.potential.wellDepthProperty.value / 2 +
                                               this.potential.getYOffsetForElectricField( x ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}