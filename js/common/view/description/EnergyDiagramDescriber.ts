// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramDescriber creates core descriptions for the Energy Diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../../axon/js/DynamicProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import AccessibleList, { AccessibleListItem } from '../../../../../scenery-phet/js/accessibility/AccessibleList.js';
import { AccessibleTemplateValue } from '../../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSModel from '../../model/QBSModel.js';
import QBSConstants from '../../QBSConstants.js';
import EnergyLevelDisplay from '../EnergyLevelDisplay.js';
import QuantumPotentialDescriber from './QuantumPotentialDescriber.js';

export default class EnergyDiagramDescriber {

  private readonly model: QBSModel;
  private readonly quantumPotentialDescriber: QuantumPotentialDescriber;

  //TODO Reduce coupling to QBSModel? Or is that OK for description?
  public constructor( model: QBSModel ) {
    this.model = model;
    this.quantumPotentialDescriber = new QuantumPotentialDescriber( model.potentialProperty );
  }

  /**
   * Gets the accessible template that dynamically describes the graph area.
   */
  public getAccessibleTemplate(): TReadOnlyProperty<AccessibleTemplateValue> {

    const listItems: AccessibleListItem[] = [];

    // Selected potential
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.listItems.selectedPotential.createProperty( {
        potentialName: new DynamicProperty<string, string, QuantumPotential>( this.model.potentialProperty, {
          derive: potential => potential.accessibleNameProperty
        } )
      } )
    } );

    // Number of wells, if variable
    if ( this.model.numberOfWellsProperty.range.getLength() !== 0 ) {
      listItems.push( {
        stringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.listItems.numberOfWells.createProperty( {
          numberOfWells: this.model.numberOfWellsProperty
        } )
      } );
    }

    // Electron masses, if variable
    if ( this.model.electronMassesProperty.range.getLength() !== 0 ) {
      listItems.push( {
        stringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.listItems.electronMasses.createProperty( {
          electronMasses: this.model.electronMassesProperty.derived( electronMasses => toFixed( electronMasses, QBSConstants.ELECTRON_MASSES_DECIMAL_PLACES ) )
        } )
      } );
    }

    // Electric field, if variable
    if ( this.model.electricFieldProperty.range.getLength() !== 0 ) {
      listItems.push( {
        stringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.listItems.electricField.createProperty( {
          electricField: this.model.electricFieldProperty.derived( electricField => toFixed( electricField, QBSConstants.ELECTRIC_FIELD_DECIMAL_PLACES ) )
        } )
      } );
    }

    // Potentials
    this.model.potentials.forEach( potential => listItems.push( ...this.quantumPotentialDescriber.createAccessibleListItems( potential ) ) );

    // Selected energy level
    const energyStringProperty = this.model.selectedEnergyLevelIndexProperty.derived(
      selectedEnergyLevelIndex => {
        const energyLevelValue = this.model.getEnergyAtEnergyLevel( selectedEnergyLevelIndex );
        //TODO EnergyLevelDisplay.getNumberOfDecimalPlaces is sadly called here and in EnergyLevelDisplay. Can they share a new Property?
        const decimalPlaces = EnergyLevelDisplay.getNumberOfDecimalPlaces( selectedEnergyLevelIndex,
          this.model.potentialProperty.value.groundStateIndex, this.model.boundStateResultProperty.value.energies );
        return toFixed( energyLevelValue, decimalPlaces );
      } );
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.listItems.energyLevel.createProperty( {
        energyLevelIndex: this.model.selectedEnergyLevelIndexProperty,
        energy: energyStringProperty
      } )
    } );

    return AccessibleList.createTemplateProperty( {
      leadingParagraphStringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.leadingParagraphStringProperty,
      listItems: listItems
    } );
  }

}