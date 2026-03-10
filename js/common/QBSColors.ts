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

export default class QBSColors {

  private constructor() {
    // Not intended for instantiation.
  }

  // Background color for screens in this sim
  public static readonly screenBackgroundColorProperty = new ProfileColorProperty( quantumBoundStates, 'screenBackgroundColor', {
    default: 'rgb( 254, 250, 229 )'
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
    default: Color.grayColor( 100 ),
    projector: Color.grayColor( 200 )
  } );

  public static readonly controlPanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'controlPanelFill', {
    default: 'white'
  } );

  public static readonly controlPanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'controlPanelStroke', {
    default: 'rgb( 200, 200, 200 )'
  } );

  public static readonly legendFillProperty = new ProfileColorProperty( quantumBoundStates, 'legendFill', {
    default: QBSColors.controlPanelFillProperty.colorProfileMap.default
  } );

  public static readonly legendStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'legendStroke', {
    default: QBSColors.controlPanelStrokeProperty.colorProfileMap.default
  } );

  public static readonly timePanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'timePanelFill', {
    default: 'rgba( 255, 255, 255, 0 )'
  } );

  public static readonly timePanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'timePanelStroke', {
    default: QBSColors.controlPanelStrokeProperty.colorProfileMap.default
  } );

  public static readonly toolsPanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'toolsPanelFill', {
    default: Color.TRANSPARENT
  } );

  public static readonly toolsPanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'toolsPanelStroke', {
    default: Color.TRANSPARENT
  } );

  public static readonly xAxisStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'xAxisStroke', {
    default: Color.grayColor( 100 ),
    projector: Color.grayColor( 200 )
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
    default: 'rgb( 10, 70, 250 )'
  } );

  public static readonly imaginaryPartStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'imaginaryPartStroke', {
    default: 'rgb( 225, 122, 20 )'
  } );

  public static readonly magnitudeStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnitudeStroke', {
    default: 'black'
  } );

  public static readonly separatorStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'separatorStroke', {
    default: Color.grayColor( 200 )
  } );

  public static readonly timeToggleButtonShownColorProperty = new ProfileColorProperty( quantumBoundStates, 'timeToggleButtonShownColor', {
    default: 'white'
  } );

  public static readonly timeToggleButtonHiddenColorProperty = new ProfileColorProperty( quantumBoundStates, 'timeToggleButtonHiddenColor', {
    default: PhetColorScheme.BUTTON_YELLOW
  } );

  public static readonly timeDisplayEnabledProperty = new ProfileColorProperty( quantumBoundStates, 'timeDisplayEnabled', {
    default: 'white'
  } );

  public static readonly timeDisplayDisabledProperty = new ProfileColorProperty( quantumBoundStates, 'timeDisplayDisabled', {
    default: Color.grayColor( 240 )
  } );

  public static readonly curvesVisibleToggleButtonOnColorProperty = new ProfileColorProperty( quantumBoundStates, 'curvesVisibleToggleButtonOnColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly curvesVisibleToggleButtonOffColorProperty = new ProfileColorProperty( quantumBoundStates, 'curvesVisibleToggleButtonOffColor', {
    default: PhetColorScheme.BUTTON_YELLOW
  } );

  public static readonly magnifierBodyColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierBodyColor', {
    default: Color.grayColor( 200 )
  } );

  public static readonly magnifierDisplayFillProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierDisplayFill', {
    default: 'white',
    projector: 'black'
  } );

  public static readonly magnifierDisplayStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierDisplayStroke', {
    default: 'black'
  } );

  public static readonly magnifierProbeColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierProbeColor', {
    default: Color.grayColor( 150 ),
    projector: Color.grayColor( 200 )
  } );

  public static readonly magnifierCrosshairsStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierCrosshairsStroke', {
    default: 'black',
    projector: 'white'
  } );

  public static readonly magnifierWireStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierWireStroke', {
    default: Color.grayColor( 128 )
  } );

  public static readonly superpositionCustomizationButtonBaseColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionCustomizationButtonBaseColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly superpositionDetailsButtonBaseColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionDetailsButtonBaseColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly superpositionDetailsButtonIconColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionDetailsButtonIconColor', {
    default: 'black'
  } );

  public static readonly functionDetailsButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'functionDetailsButtonColor', {
    default: 'rgb( 153, 206, 255 )'
  } );
}

quantumBoundStates.register( 'QBSColors', QBSColors );