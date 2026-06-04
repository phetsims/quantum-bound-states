// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSeparationHandleNode is the handle for changing the separation between wells of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareSeparationDragListener from './FiniteSquareSeparationDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

// The separation handle will be placed this many eV above the potential's energy offset.
// Vertical marker lines indicate where the separation is measured.
const ENERGY_OFFSET = 1.5; // eV

export default class FiniteSquareSeparationHandleNode extends PotentialHandleNode<FiniteSquarePotential> {

  public constructor( potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.separationPatternStringProperty, {
      value: new DerivedStringProperty( [ potential.separationProperty ],
        separation => toFixed( separation, QBSConstants.SEPARATION_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.separationProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'horizontal',

      //TODO Provide a way to hide this handle via PhET-iO?
      visibleProperty: new DerivedProperty( [ potential.numberOfWellsProperty ], numberOfWells => numberOfWells > 1 ),
      accessibleName: QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.finiteSquareSeparationHandle.accessibleObjectResponse.createProperty( {
        separation: potential.separationProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new FiniteSquareSeparationDragListener( this, potential, chartTransform, time, tandem ) );
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
    this.x = this.chartTransform.modelToViewX( x );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                               this.potential.wellDepthProperty.value +
                                               ENERGY_OFFSET +
                                               this.potential.getElectricFieldOffset( x ) );
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