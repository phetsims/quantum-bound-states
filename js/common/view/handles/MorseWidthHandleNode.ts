// Copyright 2026, University of Colorado Boulder

/**
 * MorseWidthHandleNode is the handle for changing the well width of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import MorseWidthDragListener from './MorseWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

// The width handle will be places this many eV above the potential's energy offset.
// Vertical marker lines indicate where the width is measured.
const ENERGY_OFFSET = 2; // eV

export default class MorseWidthHandleNode extends PotentialHandleNode<MorsePotential> {

  public constructor( potential: MorsePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.morseWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.morseWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.morseWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new MorseWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Vertically center the handle on the right wall of the well, halfway down to the step.
   */
  protected override updatePosition(): void {
    this.x = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + ENERGY_OFFSET );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.morseWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}