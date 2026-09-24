import http from "./http";

/**
 * Hotel API service. All hotel HTTP calls go through this module,
 * so endpoints and query shapes are defined in exactly one place.
 * @module services/hotelService
 */

/**
 * Fetch hotels, optionally filtered by destination text and guest capacity.
 * @param {{ q?: string, accommodates?: number }} [filters]
 * @returns {Promise<Array<object>>} list of hotels
 */
export async function getHotels({ q = "", accommodates = 1 } = {}) {
  const { data } = await http.get("/hotels", {
    params: { q, accommodates_gte: accommodates },
  });
  return data;
}

/**
 * Fetch a single hotel by id.
 * @param {string|number} id
 * @returns {Promise<object>} hotel
 */
export async function getHotelById(id) {
  const { data } = await http.get(`/hotels/${id}`);
  return data;
}
