import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
// import { fetchCountries } from './fetchCountries';
// import {
//   createMarkupCountryInfo,
//   createMarkupCountryList,
// } from './createMarkup';

const searchField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  const countryName = evt.target.value.trim();

  if (!countryName) {
    clearMarkup();

    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        clearMarkup();

        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        clearMarkup();

        countryInfo.innerHTML = createMarkupCountryInfo(data);
      } else {
        clearMarkup();

        countryList.innerHTML = createMarkupCountryList(data);
      }
    })
    .catch(() => {
      clearMarkup();

      Notify.failure('Oops, there is no country with that name');
    });
}

function clearMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

const BASE_URL = `https://restcountries.com/v3.1`;
const END_POINT_COUNTRY = `/name/`;
const params = 'fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}${END_POINT_COUNTRY}${name}?${params}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }
  );
}

function createMarkupCountryList(arr) {
  return arr
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class="country-list-item">
        <img src="${svg}" alt="flag ${official}" width="30"/>
        <p>${official}</p>
      </li>`
    )
    .join('');
}

function createMarkupCountryInfo(arr) {
  return arr
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) =>
        `<div class="country-name-wrap">
      <img class="country-img" src="${svg}" alt="flag ${official}" width="30" />
      <h2>${official}</h2>
    </div>
    <p ><span class="country-capital">Capital: </span>${capital}</p>
    <p><span class="country-population">Population: </span>${population}</p>
    <p>
      <span class="country-languages">Languages: </span>${Object.values(
        languages
      ).join(', ')}
    </p>`
    )
    .join('');
}
