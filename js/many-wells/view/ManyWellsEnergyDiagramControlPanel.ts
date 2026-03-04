// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsEnergyDiagramControlPanel contains controls related to what is shown in the Energy diagram
 * for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { EnergyDiagramControlPanel } from '../../common/view/EnergyDiagramControlPanel.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export class ManyWellsEnergyDiagramControlPanel extends EnergyDiagramControlPanel {

  public constructor( energyLevelProperty: NumberProperty,
                      valuesVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const controls = [
      new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) ),
      new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) )
      //TODO numberOfWellsNumberControl
      //TODO electricFieldNumberControl
    ];

    super( controls, tandem );
  }
}

quantumBoundStates.register( 'ManyWellsEnergyDiagramControlPanel', ManyWellsEnergyDiagramControlPanel );