import { Injectable } from '@angular/core';

const RADIUS_EARTH = 6371;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  getDistanceFromLatLonInKm(positionA, positionB) {
    const R = RADIUS_EARTH; // Radius of the earth in km
    const dLat = this.deg2rad(positionB.lat - positionA.lat);  // deg2rad below
    const dLon = this.deg2rad(positionB.lng - positionA.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(positionA.lat)) * Math.cos(this.deg2rad(positionB.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
