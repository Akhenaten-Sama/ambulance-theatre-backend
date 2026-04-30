/**
 * Geospatial utility functions for distance calculations and location operations
 */

import { GeoPoint } from '../types';

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate
 * @param point2 Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert coordinates to PostGIS Point format
 * @param latitude 
 * @param longitude 
 * @returns PostGIS Point string in WKT format
 */
export function toPostGISPoint(latitude: number, longitude: number): string {
  return `POINT(${longitude} ${latitude})`; // Note: PostGIS uses (lon, lat) order
}

/**
 * Parse PostGIS Point to coordinates
 * @param point PostGIS Point string
 * @returns GeoPoint object
 */
export function fromPostGISPoint(point: string): GeoPoint {
  // Format: POINT(lon lat) or SRID=4326;POINT(lon lat)
  const match = point.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (!match) {
    throw new Error(`Invalid PostGIS Point format: ${point}`);
  }

  return {
    longitude: parseFloat(match[1]),
    latitude: parseFloat(match[2]),
  };
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

/**
 * Calculate bounding box for a radius around a point
 * @param center Center point
 * @param radiusKm Radius in kilometers
 * @returns Bounding box coordinates
 */
export function getBoundingBox(
  center: GeoPoint,
  radiusKm: number,
): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  const latDelta = (radiusKm / 111.32); // 1 degree latitude ≈ 111.32 km
  const lonDelta = radiusKm / (111.32 * Math.cos(toRadians(center.latitude)));

  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    minLon: center.longitude - lonDelta,
    maxLon: center.longitude + lonDelta,
  };
}

/**
 * Calculate estimated time of arrival based on distance and average speed
 * @param distanceKm Distance in kilometers
 * @param averageSpeedKmh Average speed in km/h (default: 60)
 * @returns ETA in minutes
 */
export function calculateETA(distanceKm: number, averageSpeedKmh: number = 60): number {
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = timeHours * 60;
  return Math.ceil(timeMinutes);
}
