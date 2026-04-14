/**
 * Centralized API configuration for the Blood Bank Management System.
 * In development, it defaults to localhost:5000.
 * In production, it will use the VITE_API_BASE_URL environment variable.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default API_BASE_URL;
