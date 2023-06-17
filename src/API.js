
  // запрос на сервер

import axios from "axios";

  export default class GetImagesApi {
    constructor() {
      this.searchQuery = "";
      this.page = 1;
    }
      // функция запроса на сервер
      async getImages(){

        console.log(this);

        const key = '37349612-6a9d2bc1c1c870fef97dab380';
        const url = `https://pixabay.com/api/?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
        
        // await заморожує виконання асинхронної фукції до тих пір поки проміс не перейде у стан Fullfilled або Rejected
        // await повертає дані з промісу, а не сам проміс
        // async/await потрібні для того щоб зробити імітацію синхронності всередині асинхронного коду

        const response = await axios.get(url);

        this.incrementPage();
        return response.data
        }
    

    resetPage() {
      this.page = 1;
    }

    incrementPage() {
      this.page += 1;
    }

    get query () {
      return  this.searchQuery;
    }

    set query (newQuery) {
      this.searchQuery = newQuery;
    }
  }



  
  // запрос на сервер без AXIOS

  // export default class GetImagesApi {
  //   constructor() {
  //     this.searchQuery = "";
  //     this.page = 1;
  //   }
  //     getImages(){

  //       console.log(this);

  //       const key = '37349612-6a9d2bc1c1c870fef97dab380';
          
  //       return fetch(`https://pixabay.com/api/?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
  //       .then(response => response.json())
  //       .then(json => {
  //         this.page += 1;
  //         return json
  //       })
  //   }

  //   resetPage() {
  //     this.page = 1;
  //   }

  //   get query () {
  //     return  this.searchQuery;
  //   }

  //   set query (newQuery) {
  //     this.searchQuery = newQuery;
  //   }
  // }