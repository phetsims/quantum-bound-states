// Copyright 2026, University of Colorado Boulder

/**
 * EquationTermNode displays one term from an equation, corresponding to a selected energy level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class EquationTermNode extends RichText {

  public constructor( stringProperty: TReadOnlyProperty<string>, tandem: Tandem ) {

    super( stringProperty, {
      font: QBSConstants.EQUATION_TERM_FONT,
      fill: QBSColors.equationTermColorProperty,
      tandem: tandem
    } );
  }
}