// Copyright 2026, University of Colorado Boulder

/**
 * MorseDepthHandleNode is the handle for changing the well depth of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import MorseDepthDragListener from './MorseDepthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class MorseDepthHandleNode extends PotentialHandleNode<MorsePotential> {

  public constructor( potential: MorsePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.depthPatternStringProperty, {
      value: new DerivedStringProperty( [ potential.wellDepthProperty ],
        wellDepth => toFixed( wellDepth, QBSConstants.WELL_DEPTH_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.wellDepthProperty, labelStringProperty, {
      orientation: 'vertical',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.morseDepthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.morseDepthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.morseDepthHandle.accessibleObjectResponse.createProperty( {
        depth: potential.wellDepthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new MorseDepthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Position the handle at the bottom of the well.
   */
  protected override updatePosition(): void {
    this.x = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value );
    // Subtract wellDepth because depth is downward for Morse.
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value - this.potential.wellDepthProperty.value );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.morseDepthHandle.accessibleObjectResponse.format( {
      depth: this.potential.wellDepthProperty.value
    } ) );
  }
}