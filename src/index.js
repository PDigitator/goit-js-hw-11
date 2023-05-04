import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

import { createGalleryMarkup, clearGalleryMarkup } from './js/gallery-markup';
import { fetchImmages, totalPages } from './js/fetch';
import { ifDisabledFalse, ifDisabledTrue } from './js/if-disabled';

const searchField = document.querySelector('#search-form');
const formInput = document.querySelector('.search-form__input');
const imageGalleryRef = document.querySelector('.gallery');
const searchBtn = document.querySelector('.search-form__btn');
const guard = document.querySelector('.guard');
let searchQuery = '';
let currentPage = 1;

const lightbox = new SimpleLightbox('.gallery a');

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};
const observer = new IntersectionObserver(onPagination, options);

formInput.addEventListener('input', onInput);

function onInput() {
  ifDisabledFalse(searchBtn);
}

searchField.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const formEl = evt.currentTarget.elements;
  searchQuery = formEl.searchQuery.value.trim();

  if (searchQuery === '') {
    Notify.info(
      'Sorry, you need to fill in the search field to search for images.'
    );

    return;
  }

  clearGalleryMarkup(imageGalleryRef);
  currentPage = 1;
  observer.unobserve(guard);
  fetchImmagesResult();
}

async function fetchImmagesResult() {
  try {
    const { data } = await fetchImmages(searchQuery, currentPage);
    takeImmages(data);
  } catch (error) {
    Report.failure('ERROR', `${error.message}`, 'Close');
    console.log(error.message);
  }
}

function takeImmages(data) {
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    ifDisabledTrue(searchBtn);
  } else {
    createGalleryMarkup(imageGalleryRef, data.hits);
    lightbox.refresh();
    observer.observe(guard);
    ifDisabledTrue(searchBtn);

    if (currentPage === 1) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (currentPage > totalPages) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  }
}

function onPagination(entries, observer) {
  entries.forEach(async entry => {
    if (currentPage < totalPages && entry.isIntersecting) {
      currentPage += 1;
      fetchImmagesResult();
    }
    if (currentPage >= totalPages) {
      observer.unobserve(guard);
    }
  });
}
