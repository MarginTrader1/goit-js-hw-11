import GetImagesApi from './API.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.querySelector('.load-more');

// количество загруженных фотографий
let loadedPhotos = 0;

const getImagesApi = new GetImagesApi();

input.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', loadMore);

// первый запрос на сервер и сабмит формы ввода
function onSubmit(e) {
  e.preventDefault();

  // при сабмите формы очищаем галерею
  clearGalleryContainer();

  // обнуляем фото
  deleteLoadedPhotos();

  // сбрасываем номер странички
  getImagesApi.resetPage();

  // прячем кнопку
  loadMoreBtn.classList.add('visually-hidden');

  // присваиваем значение инпута
  getImagesApi.query = input.elements.searchQuery.value.trim();

  // проверка на пустую строку -> выводим алерт
  if (getImagesApi.query === '') {
    return alert(`Пустая строка! Введите слово для поиска!`);
  }

  // первый запрос на сервер
  getImagesApi
    .getImages()
    .then(json => {
      // делаем проверку данных
      if (json.hits.length === 0) {
        // если данных нет - выкидываем ошибку
        throw new Error();
      }

      // увеличиваем количество загруженных фотографий
      addLoadedPhotos(json.hits.length);

      // сравниваем количество загруженных фотографий с общим количеством фотографий
      if (loadedPhotos >= json.totalHits) {
        loadMoreBtn.classList.add('visually-hidden');

        // выводим сообщение
        Notiflix.Notify.info(
          `We found ${loadedPhotos} images and you have reached the end of search results.`
        );

        // обнуляем фото
        deleteLoadedPhotos();

        // возвращаем разметку
        return createMarkup(json.hits);
      }

      // если данные есть - рендерим разметку
      Notiflix.Notify.success(`Hooray! We found ${loadedPhotos} images.`);

      // показываем кнопку
      loadMoreBtn.classList.remove('visually-hidden');
      return createMarkup(json.hits);
    })
    .then(markup => addMarkup(markup))
    .catch(() => onError())
    // очищаем форму поиска
    .finally(() => input.reset());
}

//еще один запрос на сервер
function loadMore(e) {
  loadMoreBtn.classList.add('visually-hidden');
  getImagesApi
    .getImages()
    .then(json => {
      // делаем проверку данных
      if (json.hits.length === 0) {
        // если данных нет - выкидываем ошибку
        throw new Error();
      }

      // увеличиваем количество загруженных фотографий
      addLoadedPhotos(json.hits.length);

      // сравниваем количество загруженных фотографий с общим количеством фотографий
      if (loadedPhotos >= json.totalHits) {
        loadMoreBtn.classList.add('visually-hidden');

        // выводим сообщение
        Notiflix.Notify.info(
          `We found ${loadedPhotos} images and you have reached the end of search results.`
        );

        // возвращаем разметку
        return createMarkup(json.hits);
      }

      loadMoreBtn.classList.remove('visually-hidden');
      Notiflix.Notify.success(`Hooray! We found ${loadedPhotos} images.`);
      //если данные есть - рендерим разметку
      return createMarkup(json.hits);
    })

    .then(markup => {
      addNewMarkup(markup);
    })
    .catch(() => onError());
}

//функция создания разметки - принимает массив, возвращает строку разметки
function createMarkup(images) {
  const markup = images
    .map(image => {
      return `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
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
    .join('');
  return markup;
}

// функция вставить фото из первого запроса
function addMarkup(markup) {
  gallery.innerHTML = markup;
}

// функция - вставить дополнительные фотографии
function addNewMarkup(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}

//функция очистить разметку
function clearGalleryContainer() {
  gallery.innerHTML = '';
}

// функция вывода ошибки
function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

// функция увеличивает количество загруженных фотографий
function addLoadedPhotos(photos) {
  loadedPhotos = loadedPhotos + photos;
}

// функция обнуляет количество загруженных фотографий
function deleteLoadedPhotos() {
  loadedPhotos = 0;
}

// бесконечный скролл - потом переделать

// function handleScroll() {

//   // console.dir(document.documentElement);
//   // console.log(document.documentElement.scrollTop);
//   // console.log(document.documentElement.clientHeight);
//   // console.log(document.documentElement.scrollHeight);

//   const { clientHeight, scrollTop, scrollHeight } = document.documentElement;

//   if (scrollTop + clientHeight >= scrollHeight - 1) {
//     loadMore();
//   }
// }

gsap.registerPlugin(Physics2DPlugin);

document.querySelectorAll('.button').forEach(button => {
  const bounding = button.getBoundingClientRect();

  button.addEventListener('mousemove', e => {
    let dy = (e.clientY - bounding.top - bounding.height / 2) / -1;
    let dx = (e.clientX - bounding.left - bounding.width / 2) / 10;

    dy = dy > 10 ? 10 : dy < -10 ? -10 : dy;
    dx = dx > 4 ? 4 : dx < -4 ? -4 : dx;

    button.style.setProperty('--rx', dy);
    button.style.setProperty('--ry', dx);
  });

  button.addEventListener('mouseleave', e => {
    button.style.setProperty('--rx', 0);
    button.style.setProperty('--ry', 0);
  });

  button.addEventListener('click', e => {
    button.classList.add('success');
    gsap.to(button, {
      '--icon-x': -3,
      '--icon-y': 3,
      '--z-before': 0,
      duration: 0.2,
      onComplete() {
        particles(button.querySelector('.emitter'), 100, -4, 6, -80, -50);
        gsap.to(button, {
          '--icon-x': 0,
          '--icon-y': 0,
          '--z-before': -6,
          duration: 1,
          ease: 'elastic.out(1, .5)',
          onComplete() {
            button.classList.remove('success');
          },
        });
      },
    });
  });
});

function particles(parent, quantity, x, y, minAngle, maxAngle) {
  let colors = ['#FFFF04', '#EA4C89', '#892AB8', '#4AF2FD'];
  for (let i = quantity - 1; i >= 0; i--) {
    let angle = gsap.utils.random(minAngle, maxAngle),
      velocity = gsap.utils.random(70, 140),
      dot = document.createElement('div');
    dot.style.setProperty('--b', colors[Math.floor(gsap.utils.random(0, 4))]);
    parent.appendChild(dot);
    gsap.set(dot, {
      opacity: 0,
      x: x,
      y: y,
      scale: gsap.utils.random(0.4, 0.7),
    });
    gsap
      .timeline({
        onComplete() {
          dot.remove();
        },
      })
      .to(
        dot,
        {
          duration: 0.05,
          opacity: 1,
        },
        0
      )
      .to(
        dot,
        {
          duration: 1.8,
          rotationX: `-=${gsap.utils.random(720, 1440)}`,
          rotationZ: `+=${gsap.utils.random(720, 1440)}`,
          physics2D: {
            angle: angle,
            velocity: velocity,
            gravity: 120,
          },
        },
        0
      )
      .to(
        dot,
        {
          duration: 1,
          opacity: 0,
        },
        0.8
      );
  }
}
