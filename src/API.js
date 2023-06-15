
  // запрос на сервер

  const key = '37349612-6a9d2bc1c1c870fef97dab380';

  function getImages(query){
    
    return fetch(`https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
    .then(response => response.json())
    }
  
  export { getImages }; 