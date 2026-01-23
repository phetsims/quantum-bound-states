// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSConstants defines constants that are used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import quantumBoundStates from '../quantumBoundStates.js';

export default class QBSConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  // Credits are shared by all sims in this family.
  public static readonly CREDITS: CreditsData = {
    leadDesign: 'Sam McKagan',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Wendy Adams, Kathy Perkins, Carl Wieman',
    contributors: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  };

  // Margins inside the ScreenView layoutBounds.
  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;

  // Preferences
  public static readonly PREFERENCES_LABEL_FONT = new PhetFont( {
    size: 16,
    weight: 'bold'
  } );
  public static readonly PREFERENCES_LABEL_MAX_WIDTH = 200;
  public static readonly PREFERENCES_DESCRIPTION_FONT = new PhetFont( 16 );
  public static readonly PREFERENCES_DESCRIPTION_LINE_WRAP = 450;

  // Fonts
  public static readonly LEGEND_FONT = new PhetFont( 14 );
  public static readonly GRAPH_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  public static readonly TICK_LABEL_FONT = new PhetFont( 12 );

  // Graphs
  public static readonly ALL_GRAPHS_VIEW_WIDTH = 675;
  public static readonly ALL_GRAPHS_X_RANGE = new Range( -3.5, 3.5 );
  public static readonly ALL_GRAPHS_X_TICK_SPACING = 1;
  public static readonly ENERGY_GRAPH_VIEW_HEIGHT = 275;
  public static readonly ENERGY_GRAPH_Y_RANGE = new Range( 0, 20 );
  public static readonly PROBABILITY_DENSITY_GRAPH_VIEW_HEIGHT = 175;
  public static readonly PROBABILITY_DENSITY_GRAPH_Y_RANGE = new Range( 0, 1 );
}

quantumBoundStates.register( 'QBSConstants', QBSConstants );