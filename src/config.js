const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Cloudinary images are urls and older reports store just a filename.
export const imageSrc = (image) =>
  image && image.startsWith("http") ? image : `${API_URL}/uploads/${image}`;

export default API_URL;
