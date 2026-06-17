// Copyright 2026, University of Colorado Boulder

/**
 * OneWellScreenSummaryContent is the description screen summary for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QBSCurrentDetailsNode from '../../common/view/QBSCurrentDetailsNode.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import OneWellModel from '../model/OneWellModel.js';

export default class OneWellScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: OneWellModel ) {

    super( {
      isDisposable: false,
      playAreaContent: [
        QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.playArea.energyDiagramStringProperty,
        QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.playArea.quantumStateGraphStringProperty
      ],
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: new OneWellCurrentDetailsNode( model ),
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

/**
 * OneWellCurrentDetailsNode provides the current details description for the 'One Well' screen.
 */
class OneWellCurrentDetailsNode extends QBSCurrentDetailsNode {

  public constructor( model: OneWellModel ) {
    super( [
      QBSCurrentDetailsNode.createSelectedPotentialListItem( model.potentialProperty ),
      QBSCurrentDetailsNode.createSelectedGraphItem( model.selectedGraphProperty, model.selectedEnergyLevelIndexProperty ),
      QBSCurrentDetailsNode.createReferenceLineItem( model.referenceLine ),
      QBSCurrentDetailsNode.createMagnifierItem( model.magnifier ),
      QBSCurrentDetailsNode.createTimeStateItem( model.time.isPlayingProperty ),
      QBSCurrentDetailsNode.createTimeSpeedItem( model.time )
    ] );
  }
}
