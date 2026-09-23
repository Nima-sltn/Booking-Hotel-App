import http from "./http";

/**
 * Bookmark API service (CRUD over JSON Server `/bookmarks`).
 * @module services/bookmarkService
 */

/** @returns {Promise<Array<object>>} all bookmarks */
export async function getBookmarks() {
  const { data } = await http.get("/bookmarks");
  return data;
}

/**
 * @param {string|number} id
 * @returns {Promise<object>} a single bookmark
 */
export async function getBookmarkById(id) {
  const { data } = await http.get(`/bookmarks/${id}`);
  return data;
}

/**
 * Persist a new bookmark.
 * @param {object} bookmark
 * @returns {Promise<object>} the created bookmark (with generated id)
 */
export async function createBookmark(bookmark) {
  const { data } = await http.post("/bookmarks", bookmark);
  return data;
}

/**
 * Remove a bookmark by id.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deleteBookmark(id) {
  await http.delete(`/bookmarks/${id}`);
}
