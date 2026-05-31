// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSeparationHandleNode is the handle for changing the separation between wells of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareSeparationDragListener from './FiniteSquareSeparationDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

// The separation handle will be placed this many eV above the potential's energy offset.
// Vertical marker lines indicate where the separation is measured.
const ENERGY_OFFSET = 1.5; // eV

export default class FiniteSquareSeparationHandleNode extends PotentialHandleNode<FiniteSquarePotential> {

  public constructor( potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.separationProperty, {
      orientation: 'horizontal',
      visibleProperty: new DerivedProperty( [ potential.numberOfWellsProperty ], numberOfWells => numberOfWells > 1 ),
      accessibleName: QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleObjectResponse.createProperty( {
        separation: potential.separationProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new FiniteSquareSeparationDragListener( this, potential, energyDiagramNode, time, tandem ) );

    potential.electricFieldProperty.link( () => this.updatePosition() );
  }

  /**
   * Position the handle above the potential. If the number of wells is even, the handle is placed on the separation
   * that is in the middle of the potential. Otherwise, it is placed on the separation that is just right of center.
   */
  protected override updatePosition(): void {
    const numberOfWells = this.potential.numberOfWellsProperty.value;
    const x = ( numberOfWells % 2 === 0 ) ?
              this.potential.xOffsetProperty.value + this.potential.separationProperty.value / 2 :
              this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 + this.potential.separationProperty.value;
    this.centerX = this.chartTransform.modelToViewX( x );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                                     this.potential.wellDepthProperty.value +
                                                     ENERGY_OFFSET +
                                                     this.potential.getYOffsetForElectricField( x ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleObjectResponse.format( {
      separation: this.potential.separationProperty.value
    } ) );
  }
}