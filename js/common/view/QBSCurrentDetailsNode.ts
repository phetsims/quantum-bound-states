// Copyright 2026, University of Colorado Boulder

/**
 * QBSCurrentDetailsNode is the base class for the 'current details' part of the screen summary.
 * It contains static methods for creating AccessibleListItems that are common to two or more screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import AccessibleList, { AccessibleListItem } from '../../../../scenery-phet/js/accessibility/AccessibleList.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QuantumStateGraph from '../../common/model/QuantumStateGraph.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Magnifier from '../model/Magnifier.js';
import QBSTime from '../model/QBSTime.js';
import ReferenceLine from '../model/ReferenceLine.js';

export default class QBSCurrentDetailsNode extends Node {

  public constructor( listItems: AccessibleListItem[] ) {
    super( {
      accessibleTemplate: AccessibleList.createTemplateProperty( {
        leadingParagraphStringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.leadingParagraphStringProperty,
        listItems: listItems
      } )
    } );
  }

  /**
   * Identifies the selected quantum potential.
   */
  public static createSelectedPotentialListItem( potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.listItems.selectedPotential.createProperty( {
        potentialName: new DynamicProperty<string, string, QuantumPotential>( potentialProperty, {
          derive: potential => potential.accessibleNameProperty
        } )
      } )
    };
  }

  /**
   * Identifies the selected quantum state graph and selected energy level.
   */
  public static createSelectedGraphItem( selectedGraphProperty: TReadOnlyProperty<QuantumStateGraph>, energyLevelIndexProperty: TReadOnlyProperty<number> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.listItems.selectedGraph.createProperty( {
        graphName: new DynamicProperty<string, string, QuantumStateGraph>( selectedGraphProperty, {
          derive: selectedGraph => selectedGraph.accessibleNameProperty
        } ),
        energyLevelIndex: energyLevelIndexProperty
      } )
    };
  }

  /**
   * Notes if the Reference Line is visible.
   */
  public static createReferenceLineItem( referenceLine: ReferenceLine ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.listItems.referenceLineIsAddedStringProperty,
      visibleProperty: referenceLine.visibleProperty
    };
  }

  /**
   * Notes if the Magnifier is visible.
   */
  public static createMagnifierItem( magnifier: Magnifier ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.listItems.magnifierIsAddedStringProperty,
      visibleProperty: magnifier.visibleProperty
    };
  }

  /**
   * Notes whether the sim is playing or paused.
   */
  public static createTimeStateItem( isPlayingProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.listItems.simState.createProperty( {
        isPlaying: isPlayingProperty.derived( isPlaying => isPlaying ? 'true' : 'false' )
      } )
    };
  }

  /**
   * Describes the time speed.
   */
  public static createTimeSpeedItem( time: QBSTime ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.accessibleTemplate.listItems.timeSpeed.createProperty( {
        speed: time.timeSpeedProperty,
        timeStep: time.timeStepProperty
      } )
    };
  }
}