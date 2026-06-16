// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionScreenSummaryContent is the description screen summary for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QBSCurrentDetailsNode from '../../common/view/QBSCurrentDetailsNode.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import SuperpositionModel from '../model/SuperpositionModel.js';

export default class SuperpositionScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: SuperpositionModel ) {

    super( {
      isDisposable: false,
      playAreaContent: [
        QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.playArea.energyDiagramStringProperty,
        QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.playArea.quantumStateGraphStringProperty
      ],
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: new SuperpositionCurrentDetailsNode( model ),
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

/**
 * SuperpositionCurrentDetailsNode provides the current details description for the 'Superposition' screen.
 */
class SuperpositionCurrentDetailsNode extends QBSCurrentDetailsNode {

  public constructor( model: SuperpositionModel ) {

    // Identify the selected superposition configuration.
    const superpositionListItem = {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.currentDetails.accessibleTemplate.listItems.superPosition.createProperty( {
        type: model.superpositionConfigurationTypeProperty,
        name: 'TODO' //TODO extract accessible name from the selected superposition configuration
      } )
    };

    super( [
      QBSCurrentDetailsNode.createSelectedPotentialListItem( model.potentialProperty ),
      superpositionListItem,
      QBSCurrentDetailsNode.createSelectedGraphItem( model.selectedGraphProperty, model.selectedEnergyLevelProperty ),
      QBSCurrentDetailsNode.createReferenceLineItem( model.referenceLine ),
      QBSCurrentDetailsNode.createMagnifierItem( model.magnifier ),
      QBSCurrentDetailsNode.createTimeStateItem( model.time.isPlayingProperty ),
      QBSCurrentDetailsNode.createTimeSpeedItem( model.time )
    ] );
  }
}
