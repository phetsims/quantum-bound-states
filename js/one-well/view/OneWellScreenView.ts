// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SpectrumNode, { SpectrumNodeOptions } from '../../../../scenery-phet/js/SpectrumNode.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../../common/QBSQueryParameters.js';
import { phaseToRainbow, phaseToTwilight } from '../../common/view/PhaseColormapNode.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import EnergyRangeShiftSpinner from './EnergyRangeShiftSpinner.js';
import { OneWellControlPanel } from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new OneWellControlPanel( listboxParent, model.potentialProperty,
      model.electronMassesProperty, model.selectedEnergyLevelProperty, model.time,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );

    // Add a spinner to shift the y-axis range of the Energy Diagram for the selected potential.
    const energyRangeShiftSpinner = new EnergyRangeShiftSpinner( model.energyRangeShiftProperty,
      model.time, this.energyDiagramNode.tandem.createTandem( 'energyRangeShiftSpinner' ) );
    this.screenViewRootNode.addChild( energyRangeShiftSpinner );
    energyRangeShiftSpinner.right = this.energyDiagramRectangleBounds.left - 26;
    energyRangeShiftSpinner.bottom = this.energyDiagramRectangleBounds.bottom - 7;
    this.pdomOrderInsertAfter( this.pdomPlayAreaNode, this.energyDiagramNode, energyRangeShiftSpinner );

    //TODO Delete when a phase mapping has been chosen.
    if ( QBSQueryParameters.showPhaseSpectra ) {
      const spectrumNodeOptions = {
        size: new Dimension2( 600, 100 ),
        minValue: 0,
        maxValue: 2 * Math.PI
      };
      this.addChild( new VBox( {
        children: [
          new SpectrumNode( combineOptions<SpectrumNodeOptions>( {}, spectrumNodeOptions, {
            valueToColor: value => phaseToRainbow( value )
          } ) ),
          new SpectrumNode( combineOptions<SpectrumNodeOptions>( {}, spectrumNodeOptions, {
            valueToColor: value => new Color( phaseToTwilight( value ) )
          } ) )
        ],
        spacing: 20,
        align: 'center',
        centerX: this.layoutBounds.centerX,
        top: this.layoutBounds.top + 50
      } ) );
    }
  }
}
