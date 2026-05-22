// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerWidthHandleNode is the handle for changing the well width of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PoschlTellerWidthDragListener from './PoschlTellerWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

// The width handle will be places this many eV above the potential's energy offset.
// Vertical marker lines will indicate where the width is measured.
const ENERGY_OFFSET = 2; // eV

export default class PoschlTellerWidthHandleNode extends PotentialHandleNode<PoschlTellerPotential> {

  public constructor( potential: PoschlTellerPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new PoschlTellerWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Position the handle above the rightmost well.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.getTotalWidth() / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + ENERGY_OFFSET );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}