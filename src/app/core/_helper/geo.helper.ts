/**
 * Outils géo partagés avec l'app (voir lib/utils/geohash.dart) : geohash
 * identique (précision 6 par défaut, comme AppConstants.geohashPrecision)
 * et distance haversine pour le ciblage de proximité (500 m).
 */

/** Alphabet base32 du geohash (sans a, i, l, o pour éviter les confusions). */
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export const GEOHASH_PRECISION = 6;

/** Encode une position en geohash — port fidèle de l'implémentation de l'app. */
export function encodeGeohash(lat: number, lng: number, precision = GEOHASH_PRECISION): string {
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;
  let hash = '';
  let even = true; // on commence par la longitude
  let bit = 0;
  let ch = 0;

  while (hash.length < precision) {
    if (even) {
      const mid = (lngMin + lngMax) / 2;
      if (lng >= mid) {
        ch = (ch << 1) | 1;
        lngMin = mid;
      } else {
        ch = ch << 1;
        lngMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat >= mid) {
        ch = (ch << 1) | 1;
        latMin = mid;
      } else {
        ch = ch << 1;
        latMax = mid;
      }
    }
    even = !even;

    if (++bit === 5) {
      hash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return hash;
}

/** Distance haversine en mètres entre deux points {lat, lng}. */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const earthRadiusM = 6371000;
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusM * Math.asin(Math.sqrt(h));
}
