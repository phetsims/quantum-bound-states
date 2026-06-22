// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerWidthHandleNode is the handle for changing the well width of a Poschl-Teller potential.
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
import PotentialHandleNode from './PotentialHandleNode.js';
import WellWidthDragListener from './WellWidthDragListener.js';

// The width handle will be placed this many eV above the potential's energy offset.
// Vertical marker lines indicate where the width is measured.
const ENERGY_OFFSET = 1; // eV

export default class PoschlTellerWidthHandleNode extends PotentialHandleNode<PoschlTellerPotential> {

  public constructor( potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const labelStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.widthPatternStringProperty, {
      value: potential.wellWidthProperty.derived( wellWidth => toFixed( wellWidth, QBSConstants.WELL_WIDTH_DECIMAL_PLACES ) )
    } );

    super( potential, chartTransform, potential.wellWidthProperty, labelStringProperty, valuesVisibleProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new WellWidthDragListener( this, potential, chartTransform, time, tandem ) );
  }

  /**
   * Position the handle above the rightmost well.
   */
  protected override updatePosition(): void {
    const x = this.potential.xOffsetProperty.value + this.potential.getTotalWidth() / 2;
    this.x = this.chartTransform.modelToViewX( x );
    this.y = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + ENERGY_OFFSET +
                                               this.potential.getElectricFieldOffset( x ) );
  }

  /**
   * Describes the handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.poschlTellerWidthHandle.accessibleObjectResponse.format( {
      width: toFixed( this.potential.wellWidthProperty.value, QBSConstants.WELL_WIDTH_DECIMAL_PLACES )
    } ) );
  }
}