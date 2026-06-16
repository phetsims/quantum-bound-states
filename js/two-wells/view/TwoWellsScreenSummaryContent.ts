// Copyright 2026, University of Colorado Boulder

/**
 * TwoWellsScreenSummaryContent is the description screen summary for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QBSCurrentDetailsNode from '../../common/view/QBSCurrentDetailsNode.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import TwoWellsModel from '../model/TwoWellsModel.js';

export default class TwoWellsScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: TwoWellsModel ) {

    super( {
      isDisposable: false,
      playAreaContent: [
        QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.playArea.energyDiagramStringProperty,
        QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.playArea.quantumStateGraphStringProperty
        ],
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: new TwoWellsCurrentDetailsNode( model ),
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

/**
 * TwoWellsCurrentDetailsNode provides the current details description for the 'Two Wells' screen.
 */
class TwoWellsCurrentDetailsNode extends QBSCurrentDetailsNode {

  public constructor( model: TwoWellsModel ) {
    super( [
      QBSCurrentDetailsNode.createSelectedPotentialListItem( model.potentialProperty ),
      QBSCurrentDetailsNode.createSelectedGraphItem( model.selectedGraphProperty, model.selectedEnergyLevelProperty ),
      QBSCurrentDetailsNode.createReferenceLineItem( model.referenceLine ),
      QBSCurrentDetailsNode.createMagnifierItem( model.magnifier ),
      QBSCurrentDetailsNode.createTimeStateItem( model.time.isPlayingProperty ),
      QBSCurrentDetailsNode.createTimeSpeedItem( model.time )
    ] );
  }
}
