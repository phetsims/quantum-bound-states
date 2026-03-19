// Copyright 2025, University of Colorado Boulder

//TODO Move these to QBSConstants
/**
 * Physical constants for quantum mechanics calculations.
 *
 * We use natural units throughout this simulation:
 *   - Mass unit: electron mass (mₑ = 1)
 *   - Energy unit: electron volt (eV = 1)
 *   - Length unit: nanometer (nm = 1)
 *
 * In this unit system, ℏ = ℏ_SI / (nm × √(mₑ × eV)) ≈ 0.27604 [√(eV·mₑ)·nm].
 * This can be verified: ℏ²/(2mₑ) ≈ 0.03810 eV·nm², the standard value.
 *
 * @author Martin Veillette
 */

import quantumBoundStates from '../../../quantumBoundStates.js';

export default class FundamentalConstants {

  // Reduced Planck constant (hbar) in natural units: √(eV⋅mₑ)⋅nm
  // Computed as: 1.054571817e-34 / (1e-9 * sqrt(9.1093837015e-31 * 1.602176634e-19))
  public static readonly HBAR = 0.2760428268035944;

  // Electron mass (dimensionless, = 1 in natural units)
  public static readonly ELECTRON_MASS = 1;
}

quantumBoundStates.register( 'FundamentalConstants', FundamentalConstants );