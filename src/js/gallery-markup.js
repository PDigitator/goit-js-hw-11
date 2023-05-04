export function createGalleryMarkup(elem, arr) {
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

  elem.insertAdjacentHTML('beforeend', markup);
}

export function clearGalleryMarkup(elem) {
  elem.innerHTML = '';
}
