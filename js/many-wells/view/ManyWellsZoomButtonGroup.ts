// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsZoomButtonGroup is the zoom buttons for the Energy Diagram's y-axis in the 'Many Wells' screen.'
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class ManyWellsZoomButtonGroup extends PlusMinusZoomButtonGroup {

  public constructor( yAxisZoomLevelProperty: TRangedProperty, tandem: Tandem ) {
    super( yAxisZoomLevelProperty, {
      orientation: 'vertical',
      zoomInButtonOptions: {
        accessibleName: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomInButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomInButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomInButton.accessibleContextResponse.createProperty( {
          min: 'TODO', //TODO
          max: 'TODO' //TODO
        } )
      },
      zoomOutButtonOptions: {
        accessibleName: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.yAxisZoomButtonGroup.zoomOutButton.accessibleContextResponse.createProperty( {
          min: 'TODO', //TODO
          max: 'TODO' //TODO
        } )
      },
      tandem: tandem
    } );
  }
}
