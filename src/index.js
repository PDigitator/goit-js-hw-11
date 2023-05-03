import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios'; //??
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { createGalleryMarkup, clearGalleryMarkup } from './js/gallery-markup';
// import { fetchImmages } from './js/fetch';//!

// import { galleryItems } from './gallery-items'; //!

const searchField = document.querySelector('#search-form');
export const imageGalleryRef = document.querySelector('.gallery');
const searchBtn = document.querySelector('.search-form__btn');
const guard = document.querySelector('.guard');
let searchQuery = '';

const lightbox = new SimpleLightbox('.gallery a');

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

const observer = new IntersectionObserver(onPagination, options); //??

let currentPage = 1;
const perPage = 40; //??

searchField.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const formEl = evt.currentTarget.elements;
  searchQuery = formEl.searchQuery.value.trim();
  // const { searchQuery } = evt.currentTarget.elements; //!
  // const searchName = searchQuery.value.trim(); //!
  if (searchQuery === '') {
    // clearGalleryMarkup(); //???
    Notify.info(
      'Sorry, you need to fill in the search field to search for images.'
    );
    return;
  }

  clearGalleryMarkup();
  takeImmages();

  return searchQuery;
}

async function takeImmages() {
  try {
    const { data } = await fetchImmages(searchQuery, currentPage);
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (currentPage * perPage > data.totalHits) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );

      searchBtn.disabled = true;
    } else {
      if (currentPage === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      createGalleryMarkup(data.hits);
      lightbox.refresh();
      observer.observe(guard); //??
      currentPage += 1;
    }

    console.log(data); //!
    console.log(data.totalHits); //!
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchImmages(query, currentPage) {
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

function onPagination(entries, observer) {
  // console.log(entries);
  entries.forEach(async entry => {
    console.log(entry); //!
    if (entry.isIntersecting) {
      currentPage += 1;
      const { data } = await fetchImmages(searchQuery, currentPage);
      console.log(data);
      // getTrending(currentPage).then(data => {
      //   list.insertAdjacentHTML('beforeend', createMarkup(data.results));
      //   if (data.page === data.total_pages) {
      //     observer.unobserve(guard);
      //   }
      // });
    }
  });
}

// ! { imageGalleryRef };
