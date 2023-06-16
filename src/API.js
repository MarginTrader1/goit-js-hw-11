
  // запрос на сервер

  export default class GetImagesApi {
    constructor() {
      this.searchQuery = "";
      this.page = 1;
    }
      getImages(){

        console.log(this);

        const key = '37349612-6a9d2bc1c1c870fef97dab380';
          
        return fetch(`https://pixabay.com/api/?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
        .then(response => response.json())
        .then(json => {
          this.page += 1;
          return json
        })
    }

    resetPage() {
      this.page = 1;
    }

    get query () {
      return  this.searchQuery;
    }

    set query (newQuery) {
      this.searchQuery = newQuery;
    }
  }