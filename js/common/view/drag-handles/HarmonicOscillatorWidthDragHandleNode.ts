// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorWidthDragHandleNode is the drag handle for changing the well width of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import HarmonicOscillatorWidthDragListener from './HarmonicOscillatorWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class HarmonicOscillatorWidthDragHandleNode extends PotentialDragHandleNode<HarmonicOscillatorPotential> {

  public constructor( potential: HarmonicOscillatorPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new HarmonicOscillatorWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Position the handle on the potential at HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY eV.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY );
  }

  /**
   * Describes the drag handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.harmonicOscillatorWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}