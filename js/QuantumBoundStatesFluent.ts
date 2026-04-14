// Copyright 2025-2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from quantum-bound-states-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import type {FluentVariable} from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import quantumBoundStates from './quantumBoundStates.js';
import QuantumBoundStatesStrings from './QuantumBoundStatesStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( QuantumBoundStatesStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'quantum_bound_states_title', 'quantum-bound-states.titleStringProperty' );
addToMapIfDefined( 'screen_oneWell', 'screen.oneWellStringProperty' );
addToMapIfDefined( 'screen_superposition', 'screen.superpositionStringProperty' );
addToMapIfDefined( 'screen_twoWells', 'screen.twoWellsStringProperty' );
addToMapIfDefined( 'screen_manyWells', 'screen.manyWellsStringProperty' );
addToMapIfDefined( 'phaseFeatureControl_label', 'phaseFeatureControl.labelStringProperty' );
addToMapIfDefined( 'phaseFeatureControl_description', 'phaseFeatureControl.descriptionStringProperty' );
addToMapIfDefined( 'potentialEnergy', 'potentialEnergyStringProperty' );
addToMapIfDefined( 'totalEnergy', 'totalEnergyStringProperty' );
addToMapIfDefined( 'position_nm', 'position_nmStringProperty' );
addToMapIfDefined( 'energy_eV', 'energy_eVStringProperty' );
addToMapIfDefined( 'averageProbabilityDensityOfBand', 'averageProbabilityDensityOfBandStringProperty' );
addToMapIfDefined( 'probabilityDensity', 'probabilityDensityStringProperty' );
addToMapIfDefined( 'waveFunction', 'waveFunctionStringProperty' );
addToMapIfDefined( 'quantumStateGraph', 'quantumStateGraphStringProperty' );
addToMapIfDefined( 'energyDiagram', 'energyDiagramStringProperty' );
addToMapIfDefined( 'probabilityDensityDetailsButton', 'probabilityDensityDetailsButtonStringProperty' );
addToMapIfDefined( 'waveFunctionDetailsButton', 'waveFunctionDetailsButtonStringProperty' );
addToMapIfDefined( 'values', 'valuesStringProperty' );
addToMapIfDefined( 'realPart', 'realPartStringProperty' );
addToMapIfDefined( 'imaginaryPart', 'imaginaryPartStringProperty' );
addToMapIfDefined( 'magnitude', 'magnitudeStringProperty' );
addToMapIfDefined( 'phase', 'phaseStringProperty' );
addToMapIfDefined( 'magnifier', 'magnifierStringProperty' );
addToMapIfDefined( 'referenceLine', 'referenceLineStringProperty' );
addToMapIfDefined( 'superposition', 'superpositionStringProperty' );
addToMapIfDefined( 'averageProbabilityDensityOfBandDialogTitle', 'averageProbabilityDensityOfBandDialogTitleStringProperty' );
addToMapIfDefined( 'probabilityDensityDialogTitle', 'probabilityDensityDialogTitleStringProperty' );
addToMapIfDefined( 'waveFunctionDialogTitle', 'waveFunctionDialogTitleStringProperty' );
addToMapIfDefined( 'superpositionDetailsDialogTitle', 'superpositionDetailsDialogTitleStringProperty' );
addToMapIfDefined( 'superpositionCustomizationDialogTitle', 'superpositionCustomizationDialogTitleStringProperty' );
addToMapIfDefined( 'mass', 'massStringProperty' );
addToMapIfDefined( 'numberOfWells', 'numberOfWellsStringProperty' );
addToMapIfDefined( 'electricField', 'electricFieldStringProperty' );
addToMapIfDefined( 'slow', 'slowStringProperty' );
addToMapIfDefined( 'fast', 'fastStringProperty' );
addToMapIfDefined( 'energyLevel', 'energyLevelStringProperty' );
addToMapIfDefined( 'preset', 'presetStringProperty' );
addToMapIfDefined( 'custom', 'customStringProperty' );
addToMapIfDefined( 'units_electronMasses_symbol', 'units.electronMasses.symbolStringProperty' );
addToMapIfDefined( 'units_electronVolts_symbol', 'units.electronVolts.symbolStringProperty' );
addToMapIfDefined( 'units_femtoSeconds_symbol', 'units.femtoSeconds.symbolStringProperty' );
addToMapIfDefined( 'units_voltsPerNanometer_symbol', 'units.voltsPerNanometer.symbolStringProperty' );
addToMapIfDefined( 'potentialWells_finiteSquare', 'potentialWells.finiteSquareStringProperty' );
addToMapIfDefined( 'potentialWells_infiniteSquare', 'potentialWells.infiniteSquareStringProperty' );
addToMapIfDefined( 'potentialWells_doubleSquare', 'potentialWells.doubleSquareStringProperty' );
addToMapIfDefined( 'potentialWells_asymmetricTriangle', 'potentialWells.asymmetricTriangleStringProperty' );
addToMapIfDefined( 'potentialWells_harmonicOscillator', 'potentialWells.harmonicOscillatorStringProperty' );
addToMapIfDefined( 'potentialWells_anharmonicOscillator', 'potentialWells.anharmonicOscillatorStringProperty' );
addToMapIfDefined( 'potentialWells_morse', 'potentialWells.morseStringProperty' );
addToMapIfDefined( 'potentialWells_coulomb', 'potentialWells.coulombStringProperty' );
addToMapIfDefined( 'potentialWells_infiniteStep', 'potentialWells.infiniteStepStringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState0_preset1', 'superpositionConfigurations.groundState0.preset1StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState0_preset2', 'superpositionConfigurations.groundState0.preset2StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState0_preset3', 'superpositionConfigurations.groundState0.preset3StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState0_preset4', 'superpositionConfigurations.groundState0.preset4StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState1_preset1', 'superpositionConfigurations.groundState1.preset1StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState1_preset2', 'superpositionConfigurations.groundState1.preset2StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState1_preset3', 'superpositionConfigurations.groundState1.preset3StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_groundState1_preset4', 'superpositionConfigurations.groundState1.preset4StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_preset5', 'superpositionConfigurations.preset5StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_custom1', 'superpositionConfigurations.custom1StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_custom2', 'superpositionConfigurations.custom2StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_custom3', 'superpositionConfigurations.custom3StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_custom4', 'superpositionConfigurations.custom4StringProperty' );
addToMapIfDefined( 'superpositionConfigurations_custom5', 'superpositionConfigurations.custom5StringProperty' );
addToMapIfDefined( 'keyboardHelp_referenceLine_heading', 'keyboardHelp.referenceLine.headingStringProperty' );
addToMapIfDefined( 'a11y_screens_oneWellScreen_screenButtonsHelpText', 'a11y.screens.oneWellScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_screens_oneWellScreen_screenSummary_playArea', 'a11y.screens.oneWellScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_oneWellScreen_screenSummary_controlArea', 'a11y.screens.oneWellScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_oneWellScreen_screenSummary_currentDetails', 'a11y.screens.oneWellScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_screens_oneWellScreen_screenSummary_interactionHint', 'a11y.screens.oneWellScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_screens_twoWellsScreen_screenButtonsHelpText', 'a11y.screens.twoWellsScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_screens_twoWellsScreen_screenSummary_playArea', 'a11y.screens.twoWellsScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_twoWellsScreen_screenSummary_controlArea', 'a11y.screens.twoWellsScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_twoWellsScreen_screenSummary_currentDetails', 'a11y.screens.twoWellsScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_screens_twoWellsScreen_screenSummary_interactionHint', 'a11y.screens.twoWellsScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_screens_manyWellsScreen_screenButtonsHelpText', 'a11y.screens.manyWellsScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_screens_manyWellsScreen_screenSummary_playArea', 'a11y.screens.manyWellsScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_manyWellsScreen_screenSummary_controlArea', 'a11y.screens.manyWellsScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_manyWellsScreen_screenSummary_currentDetails', 'a11y.screens.manyWellsScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_screens_manyWellsScreen_screenSummary_interactionHint', 'a11y.screens.manyWellsScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_screens_superpositionScreen_screenButtonsHelpText', 'a11y.screens.superpositionScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_screens_superpositionScreen_screenSummary_playArea', 'a11y.screens.superpositionScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_superpositionScreen_screenSummary_controlArea', 'a11y.screens.superpositionScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_screens_superpositionScreen_screenSummary_currentDetails', 'a11y.screens.superpositionScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_screens_superpositionScreen_screenSummary_interactionHint', 'a11y.screens.superpositionScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_energyDiagramControls_accessibleHeading', 'a11y.energyDiagramControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_quantumStateGraphControls_accessibleHeading', 'a11y.quantumStateGraphControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionParts_accessibleHeading', 'a11y.waveFunctionParts.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_timeControls_accessibleHeading', 'a11y.timeControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_toolControls_accessibleHeading', 'a11y.toolControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_valuesCheckbox_accessibleHelpText', 'a11y.valuesCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_valuesCheckbox_accessibleContextResponseChecked', 'a11y.valuesCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_valuesCheckbox_accessibleContextResponseUnchecked', 'a11y.valuesCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_realPartCheckbox_accessibleHelpText', 'a11y.realPartCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_realPartCheckbox_accessibleContextResponseChecked', 'a11y.realPartCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_realPartCheckbox_accessibleContextResponseUnchecked', 'a11y.realPartCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_imaginaryPartCheckbox_accessibleHelpText', 'a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_imaginaryPartCheckbox_accessibleContextResponseChecked', 'a11y.imaginaryPartCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_imaginaryPartCheckbox_accessibleContextResponseUnchecked', 'a11y.imaginaryPartCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_magnitudeCheckbox_accessibleHelpText', 'a11y.magnitudeCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_magnitudeCheckbox_accessibleContextResponseChecked', 'a11y.magnitudeCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_magnitudeCheckbox_accessibleContextResponseUnchecked', 'a11y.magnitudeCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_phaseCheckbox_accessibleHelpText', 'a11y.phaseCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_phaseCheckbox_accessibleContextResponseChecked', 'a11y.phaseCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_phaseCheckbox_accessibleContextResponseUnchecked', 'a11y.phaseCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_magnifierCheckbox_accessibleHelpText', 'a11y.magnifierCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_magnifierCheckbox_accessibleContextResponseChecked', 'a11y.magnifierCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_magnifierCheckbox_accessibleContextResponseUnchecked', 'a11y.magnifierCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_referenceLineCheckbox_accessibleHelpText', 'a11y.referenceLineCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_referenceLineCheckbox_accessibleContextResponseChecked', 'a11y.referenceLineCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_referenceLineCheckbox_accessibleContextResponseUnchecked', 'a11y.referenceLineCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_potentialComboBox_accessibleName', 'a11y.potentialComboBox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_potentialComboBox_accessibleHelpText', 'a11y.potentialComboBox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionPresetComboBox_accessibleName', 'a11y.superpositionPresetComboBox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_superpositionPresetComboBox_accessibleHelpText', 'a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_accessibleName', 'a11y.superpositionCustomComboBox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_accessibleHelpText', 'a11y.superpositionCustomComboBox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset1', 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset1StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset2', 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset2StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset3', 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset3StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset4', 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset4StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset1', 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset1StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset2', 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset2StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset3', 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset3StringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset4', 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset4StringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleHeading', 'a11y.energyDiagram.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_energyDiagram_accessibleParagraph', 'a11y.energyDiagram.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_graphs_averageProbabilityDensityOfBandGraph_accessibleHeading', 'a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_graphs_averageProbabilityDensityOfBandGraph_accessibleParagraph', 'a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_graphs_probabilityDensityGraph_accessibleHeading', 'a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_graphs_probabilityDensityGraph_accessibleParagraph', 'a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_graphs_waveFunctionGraph_accessibleHeading', 'a11y.graphs.waveFunctionGraph.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_graphs_waveFunctionGraph_accessibleParagraph', 'a11y.graphs.waveFunctionGraph.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_timeButtonGroup_accessibleHeading', 'a11y.timeButtonGroup.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_timeButtonGroup_accessibleHelpText', 'a11y.timeButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_restartButton_accessibleHelpText', 'a11y.restartButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_restartButton_accessibleContextResponse', 'a11y.restartButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_accessibleHelpTextPlaying', 'a11y.playPauseButton.accessibleHelpTextPlayingStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_accessibleHelpTextPaused', 'a11y.playPauseButton.accessibleHelpTextPausedStringProperty' );
addToMapIfDefined( 'a11y_stepForwardButton_accessibleHelpText', 'a11y.stepForwardButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_stepForwardButton_accessibleContextResponse', 'a11y.stepForwardButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityDetailsButton_accessibleName', 'a11y.probabilityDensityDetailsButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityDetailsButton_accessibleHelpText', 'a11y.probabilityDensityDetailsButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityDetailsButton_accessibleContextResponse', 'a11y.probabilityDensityDetailsButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionDetailsButton_accessibleName', 'a11y.waveFunctionDetailsButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionDetailsButton_accessibleHelpText', 'a11y.waveFunctionDetailsButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionDetailsButton_accessibleContextResponse', 'a11y.waveFunctionDetailsButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomizeButton_accessibleName', 'a11y.superpositionCustomizeButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomizeButton_accessibleHelpText', 'a11y.superpositionCustomizeButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionCustomizeButton_accessibleContextResponse', 'a11y.superpositionCustomizeButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_superpositionDetailsButton_accessibleName', 'a11y.superpositionDetailsButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_superpositionDetailsButton_accessibleHelpText', 'a11y.superpositionDetailsButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionDetailsButton_accessibleContextResponse', 'a11y.superpositionDetailsButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_yAxisZoomButtonGroup_zoomInButton_accessibleName', 'a11y.yAxisZoomButtonGroup.zoomInButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_yAxisZoomButtonGroup_zoomInButton_accessibleHelpText', 'a11y.yAxisZoomButtonGroup.zoomInButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_yAxisZoomButtonGroup_zoomInButton_accessibleContextResponse', 'a11y.yAxisZoomButtonGroup.zoomInButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_yAxisZoomButtonGroup_zoomOutButton_accessibleName', 'a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_yAxisZoomButtonGroup_zoomOutButton_accessibleHelpText', 'a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_yAxisZoomButtonGroup_zoomOutButton_accessibleContextResponse', 'a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_quantumStateGraphRadioButtonGroup_accessibleName', 'a11y.quantumStateGraphRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_quantumStateGraphRadioButtonGroup_accessibleHelpText', 'a11y.quantumStateGraphRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeSpeedSlider_accessibleName', 'a11y.timeSpeedSlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_timeSpeedSlider_accessibleHelpText', 'a11y.timeSpeedSlider.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_electronMassesControl_accessibleHelpText', 'a11y.electronMassesControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_numberOfWellsControl_accessibleHelpText', 'a11y.numberOfWellsControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_electricFieldControl_accessibleHelpText', 'a11y.electricFieldControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_energyLevelSpinner_accessibleName', 'a11y.energyLevelSpinner.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_energyLevelSpinner_accessibleHelpText', 'a11y.energyLevelSpinner.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleNameOn', 'a11y.timeDisplayToggleButton.accessibleNameOnStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleNameOff', 'a11y.timeDisplayToggleButton.accessibleNameOffStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleHelpText', 'a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleContextResponseOn', 'a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleContextResponseOff', 'a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty' );
addToMapIfDefined( 'a11y_curvesVisibleToggleButton_accessibleNameOn', 'a11y.curvesVisibleToggleButton.accessibleNameOnStringProperty' );
addToMapIfDefined( 'a11y_curvesVisibleToggleButton_accessibleNameOff', 'a11y.curvesVisibleToggleButton.accessibleNameOffStringProperty' );
addToMapIfDefined( 'a11y_curvesVisibleToggleButton_accessibleHelpTextOn', 'a11y.curvesVisibleToggleButton.accessibleHelpTextOnStringProperty' );
addToMapIfDefined( 'a11y_curvesVisibleToggleButton_accessibleHelpTextOff', 'a11y.curvesVisibleToggleButton.accessibleHelpTextOffStringProperty' );
addToMapIfDefined( 'a11y_curvesVisibleToggleButton_accessibleContextResponseOn', 'a11y.curvesVisibleToggleButton.accessibleContextResponseOnStringProperty' );
addToMapIfDefined( 'a11y_curvesVisibleToggleButton_accessibleContextResponseOff', 'a11y.curvesVisibleToggleButton.accessibleContextResponseOffStringProperty' );
addToMapIfDefined( 'a11y_presetCustomSwitch_accessibleHelpText', 'a11y.presetCustomSwitch.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_magnifier_accessibleHeading', 'a11y.magnifier.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_magnifier_accessibleParagraph', 'a11y.magnifier.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_magnifier_probe_accessibleName', 'a11y.magnifier.probe.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_magnifier_probe_accessibleHelpText', 'a11y.magnifier.probe.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_magnifier_probe_accessibleObjectResponse', 'a11y.magnifier.probe.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_magnifier_body_accessibleName', 'a11y.magnifier.body.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_magnifier_body_accessibleHelpText', 'a11y.magnifier.body.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_magnifier_body_accessibleObjectResponse', 'a11y.magnifier.body.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_referenceLine_accessibleRoleDescription', 'a11y.referenceLine.accessibleRoleDescriptionStringProperty' );
addToMapIfDefined( 'a11y_referenceLine_accessibleName', 'a11y.referenceLine.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_referenceLine_accessibleHelpText', 'a11y.referenceLine.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_referenceLine_accessibleObjectResponse', 'a11y.referenceLine.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_units_electronMasses_accessiblePattern', 'a11y.units.electronMasses.accessiblePatternStringProperty' );
addToMapIfDefined( 'a11y_units_electronVolts_accessiblePattern', 'a11y.units.electronVolts.accessiblePatternStringProperty' );
addToMapIfDefined( 'a11y_units_femtoseconds_accessiblePattern', 'a11y.units.femtoseconds.accessiblePatternStringProperty' );
addToMapIfDefined( 'a11y_units_voltsPerNanometer_accessiblePattern', 'a11y.units.voltsPerNanometer.accessiblePatternStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const QuantumBoundStatesFluent = {
  "quantum-bound-states": {
    _comment_0: new FluentComment( {"comment":"Strings for PhET's Quantum Bound States simulation","associatedKey":"quantum-bound-states.title"} ),
    _comment_1: new FluentComment( {"comment":"Simulation Title","associatedKey":"quantum-bound-states.title"} ),
    titleStringProperty: _.get( QuantumBoundStatesStrings, 'quantum-bound-states.titleStringProperty' )
  },
  screen: {
    _comment_0: new FluentComment( {"comment":"Screen Names","associatedKey":"screen.oneWell"} ),
    oneWellStringProperty: _.get( QuantumBoundStatesStrings, 'screen.oneWellStringProperty' ),
    _comment_1: new FluentComment( {"comment":"ComboBoxes","associatedKey":"superposition"} ),
    superpositionStringProperty: _.get( QuantumBoundStatesStrings, 'screen.superpositionStringProperty' ),
    twoWellsStringProperty: _.get( QuantumBoundStatesStrings, 'screen.twoWellsStringProperty' ),
    manyWellsStringProperty: _.get( QuantumBoundStatesStrings, 'screen.manyWellsStringProperty' )
  },
  _comment_0: new FluentComment( {"comment":"Preferences","associatedKey":"phaseFeatureControl"} ),
  phaseFeatureControl: {
    labelStringProperty: _.get( QuantumBoundStatesStrings, 'phaseFeatureControl.labelStringProperty' ),
    descriptionStringProperty: _.get( QuantumBoundStatesStrings, 'phaseFeatureControl.descriptionStringProperty' )
  },
  _comment_1: new FluentComment( {"comment":"Titles","associatedKey":"potentialEnergy"} ),
  potentialEnergyStringProperty: _.get( QuantumBoundStatesStrings, 'potentialEnergyStringProperty' ),
  totalEnergyStringProperty: _.get( QuantumBoundStatesStrings, 'totalEnergyStringProperty' ),
  position_nmStringProperty: _.get( QuantumBoundStatesStrings, 'position_nmStringProperty' ),
  energy_eVStringProperty: _.get( QuantumBoundStatesStrings, 'energy_eVStringProperty' ),
  averageProbabilityDensityOfBandStringProperty: _.get( QuantumBoundStatesStrings, 'averageProbabilityDensityOfBandStringProperty' ),
  probabilityDensityStringProperty: _.get( QuantumBoundStatesStrings, 'probabilityDensityStringProperty' ),
  waveFunctionStringProperty: _.get( QuantumBoundStatesStrings, 'waveFunctionStringProperty' ),
  quantumStateGraphStringProperty: _.get( QuantumBoundStatesStrings, 'quantumStateGraphStringProperty' ),
  _comment_2: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyDiagram"} ),
  _comment_3: new FluentComment( {"comment":"Graphs","associatedKey":"energyDiagram"} ),
  _comment_4: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyDiagram"} ),
  energyDiagramStringProperty: _.get( QuantumBoundStatesStrings, 'energyDiagramStringProperty' ),
  _comment_5: new FluentComment( {"comment":"Buttons","associatedKey":"probabilityDensityDetailsButton"} ),
  probabilityDensityDetailsButtonStringProperty: _.get( QuantumBoundStatesStrings, 'probabilityDensityDetailsButtonStringProperty' ),
  waveFunctionDetailsButtonStringProperty: _.get( QuantumBoundStatesStrings, 'waveFunctionDetailsButtonStringProperty' ),
  _comment_6: new FluentComment( {"comment":"Checkboxes","associatedKey":"values"} ),
  valuesStringProperty: _.get( QuantumBoundStatesStrings, 'valuesStringProperty' ),
  realPartStringProperty: _.get( QuantumBoundStatesStrings, 'realPartStringProperty' ),
  imaginaryPartStringProperty: _.get( QuantumBoundStatesStrings, 'imaginaryPartStringProperty' ),
  magnitudeStringProperty: _.get( QuantumBoundStatesStrings, 'magnitudeStringProperty' ),
  phaseStringProperty: _.get( QuantumBoundStatesStrings, 'phaseStringProperty' ),
  _comment_7: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"magnifier"} ),
  _comment_8: new FluentComment( {"comment":"Tools","associatedKey":"magnifier"} ),
  _comment_9: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"magnifier"} ),
  magnifierStringProperty: _.get( QuantumBoundStatesStrings, 'magnifierStringProperty' ),
  referenceLineStringProperty: _.get( QuantumBoundStatesStrings, 'referenceLineStringProperty' ),
  _comment_10: new FluentComment( {"comment":"ComboBoxes","associatedKey":"superposition"} ),
  superpositionStringProperty: _.get( QuantumBoundStatesStrings, 'superpositionStringProperty' ),
  _comment_11: new FluentComment( {"comment":"Dialogs","associatedKey":"averageProbabilityDensityOfBandDialogTitle"} ),
  averageProbabilityDensityOfBandDialogTitleStringProperty: _.get( QuantumBoundStatesStrings, 'averageProbabilityDensityOfBandDialogTitleStringProperty' ),
  probabilityDensityDialogTitleStringProperty: _.get( QuantumBoundStatesStrings, 'probabilityDensityDialogTitleStringProperty' ),
  waveFunctionDialogTitleStringProperty: _.get( QuantumBoundStatesStrings, 'waveFunctionDialogTitleStringProperty' ),
  superpositionDetailsDialogTitleStringProperty: _.get( QuantumBoundStatesStrings, 'superpositionDetailsDialogTitleStringProperty' ),
  superpositionCustomizationDialogTitleStringProperty: _.get( QuantumBoundStatesStrings, 'superpositionCustomizationDialogTitleStringProperty' ),
  _comment_12: new FluentComment( {"comment":"Sliders","associatedKey":"mass"} ),
  massStringProperty: _.get( QuantumBoundStatesStrings, 'massStringProperty' ),
  numberOfWellsStringProperty: _.get( QuantumBoundStatesStrings, 'numberOfWellsStringProperty' ),
  electricFieldStringProperty: _.get( QuantumBoundStatesStrings, 'electricFieldStringProperty' ),
  slowStringProperty: _.get( QuantumBoundStatesStrings, 'slowStringProperty' ),
  fastStringProperty: _.get( QuantumBoundStatesStrings, 'fastStringProperty' ),
  _comment_13: new FluentComment( {"comment":"Spinners","associatedKey":"energyLevel"} ),
  energyLevelStringProperty: _.get( QuantumBoundStatesStrings, 'energyLevelStringProperty' ),
  energyLevelPatternStringProperty: _.get( QuantumBoundStatesStrings, 'energyLevelPatternStringProperty' ),
  _comment_14: new FluentComment( {"comment":"Toggles and Switches","associatedKey":"preset"} ),
  presetStringProperty: _.get( QuantumBoundStatesStrings, 'presetStringProperty' ),
  customStringProperty: _.get( QuantumBoundStatesStrings, 'customStringProperty' ),
  _comment_15: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
  _comment_16: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
  _comment_17: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
  _comment_18: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
  units: {
    electronMasses: {
      symbolStringProperty: _.get( QuantumBoundStatesStrings, 'units.electronMasses.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( QuantumBoundStatesStrings, 'units.electronMasses.symbolPatternStringProperty' )
    },
    electronVolts: {
      symbolStringProperty: _.get( QuantumBoundStatesStrings, 'units.electronVolts.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( QuantumBoundStatesStrings, 'units.electronVolts.symbolPatternStringProperty' )
    },
    femtoSeconds: {
      symbolStringProperty: _.get( QuantumBoundStatesStrings, 'units.femtoSeconds.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( QuantumBoundStatesStrings, 'units.femtoSeconds.symbolPatternStringProperty' )
    },
    voltsPerNanometer: {
      symbolStringProperty: _.get( QuantumBoundStatesStrings, 'units.voltsPerNanometer.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( QuantumBoundStatesStrings, 'units.voltsPerNanometer.symbolPatternStringProperty' )
    }
  },
  _comment_19: new FluentComment( {"comment":"Potential Wells","associatedKey":"potentialWells"} ),
  potentialWells: {
    finiteSquareStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.finiteSquareStringProperty' ),
    infiniteSquareStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.infiniteSquareStringProperty' ),
    doubleSquareStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.doubleSquareStringProperty' ),
    asymmetricTriangleStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.asymmetricTriangleStringProperty' ),
    harmonicOscillatorStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.harmonicOscillatorStringProperty' ),
    anharmonicOscillatorStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.anharmonicOscillatorStringProperty' ),
    morseStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.morseStringProperty' ),
    coulombStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.coulombStringProperty' ),
    infiniteStepStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.infiniteStepStringProperty' )
  },
  _comment_20: new FluentComment( {"comment":"Superposition configurations","associatedKey":"superpositionConfigurations"} ),
  superpositionConfigurations: {
    groundState0: {
      preset1StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState0.preset1StringProperty' ),
      preset2StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState0.preset2StringProperty' ),
      preset3StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState0.preset3StringProperty' ),
      preset4StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState0.preset4StringProperty' )
    },
    groundState1: {
      preset1StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState1.preset1StringProperty' ),
      preset2StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState1.preset2StringProperty' ),
      preset3StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState1.preset3StringProperty' ),
      preset4StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.groundState1.preset4StringProperty' )
    },
    preset5StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.preset5StringProperty' ),
    custom1StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.custom1StringProperty' ),
    custom2StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.custom2StringProperty' ),
    custom3StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.custom3StringProperty' ),
    custom4StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.custom4StringProperty' ),
    custom5StringProperty: _.get( QuantumBoundStatesStrings, 'superpositionConfigurations.custom5StringProperty' )
  },
  _comment_21: new FluentComment( {"comment":"Magnifier","associatedKey":"magnificationPower"} ),
  magnificationPowerStringProperty: _.get( QuantumBoundStatesStrings, 'magnificationPowerStringProperty' ),
  _comment_22: new FluentComment( {"comment":"Keyboard Help","associatedKey":"keyboardHelp"} ),
  keyboardHelp: {
    referenceLine: {
      headingStringProperty: _.get( QuantumBoundStatesStrings, 'keyboardHelp.referenceLine.headingStringProperty' )
    }
  },
  _comment_23: new FluentComment( {"comment":"Strings that are specific to accessibility","associatedKey":"a11y"} ),
  a11y: {
    _comment_0: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"screens"} ),
    _comment_1: new FluentComment( {"comment":"Screens (screen summaries, screen buttons)","associatedKey":"screens"} ),
    _comment_2: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"screens"} ),
    screens: {
      oneWellScreen: {
        screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_oneWellScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.screens.oneWellScreen.screenButtonsHelpTextStringProperty' ) ),
        screenSummary: {
          playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_oneWellScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.oneWellScreen.screenSummary.playAreaStringProperty' ) ),
          controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_oneWellScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.oneWellScreen.screenSummary.controlAreaStringProperty' ) ),
          currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_oneWellScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.screens.oneWellScreen.screenSummary.currentDetailsStringProperty' ) ),
          interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_oneWellScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.screens.oneWellScreen.screenSummary.interactionHintStringProperty' ) )
        }
      },
      twoWellsScreen: {
        screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_twoWellsScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.screens.twoWellsScreen.screenButtonsHelpTextStringProperty' ) ),
        screenSummary: {
          playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_twoWellsScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.twoWellsScreen.screenSummary.playAreaStringProperty' ) ),
          controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_twoWellsScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.twoWellsScreen.screenSummary.controlAreaStringProperty' ) ),
          currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_twoWellsScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.screens.twoWellsScreen.screenSummary.currentDetailsStringProperty' ) ),
          interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_twoWellsScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.screens.twoWellsScreen.screenSummary.interactionHintStringProperty' ) )
        }
      },
      manyWellsScreen: {
        screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_manyWellsScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.screens.manyWellsScreen.screenButtonsHelpTextStringProperty' ) ),
        screenSummary: {
          playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_manyWellsScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.manyWellsScreen.screenSummary.playAreaStringProperty' ) ),
          controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_manyWellsScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.manyWellsScreen.screenSummary.controlAreaStringProperty' ) ),
          currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_manyWellsScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.screens.manyWellsScreen.screenSummary.currentDetailsStringProperty' ) ),
          interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_manyWellsScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.screens.manyWellsScreen.screenSummary.interactionHintStringProperty' ) )
        }
      },
      superpositionScreen: {
        screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_superpositionScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.screens.superpositionScreen.screenButtonsHelpTextStringProperty' ) ),
        screenSummary: {
          playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_superpositionScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.superpositionScreen.screenSummary.playAreaStringProperty' ) ),
          controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_superpositionScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.screens.superpositionScreen.screenSummary.controlAreaStringProperty' ) ),
          currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_superpositionScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.screens.superpositionScreen.screenSummary.currentDetailsStringProperty' ) ),
          interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screens_superpositionScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.screens.superpositionScreen.screenSummary.interactionHintStringProperty' ) )
        }
      }
    },
    _comment_3: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyDiagramControls"} ),
    _comment_4: new FluentComment( {"comment":"Headings","associatedKey":"energyDiagramControls"} ),
    _comment_5: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyDiagramControls"} ),
    energyDiagramControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagramControls_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.energyDiagramControls.accessibleHeadingStringProperty' ) )
    },
    quantumStateGraphControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_quantumStateGraphControls_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.quantumStateGraphControls.accessibleHeadingStringProperty' ) )
    },
    waveFunctionParts: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionParts_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionParts.accessibleHeadingStringProperty' ) )
    },
    timeControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.timeControls.accessibleHeadingStringProperty' ) )
    },
    toolControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_toolControls_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.toolControls.accessibleHeadingStringProperty' ) )
    },
    _comment_6: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"valuesCheckbox"} ),
    _comment_7: new FluentComment( {"comment":"Checkboxes","associatedKey":"valuesCheckbox"} ),
    _comment_8: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"valuesCheckbox"} ),
    valuesCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valuesCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.valuesCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valuesCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.valuesCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valuesCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.valuesCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    realPartCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_realPartCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.realPartCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_realPartCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.realPartCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_realPartCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.realPartCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    imaginaryPartCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_imaginaryPartCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_imaginaryPartCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.imaginaryPartCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_imaginaryPartCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.imaginaryPartCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    magnitudeCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnitudeCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.magnitudeCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnitudeCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.magnitudeCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnitudeCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.magnitudeCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    phaseCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_phaseCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.phaseCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_phaseCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.phaseCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_phaseCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.phaseCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    magnifierCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifierCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.magnifierCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifierCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.magnifierCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifierCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.magnifierCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    referenceLineCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    _comment_9: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"potentialComboBox"} ),
    _comment_10: new FluentComment( {"comment":"ComboBoxes","associatedKey":"potentialComboBox"} ),
    _comment_11: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"potentialComboBox"} ),
    potentialComboBox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialComboBox_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.potentialComboBox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialComboBox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.potentialComboBox.accessibleHelpTextStringProperty' ) )
    },
    superpositionPresetComboBox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionPresetComboBox_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.superpositionPresetComboBox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionPresetComboBox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty' ) )
    },
    superpositionCustomComboBox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.accessibleHelpTextStringProperty' ) ),
      groundState0: {
        accessibleNamePreset1StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset1', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset1StringProperty' ) ),
        accessibleNamePreset2StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset2', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset2StringProperty' ) ),
        accessibleNamePreset3StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset3', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset3StringProperty' ) ),
        accessibleNamePreset4StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState0_accessibleNamePreset4', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState0.accessibleNamePreset4StringProperty' ) )
      },
      groundState1: {
        accessibleNamePreset1StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset1', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset1StringProperty' ) ),
        accessibleNamePreset2StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset2', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset2StringProperty' ) ),
        accessibleNamePreset3StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset3', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset3StringProperty' ) ),
        accessibleNamePreset4StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomComboBox_groundState1_accessibleNamePreset4', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomComboBox.groundState1.accessibleNamePreset4StringProperty' ) )
      }
    },
    _comment_12: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyDiagram"} ),
    _comment_13: new FluentComment( {"comment":"Graphs","associatedKey":"energyDiagram"} ),
    _comment_14: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyDiagram"} ),
    energyDiagram: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.energyDiagram.accessibleHeadingStringProperty' ) ),
      accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyDiagram_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.energyDiagram.accessibleParagraphStringProperty' ) )
    },
    graphs: {
      averageProbabilityDensityOfBandGraph: {
        accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphs_averageProbabilityDensityOfBandGraph_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleHeadingStringProperty' ) ),
        accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphs_averageProbabilityDensityOfBandGraph_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleParagraphStringProperty' ) )
      },
      probabilityDensityGraph: {
        accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphs_probabilityDensityGraph_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty' ) ),
        accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphs_probabilityDensityGraph_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty' ) )
      },
      waveFunctionGraph: {
        accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphs_waveFunctionGraph_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.graphs.waveFunctionGraph.accessibleHeadingStringProperty' ) ),
        accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphs_waveFunctionGraph_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.graphs.waveFunctionGraph.accessibleParagraphStringProperty' ) )
      }
    },
    _comment_15: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeButtonGroup"} ),
    _comment_16: new FluentComment( {"comment":"Push Buttons","associatedKey":"timeButtonGroup"} ),
    _comment_17: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeButtonGroup"} ),
    timeButtonGroup: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeButtonGroup_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.timeButtonGroup.accessibleHeadingStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeButtonGroup_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.timeButtonGroup.accessibleHelpTextStringProperty' ) )
    },
    restartButton: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_restartButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.restartButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_restartButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.restartButton.accessibleContextResponseStringProperty' ) )
    },
    playPauseButton: {
      accessibleHelpTextPlayingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseButton_accessibleHelpTextPlaying', _.get( QuantumBoundStatesStrings, 'a11y.playPauseButton.accessibleHelpTextPlayingStringProperty' ) ),
      accessibleHelpTextPausedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseButton_accessibleHelpTextPaused', _.get( QuantumBoundStatesStrings, 'a11y.playPauseButton.accessibleHelpTextPausedStringProperty' ) )
    },
    stepForwardButton: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepForwardButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.stepForwardButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepForwardButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.stepForwardButton.accessibleContextResponseStringProperty' ) )
    },
    _comment_18: new FluentComment( {"comment":"Buttons","associatedKey":"probabilityDensityDetailsButton"} ),
    probabilityDensityDetailsButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityDetailsButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityDetailsButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityDetailsButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityDetailsButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityDetailsButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityDetailsButton.accessibleContextResponseStringProperty' ) )
    },
    waveFunctionDetailsButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionDetailsButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionDetailsButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionDetailsButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionDetailsButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionDetailsButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionDetailsButton.accessibleContextResponseStringProperty' ) )
    },
    superpositionCustomizeButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomizeButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomizeButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomizeButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomizeButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionCustomizeButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.superpositionCustomizeButton.accessibleContextResponseStringProperty' ) )
    },
    superpositionDetailsButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionDetailsButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.superpositionDetailsButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionDetailsButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.superpositionDetailsButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionDetailsButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.superpositionDetailsButton.accessibleContextResponseStringProperty' ) )
    },
    yAxisZoomButtonGroup: {
      zoomInButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_yAxisZoomButtonGroup_zoomInButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.yAxisZoomButtonGroup.zoomInButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_yAxisZoomButtonGroup_zoomInButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.yAxisZoomButtonGroup.zoomInButton.accessibleHelpTextStringProperty' ) ),
        accessibleContextResponse: new FluentPattern<{ max: FluentVariable, min: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_yAxisZoomButtonGroup_zoomInButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.yAxisZoomButtonGroup.zoomInButton.accessibleContextResponseStringProperty' ), [{"name":"max"},{"name":"min"}] )
      },
      zoomOutButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_yAxisZoomButtonGroup_zoomOutButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_yAxisZoomButtonGroup_zoomOutButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleHelpTextStringProperty' ) ),
        accessibleContextResponse: new FluentPattern<{ max: FluentVariable, min: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_yAxisZoomButtonGroup_zoomOutButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleContextResponseStringProperty' ), [{"name":"max"},{"name":"min"}] )
      }
    },
    _comment_19: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"quantumStateGraphRadioButtonGroup"} ),
    _comment_20: new FluentComment( {"comment":"Radio Buttons","associatedKey":"quantumStateGraphRadioButtonGroup"} ),
    _comment_21: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"quantumStateGraphRadioButtonGroup"} ),
    _comment_22: new FluentComment( {"comment":"Radio buttons for selecting which Quantum State Graph to display below the Energy Diagram.","associatedKey":"quantumStateGraphRadioButtonGroup"} ),
    quantumStateGraphRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_quantumStateGraphRadioButtonGroup_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.quantumStateGraphRadioButtonGroup.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_quantumStateGraphRadioButtonGroup_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.quantumStateGraphRadioButtonGroup.accessibleHelpTextStringProperty' ) )
    },
    _comment_23: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeSpeedSlider"} ),
    _comment_24: new FluentComment( {"comment":"Sliders","associatedKey":"timeSpeedSlider"} ),
    _comment_25: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeSpeedSlider"} ),
    timeSpeedSlider: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeSpeedSlider_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.timeSpeedSlider.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeSpeedSlider_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.timeSpeedSlider.accessibleHelpTextStringProperty' ) )
    },
    electronMassesControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_electronMassesControl_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.electronMassesControl.accessibleHelpTextStringProperty' ) )
    },
    numberOfWellsControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_numberOfWellsControl_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.numberOfWellsControl.accessibleHelpTextStringProperty' ) )
    },
    electricFieldControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_electricFieldControl_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.electricFieldControl.accessibleHelpTextStringProperty' ) )
    },
    _comment_26: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyLevelSpinner"} ),
    _comment_27: new FluentComment( {"comment":"Spinners","associatedKey":"energyLevelSpinner"} ),
    _comment_28: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyLevelSpinner"} ),
    energyLevelSpinner: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLevelSpinner_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.energyLevelSpinner.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLevelSpinner_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.energyLevelSpinner.accessibleHelpTextStringProperty' ) )
    },
    _comment_29: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeDisplayToggleButton"} ),
    _comment_30: new FluentComment( {"comment":"Toggle Buttons and Switches","associatedKey":"timeDisplayToggleButton"} ),
    _comment_31: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeDisplayToggleButton"} ),
    timeDisplayToggleButton: {
      accessibleNameOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleNameOn', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleNameOnStringProperty' ) ),
      accessibleNameOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleNameOff', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleNameOffStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleContextResponseOn', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty' ) ),
      accessibleContextResponseOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleContextResponseOff', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty' ) )
    },
    curvesVisibleToggleButton: {
      accessibleNameOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_curvesVisibleToggleButton_accessibleNameOn', _.get( QuantumBoundStatesStrings, 'a11y.curvesVisibleToggleButton.accessibleNameOnStringProperty' ) ),
      accessibleNameOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_curvesVisibleToggleButton_accessibleNameOff', _.get( QuantumBoundStatesStrings, 'a11y.curvesVisibleToggleButton.accessibleNameOffStringProperty' ) ),
      accessibleHelpTextOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_curvesVisibleToggleButton_accessibleHelpTextOn', _.get( QuantumBoundStatesStrings, 'a11y.curvesVisibleToggleButton.accessibleHelpTextOnStringProperty' ) ),
      accessibleHelpTextOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_curvesVisibleToggleButton_accessibleHelpTextOff', _.get( QuantumBoundStatesStrings, 'a11y.curvesVisibleToggleButton.accessibleHelpTextOffStringProperty' ) ),
      accessibleContextResponseOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_curvesVisibleToggleButton_accessibleContextResponseOn', _.get( QuantumBoundStatesStrings, 'a11y.curvesVisibleToggleButton.accessibleContextResponseOnStringProperty' ) ),
      accessibleContextResponseOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_curvesVisibleToggleButton_accessibleContextResponseOff', _.get( QuantumBoundStatesStrings, 'a11y.curvesVisibleToggleButton.accessibleContextResponseOffStringProperty' ) )
    },
    presetCustomSwitch: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_presetCustomSwitch_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.presetCustomSwitch.accessibleHelpTextStringProperty' ) )
    },
    _comment_32: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"magnifier"} ),
    _comment_33: new FluentComment( {"comment":"Tools","associatedKey":"magnifier"} ),
    _comment_34: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"magnifier"} ),
    magnifier: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.accessibleHeadingStringProperty' ) ),
      accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.accessibleParagraphStringProperty' ) ),
      probe: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_probe_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.probe.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_probe_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.probe.accessibleHelpTextStringProperty' ) ),
        accessibleObjectResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_probe_accessibleObjectResponse', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.probe.accessibleObjectResponseStringProperty' ) )
      },
      body: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_body_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.body.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_body_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.body.accessibleHelpTextStringProperty' ) ),
        accessibleObjectResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifier_body_accessibleObjectResponse', _.get( QuantumBoundStatesStrings, 'a11y.magnifier.body.accessibleObjectResponseStringProperty' ) )
      }
    },
    referenceLine: {
      accessibleRoleDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLine_accessibleRoleDescription', _.get( QuantumBoundStatesStrings, 'a11y.referenceLine.accessibleRoleDescriptionStringProperty' ) ),
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLine_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.referenceLine.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLine_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.referenceLine.accessibleHelpTextStringProperty' ) ),
      accessibleObjectResponse: new FluentPattern<{ x: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_referenceLine_accessibleObjectResponse', _.get( QuantumBoundStatesStrings, 'a11y.referenceLine.accessibleObjectResponseStringProperty' ), [{"name":"x"}] )
    },
    _comment_35: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
    _comment_36: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
    _comment_37: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
    _comment_38: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
    units: {
      electronMasses: {
        accessiblePattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_electronMasses_accessiblePattern', _.get( QuantumBoundStatesStrings, 'a11y.units.electronMasses.accessiblePatternStringProperty' ), [{"name":"value"}] )
      },
      electronVolts: {
        accessiblePattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_electronVolts_accessiblePattern', _.get( QuantumBoundStatesStrings, 'a11y.units.electronVolts.accessiblePatternStringProperty' ), [{"name":"value"}] )
      },
      femtoseconds: {
        accessiblePattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_femtoseconds_accessiblePattern', _.get( QuantumBoundStatesStrings, 'a11y.units.femtoseconds.accessiblePatternStringProperty' ), [{"name":"value"}] )
      },
      voltsPerNanometer: {
        accessiblePattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_voltsPerNanometer_accessiblePattern', _.get( QuantumBoundStatesStrings, 'a11y.units.voltsPerNanometer.accessiblePatternStringProperty' ), [{"name":"value"}] )
      }
    }
  }
};

export default QuantumBoundStatesFluent;

quantumBoundStates.register('QuantumBoundStatesFluent', QuantumBoundStatesFluent);
