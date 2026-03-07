// Copyright 2026, University of Colorado Boulder

/**
 * OneWellControlPanel is the control panel that is specific to the 'One Well' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import { EnergyDiagramControlPanel } from '../../common/view/EnergyDiagramControlPanel.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import MassControl from './MassControl.js';

export class OneWellControlPanel extends EnergyDiagramControlPanel {

  public constructor( energyLevelProperty: NumberProperty,
                      electronMassesProperty: NumberProperty,
                      valuesVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const controls = [
      new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) ),
      new MassControl( electronMassesProperty, tandem.createTandem( 'massControl' ) ),
      new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) )
    ];

    super( titleText, controls, tandem );
  }
}

quantumBoundStates.register( 'OneWellControlPanel', OneWellControlPanel );