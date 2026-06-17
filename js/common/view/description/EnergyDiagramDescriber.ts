// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramDescriber creates core descriptions for the Energy Diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../../axon/js/DynamicProperty.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import AccessibleList, { AccessibleListItem } from '../../../../../scenery-phet/js/accessibility/AccessibleList.js';
import { AccessibleTemplateValue } from '../../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSModel from '../../model/QBSModel.js';
import QBSConstants from '../../QBSConstants.js';

export default class EnergyDiagramDescriber {

  private readonly model: QBSModel;

  //TODO Eliminate coupling to QBSModel? Or is that OK/necessary for description?
  public constructor( model: QBSModel ) {
    this.model = model;
  }

  /**
   * Gets the accessible template that describes the graph area.
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
      console.log( `electronMassesProperty.range=${this.model.electronMassesProperty.range}` );
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

    // Energy offset, if variable
    const yOffsetProperty = new DynamicProperty<number, number, QuantumPotential>( this.model.potentialProperty, {
      derive: potential => potential.yOffsetProperty
    } );
    const yOffsetRangeProperty = new DerivedProperty( [ this.model.potentialProperty ], potential => potential.yOffsetProperty.range );
    listItems.push( {
      stringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.listItems.energyOffset.createProperty( {
        energyOffset: yOffsetProperty.derived( yOffset => toFixed( yOffset, QBSConstants.Y_OFFSET_DECIMAL_PLACES ) )
      } ),
      visibleProperty: yOffsetRangeProperty.derived( yOffsetRange => yOffsetRange.getLength() !== 0 )
    } );

    const potentialParametersItem = {
      stringProperty: new StringProperty( 'TODO list items that describe potential parameters' ) //TODO
    };
    listItems.push( potentialParametersItem );

    return AccessibleList.createTemplateProperty( {
      leadingParagraphStringProperty: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleTemplate.leadingParagraphStringProperty,
      listItems: listItems
    } );
  }

}