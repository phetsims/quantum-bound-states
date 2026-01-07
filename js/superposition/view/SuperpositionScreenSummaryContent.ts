// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionScreenSummaryContent is the description screen summary for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class SuperpositionScreenSummaryContent extends ScreenSummaryContent {

  public constructor() {

    super( {
      playAreaContent: QuantumBoundStatesFluent.a11y.superpositionScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: QuantumBoundStatesFluent.a11y.superpositionScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: QuantumBoundStatesFluent.a11y.superpositionScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: QuantumBoundStatesFluent.a11y.superpositionScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

quantumBoundStates.register( 'SuperpositionScreenSummaryContent', SuperpositionScreenSummaryContent );