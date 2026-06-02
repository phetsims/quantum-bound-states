// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorWidthHandleNode is the handle for changing the well width of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import HarmonicOscillatorWidthDragListener from './HarmonicOscillatorWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class HarmonicOscillatorWidthHandleNode extends PotentialHandleNode<HarmonicOscillatorPotential> {

  public constructor( potential: HarmonicOscillatorPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new HarmonicOscillatorWidthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Position the handle on the potential at HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY eV.
   */
  protected override updatePosition(): void {
    this.x = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}