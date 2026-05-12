// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SpectrumNode, { SpectrumNodeOptions } from '../../../../scenery-phet/js/SpectrumNode.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../../common/QBSQueryParameters.js';
import PhaseColormap from '../../common/view/PhaseColormap.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import EnergyOffsetHandleNode from './EnergyOffsetHandleNode.js';
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

    // Layer for drag handles used to configure potentials.
    //TODO Make this a child of EnergyDiagramNode and resolve coordinate-transform problems.
    const handlesLayer = new Node( {
      tandem: tandem.createTandem( 'handlesLayer' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
    this.screenViewRootNode.addChild( handlesLayer );
    this.pdomOrderInsertAfter( this.pdomPlayAreaNode, this.energyDiagramNode, handlesLayer );

    const potentials = model.potentialProperty.validValues;
    affirm( potentials && potentials.length > 0, 'At least one potential is required.' );
    potentials.forEach( potential => {
      handlesLayer.addChild( new EnergyOffsetHandleNode( potential, model.potentialProperty, model.energyDiagram,
        this.energyDiagramRectangleBounds, this.energyDiagramNode.chartTransform, model.time,
        handlesLayer.tandem.createTandem( `${potential.tandemPrefix}EnergyOffsetHandleNode` ) ) );
    } );

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
            valueToColor: value => PhaseColormap.phaseToRainbow( value )
          } ) ),
          new SpectrumNode( combineOptions<SpectrumNodeOptions>( {}, spectrumNodeOptions, {
            valueToColor: value => PhaseColormap.phaseToTwilight( value )
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
