// Copyright 2026, University of Colorado Boulder

/**
 * QBSCurrentDetailsNode is the base class for the 'current details' part of the screen summary.
 * It contains static methods for creating content that is common to one or more screens.
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
        leadingParagraphStringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.leadingParagraphStringProperty,
        listItems: listItems
      } )
    } );
  }

  /**
   * Identify the selected quantum potential.
   */
  public static createSelectedPotentialListItem( potentialProperty: TReadOnlyProperty<QuantumPotential> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.selectedPotential.createProperty( {
        potentialName: new DynamicProperty<string, string, QuantumPotential>( potentialProperty, {
          derive: potential => potential.accessibleNameProperty
        } )
      } )
    };
  }

  /**
   * Identify the selected quantum state graph and selected energy level.
   */
  public static createSelectedGraphItem( selectedGraphProperty: TReadOnlyProperty<QuantumStateGraph>, energyLevelProperty: TReadOnlyProperty<number> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.selectedGraph.createProperty( {
        graphName: new DynamicProperty<string, string, QuantumStateGraph>( selectedGraphProperty, {
          derive: selectedGraph => selectedGraph.accessibleNameProperty
        } ),
        energyLevelIndex: energyLevelProperty
      } )
    };
  }

  /**
   * Note if the Reference Line is visible.
   */
  public static createReferenceLineItem( referenceLine: ReferenceLine ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.referenceLineIsAddedStringProperty,
      visibleProperty: referenceLine.visibleProperty
    };
  }

  /**
   * Note if the Magnifier is visible.
   */
  public static createMagnifierItem( magnifier: Magnifier ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.magnifierIsAddedStringProperty,
      visibleProperty: magnifier.visibleProperty
    };
  }

  /**
   * Note whether the sim is playing or paused.
   */
  public static createTimeStateItem( isPlayingProperty: TReadOnlyProperty<boolean> ): AccessibleListItem {
    return {
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.simState.createProperty( {
        isPlaying: isPlayingProperty.derived( isPlaying => isPlaying ? 'true' : 'false' )
      } )
    };
  }

  /**
   * Describe the sim speed.
   */
  public static createTimeSpeedItem( time: QBSTime ): AccessibleListItem {
    return {
      //TODO Need descriptions of sim speeds.
      stringProperty: QuantumBoundStatesFluent.a11y.screens.defaults.screenSummary.currentDetails.listItems.simSpeedStringProperty
    };
  }
}