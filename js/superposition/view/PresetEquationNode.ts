// Copyright 2026, University of Colorado Boulder

/**
 * PresetEquationNode renders the wave function equation for a Preset superposition state, with the following requirements:
 *
 * 1. Localization of the equation is not necessary or supported.
 * 2. Only supports the amplitude format, where phase determines the operator between terms.
 * 3. Only terms with non-zero magnitude are included.
 * 4. Multiline equations are not particularly pretty and don't have to be.
 * 5. Since previews of the curves are time-independent, this equation is NOT of the form Ψ(x,t).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import QBSConstants from '../../common/QBSConstants.js';

const EQUATION_FONT = new PhetFont( 14 );

export default class PresetEquationNode extends RichText {

  private static readonly TERMS_PER_LINE = 5;

  public constructor( coefficients: readonly SuperpositionCoefficient[],
                      groundStateIndex: number,
                      providedOptions?: PickOptional<NodeOptions, 'layoutOptions'> ) {

    // Localization of equationString is not supported.
    let equationString = 'Ψ =';
    coefficients.forEach( ( coefficient, index ) => {
      if ( coefficient.magnitude !== 0 ) {

        // Add plus or minus operator.
        if ( index > 0 ) {
          if ( coefficient.asAmplitude() > 0 ) {
            equationString += ` ${MathSymbols.PLUS}`;
          }
          else {
            equationString += ` ${MathSymbols.MINUS}`;
          }
        }

        // Start a new line.
        if ( index > 0 && index % PresetEquationNode.TERMS_PER_LINE === 0 ) {
          equationString += '<br>';
        }

        // Add the term for this coefficient.
        const magnitudeString = toFixed( coefficient.magnitude, QBSConstants.SUPERPOSITION_COEFFICIENT_AMPLITUDE_DECIMAL_PLACES );
        const subscript = index + groundStateIndex;
        equationString += ` ${magnitudeString}Ψ<sub>${subscript}</sub>`;
      }
    } );

    super( equationString, combineOptions<RichTextOptions>( {
      font: EQUATION_FONT,
      maxWidth: 500
    }, providedOptions ) );
  }
}