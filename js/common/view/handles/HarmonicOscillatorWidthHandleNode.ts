// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorWidthHandleNode is the handle for changing the well width of a Harmonic Oscillator potential.
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
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import HarmonicOscillatorWidthDragListener from './HarmonicOscillatorWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class HarmonicOscillatorWidthHandleNode extends PotentialHandleNode<HarmonicOscillatorPotential> {

  public constructor( potential: HarmonicOscillatorPotential,
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
      width: toFixed( this.potential.wellWidthProperty.value, QBSConstants.WELL_WIDTH_DECIMAL_PLACES )
    } ) );
  }
}