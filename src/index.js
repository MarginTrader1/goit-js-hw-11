import GetImagesApi from './API.js';
import Notiflix from 'notiflix';

const input = document.getElementById("search-form");
const gallery = document.getElementById("gallery");
const loadMoreBtn = document.querySelector('.load-more');

const getImagesApi = new GetImagesApi();

console.log(getImagesApi);

input.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', loadMore);

// сабмит формы ввода поиска
function onSubmit(e){
    e.preventDefault();

    getImagesApi.query = input.elements.searchQuery.value.trim();
    getImagesApi.resetPage();

    //первый запрос на сервер
    getImagesApi.getImages()
    .then(json => {
        if (json.length === 0) {
          // делаем проверку данных
          throw new Error();
        }
        //если данные есть - рендерим разметку
       return createMarkup(json.hits)
      })
    .then(markup => addMarkup(markup))
    .catch(error => onError(error))
}

//еще один запрос на сервер
function loadMore (e){
    
    getImagesApi.getImages()
    .then(json => {
        if (json.length === 0) {
          // делаем проверку данных
          throw new Error();
        }
        //если данные есть - рендерим разметку
       return createMarkup(json.hits)
      })
    .then(markup => addNewMarkup(markup))
    .catch(error => onError(error))
}

//функция создания разметки - принимает массив, возвращает строку разметки
function createMarkup(images){
    const markup = images
    .map((image) => {
      return `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes:</b> ${image.likes}
            </p>
            <p class="info-item">
                <b>Likes:</b> ${image.views}
            </p>
            <p class="info-item">
                <b>Comments:</b> ${image.comments}
            </p>
            <p class="info-item">
                <b>Downloads:</b> ${image.downloads}
            </p>
        </div>
       </div>
      `;
    })
    .join("");
    return markup
}

// функция вставить разметку 
function addMarkup(markup){
    gallery.innerHTML = markup; 
    loadMoreBtn.classList.remove('visually-hidden')
}

// функция - вставить дополнительные фотографии 
function addNewMarkup(markup){
    gallery.insertAdjacentHTML("beforeend", markup);
}

// функция вывода ошибки
function onError(){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }