// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingHandleNode is the handle for changing the spacing between wells of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PoschlTellerSpacingDragListener from './PoschlTellerSpacingDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

// The separation handle will be placed this many eV above the potential's energy offset.
// Vertical marker lines indicate where the separation is measured.
const ENERGY_OFFSET = 1; // eV

export default class PoschlTellerSpacingHandleNode extends PotentialHandleNode<PoschlTellerPotential> {

  public constructor( potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.spacingPatternStringProperty, {
      value: potential.spacingProperty.derived( spacing => toFixed( spacing, QBSConstants.SPACING_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.spacingProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'horizontal',

      //TODO Provide a way to hide this handle via PhET-iO?
      visibleProperty: potential.numberOfWellsProperty.derived( numberOfWells => numberOfWells > 1 ),
      accessibleName: QuantumBoundStatesFluent.a11y.handles.poschlTellerSpacingHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.poschlTellerSpacingHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.poschlTellerSpacingHandle.accessibleObjectResponse.createProperty( {
        spacing: potential.spacingProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new PoschlTellerSpacingDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Position the handle above the potential. If the number of wells is even, the handle is placed on the spacing
   * that is in the middle of the potential. Otherwise, it is placed on the spacing that is just right of center.
   */
  protected override updatePosition(): void {
    const x = ( this.potential.numberOfWellsProperty.value % 2 === 0 ) ?
              this.potential.xOffsetProperty.value + this.potential.spacingProperty.value / 2 :
              this.potential.xOffsetProperty.value + this.potential.spacingProperty.value;
    this.x = this.chartTransform.modelToViewX( x );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + ENERGY_OFFSET +
                                               this.potential.getElectricFieldOffset( x ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.poschlTellerSpacingHandle.accessibleObjectResponse.format( {
      spacing: toFixed( this.potential.spacingProperty.value, QBSConstants.SPACING_DECIMAL_PLACES )
    } ) );
  }
}