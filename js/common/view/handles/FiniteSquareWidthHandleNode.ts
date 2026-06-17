// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthHandleNode is the handle for changing the well width of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWidthDragListener from './FiniteSquareWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class FiniteSquareWidthHandleNode extends PotentialHandleNode<FiniteSquarePotential> {

  public constructor( potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.widthPatternStringProperty, {
      value: new DerivedStringProperty( [ potential.wellWidthProperty ],
        wellWidth => toFixed( wellWidth, QBSConstants.WELL_WIDTH_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.wellWidthProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new FiniteSquareWidthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Vertically center the handle on the right wall of the rightmost well.
   */
  protected override updatePosition(): void {
    const x = this.potential.xOffsetProperty.value + this.potential.getTotalWidth() / 2;
    this.x = this.chartTransform.modelToViewX( x );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                               this.potential.wellDepthProperty.value / 2 +
                                               this.potential.getElectricFieldOffset( x ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.finiteSquareWidthHandle.accessibleObjectResponse.format( {
      width: toFixed( this.potential.wellWidthProperty.value, QBSConstants.WELL_WIDTH_DECIMAL_PLACES )
    } ) );
  }
}