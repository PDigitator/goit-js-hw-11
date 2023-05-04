export function ifDisabledTrue(searchBtn) {
  searchBtn.disabled = true;
  searchBtn.classList.add('js-disabled-true');
}

export function ifDisabledFalse(searchBtn) {
  searchBtn.disabled = false;
  searchBtn.classList.remove('js-disabled-true');
}
