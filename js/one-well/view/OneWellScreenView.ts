// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import { AngularFrequencyDisplay } from './AngularFrequencyDisplay.js';
import { OneWellEnergyDiagramPanel } from './OneWellEnergyDiagramPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramPanel = new OneWellEnergyDiagramPanel( listboxParent, model.potentialProperty,
      model.electronMassesProperty, model.energyOffsetProperty, model.selectedEnergyLevelIndexProperty,
      model.time, tandem.createTandem( 'energyDiagramPanel' ) );

    super( model, listboxParent, energyDiagramPanel, {
      screenSummaryContent: new OneWellScreenSummaryContent( model ),
      tandem: tandem
    } );

    // Angular frequency, displayed above the top-right of the Energy Diagram when the Harmonic Oscillator potential is selected.
    // See https://github.com/phetsims/quantum-bound-states/issues/44.
    const angularFrequencyDisplay = new AngularFrequencyDisplay( model.harmonicOscillatorPotential.angularFrequencyProperty, {
      //TODO Do we need a way to permanently hide this via PhET-iO?
      visibleProperty: new DerivedProperty( [ model.potentialProperty ], potential => potential === model.harmonicOscillatorPotential ),
      tandem: tandem.createTandem( 'angularFrequencyDisplay' )
    } );
    this.screenViewRootNode.addChild( angularFrequencyDisplay );
    angularFrequencyDisplay.localBoundsProperty.link( () => {
      angularFrequencyDisplay.right = this.energyDiagramRectangleBounds.right;
      angularFrequencyDisplay.bottom = this.energyDiagramRectangleBounds.top - 3;
    } );
  }
}
