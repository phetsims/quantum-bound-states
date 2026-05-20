// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDepthDragHandleNode is the drag handle for changing the well depth of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareDepthDragListener from './FiniteSquareDepthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

// How far the handle is positioned from the rightmost well of the potential, in nm
const HANDLE_X_OFFSET = 0.25;

export default class FiniteSquareDepthDragHandleNode extends PotentialDragHandleNode {

  private readonly potential: FiniteSquarePotential;
  private readonly chartTransform: ChartTransform;

  public constructor( potential: FiniteSquarePotential,
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

    this.addInputListener( new FiniteSquareDepthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    potential.propertyChangedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
  }

  /**
   * Position the handle to the right of the rightmost well, at the top of the potential.
   */
  protected override updatePosition(): void {
    const numberOfWells = this.potential.numberOfWellsProperty.value;
    const potentialWidth = ( numberOfWells * this.potential.wellWidthProperty.value ) +
                           ( ( numberOfWells - 1 ) * this.potential.separationProperty.value );
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + potentialWidth / 2 + HANDLE_X_OFFSET );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.wellDepthProperty.value );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}