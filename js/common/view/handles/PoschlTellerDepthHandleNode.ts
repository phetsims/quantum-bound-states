// Copyright 2026, University of Colorado Boulder

/**
 * MorseDepthHandleNode is the handle for changing the well depth of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import WellDepthDragListener from './WellDepthDragListener.js';

export default class PoschlTellerDepthHandleNode extends PotentialHandleNode<PoschlTellerPotential> {

  public constructor( potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.depthPatternStringProperty, {
      value: potential.wellDepthProperty.derived( wellDepth => toFixed( wellDepth, QBSConstants.WELL_DEPTH_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.wellDepthProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'vertical',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.poschlTellerDepthHandle.accessibleObjectResponse.createProperty( {
        depth: potential.wellDepthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new WellDepthDragListener( this, potential, chartTransform, time, tandem ) );
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
      depth: toFixed( this.potential.wellDepthProperty.value, QBSConstants.WELL_DEPTH_DECIMAL_PLACES )
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