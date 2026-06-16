// Copyright 2026, University of Colorado Boulder

/**
 * OneWellScreenSummaryContent is the description screen summary for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import AccessibleList, { AccessibleListItem } from '../../../../scenery-phet/js/accessibility/AccessibleList.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QuantumStateGraph from '../../common/model/QuantumStateGraph.js';
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
      currentDetailsContent: new CurrentDetailsNode( model ),
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

class CurrentDetailsNode extends Node {

  public constructor( model: OneWellModel ) {

    // Ordered items for the accessible list.
    const listItems: AccessibleListItem[] = [];

    // Identify the selected quantum potential.
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.selectedPotential.createProperty( {
        potentialName: new DynamicProperty<string, string, QuantumPotential>( model.potentialProperty, {
          derive: potential => potential.accessibleNameProperty
        } )
      } )
    } );

    // Identify selected quantum state graph and energy level.
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.selectedGraph.createProperty( {
        graphName: new DynamicProperty<string, string, QuantumStateGraph>( model.selectedGraphProperty, {
          derive: selectedGraph => selectedGraph.accessibleNameProperty
        } ),
        energyLevelIndex: model.selectedEnergyLevelProperty
      } )
    } );

    // Note if Reference Line is visible.
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.referenceLineIsAddedStringProperty,
      visibleProperty: model.referenceLine.visibleProperty
    } );

    // Note if Magnifier is visible.
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.magnifierIsAddedStringProperty,
      visibleProperty: model.magnifier.visibleProperty
    } );

    // Sim is playing | paused.
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.simState.createProperty( {
        isPlaying: model.time.isPlayingProperty.derived( isPlaying => isPlaying ? 'true' : 'false' )
      } )
    } );

    // Describe the sim speed if the sim is playing.
    listItems.push( {
      //TODO Need descriptions of sim speeds.
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.simSpeedStringProperty
    } );

    super( {
      accessibleTemplate: AccessibleList.createTemplateProperty( {
        leadingParagraphStringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.leadingParagraphStringProperty,
        listItems: listItems
      } )
    } );
  }
}
