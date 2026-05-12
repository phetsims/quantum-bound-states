// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSColors defines colors that are used throughout this simulation.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors, add instances of ProfileColorProperty here, each of which is required to have a default color.
 * Note that dynamic colors can be edited by running the sim in PhET's "Color Editor" wrapper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import ColorConstants from '../../../sun/js/ColorConstants.js';
import quantumBoundStates from '../quantumBoundStates.js';

export default class QBSColors {

  private constructor() {
    // Not intended for instantiation.
  }

  // Background color for screens in this sim
  public static readonly screenBackgroundColorProperty = new ProfileColorProperty( quantumBoundStates, 'screenBackgroundColorProperty', {
    default: 'rgb( 254, 250, 229 )'
  } );

  public static readonly potentialEnergyColorProperty = new ProfileColorProperty( quantumBoundStates, 'potentialEnergyColorProperty', {
    default: 'rgb( 149, 29, 214 )'
  } );

  public static readonly totalEnergyColorProperty = new ProfileColorProperty( quantumBoundStates, 'totalEnergyColorProperty', {
    default: 'rgb( 92, 184, 79 )'
  } );

  public static readonly selectedEnergyLevelColorProperty = new ProfileColorProperty( quantumBoundStates, 'selectedEnergyLevelColorProperty', {
    default: PhetColorScheme.RED_COLORBLIND
  } );

  public static readonly highlightedEnergyLevelColorProperty = new ProfileColorProperty( quantumBoundStates, 'highlightedEnergyLevelColorProperty', {
    default: 'rgb( 40, 255, 40 )'
  } );

  public static readonly chartRectangleFillProperty = new ProfileColorProperty( quantumBoundStates, 'chartRectangleFillProperty', {
    default: 'white'
  } );

  public static readonly chartRectangleStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'chartRectangleStrokeProperty', {
    default: Color.grayColor( 100 )
  } );

  public static readonly controlPanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'controlPanelFillProperty', {
    default: 'white'
  } );

  public static readonly controlPanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'controlPanelStrokeProperty', {
    default: 'rgb( 200, 200, 200 )'
  } );

  public static readonly legendFillProperty = new ProfileColorProperty( quantumBoundStates, 'legendFillProperty', {
    default: QBSColors.controlPanelFillProperty.colorProfileMap.default
  } );

  public static readonly legendStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'legendStrokeProperty', {
    default: QBSColors.controlPanelStrokeProperty.colorProfileMap.default
  } );

  public static readonly timePanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'timePanelFillProperty', {
    default: 'rgba( 255, 255, 255, 0 )'
  } );

  public static readonly timePanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'timePanelStrokeProperty', {
    default: QBSColors.controlPanelStrokeProperty.colorProfileMap.default
  } );

  public static readonly toolsPanelFillProperty = new ProfileColorProperty( quantumBoundStates, 'toolsPanelFillProperty', {
    default: Color.TRANSPARENT
  } );

  public static readonly toolsPanelStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'toolsPanelStrokeProperty', {
    default: Color.TRANSPARENT
  } );

  public static readonly gridLinesStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'gridLinesStrokeProperty', {
    default: Color.grayColor( 200 )
  } );

  public static readonly referenceLineStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'referenceLineStrokeProperty', {
    default: 'black'
  } );

  public static readonly referenceLineHandleColorProperty = new ProfileColorProperty( quantumBoundStates, 'referenceLineHandleColorProperty', {
    default: 'black'
  } );

  public static readonly probabilityDensityStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'probabilityDensityStrokeProperty', {
    default: 'black'
  } );

  public static readonly realPartStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'realPartStrokeProperty', {
    default: 'rgb( 10, 70, 250 )'
  } );

  public static readonly imaginaryPartStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'imaginaryPartStrokeProperty', {
    default: 'rgb( 225, 122, 20 )'
  } );

  public static readonly magnitudeStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnitudeStrokeProperty', {
    default: 'black'
  } );

  public static readonly separatorStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'separatorStrokeProperty', {
    default: Color.grayColor( 200 )
  } );

  public static readonly timeToggleButtonShownColorProperty = new ProfileColorProperty( quantumBoundStates, 'timeToggleButtonShownColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly timeToggleButtonHiddenColorProperty = new ProfileColorProperty( quantumBoundStates, 'timeToggleButtonHiddenColorProperty', {
    default: PhetColorScheme.BUTTON_YELLOW
  } );

  public static readonly timeDisplayEnabledFillProperty = new ProfileColorProperty( quantumBoundStates, 'timeDisplayEnabledFillProperty', {
    default: 'white'
  } );

  public static readonly timeDisplayDisabledFillProperty = new ProfileColorProperty( quantumBoundStates, 'timeDisplayDisabledFillProperty', {
    default: Color.grayColor( 240 )
  } );

  public static readonly restartButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'restartButtonColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly playPauseButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'playPauseButtonColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly stepForwardButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'stepForwardButtonColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly timeSpeedSliderThumbFillProperty = new ProfileColorProperty( quantumBoundStates, 'timeSpeedSliderThumbFillProperty', {
    default: 'rgb( 50, 145, 184 )'
  } );

  public static readonly timeSpeedSliderThumbHighlightFillProperty = new ProfileColorProperty( quantumBoundStates, 'timeSpeedSliderThumbHighlightFillProperty', {
    default: 'rgb( 71, 207, 255 )'
  } );

  public static readonly curvesVisibleToggleButtonShownColorProperty = new ProfileColorProperty( quantumBoundStates, 'curvesVisibleToggleButtonShownColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly curvesVisibleToggleButtonHiddenColorProperty = new ProfileColorProperty( quantumBoundStates, 'curvesVisibleToggleButtonHiddenColorProperty', {
    default: PhetColorScheme.BUTTON_YELLOW
  } );

  public static readonly massSliderThumbFillProperty = new ProfileColorProperty( quantumBoundStates, 'massSliderThumbFillProperty', {
    default: 'rgb( 50, 145, 184 )'
  } );

  public static readonly massSliderThumbHighlightFillProperty = new ProfileColorProperty( quantumBoundStates, 'massSliderThumbHighlightFillProperty', {
    default: 'rgb( 71, 207, 255 )'
  } );

  public static readonly magnifierBodyColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierBodyColorProperty', {
    default: Color.grayColor( 200 )
  } );

  public static readonly magnifierDisplayFillProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierDisplayFillProperty', {
    default: 'white'
  } );

  public static readonly magnifierDisplayStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierDisplayStrokeProperty', {
    default: 'black'
  } );

  public static readonly magnifierProbeColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierProbeColorProperty', {
    default: Color.grayColor( 150 )
  } );

  public static readonly magnifierCrosshairsStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierCrosshairsStrokeProperty', {
    default: 'black'
  } );

  public static readonly magnifierWireStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierWireStrokeProperty', {
    default: Color.grayColor( 128 )
  } );

  public static readonly magnifierPowerTextColorProperty = new ProfileColorProperty( quantumBoundStates, 'magnifierPowerTextColorProperty', {
    default: 'black'
  } );

  public static readonly superpositionCustomizationButtonBaseColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionCustomizationButtonBaseColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly superpositionCustomizationButtonIconColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionCustomizationButtonIconColorProperty', {
    default: 'black'
  } );

  public static readonly superpositionDetailsButtonBaseColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionDetailsButtonBaseColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly superpositionDetailsButtonIconColorProperty = new ProfileColorProperty( quantumBoundStates, 'superpositionDetailsButtonIconColorProperty', {
    default: 'black'
  } );

  public static readonly equationDetailsButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'equationDetailsButtonColorProperty', {
    default: 'rgb( 153, 206, 255 )'
  } );

  public static readonly equationTermColorProperty = new ProfileColorProperty( quantumBoundStates, 'equationTermColorProperty', {
    default: 'black'
  } );

  public static readonly equationTermBackgroundColorProperty = new ProfileColorProperty( quantumBoundStates, 'equationTermBackgroundColorProperty', {
    default: 'rgba( 255, 255, 255, 0.85 )'
  } );

  public static readonly dragArrowsFillProperty = new ProfileColorProperty( quantumBoundStates, 'dragArrowsFillProperty', {
    default: 'yellow'
  } );

  public static readonly dragArrowsStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'dragArrowsStrokeProperty', {
    default: 'black'
  } );

  public static readonly eyeClosedFillProperty = new ProfileColorProperty( quantumBoundStates, 'eyeClosedFillProperty', {
    default: Color.grayColor( 210 )
  } );

  public static readonly energyLevelDisplayBackgroundFillProperty = new ProfileColorProperty( quantumBoundStates, 'energyLevelDisplayBackgroundFillProperty', {
    default: 'white'
  } );

  public static readonly energyLevelDisplayBackgroundStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'energyLevelDisplayBackgroundStrokeProperty', {
    default: Color.grayColor( 200 )
  } );

  public static readonly energyAxisBackgroundFillProperty = new ProfileColorProperty( quantumBoundStates, 'energyAxisBackgroundFillProperty', {
    default: 'rgba( 255, 255, 255, 0.75 )'
  } );

  public static readonly energyAxisBackgroundStrokeProperty = new ProfileColorProperty( quantumBoundStates, 'energyAxisBackgroundStrokeProperty', {
    default: Color.grayColor( 230 )
  } );

  public static readonly resetEnergyOffsetButtonColorProperty = new ProfileColorProperty( quantumBoundStates, 'resetEnergyOffsetButtonColorProperty', {
    default: ColorConstants.LIGHT_BLUE
  } );
}
