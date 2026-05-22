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


// TODO: FOR CM from MV. The math is correct but please review the approach.
// The handle is positioned at a one "wellWidth" of the bottom of the well 
// which means , that vertically it is at a fraction of the well depth below the y-axis. This fraction is computed below.
// The fraction could be computed from the potential function, but this is a simpler computation.
const FRACTION_OF_WELL_DEPTH = 1- (1-Math.exp(-1))**2; // ≈ 0.60

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
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value  );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value - FRACTION_OF_WELL_DEPTH*this.potential.wellDepthProperty.value );
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