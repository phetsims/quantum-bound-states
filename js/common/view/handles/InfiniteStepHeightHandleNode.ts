// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightHandleNode is the handle for changing the step height of an Infinite Step potential.
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
import QBSConstants from '../../QBSConstants.js';
import InfiniteStepHeightDragListener from './InfiniteStepHeightDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class InfiniteStepHeightHandleNode extends PotentialHandleNode<InfiniteStepPotential> {

  public constructor( potential: InfiniteStepPotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.stepHeightPatternStringProperty, {
      value: potential.stepHeightProperty.derived( stepHeight => toFixed( stepHeight, QBSConstants.STEP_HEIGHT_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.stepHeightProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'vertical',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.infiniteStepHeightHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.infiniteStepHeightHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.infiniteStepHeightHandle.accessibleObjectResponse.createProperty( {
        stepHeight: potential.stepHeightProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new InfiniteStepHeightDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Horizontally center the handle at the top of the step.
   */
  protected override updatePosition(): void {
    this.x = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 4 );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.stepHeightProperty.value );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.infiniteStepHeightHandle.accessibleObjectResponse.format( {
      stepHeight: toFixed( this.potential.stepHeightProperty.value, QBSConstants.STEP_HEIGHT_DECIMAL_PLACES )
    } ) );
  }
}