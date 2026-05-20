// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorWidthDragHandleNode is the drag handle for changing the well width of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import HarmonicOscillatorWidthDragListener from './HarmonicOscillatorWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class HarmonicOscillatorWidthDragHandleNode extends PotentialDragHandleNode {

  private readonly potential: HarmonicOscillatorPotential;
  private readonly chartTransform: ChartTransform;

  public constructor( potential: HarmonicOscillatorPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential.wellWidthProperty, {
      orientation: 'horizontal',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.potential = potential;
    this.chartTransform = energyDiagramNode.chartTransform;

    this.addInputListener( new HarmonicOscillatorWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    potential.propertyChangedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
  }

  /**
   * Position the handle on the potential at HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY eV.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}