// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorWidthDragHandleNode is the drag handle for changing the well width of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import HarmonicOscillatorWidthDragListener from './HarmonicOscillatorWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class HarmonicOscillatorWidthDragHandleNode extends PotentialDragHandleNode {

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

    this.addInputListener( new HarmonicOscillatorWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    const chartTransform = energyDiagramNode.chartTransform;

    // Vertically center the handle on the left wall.
    const updatePosition = () => {
      this.centerX = chartTransform.modelToViewX( potential.xOffsetProperty.value + potential.wellWidthProperty.value / 2 );
      this.centerY = chartTransform.modelToViewY( potential.yOffsetProperty.value + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY );
    };

    chartTransform.changedEmitter.addListener( () => updatePosition() );
    potential.propertyChangedEmitter.addListener( () => updatePosition() );
    updatePosition();
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}