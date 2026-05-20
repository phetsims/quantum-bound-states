// Copyright 2026, University of Colorado Boulder

/**
 * MorseDepthDragHandleNode is the drag handle for changing the well depth of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import MorseDepthDragListener from './MorseDepthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class MorseDepthDragHandleNode extends PotentialDragHandleNode<MorsePotential> {

  public constructor( potential: MorsePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellDepthProperty, {
      orientation: 'vertical',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new MorseDepthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Position the handle to the right of the well, at the top of the potential.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value );
    // Subtract wellDepth because depth is downward for Morse.
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value - this.potential.wellDepthProperty.value );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}