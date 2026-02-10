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
addToMapIfDefined( 'display', 'displayStringProperty' );
addToMapIfDefined( 'properties', 'propertiesStringProperty' );
addToMapIfDefined( 'probabilityDensityFunction', 'probabilityDensityFunctionStringProperty' );
addToMapIfDefined( 'probabilityDensityFunctionButtonLabel', 'probabilityDensityFunctionButtonLabelStringProperty' );
addToMapIfDefined( 'waveFunctionButtonLabel', 'waveFunctionButtonLabelStringProperty' );
addToMapIfDefined( 'valueLabels', 'valueLabelsStringProperty' );
addToMapIfDefined( 'realPart', 'realPartStringProperty' );
addToMapIfDefined( 'imaginaryPart', 'imaginaryPartStringProperty' );
addToMapIfDefined( 'magnitude', 'magnitudeStringProperty' );
addToMapIfDefined( 'phase', 'phaseStringProperty' );
addToMapIfDefined( 'magnifierTool', 'magnifierToolStringProperty' );
addToMapIfDefined( 'referenceLine', 'referenceLineStringProperty' );
addToMapIfDefined( 'mass', 'massStringProperty' );
addToMapIfDefined( 'normal', 'normalStringProperty' );
addToMapIfDefined( 'fast', 'fastStringProperty' );
addToMapIfDefined( 'energyLevel', 'energyLevelStringProperty' );
addToMapIfDefined( 'units_electronMasses_symbol', 'units.electronMasses.symbolStringProperty' );
addToMapIfDefined( 'units_electronVolts_symbol', 'units.electronVolts.symbolStringProperty' );
addToMapIfDefined( 'units_femtoSeconds_symbol', 'units.femtoSeconds.symbolStringProperty' );
addToMapIfDefined( 'potentialWells_finiteSquare', 'potentialWells.finiteSquareStringProperty' );
addToMapIfDefined( 'potentialWells_infiniteSquare', 'potentialWells.infiniteSquareStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenButtonsHelpText', 'a11y.oneWellScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_playArea', 'a11y.oneWellScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_controlArea', 'a11y.oneWellScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_currentDetails', 'a11y.oneWellScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_interactionHint', 'a11y.oneWellScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_twoWellsScreen_screenButtonsHelpText', 'a11y.twoWellsScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_twoWellsScreen_screenSummary_playArea', 'a11y.twoWellsScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_twoWellsScreen_screenSummary_controlArea', 'a11y.twoWellsScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_twoWellsScreen_screenSummary_currentDetails', 'a11y.twoWellsScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_twoWellsScreen_screenSummary_interactionHint', 'a11y.twoWellsScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_manyWellsScreen_screenButtonsHelpText', 'a11y.manyWellsScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_manyWellsScreen_screenSummary_playArea', 'a11y.manyWellsScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_manyWellsScreen_screenSummary_controlArea', 'a11y.manyWellsScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_manyWellsScreen_screenSummary_currentDetails', 'a11y.manyWellsScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_manyWellsScreen_screenSummary_interactionHint', 'a11y.manyWellsScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenButtonsHelpText', 'a11y.superpositionScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_playArea', 'a11y.superpositionScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_controlArea', 'a11y.superpositionScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_currentDetails', 'a11y.superpositionScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_interactionHint', 'a11y.superpositionScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_controlPanel_accessibleHeading', 'a11y.controlPanel.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionComponents_accessibleHeading', 'a11y.waveFunctionComponents.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_timeControls_accessibleHeading', 'a11y.timeControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_toolControls_accessibleHeading', 'a11y.toolControls.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_energyGraph_accessibleHeading', 'a11y.energyGraph.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_energyGraph_accessibleParagraph', 'a11y.energyGraph.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityGraph_accessibleHeading', 'a11y.probabilityDensityGraph.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityGraph_accessibleParagraph', 'a11y.probabilityDensityGraph.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionGraph_accessibleHeading', 'a11y.waveFunctionGraph.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionGraph_accessibleParagraph', 'a11y.waveFunctionGraph.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_timeButtonGroup_accessibleHeading', 'a11y.timeButtonGroup.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_timeButtonGroup_accessibleHelpText', 'a11y.timeButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_restartButton_accessibleHelpText', 'a11y.restartButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_restartButton_accessibleContextResponse', 'a11y.restartButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_accessibleHelpTextPlaying', 'a11y.playPauseButton.accessibleHelpTextPlayingStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_accessibleHelpTextPaused', 'a11y.playPauseButton.accessibleHelpTextPausedStringProperty' );
addToMapIfDefined( 'a11y_stepForwardButton_accessibleHelpText', 'a11y.stepForwardButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_stepForwardButton_accessibleContextResponse', 'a11y.stepForwardButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityFunctionButton_accessibleName', 'a11y.probabilityDensityFunctionButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityFunctionButton_accessibleHelpText', 'a11y.probabilityDensityFunctionButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityFunctionButton_accessibleContextResponse', 'a11y.probabilityDensityFunctionButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionButton_accessibleName', 'a11y.waveFunctionButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionButton_accessibleHelpText', 'a11y.waveFunctionButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionButton_accessibleContextResponse', 'a11y.waveFunctionButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityToggleButton_accessibleNameOn', 'a11y.probabilityDensityToggleButton.accessibleNameOnStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityToggleButton_accessibleNameOff', 'a11y.probabilityDensityToggleButton.accessibleNameOffStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityToggleButton_accessibleHelpTextOn', 'a11y.probabilityDensityToggleButton.accessibleHelpTextOnStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityToggleButton_accessibleHelpTextOff', 'a11y.probabilityDensityToggleButton.accessibleHelpTextOffStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityToggleButton_accessibleContextResponseOn', 'a11y.probabilityDensityToggleButton.accessibleContextResponseOnStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityToggleButton_accessibleContextResponseOff', 'a11y.probabilityDensityToggleButton.accessibleContextResponseOffStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionToggleButton_accessibleNameOn', 'a11y.waveFunctionToggleButton.accessibleNameOnStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionToggleButton_accessibleNameOff', 'a11y.waveFunctionToggleButton.accessibleNameOffStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionToggleButton_accessibleHelpTextOn', 'a11y.waveFunctionToggleButton.accessibleHelpTextOnStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionToggleButton_accessibleHelpTextOff', 'a11y.waveFunctionToggleButton.accessibleHelpTextOffStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionToggleButton_accessibleContextResponseOn', 'a11y.waveFunctionToggleButton.accessibleContextResponseOnStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionToggleButton_accessibleContextResponseOff', 'a11y.waveFunctionToggleButton.accessibleContextResponseOffStringProperty' );
addToMapIfDefined( 'a11y_valueLabelsCheckbox_accessibleHelpText', 'a11y.valueLabelsCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_valueLabelsCheckbox_accessibleContextResponseChecked', 'a11y.valueLabelsCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_valueLabelsCheckbox_accessibleContextResponseUnchecked', 'a11y.valueLabelsCheckbox.accessibleContextResponseUncheckedStringProperty' );
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
addToMapIfDefined( 'a11y_magnifierToolCheckbox_accessibleHelpText', 'a11y.magnifierToolCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_magnifierToolCheckbox_accessibleContextResponseChecked', 'a11y.magnifierToolCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_magnifierToolCheckbox_accessibleContextResponseUnchecked', 'a11y.magnifierToolCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_referenceLineCheckbox_accessibleHelpText', 'a11y.referenceLineCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_referenceLineCheckbox_accessibleContextResponseChecked', 'a11y.referenceLineCheckbox.accessibleContextResponseCheckedStringProperty' );
addToMapIfDefined( 'a11y_referenceLineCheckbox_accessibleContextResponseUnchecked', 'a11y.referenceLineCheckbox.accessibleContextResponseUncheckedStringProperty' );
addToMapIfDefined( 'a11y_probabilityDensityFunctionDialog_accessibleName', 'a11y.probabilityDensityFunctionDialog.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_waveFunctionDialog_accessibleName', 'a11y.waveFunctionDialog.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_graphTypeRadioButtonGroup_accessibleName', 'a11y.graphTypeRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_graphTypeRadioButtonGroup_accessibleHelpText', 'a11y.graphTypeRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_graphTypeRadioButtonGroup_averageProbabilityDensityOfBandRadioButton_accessibleHelpText', 'a11y.graphTypeRadioButtonGroup.averageProbabilityDensityOfBandRadioButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_graphTypeRadioButtonGroup_probabilityDensityRadioButton_accessibleHelpText', 'a11y.graphTypeRadioButtonGroup.probabilityDensityRadioButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_graphTypeRadioButtonGroup_wavefunctionRadioButton_accessibleHelpText', 'a11y.graphTypeRadioButtonGroup.wavefunctionRadioButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_massControl_accessibleHelpText', 'a11y.massControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_energyLevelSpinner_accessibleName', 'a11y.energyLevelSpinner.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_energyLevelSpinner_accessibleHelpText', 'a11y.energyLevelSpinner.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleNameOn', 'a11y.timeDisplayToggleButton.accessibleNameOnStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleNameOff', 'a11y.timeDisplayToggleButton.accessibleNameOffStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleHelpText', 'a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleContextResponseOn', 'a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty' );
addToMapIfDefined( 'a11y_timeDisplayToggleButton_accessibleContextResponseOff', 'a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty' );
addToMapIfDefined( 'a11y_referenceLineHandleNode_accessibleName', 'a11y.referenceLineHandleNode.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_referenceLineHandleNode_accessibleHelpText', 'a11y.referenceLineHandleNode.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_referenceLineHandleNode_accessibleObjectResponse', 'a11y.referenceLineHandleNode.accessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_potentialComboBox_accessibleName', 'a11y.potentialComboBox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_units_electronMasses_pattern', 'a11y.units.electronMasses.patternStringProperty' );
addToMapIfDefined( 'a11y_units_electronVolts_pattern', 'a11y.units.electronVolts.patternStringProperty' );
addToMapIfDefined( 'a11y_units_femtoseconds_pattern', 'a11y.units.femtoseconds.patternStringProperty' );

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
  displayStringProperty: _.get( QuantumBoundStatesStrings, 'displayStringProperty' ),
  propertiesStringProperty: _.get( QuantumBoundStatesStrings, 'propertiesStringProperty' ),
  probabilityDensityFunctionStringProperty: _.get( QuantumBoundStatesStrings, 'probabilityDensityFunctionStringProperty' ),
  _comment_2: new FluentComment( {"comment":"Buttons","associatedKey":"probabilityDensityFunctionButtonLabel"} ),
  probabilityDensityFunctionButtonLabelStringProperty: _.get( QuantumBoundStatesStrings, 'probabilityDensityFunctionButtonLabelStringProperty' ),
  waveFunctionButtonLabelStringProperty: _.get( QuantumBoundStatesStrings, 'waveFunctionButtonLabelStringProperty' ),
  _comment_3: new FluentComment( {"comment":"Checkboxes","associatedKey":"valueLabels"} ),
  valueLabelsStringProperty: _.get( QuantumBoundStatesStrings, 'valueLabelsStringProperty' ),
  realPartStringProperty: _.get( QuantumBoundStatesStrings, 'realPartStringProperty' ),
  imaginaryPartStringProperty: _.get( QuantumBoundStatesStrings, 'imaginaryPartStringProperty' ),
  magnitudeStringProperty: _.get( QuantumBoundStatesStrings, 'magnitudeStringProperty' ),
  phaseStringProperty: _.get( QuantumBoundStatesStrings, 'phaseStringProperty' ),
  magnifierToolStringProperty: _.get( QuantumBoundStatesStrings, 'magnifierToolStringProperty' ),
  referenceLineStringProperty: _.get( QuantumBoundStatesStrings, 'referenceLineStringProperty' ),
  _comment_4: new FluentComment( {"comment":"Sliders","associatedKey":"mass"} ),
  massStringProperty: _.get( QuantumBoundStatesStrings, 'massStringProperty' ),
  normalStringProperty: _.get( QuantumBoundStatesStrings, 'normalStringProperty' ),
  fastStringProperty: _.get( QuantumBoundStatesStrings, 'fastStringProperty' ),
  _comment_5: new FluentComment( {"comment":"Spinners","associatedKey":"energyLevel"} ),
  energyLevelStringProperty: _.get( QuantumBoundStatesStrings, 'energyLevelStringProperty' ),
  energyLevelPatternStringProperty: _.get( QuantumBoundStatesStrings, 'energyLevelPatternStringProperty' ),
  _comment_6: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
  _comment_7: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
  _comment_8: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
  _comment_9: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
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
    }
  },
  _comment_10: new FluentComment( {"comment":"Potential Wells","associatedKey":"potentialWells"} ),
  potentialWells: {
    finiteSquareStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.finiteSquareStringProperty' ),
    infiniteSquareStringProperty: _.get( QuantumBoundStatesStrings, 'potentialWells.infiniteSquareStringProperty' )
  },
  _comment_11: new FluentComment( {"comment":"Strings that are specific to accessibility","associatedKey":"a11y"} ),
  a11y: {
    _comment_0: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"oneWellScreen"} ),
    _comment_1: new FluentComment( {"comment":"Screen Summaries","associatedKey":"oneWellScreen"} ),
    _comment_2: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"oneWellScreen"} ),
    oneWellScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.currentDetailsStringProperty' ) ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    twoWellsScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_twoWellsScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.twoWellsScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_twoWellsScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.twoWellsScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_twoWellsScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.twoWellsScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_twoWellsScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.twoWellsScreen.screenSummary.currentDetailsStringProperty' ) ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_twoWellsScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.twoWellsScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    manyWellsScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_manyWellsScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.manyWellsScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_manyWellsScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.manyWellsScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_manyWellsScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.manyWellsScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_manyWellsScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.manyWellsScreen.screenSummary.currentDetailsStringProperty' ) ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_manyWellsScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.manyWellsScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    superpositionScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.superpositionScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.superpositionScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.superpositionScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.superpositionScreen.screenSummary.currentDetailsStringProperty' ) ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_superpositionScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.superpositionScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    _comment_3: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"controlPanel"} ),
    _comment_4: new FluentComment( {"comment":"Headings","associatedKey":"controlPanel"} ),
    _comment_5: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"controlPanel"} ),
    controlPanel: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_controlPanel_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.controlPanel.accessibleHeadingStringProperty' ) )
    },
    waveFunctionComponents: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionComponents_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionComponents.accessibleHeadingStringProperty' ) )
    },
    timeControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.timeControls.accessibleHeadingStringProperty' ) )
    },
    toolControls: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_toolControls_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.toolControls.accessibleHeadingStringProperty' ) )
    },
    energyGraph: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyGraph_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.energyGraph.accessibleHeadingStringProperty' ) ),
      accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyGraph_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.energyGraph.accessibleParagraphStringProperty' ) )
    },
    probabilityDensityGraph: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityGraph_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityGraph.accessibleHeadingStringProperty' ) ),
      accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityGraph_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityGraph.accessibleParagraphStringProperty' ) )
    },
    waveFunctionGraph: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionGraph_accessibleHeading', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionGraph.accessibleHeadingStringProperty' ) ),
      accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionGraph_accessibleParagraph', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionGraph.accessibleParagraphStringProperty' ) )
    },
    _comment_6: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeButtonGroup"} ),
    _comment_7: new FluentComment( {"comment":"Push Buttons","associatedKey":"timeButtonGroup"} ),
    _comment_8: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeButtonGroup"} ),
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
      accessibleHelpText: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_stepForwardButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.stepForwardButton.accessibleHelpTextStringProperty' ), [{"name":"value"}] ),
      accessibleContextResponse: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_stepForwardButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.stepForwardButton.accessibleContextResponseStringProperty' ), [{"name":"value"}] )
    },
    probabilityDensityFunctionButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityFunctionButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityFunctionButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityFunctionButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityFunctionButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityFunctionButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityFunctionButton.accessibleContextResponseStringProperty' ) )
    },
    waveFunctionButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionButton_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionButton_accessibleContextResponse', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionButton.accessibleContextResponseStringProperty' ) )
    },
    probabilityDensityToggleButton: {
      accessibleNameOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityToggleButton_accessibleNameOn', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityToggleButton.accessibleNameOnStringProperty' ) ),
      accessibleNameOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityToggleButton_accessibleNameOff', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityToggleButton.accessibleNameOffStringProperty' ) ),
      accessibleHelpTextOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityToggleButton_accessibleHelpTextOn', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityToggleButton.accessibleHelpTextOnStringProperty' ) ),
      accessibleHelpTextOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityToggleButton_accessibleHelpTextOff', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityToggleButton.accessibleHelpTextOffStringProperty' ) ),
      accessibleContextResponseOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityToggleButton_accessibleContextResponseOn', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityToggleButton.accessibleContextResponseOnStringProperty' ) ),
      accessibleContextResponseOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityToggleButton_accessibleContextResponseOff', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityToggleButton.accessibleContextResponseOffStringProperty' ) )
    },
    waveFunctionToggleButton: {
      accessibleNameOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionToggleButton_accessibleNameOn', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionToggleButton.accessibleNameOnStringProperty' ) ),
      accessibleNameOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionToggleButton_accessibleNameOff', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionToggleButton.accessibleNameOffStringProperty' ) ),
      accessibleHelpTextOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionToggleButton_accessibleHelpTextOn', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionToggleButton.accessibleHelpTextOnStringProperty' ) ),
      accessibleHelpTextOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionToggleButton_accessibleHelpTextOff', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionToggleButton.accessibleHelpTextOffStringProperty' ) ),
      accessibleContextResponseOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionToggleButton_accessibleContextResponseOn', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionToggleButton.accessibleContextResponseOnStringProperty' ) ),
      accessibleContextResponseOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionToggleButton_accessibleContextResponseOff', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionToggleButton.accessibleContextResponseOffStringProperty' ) )
    },
    _comment_9: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"valueLabelsCheckbox"} ),
    _comment_10: new FluentComment( {"comment":"Checkboxes","associatedKey":"valueLabelsCheckbox"} ),
    _comment_11: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"valueLabelsCheckbox"} ),
    valueLabelsCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valueLabelsCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.valueLabelsCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valueLabelsCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.valueLabelsCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_valueLabelsCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.valueLabelsCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
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
    magnifierToolCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifierToolCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.magnifierToolCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifierToolCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.magnifierToolCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_magnifierToolCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.magnifierToolCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    referenceLineCheckbox: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineCheckbox_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineCheckbox.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseCheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineCheckbox_accessibleContextResponseChecked', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineCheckbox.accessibleContextResponseCheckedStringProperty' ) ),
      accessibleContextResponseUncheckedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineCheckbox_accessibleContextResponseUnchecked', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineCheckbox.accessibleContextResponseUncheckedStringProperty' ) )
    },
    _comment_12: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"probabilityDensityFunctionDialog"} ),
    _comment_13: new FluentComment( {"comment":"Dialogs","associatedKey":"probabilityDensityFunctionDialog"} ),
    _comment_14: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"probabilityDensityFunctionDialog"} ),
    probabilityDensityFunctionDialog: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_probabilityDensityFunctionDialog_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.probabilityDensityFunctionDialog.accessibleNameStringProperty' ) )
    },
    waveFunctionDialog: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveFunctionDialog_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.waveFunctionDialog.accessibleNameStringProperty' ) )
    },
    _comment_15: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"graphTypeRadioButtonGroup"} ),
    _comment_16: new FluentComment( {"comment":"Radio Buttons","associatedKey":"graphTypeRadioButtonGroup"} ),
    _comment_17: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"graphTypeRadioButtonGroup"} ),
    _comment_18: new FluentComment( {"comment":"Radio buttons for selecting which graph to display at the bottom of the screen.","associatedKey":"graphTypeRadioButtonGroup"} ),
    graphTypeRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphTypeRadioButtonGroup_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.graphTypeRadioButtonGroup.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphTypeRadioButtonGroup_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.graphTypeRadioButtonGroup.accessibleHelpTextStringProperty' ) ),
      averageProbabilityDensityOfBandRadioButton: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphTypeRadioButtonGroup_averageProbabilityDensityOfBandRadioButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.graphTypeRadioButtonGroup.averageProbabilityDensityOfBandRadioButton.accessibleHelpTextStringProperty' ) )
      },
      probabilityDensityRadioButton: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphTypeRadioButtonGroup_probabilityDensityRadioButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.graphTypeRadioButtonGroup.probabilityDensityRadioButton.accessibleHelpTextStringProperty' ) )
      },
      wavefunctionRadioButton: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_graphTypeRadioButtonGroup_wavefunctionRadioButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.graphTypeRadioButtonGroup.wavefunctionRadioButton.accessibleHelpTextStringProperty' ) )
      }
    },
    _comment_19: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"massControl"} ),
    _comment_20: new FluentComment( {"comment":"Sliders","associatedKey":"massControl"} ),
    _comment_21: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"massControl"} ),
    massControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_massControl_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.massControl.accessibleHelpTextStringProperty' ) )
    },
    _comment_22: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyLevelSpinner"} ),
    _comment_23: new FluentComment( {"comment":"Spinners","associatedKey":"energyLevelSpinner"} ),
    _comment_24: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"energyLevelSpinner"} ),
    energyLevelSpinner: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLevelSpinner_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.energyLevelSpinner.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLevelSpinner_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.energyLevelSpinner.accessibleHelpTextStringProperty' ) )
    },
    _comment_25: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeDisplayToggleButton"} ),
    _comment_26: new FluentComment( {"comment":"Toggle Buttons","associatedKey":"timeDisplayToggleButton"} ),
    _comment_27: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"timeDisplayToggleButton"} ),
    timeDisplayToggleButton: {
      accessibleNameOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleNameOn', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleNameOnStringProperty' ) ),
      accessibleNameOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleNameOff', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleNameOffStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleContextResponseOn', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty' ) ),
      accessibleContextResponseOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeDisplayToggleButton_accessibleContextResponseOff', _.get( QuantumBoundStatesStrings, 'a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty' ) )
    },
    _comment_28: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"referenceLineHandleNode"} ),
    _comment_29: new FluentComment( {"comment":"Tools","associatedKey":"referenceLineHandleNode"} ),
    _comment_30: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"referenceLineHandleNode"} ),
    referenceLineHandleNode: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineHandleNode_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineHandleNode.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineHandleNode_accessibleHelpText', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineHandleNode.accessibleHelpTextStringProperty' ) ),
      accessibleObjectResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLineHandleNode_accessibleObjectResponse', _.get( QuantumBoundStatesStrings, 'a11y.referenceLineHandleNode.accessibleObjectResponseStringProperty' ) )
    },
    _comment_31: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"potentialComboBox"} ),
    _comment_32: new FluentComment( {"comment":"Potentials","associatedKey":"potentialComboBox"} ),
    _comment_33: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"potentialComboBox"} ),
    potentialComboBox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_potentialComboBox_accessibleName', _.get( QuantumBoundStatesStrings, 'a11y.potentialComboBox.accessibleNameStringProperty' ) )
    },
    _comment_34: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
    _comment_35: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
    _comment_36: new FluentComment( {"comment":"Units","associatedKey":"units"} ),
    _comment_37: new FluentComment( {"comment":"=======================================================================================================","associatedKey":"units"} ),
    units: {
      electronMasses: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_electronMasses_pattern', _.get( QuantumBoundStatesStrings, 'a11y.units.electronMasses.patternStringProperty' ), [{"name":"value"}] )
      },
      electronVolts: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_electronVolts_pattern', _.get( QuantumBoundStatesStrings, 'a11y.units.electronVolts.patternStringProperty' ), [{"name":"value"}] )
      },
      femtoseconds: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_femtoseconds_pattern', _.get( QuantumBoundStatesStrings, 'a11y.units.femtoseconds.patternStringProperty' ), [{"name":"value"}] )
      }
    }
  }
};

export default QuantumBoundStatesFluent;

quantumBoundStates.register('QuantumBoundStatesFluent', QuantumBoundStatesFluent);
