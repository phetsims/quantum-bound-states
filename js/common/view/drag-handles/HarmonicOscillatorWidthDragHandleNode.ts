// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorWidthDragHandleNode is the drag handle for changing the well width of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
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

    // Vertically center the handle on the left wall.
    const chartTransform = energyDiagramNode.chartTransform;
    Multilink.multilink(
      [ potential.wellWidthProperty, potential.xOffsetProperty, potential.yOffsetProperty ],
      ( wellWidth, xOffset, yOffset ) => {
        this.centerX = chartTransform.modelToViewX( xOffset + wellWidth / 2 );
        this.centerY = chartTransform.modelToViewY( yOffset + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY );
      } );

  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}