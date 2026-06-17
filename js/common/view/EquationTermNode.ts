// Copyright 2026, University of Colorado Boulder

/**
 * EquationTermNode displays a term from an equation in the Quantum State Graph. The term corresponds to the selected
 * energy level. For example, if energy level E3 is selected, the Wave Function graph shows 'Ψ<sub>3</sub>(x,t)'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class EquationTermNode extends BackgroundNode {

  private constructor( energyLevelIndexProperty: TReadOnlyProperty<number>, patternString: string, tandem: Tandem ) {

    affirm( patternString.includes( '{{energyLevelIndex}}' ), 'invalid pattern string: ' + patternString );

    const stringProperty = new DerivedStringProperty( [ energyLevelIndexProperty ],
      energyLevel => StringUtils.fillIn( patternString, {
        energyLevel: energyLevel
      } ) );

    const richText = new RichText( stringProperty, {
      font: QBSConstants.EQUATION_TERM_FONT,
      fill: QBSColors.equationTermColorProperty
    } );

    super( richText, {

      // BackgroundNodeOptions
      isDisposable: false,
      xMargin: 4,
      yMargin: 2,
      rectangleOptions: {
        cornerRadius: 3,
        fill: QBSColors.equationTermBackgroundColorProperty,
        stroke: null,
        opacity: 1 // use alpha in fill
      },
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }

  /**
   * Creates a term for the probability density equation.
   */
  public static probabilityDensityTerm( energyLevelIndexProperty: TReadOnlyProperty<number>, tandem: Tandem ): EquationTermNode {
    return new EquationTermNode( energyLevelIndexProperty, '|Ψ<sub>{{energyLevelIndex}}</sub>(x,t)|<sup>2</sup>', tandem );
  }

  /**
   * Creates a term for the wave function equation.
   */
  public static waveFunctionTerm( energyLevelIndexProperty: TReadOnlyProperty<number>, tandem: Tandem ): EquationTermNode {
    return new EquationTermNode( energyLevelIndexProperty, 'Ψ<sub><sub>{{energyLevelIndex}}</sub></sub>(x,t)', tandem );
  }
}