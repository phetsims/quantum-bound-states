// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSColors defines colors that are used throughout this simulation.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors, add instances of ProfileColorProperty here, each of which is required to have a default color.
 * Note that dynamic colors can be edited by running the sim from phetmarks using the "Color Editor" mode.
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

  public static readonly chartRectangleFillProperty = new ProfileColorProperty( quantumBoundStates, 'chartRectangleFill', {
    default: 'white'
  } );

  public static readonly chartRectangleStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'chartRectangleStroke', {
    default: Color.grayColor( 100 )
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

  public static readonly gridLinesStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'gridLinesStroke', {
    default: Color.grayColor( 200 )
  } );

  public static readonly referenceLineStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'referenceLineStroke', {
    default: PhetColorScheme.RED_COLORBLIND
  } );

  public static readonly referenceLineHandleColorProperty = new ProfileColorProperty( quantumBoundStates, 'referenceLineHandleColor', {
    default: PhetColorScheme.RED_COLORBLIND
  } );

  public static readonly probabilityDensityStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'probabilityDensityStroke', {
    default: 'black'
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
    default: 'rgb( 153, 206, 255 )'
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

  public static readonly restartButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'restartButtonColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly playPauseButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'playPauseButtonColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly stepForwardButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'stepForwardButtonColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly timeSpeedSliderThumbFillProperty = new ProfileColorProperty( quantumBoundStates, 'timeSpeedSliderThumbFill', {
    default: 'rgb( 50, 145, 184 )'
  } );

  public static readonly timeSpeedSliderThumbFillHighlightedProperty = new ProfileColorProperty( quantumBoundStates, 'timeSpeedSliderThumbFillHighlighted', {
    default: 'rgb( 71, 207, 255 )'
  } );

  public static readonly curvesVisibleToggleButtonShownColorProperty = new ProfileColorProperty( quantumBoundStates, 'curvesVisibleToggleButtonShownColor', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly curvesVisibleToggleButtonHiddenColorProperty = new ProfileColorProperty( quantumBoundStates, 'curvesVisibleToggleButtonHiddenColor', {
    default: PhetColorScheme.BUTTON_YELLOW
  } );

  public static readonly massSliderThumbFillProperty = new ProfileColorProperty( quantumBoundStates, 'massSliderThumbFill', {
    default: 'rgb( 50, 145, 184 )'
  } );

  public static readonly massSliderThumbFillHighlightedProperty = new ProfileColorProperty( quantumBoundStates, 'massSliderThumbFillHighlighted', {
    default: 'rgb( 71, 207, 255 )'
  } );

  public static readonly magnifierBodyColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierBodyColor', {
    default: Color.grayColor( 200 )
  } );

  public static readonly magnifierDisplayFillProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierDisplayFill', {
    default: 'white'
  } );

  public static readonly magnifierDisplayStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierDisplayStroke', {
    default: 'black'
  } );

  public static readonly magnifierProbeColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierProbeColor', {
    default: Color.grayColor( 150 )
  } );

  public static readonly magnifierCrosshairsStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierCrosshairsStroke', {
    default: 'black'
  } );

  public static readonly magnifierWireStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierWireStroke', {
    default: Color.grayColor( 128 )
  } );

  public static readonly magnifierPowerTextColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierPowerTextColor', {
    default: 'black'
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

  public static readonly equationDetailsButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'equationDetailsButtonColor', {
    default: 'rgb( 153, 206, 255 )'
  } );
}
