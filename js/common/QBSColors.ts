// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSColors defines colors that are used throughout this simulation.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Editor" mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import quantumBoundStates from '../quantumBoundStates.js';

const PANEL_FILL = 'white';
const PANEL_STROKE = 'rgb( 200, 200, 200 )';

export default class QBSColors {

  private constructor() {
    // Not intended for instantiation.
  }

  // Background color for screens in this sim
  public static readonly screenBackgroundColorProperty = new ProfileColorProperty( quantumBoundStates, 'screenBackgroundColor', {
    default: 'rgb( 254, 250, 229 )'
  } );

  public static readonly legendFillProperty = new ProfileColorProperty( quantumBoundStates, 'legendFill', {
    default: 'white'
  } );

  public static readonly legendStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'legendStroke', {
    default: 'black'
  } );

  public static readonly potentialEnergyColorProperty = new ProfileColorProperty( quantumBoundStates, 'potentialEnergyColor', {
    default: 'rgb( 149, 29, 214 )'
  } );

  public static readonly totalEnergyColorProperty = new ProfileColorProperty( quantumBoundStates, 'totalEnergyColor', {
    default: 'rgb( 92, 184, 79 )'
  } );

  public static readonly graphRectangleFillProperty = new ProfileColorProperty( quantumBoundStates, 'graphRectangleFill', {
    default: 'white',
    projector: 'black'
  } );

  public static readonly graphRectangleStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'graphRectangleStroke', {
    default: 'black'
  } );

  public static readonly controlPanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'controlPanelFill', {
    default: PANEL_FILL
  } );

  public static readonly controlPanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'controlPanelStroke', {
    default: PANEL_STROKE
  } );

  public static readonly timePanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'timePanelFill', {
    default: 'rgba( 255, 255, 255, 0 )'
  } );

  public static readonly timePanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'timePanelStroke', {
    default: PANEL_STROKE
  } );

  public static readonly toolsPanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'toolsPanelFill', {
    default: Color.TRANSPARENT
  } );

  public static readonly toolsPanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'toolsPanelStroke', {
    default: Color.TRANSPARENT
  } );

  public static readonly gridLinesStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'gridLinesStroke', {
    default: Color.grayColor( 200 ),
    projector: Color.grayColor( 100 )
  } );

  public static readonly referenceLineStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'referenceLineStroke', {
    default: PhetColorScheme.RED_COLORBLIND
  } );

  public static readonly referenceLineHandleColorProperty = new ProfileColorProperty( quantumBoundStates, 'referenceLineHandleColor', {
    default: PhetColorScheme.RED_COLORBLIND
  } );

  public static readonly realPartStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'realPartStroke', {
    default: 'rgb( 31, 69, 240 )'
  } );

  public static readonly imaginaryPartStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'imaginaryPartStroke', {
    default: 'rgb( 211, 127, 51 )'
  } );

  public static readonly magnitudeStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnitudeStroke', {
    default: 'black'
  } );

  public static readonly separatorStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'separatorStroke', {
    default: Color.grayColor( 200 )
  } );
}

quantumBoundStates.register( 'QBSColors', QBSColors );