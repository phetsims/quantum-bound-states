// Copyright 2026, University of Colorado Boulder

/**
 * Symbols used throughout this simulation. These symbols contain RichText markup that renders them with MathSymbolFont.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import quantumBoundStates from '../quantumBoundStates.js';

export default class QBSSymbols {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly psiSymbolProperty = MathSymbolFont.getRichTextMarkup( 'φ' );
}

quantumBoundStates.register( 'QBSSymbols', QBSSymbols );