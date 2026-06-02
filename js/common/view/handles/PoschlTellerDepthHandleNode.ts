// Copyright 2026, University of Colorado Boulder

/**
 * MorseDepthHandleNode is the handle for changing the well depth of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import PoschlTellerDepthDragListener from './PoschlTellerDepthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class PoschlTellerDepthHandleNode extends PotentialHandleNode<PoschlTellerPotential> {

  public constructor( potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, chartTransform, potential.wellDepthProperty, {
      orientation: 'vertical',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleObjectResponse.createProperty( {
        depth: potential.wellDepthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new PoschlTellerDepthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Position the handle at the bottom of the rightmost well.
   */
  protected override updatePosition(): void {
    const x = this.getModelX();
    this.x = this.chartTransform.modelToViewX( x );
    // Subtract wellDepth because depth is downward for Poschl-Teller.
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value -
                                               this.potential.wellDepthProperty.value +
                                               this.potential.getElectricFieldOffset( x ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleObjectResponse.format( {
      depth: this.potential.wellDepthProperty.value
    } ) );
  }

  /**
   * Gets the x coordinate where the handle should be positioned in the model coordinate system.
   * This is at the center of the rightmost well.
   */
  public getModelX(): number {
    return this.potential.xOffsetProperty.value + this.potential.getTotalWidth() / 2 - this.potential.wellWidthProperty.value / 2;
  }
}