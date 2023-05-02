import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// import { galleryItems } from './gallery-items'; //!

const searchField = document.querySelector('#search-form');
const imageGalleryRef = document.querySelector('.gallery');
// const cardsMarkup = createImageCardsMarkup(galleryItems); //?

const lightbox = new SimpleLightbox('.gallery a');

searchField.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  const formEl = evt.currentTarget.elements;
  const searchQuery = formEl.searchQuery.value.trim();
  // const { searchQuery } = evt.currentTarget.elements; //!
  // const searchName = searchQuery.value.trim(); //!
  if (!searchQuery) {
    // clearGalleryMarkup(); //???
    Notify.info(
      'Sorry, you need to fill in the search field to search for images.'
    );
    return;
  }

  try {
    const { data } = await fetchImmages(searchQuery);
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      createGalleryMarkup(data.hits);
    }

    console.log(data.totalHits); //!
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchImmages(query) {
  const BASE_URL = `https://pixabay.com/api/`;
  const API_KEY = `35918460-7c3da85385fde4b8ea2396448`;
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    //! page: 1,
    per_page: 40, //!
  });

  return await axios.get(`${BASE_URL}?${params}`);
}

function createGalleryMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery__item card-set__item">
          <a class="gallery__link link" href="${largeImageURL}">
            <div class="gallery__thumb">
              <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </div>  
            <div class="gallery__info">
              <p class="gallery__info-item">
                <b>Likes</b>${likes}
              </p>
              <p class="gallery__info-item">
                <b>Views</b>${views}
              </p>
              <p class="gallery__info-item">
                <b>Comments</b>${comments}
              </p>
              <p class="gallery__info-item">
                <b>Downloads</b>${downloads}
              </p>
            </div>
          </a>
        </li>`
    )
    .join('');

  imageGalleryRef.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

function clearGalleryMarkup() {
  imageGalleryRef.innerHTML = '';
}
