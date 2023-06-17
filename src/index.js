import GetImagesApi from './API.js';
import Notiflix from 'notiflix';

const input = document.getElementById("search-form");
const gallery = document.getElementById("gallery");
const loadMoreBtn = document.querySelector('.load-more');

const getImagesApi = new GetImagesApi();

console.log(getImagesApi);

input.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', loadMore);

// сабмит формы ввода 
function onSubmit(e){
    e.preventDefault();

    // при сабмите формы очищаем галерею
    clearGalleryContainer()

    // присваиваем значение инпута
    getImagesApi.query = input.elements.searchQuery.value.trim();

    // проверка на пустую строку -> выводим алерт 
    if (getImagesApi.query === "") {
        return alert(`Пустая строка! Введите слово для поиска!`);
    }
    
    // при сабмите сбрасываем номер странички 
    getImagesApi.resetPage();

    // первый запрос на сервер
    getImagesApi.getImages()
    .then(json => {

        console.log(json);

        // делаем проверку данных
        if (json.hits.length === 0) {
          // если данных нет - выкидываем ошибку 
          throw new Error();
        }
        // если данные есть - рендерим разметку
       return createMarkup(json.hits)
      })
    .then(markup => addMarkup(markup))
    .catch(error => onError(error))
      // очищаем форму поиска
    .finally(() => input.reset())
}

//еще один запрос на сервер
function loadMore (e){
    
    loadMoreBtn.classList.add('visually-hidden')
    getImagesApi.getImages()
    .then(json => {

        // делаем проверку данных
        if (json.hits.length === 0) {
          // если данных нет - выкидываем ошибку 
          throw new Error();
        }
        loadMoreBtn.classList.remove('visually-hidden')
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

// функция вставить фото из первого запроса
function addMarkup(markup){
    gallery.innerHTML = markup; 
    loadMoreBtn.classList.remove('visually-hidden')
}

// функция - вставить дополнительные фотографии 
function addNewMarkup(markup){
    gallery.insertAdjacentHTML("beforeend", markup);
}

//функция очистить разметку 
function clearGalleryContainer(){
    gallery.innerHTML = ""; 
}

// функция вывода ошибки
function onError(){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }

// бесконечный скролл 
window.addEventListener('scroll', handleScroll)

function handleScroll() {
  const { clientHeight, scrollTop, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMore();
  }
}