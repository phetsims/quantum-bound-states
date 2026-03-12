// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsScreenView is the top-level view for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ManyWellsModel from '../model/ManyWellsModel.js';
import { ManyWellsControlPanel } from './ManyWellsControlPanel.js';
import ManyWellsScreenSummaryContent from './ManyWellsScreenSummaryContent.js';

export default class ManyWellsScreenView extends QBSScreenView {

  public constructor( model: ManyWellsModel, tandem: Tandem ) {

    const energyDiagramControlPanel = new ManyWellsControlPanel(
      model.energyLevelProperty,
      model.numberOfWellsProperty,
      model.electricFieldProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    const yAxisZoomButtonGroup = new PlusMinusZoomButtonGroup( model.yAxisZoomLevelProperty, {
      orientation: 'vertical',
      zoomInButtonOptions: {
        accessibleName: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomInButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomInButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomInButton.accessibleContextResponse.createProperty( {
          min: 'TODO', //TODO
          max: 'TODO' //TODO
        } )
      },
      zoomOutButtonOptions: {
        accessibleName: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleContextResponse.createProperty( {
          min: 'TODO', //TODO
          max: 'TODO' //TODO
        } )
      }
    } );

    super( model, energyDiagramControlPanel, {
      screenSummaryContent: new ManyWellsScreenSummaryContent(),
      yAxisZoomButtonGroup: yAxisZoomButtonGroup,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ManyWellsScreenView', ManyWellsScreenView );