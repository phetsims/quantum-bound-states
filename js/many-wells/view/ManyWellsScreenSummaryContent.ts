// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsScreenSummaryContent is the description screen summary for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class ManyWellsScreenSummaryContent extends ScreenSummaryContent {

  public constructor() {

    super( {
      playAreaContent: QuantumBoundStatesFluent.a11y.manyWellsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: QuantumBoundStatesFluent.a11y.manyWellsScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: QuantumBoundStatesFluent.a11y.manyWellsScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: QuantumBoundStatesFluent.a11y.manyWellsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

quantumBoundStates.register( 'ManyWellsScreenSummaryContent', ManyWellsScreenSummaryContent );