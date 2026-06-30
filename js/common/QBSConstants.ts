// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSConstants defines constants that are used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { GridLineSetOptions } from '../../../bamboo/js/GridLineSet.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import NumberControl, { NumberControlOptions } from '../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import ProbeNode, { ProbeNodeOptions } from '../../../scenery-phet/js/ProbeNode.js';
import { VBoxOptions } from '../../../scenery/js/layout/nodes/VBox.js';
import Text, { TextOptions } from '../../../scenery/js/nodes/Text.js';
import { CheckboxOptions } from '../../../sun/js/Checkbox.js';
import { DialogOptions } from '../../../sun/js/Dialog.js';
import { PanelOptions } from '../../../sun/js/Panel.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from './QBSColors.js';

export default class QBSConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  // Credits are shared by all sims in this suite.
  public static readonly CREDITS: CreditsData = {
    leadDesign: 'Brett Fiedler, Sam McKagan',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), Martin Veillette',
    team: 'Wendy Adams, Ariel Paul, Kathy Perkins, Carl Wieman',
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
  public static readonly PREFERENCES_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  public static readonly PREFERENCES_LABEL_MAX_WIDTH = 200;
  public static readonly PREFERENCES_DESCRIPTION_FONT = new PhetFont( 16 );
  public static readonly PREFERENCES_DESCRIPTION_LINE_WRAP = 450;

  // Fonts
  public static readonly LEGEND_FONT = new PhetFont( 14 ); // for text in the legend
  public static readonly AXIS_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } ); // for axis labels on graphs
  public static readonly TICK_LABEL_FONT = new PhetFont( 12 ); // for tick labels on graphs
  public static readonly CONTROL_FONT = new PhetFont( 14 ); // for text on checkboxes, radio buttons, push buttons, etc.
  public static readonly TITLE_FONT = new PhetFont( { size: 14, weight: 'bold' } );
  public static readonly TIME_FONT = new PhetFont( { size: 15, family: 'monospace' } );
  public static readonly EQUATION_TERM_FONT = new PhetFont( 18 );
  public static readonly ENERGY_LEVEL_DISPLAY_FONT = new PhetFont( 14 );
  public static readonly ANGULAR_FREQUENCY_FONT = new PhetFont( 14 );
  public static readonly HANDLE_FONT = new PhetFont( 14 );

  // Energy Diagram & all Quantum State Graphs
  public static readonly ALL_GRAPHS_VIEW_WIDTH = 700;
  public static readonly ALL_GRAPHS_X_RANGE = new Range( -3.5, 3.5 );
  public static readonly ALL_GRAPHS_X_TICK_SPACING = 1;
  public static readonly ALL_GRAPHS_Y_AXIS_LABEL_X_OFFSET = -32;

  // Energy Diagram
  public static readonly ENERGY_DIAGRAM_VIEW_HEIGHT = 265;
  public static readonly ENERGY_DIAGRAM_Y_TICK_SPACING = 5;

  // Quantum State Graphs
  public static readonly QUANTUM_STATE_GRAPHS_VIEW_HEIGHT = 175;
  public static readonly QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION = 0.1; // in model coordinates

  // Decimal places in displayed values
  public static readonly ELECTRON_MASSES_DECIMAL_PLACES = 2;
  public static readonly X_DECIMAL_PLACES = 2;
  public static readonly ELECTRIC_FIELD_DECIMAL_PLACES = 1;
  public static readonly WELL_WIDTH_DECIMAL_PLACES = 1;
  public static readonly WELL_WIDTH_DECIMAL_PLACES_MANY_WELLS = 2;
  public static readonly WELL_DEPTH_DECIMAL_PLACES = 1;
  public static readonly STEP_HEIGHT_DECIMAL_PLACES = 1;
  public static readonly SEPARATION_DECIMAL_PLACES = 2;
  public static readonly SPACING_DECIMAL_PLACES = 2;
  public static readonly X_OFFSET_DECIMAL_PLACES = 1;
  public static readonly Y_OFFSET_DECIMAL_PLACES = 1;
  public static readonly ANGULAR_FREQUENCY_DECIMAL_PLACES = 1;
  public static readonly POTENTIAL_ENERGY_DECIMAL_PLACES = 2;
  public static readonly PROBABILITY_DENSITY_DECIMAL_PLACES = 2;
  public static readonly REAL_PART_DECIMAL_PLACES = 2;
  public static readonly IMAGINARY_PART_DECIMAL_PLACES = 2;
  public static readonly MAGNITUDE_DECIMAL_PLACES = 2;
  public static readonly PHASE_DECIMAL_PLACES = 2;

  // Intervals
  public static readonly Y_OFFSET_INTERVAL = Math.pow( 10, -QBSConstants.Y_OFFSET_DECIMAL_PLACES ); // eV

  // Keyboard steps. NOTE: If you change decimal places, you should change these!
  public static readonly WIDTH_KEYBOARD_DRAG_DELTA = 0.5; // nm
  public static readonly WIDTH_KEYBOARD_SHIFT_DRAG_DELTA = 0.1; // nm
  public static readonly SEPARATION_KEYBOARD_DRAG_DELTA = 0.05; // nm
  public static readonly SEPARATION_KEYBOARD_SHIFT_DRAG_DELTA = 0.01; // nm
  public static readonly SPACING_KEYBOARD_DRAG_DELTA = 0.05; // nm
  public static readonly SPACING_KEYBOARD_SHIFT_DRAG_DELTA = 0.01; // nm
  public static readonly DEPTH_KEYBOARD_DRAG_DELTA = 0.5; // eV
  public static readonly DEPTH_KEYBOARD_SHIFT_DRAG_DELTA = 0.1; // eV
  public static readonly STEP_HEIGHT_KEYBOARD_DRAG_DELTA = 0.5; // eV
  public static readonly STEP_HEIGHT_KEYBOARD_SHIFT_DRAG_DELTA = 0.1; // eV

  //TODO Is this OK or do we need to use Number.Infinity?
  public static readonly EFFECTIVELY_INFINITE_POTENTIAL_ENERGY = 1000; // eV

  // Reduced Planck constant (hbar) in natural units: √(eV⋅mₑ)⋅nm
  // Computed as: 1.054571817e-34 / (1e-9 * sqrt(9.1093837015e-31 * 1.602176634e-19))
  public static readonly HBAR = 0.2760428268035944;

  // Upper bound (eV above the well bottom) of the energy window searched by the bound-state solver, for
  // potentials that have infinitely many bound states (infinite square well, harmonic oscillator, infinite step).
  // These have no physical maximum energy, so the search is capped at a fixed energy. This is deliberately
  // decoupled from the Energy diagram's viewport (yRange) so that the set of computed states - and each state's
  // energy, wave function, and node count - stays stable when the y-axis is zoomed.
  // See https://github.com/phetsims/quantum-bound-states/issues/63
  public static readonly MAX_SOLVER_ENERGY_ABOVE_WELL = 30; // eV

  // Line widths
  public static readonly POTENTIAL_ENERGY_LINE_WIDTH = 3;
  public static readonly TOTAL_ENERGY_LINE_WIDTH = 2;
  public static readonly PROBABILITY_DENSITY_LINE_WIDTH = 2;
  public static readonly WAVE_FUNCTION_LINE_WIDTH = 2;
  public static readonly REFERENCE_LINE_LINE_WIDTH = 1.5;
  public static readonly GRID_LINE_LINE_WIDTH = 1;
  public static readonly MARKER_LINE_WIDTH = 1.5;
  public static readonly LEGEND_LINE_WIDTH = 3;
  public static readonly POTENTIAL_ICON_LINE_WIDTH = 2;

  // Drag handles for configuring potentials
  public static readonly HANDLE_LENGTH = 35;

  public static readonly CHECKBOX_OPTIONS: CheckboxOptions = {
    boxWidth: new Text( 'A', { font: QBSConstants.CONTROL_FONT } ).height,
    touchAreaXDilation: 6,
    touchAreaYDilation: 3,
    mouseAreaXDilation: 6,
    mouseAreaYDilation: 3
  };

  public static readonly DIALOG_OPTIONS: DialogOptions = {
    tandem: Tandem.OPT_OUT // Not instrumenting dialogs was a design decision.
  };

  public static readonly GRID_LINE_SET_OPTIONS: GridLineSetOptions = {
    pickable: false, // optimization
    lineWidth: QBSConstants.GRID_LINE_LINE_WIDTH,
    lineDash: [ 4, 4 ],
    stroke: QBSColors.gridLinesStrokeProperty
  };

  public static readonly NUMBER_CONTROL_OPTIONS: NumberControlOptions = {
    layoutFunction: NumberControl.createLayoutFunction1( {
      align: 'left',
      ySpacing: 4,
      arrowButtonsXSpacing: 5
    } ),
    sliderOptions: {
      trackSize: new Dimension2( 150, 3 ),
      thumbSize: new Dimension2( 15, 25 ),
      majorTickLength: 13,
      tickLabelSpacing: 4,
      keyboardStep: 0.1,
      shiftKeyboardStep: 0.01,
      pageKeyboardStep: 0.2
    }
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

  public static readonly PROBE_NODE_OPTIONS: ProbeNodeOptions = {
    radius: 18,
    innerRadius: 14,
    handleWidth: 20,
    handleHeight: 20,
    handleCornerRadius: 8,
    lightAngle: 1.25 * Math.PI,
    color: QBSColors.magnifierProbeColorProperty,
    sensorTypeFunction: ProbeNode.crosshairs( {
      stroke: QBSColors.magnifierCrosshairsStrokeProperty,
      lineWidth: 2,
      intersectionRadius: 4
    } )
  };

  public static readonly TICK_TEXT_OPTIONS: TextOptions = {
    font: new PhetFont( 10 ),
    maxWidth: 50
  };

  public static readonly VBOX_OPTIONS: VBoxOptions = {
    align: 'left',
    spacing: 7
  };
}
