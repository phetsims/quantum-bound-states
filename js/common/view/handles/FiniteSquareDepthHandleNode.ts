// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDepthHandleNode is the handle for changing the well depth of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import WellDepthDragListener from './WellDepthDragListener.js';

// How far the handle is positioned from the rightmost well of the potential, in nm
const HANDLE_X_OFFSET = 0.25;

export default class FiniteSquareDepthHandleNode extends PotentialHandleNode<FiniteSquarePotential> {

  public constructor( potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.depthPatternStringProperty, {
      value: potential.wellDepthProperty.derived( wellDepth => toFixed( wellDepth, QBSConstants.WELL_DEPTH_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.wellDepthProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'vertical',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.finiteSquareDepthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.finiteSquareDepthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.finiteSquareDepthHandle.accessibleObjectResponse.createProperty( {
        depth: potential.wellDepthProperty
      } ),
      tandem: tandem
    } );

    potential.numberOfWellsProperty.lazyLink( () => this.updateLabelPosition() );

    this.addInputListener( new WellDepthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Position the handle to the right of the rightmost well, at the top of the potential.
   */
  protected override updatePosition(): void {
    const xModel = this.potential.xOffsetProperty.value + this.potential.getTotalWidth() / 2 + HANDLE_X_OFFSET;
    this.x = this.chartTransform.modelToViewX( xModel );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                               this.potential.wellDepthProperty.value +
                                               this.potential.getElectricFieldOffset( xModel ) );
  }

  /**
   * Updates the position of the label. This label is typically centered above the arrow. But when the number of
   * wells becomes large, the label can sometimes exceed the bounds of the Energy Diagram and overlap the control
   * panel to the right of the Energy Diagram. So in that case, right-justify the label and arrow.
   */
  protected override updateLabelPosition(): void {
    if ( this.potential.numberOfWellsProperty.range.getLength() > 0 &&
         this.potential.numberOfWellsProperty.value === this.potential.numberOfWellsProperty.range.max ) {
      this.labelNode.right = this.arrowNode.right;
    }
    else {
      this.labelNode.centerX = this.arrowNode.centerX;
    }
    this.labelNode.bottom = this.arrowNode.top + PotentialHandleNode.LABEL_Y_OFFSET;
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.finiteSquareDepthHandle.accessibleObjectResponse.format( {
      depth: toFixed( this.potential.wellDepthProperty.value, QBSConstants.WELL_DEPTH_DECIMAL_PLACES )
    } ) );
  }
}