// Copyright 2026, University of Colorado Boulder

/**
 * MorseDepthDragHandleNode is the drag handle for changing the well depth of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import MorseDepthDragListener from './MorseDepthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class MorseDepthDragHandleNode extends PotentialDragHandleNode {

  private readonly potential: AsymmetricTrianglePotential;
  private readonly chartTransform: ChartTransform;

  public constructor( potential: AsymmetricTrianglePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential.wellDepthProperty, {
      orientation: 'vertical',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.potential = potential;
    this.chartTransform = energyDiagramNode.chartTransform;

    this.addInputListener( new MorseDepthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    potential.propertyChangedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
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