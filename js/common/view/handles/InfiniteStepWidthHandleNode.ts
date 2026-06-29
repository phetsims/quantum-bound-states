// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepWidthHandleNode is the handle for changing the well width of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import WellWidthDragListener from './WellWidthDragListener.js';

export default class InfiniteStepWidthHandleNode extends PotentialHandleNode<InfiniteStepPotential> {

  public constructor( potential: InfiniteStepPotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.widthPatternStringProperty, {
      value: potential.wellWidthProperty.derived( wellWidth => toFixed( wellWidth, potential.wellWidthDecimalPlaces ) )
    } );

    super( potential, chartTransform, potential.wellWidthProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.infiniteStepWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.infiniteStepWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.infiniteStepWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new WellWidthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Vertically center the handle on the right wall of the well, halfway down to the step.
   */
  protected override updatePosition(): void {
    this.x = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                               ( this.potential.yRangeProperty.value.getLength() / 2 ) +
                                               ( this.potential.stepHeightProperty.value / 2 ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.infiniteStepWidthHandle.accessibleObjectResponse.format( {
      width: toFixed( this.potential.wellWidthProperty.value, this.potential.wellWidthDecimalPlaces )
    } ) );
  }
}