// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphDescriber creates core descriptions for the Probability Density graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import AccessibleList from '../../../../../scenery-phet/js/accessibility/AccessibleList.js';
import { AccessibleTemplateValue } from '../../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSModel from '../../model/QBSModel.js';

export default class ProbabilityDensityGraphDescriber {

  public constructor( model: QBSModel ) {
    //TODO
  }

  /**
   * Gets the accessible template that describes the graph area.
   */
  public getAccessibleTemplate(): TReadOnlyProperty<AccessibleTemplateValue> {
    return AccessibleList.createTemplateProperty( {
      leadingParagraphStringProperty: QuantumBoundStatesFluent.a11y.probabilityDensityGraph.accessibleTemplate.leadingParagraphStringProperty,
      listItems: [
        {
          //TODO
          stringProperty: new StringProperty( 'TODO list item' ),
          visibleProperty: new BooleanProperty( true )
        }
      ]
    } );
  }

}