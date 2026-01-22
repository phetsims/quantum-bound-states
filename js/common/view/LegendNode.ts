// Copyright 2026, University of Colorado Boulder

/**
 * LegendNode explains the colors used in the charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class LegendNode extends Panel {

  public constructor( tandem: Tandem ) {

    const content = new HBox( {
      spacing: 14,
      children: [
        new LegendEntryNode( QuantumBoundStatesFluent.potentialEnergyStringProperty, QBSColors.potentialEnergyColorProperty ),
        new LegendEntryNode( QuantumBoundStatesFluent.totalEnergyStringProperty, QBSColors.totalEnergyColorProperty )
      ]
    } );

    super( content, {
      cornerRadius: 3,
      xMargin: 10,
      yMargin: 5,
      fill: QBSColors.legendFillProperty,
      stroke: QBSColors.legendStrokeProperty
    } );
  }
}

class LegendEntryNode extends HBox {

  public constructor( labelStringProperty: TReadOnlyProperty<string>, stroke: TColor ) {

    const lineNode = new Line( 0, 0, 20, 0, {
      lineWidth: 3,
      stroke: stroke
    } );

    const labelNode = new Text( labelStringProperty, {
      font: QBSConstants.LEGEND_FONT
    } );

    super( {
      spacing: 5,
      children: [ lineNode, labelNode ]
    } );
  }
}

quantumBoundStates.register( 'LegendNode', LegendNode );