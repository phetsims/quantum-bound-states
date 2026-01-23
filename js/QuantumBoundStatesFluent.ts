// Copyright 2025-2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from quantum-bound-states-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
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
addToMapIfDefined( 'probabilityDensity', 'probabilityDensityStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenButtonsHelpText', 'a11y.oneWellScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_playArea', 'a11y.oneWellScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_controlArea', 'a11y.oneWellScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_currentDetails', 'a11y.oneWellScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_oneWellScreen_screenSummary_interactionHint', 'a11y.oneWellScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenButtonsHelpText', 'a11y.superpositionScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_playArea', 'a11y.superpositionScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_controlArea', 'a11y.superpositionScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_currentDetails', 'a11y.superpositionScreen.screenSummary.currentDetailsStringProperty' );
addToMapIfDefined( 'a11y_superpositionScreen_screenSummary_interactionHint', 'a11y.superpositionScreen.screenSummary.interactionHintStringProperty' );
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
  potentialEnergyStringProperty: _.get( QuantumBoundStatesStrings, 'potentialEnergyStringProperty' ),
  totalEnergyStringProperty: _.get( QuantumBoundStatesStrings, 'totalEnergyStringProperty' ),
  position_nmStringProperty: _.get( QuantumBoundStatesStrings, 'position_nmStringProperty' ),
  energy_eVStringProperty: _.get( QuantumBoundStatesStrings, 'energy_eVStringProperty' ),
  probabilityDensityStringProperty: _.get( QuantumBoundStatesStrings, 'probabilityDensityStringProperty' ),
  _comment_1: new FluentComment( {"comment":"Strings that are specific to accessibility","associatedKey":"a11y"} ),
  a11y: {
    oneWellScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenButtonsHelpText', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_playArea', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_controlArea', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetailsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_currentDetails', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.currentDetailsStringProperty' ) ),
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_oneWellScreen_screenSummary_interactionHint', _.get( QuantumBoundStatesStrings, 'a11y.oneWellScreen.screenSummary.interactionHintStringProperty' ) )
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
    }
  }
};

export default QuantumBoundStatesFluent;

quantumBoundStates.register('QuantumBoundStatesFluent', QuantumBoundStatesFluent);
