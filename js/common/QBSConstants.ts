// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSConstants defines constants that are used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Text from '../../../scenery/js/nodes/Text.js';
import { CheckboxOptions } from '../../../sun/js/Checkbox.js';
import { PanelOptions } from '../../../sun/js/Panel.js';
import quantumBoundStates from '../quantumBoundStates.js';
import QBSColors from './QBSColors.js';

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
  public static readonly LEGEND_FONT = new PhetFont( 14 ); // for text in the legend
  public static readonly AXIS_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } ); // for axis labels on graphs
  public static readonly TICK_LABEL_FONT = new PhetFont( 12 ); // for tick labels on graphs
  public static readonly CONTROL_FONT = new PhetFont( 14 ); // for text on checkboxes, radio buttons, push buttons, etc.
  public static readonly TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  public static readonly TIME_FONT = new PhetFont( 16 );

  // Graphs
  public static readonly ALL_GRAPHS_VIEW_WIDTH = 675;
  public static readonly ALL_GRAPHS_X_RANGE = new Range( -3.5, 3.5 );
  public static readonly ALL_GRAPHS_X_TICK_SPACING = 1;
  public static readonly ENERGY_GRAPH_VIEW_HEIGHT = 265;
  public static readonly ENERGY_GRAPH_Y_RANGE = new Range( -2.5, 22.5 );
  public static readonly PROBABILITY_DENSITY_GRAPH_VIEW_HEIGHT = 175;
  public static readonly PROBABILITY_DENSITY_GRAPH_Y_RANGE = new Range( -1.25, 1.25 );

  // Decimal places
  public static readonly ELECTRON_MASS_DECIMAL_PLACES = 2;
  public static readonly TIME_DECIMAL_PLACES = 1;

  public static readonly HANDLE_DIAMETER = 18;

  public static readonly CHECKBOX_OPTIONS: CheckboxOptions = {
    boxWidth: new Text( 'A', { font: QBSConstants.CONTROL_FONT } ).height,
    touchAreaXDilation: 6,
    touchAreaYDilation: 3,
    mouseAreaXDilation: 6,
    mouseAreaYDilation: 3
  };

  public static readonly PANEL_OPTIONS: PanelOptions = {
    cornerRadius: 5,
    xMargin: 8,
    yMargin: 6,
    fill: QBSColors.controlPanelFillProperty,
    stroke: QBSColors.controlPanelStrokeProperty,
    visiblePropertyOptions: {
      phetioFeatured: true
    }
  };
}

quantumBoundStates.register( 'QBSConstants', QBSConstants );