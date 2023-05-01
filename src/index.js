import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// import { galleryItems } from './gallery-items'; //!

const searchField = document.querySelector('#search-form');
const imageGalleryRef = document.querySelector('.gallery');
// const cardsMarkup = createImageCardsMarkup(galleryItems); //?
console.log(searchField); //?

searchField.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  const formEl = evt.currentTarget.elements;
  const searchQuery = formEl.searchQuery.value.trim();
  // const { searchQuery } = evt.currentTarget.elements; //!
  // const searchName = searchQuery.value.trim(); //!
  if (!searchQuery) {
    clearGalleryMarkup();

    return;
  } //???

  try {
    const { data } = await fetchImmages(searchQuery);
    // div.innerHTML = createMarkupProduct(data);//!

    createGalleryMarkup(data.hits);
    // allProductsRef.innerHTML = createGalleryMarkup(data.hits);//!
    console.log(data.hits);
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
        `<li class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}">
            <div gallery__thumb>
              <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </div>  
            <div class="info">
              <p class="info-item">
                <b>Likes</b>${likes}
              </p>
              <p class="info-item">
                <b>Views</b>${views}
              </p>
              <p class="info-item">
                <b>Comments</b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>${downloads}
              </p>
            </div>
          </a>
        </li>`
    )
    .join('');

  imageGalleryRef.insertAdjacentHTML('beforeend', markup);
}

// function createImageCardsMarkup(images) {
//   return images
//     .map(
//       ({ preview, original, description }) =>
//         `<li class="gallery__item">
//           <a class="gallery__link" href="${original}">
//             <img
//               class="gallery__image"
//               src="${preview}"
//               alt="${description}"
//             />
//           </a>
//         </li>`
//     )
//     .join(''); //?
// }

// imageGallery.insertAdjacentHTML('beforeend', cardsMarkup); //?

// imageGallery.style.listStyle = 'none'; //?

const lightbox = new SimpleLightbox('.gallery a'); //?

// console.log(galleryItems); //!

function clearGalleryMarkup() {
  imageGalleryRef.innerHTML = '';
}
