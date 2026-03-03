/**
 * Convert a date string from "YYYY-MM-DD" to "DD/MM/YYYY".
 * @param {string} dateString - Date in "YYYY-MM-DD" format.
 * @returns {string} Date in "DD/MM/YYYY" format, or empty string if invalid.
 */
export function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  if (!year || !month || !day) return dateString;

  return `${day} / ${month} / ${year}`;
}
