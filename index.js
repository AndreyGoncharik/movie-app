const genres = [{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}];
const search = document.getElementById('search');
const searchButton = document.querySelector('.search-button');
const loading = document.querySelector('.loading');
const wrapper = document.querySelector('.wrapper');
const url = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&append_to_response=imdb_id,budget,production_companies';

window.addEventListener("load", () => getData('&query=' + search.value));

// Seardh Enter 
search.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && search.value.trim().length > 0 && search.value != '') {
        getData('&query=' + search.value);
    }        
});
// Search Button 
searchButton.addEventListener("click", (e) => {
    if (search.value.trim().length > 0 && search.value != '') {
        getData('&query=' + search.value);
    }
});
// DisplayLoading
function displayLoading() {
    loading.innerHTML = `<h3>Please, wait</h3><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
    loading.classList.remove('hide');
}
function hideLoading() {
    loading.classList.add('hide');
}

function getData(req) {
    displayLoading();
    fetch(url+req)
      .then((res) => res.json())
      .then((data) => getResponse(data))
      .then(() => setTimeout(() => hideLoading(), 10000));
      
  }

function getResponse(data) {
    if (data.total_results == 0) {
        wrapper.innerHTML = `<h3> Total results: 0<h3>`;
    } else {
        wrapper.innerHTML = '';

        for (let i = 0; i < data.results.length; i++) {
            fetch('https://api.themoviedb.org/3/movie/'+data.results[i].id+'?api_key=90ee41ee7321448059f87adaed7e0761&append_to_response=imdb_id,budget,production_companies')
            .then((resp) => resp.json())
            .then((data2) => {

           let poster = data2.poster_path != null ? 'https://image.tmdb.org/t/p/w200/'+data2.poster_path :  './assets/img/poster.png';
           let backdrop = data2.backdrop_path != null ? 'https://image.tmdb.org/t/p/w500/'+data2.backdrop_path :  './assets/img/backdrop.png';
           let comp = (data2.production_companies).length > 0 ? ', ' + data2.production_companies[0].name : '';
           let runtime = data2.runtime > 0 ? data2.runtime + ' min' : 'Unk';
           let genreID = [];
           let release_date = data2.release_date != null ? (data2.release_date).slice(0, 4) : 'Unknown date';
            for (let g = 0; g < genres.length; g++) {
                (data2.genres[0] != undefined) && (genres[g].id == data2.genres[0].id) ? genreID.push(genres[g].name) : false;
                (data2.genres[1] != undefined) && (genres[g].id == data2.genres[1].id) ? genreID.push(genres[g].name) : false;
            }
            let out = `
            <div class="card" >
                    <div class="film-id hide">${data2.id}</div>
                <div class="card-info">
                    <div class="card-info_poster">
                        <img src="${poster}" alt="${data2.original_title} - poster">
                    </div>
                    <div class="card-info_header">
                        <h2>${data2.original_title}</h2>
                        <p class="genres">${genreID.join(', ')}
                        <div class="card-info_year">${release_date} ${comp}</div>
                        <div class="minutes"><span class="">${runtime}</span> </span> <div class="rate">&#9733 ${data2.vote_average} </div></div>
                        
                    </div> 
                    <div class="overview">${data2.overview}</div>   
                </div>
                <div class="card-backdrop">
                    <img src="${backdrop}" alt="${data2.original_title} - backdrop">
                </div>
            </div>
            `;
            wrapper.insertAdjacentHTML('afterbegin', out);
            });
        }
    }
}

