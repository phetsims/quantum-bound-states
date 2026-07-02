// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionScreenSummaryContent is the description screen summary for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QBSCurrentDetailsNode from '../../common/view/QBSCurrentDetailsNode.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState from '../model/CustomSuperpositionState.js';
import SuperpositionModel from '../model/SuperpositionModel.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';

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

    // Identify the selected superposition state.
    const superpositionListItem = {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.currentDetails.accessibleTemplate.listItems.superPosition.createProperty( {
        type: model.superpositionStateTypeProperty,
        presetName: new DynamicProperty<string, string, PresetSuperpositionState>( model.presetSuperpositionStateProperty, {
          derive: superpositionPreset => superpositionPreset.accessibleNameProperty
        } ),
        customName: new DynamicProperty<string, string, CustomSuperpositionState>( model.customSuperpositionStateProperty, {
          derive: superpositionCustom => superpositionCustom.accessibleNameProperty
        } )
      } )
    };

    super( [
      QBSCurrentDetailsNode.createSelectedPotentialListItem( model.potentialProperty ),
      superpositionListItem,
      QBSCurrentDetailsNode.createSelectedGraphItem( model.selectedGraphProperty, model.selectedEnergyLevelIndexProperty ),
      QBSCurrentDetailsNode.createReferenceLineItem( model.referenceLine ),
      QBSCurrentDetailsNode.createMagnifierItem( model.magnifier ),
      QBSCurrentDetailsNode.createTimeStateItem( model.time.isPlayingProperty ),
      QBSCurrentDetailsNode.createTimeSpeedItem( model.time )
    ] );
  }
}
