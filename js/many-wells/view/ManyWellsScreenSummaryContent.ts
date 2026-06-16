// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsScreenSummaryContent is the description screen summary for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QBSCurrentDetailsNode from '../../common/view/QBSCurrentDetailsNode.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ManyWellsModel from '../model/ManyWellsModel.js';

export default class ManyWellsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: ManyWellsModel ) {

    super( {
      isDisposable: false,
      playAreaContent: [
        QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.playArea.energyDiagramStringProperty,
        QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.playArea.quantumStateGraphStringProperty
      ],
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: new ManyWellsCurrentDetailsNode( model ),
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

/**
 * ManyWellsCurrentDetailsNode provides the current details description for the 'Many Wells' screen.
 */
class ManyWellsCurrentDetailsNode extends QBSCurrentDetailsNode {

  public constructor( model: ManyWellsModel ) {

    // Number of wells
    const numberOfWellsItem = {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.currentDetails.listItems.numberOfWells.createProperty( {
        value: model.numberOfWellsProperty
      } )
    };

    // Electric field value
    const electricFieldItem = {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.currentDetails.listItems.electricField.createProperty( {
        value: model.electricFieldProperty
      } )
    };

    super( [
      QBSCurrentDetailsNode.createSelectedPotentialListItem( model.potentialProperty ),
      numberOfWellsItem,
      electricFieldItem,
      QBSCurrentDetailsNode.createSelectedGraphItem( model.selectedGraphProperty, model.selectedEnergyLevelProperty ),
      QBSCurrentDetailsNode.createReferenceLineItem( model.referenceLine ),
      QBSCurrentDetailsNode.createMagnifierItem( model.magnifier ),
      QBSCurrentDetailsNode.createTimeStateItem( model.time.isPlayingProperty ),
      QBSCurrentDetailsNode.createTimeSpeedItem( model.time )
    ] );
  }
}
