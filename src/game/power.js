/**
 * Creates a separate file for PowerClass definition to avoid circular dependency.
 */
export const PowerClass = {
  pyro: 'pyro',
  cryo: 'cryo',
  psammo: 'psammo',
  dentro: 'dentro',
  hydro: 'hydro',
  erebo: 'erebo',
};

// Power specific constants
export const pyroHandDistribution = [0.4, 0.4, 0.1, 0.09, 0.01];
export const cryoFreezeRate = 0.4;
export const psammoMissRate = 0.15;
export const psammoWishRate = 0.3;
export const hydroBuffRate = 0.3;
