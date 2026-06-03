// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleWidthHandleNode is the handle for changing the well width of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import AsymmetricTriangleWidthDragListener from './AsymmetricTriangleWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class AsymmetricTriangleWidthHandleNode extends PotentialHandleNode<AsymmetricTrianglePotential> {

  public constructor( potential: AsymmetricTrianglePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.widthPatternStringProperty, {
      value: new DerivedStringProperty( [ potential.wellWidthProperty ],
        wellWidth => toFixed( wellWidth, QBSConstants.WELL_WIDTH_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.wellWidthProperty, labelStringProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new AsymmetricTriangleWidthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Vertically center the handle on the left wall.
   */
  protected override updatePosition(): void {
    this.x = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value - this.potential.wellWidthProperty.value / 2 );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.wellDepthProperty.value / 2 );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}