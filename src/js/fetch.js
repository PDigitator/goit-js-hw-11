import axios from 'axios';

const perPage = 40;

export async function fetchImmages(query, currentPage) {
  const BASE_URL = `https://pixabay.com/api/`;
  const API_KEY = `35918460-7c3da85385fde4b8ea2396448`;
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: perPage, //!
  });

  return await axios.get(`${BASE_URL}?${params}`);
}
