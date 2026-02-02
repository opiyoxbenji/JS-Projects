const autoCompleteConfig = {
	// rendering options logic
	renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
			<img src="${imgSrc}" />
			${movie.Title} (${movie.Year}) 
		`;
	},

	inputValue(movie) {
		return movie.Title;
	},
	// fetch data logic
	async fetchData(searchTerm) {
		const response = await axios.get('http://www.omdbapi.com', {
			params: {
				apikey: 'c68ca0f0',
				// searching via the input
				s: searchTerm,
				// i: 'tt0110912',
			},
		});

		// handling errored responses
		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	},
};

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	// onOptionSelect logic
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	},
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	// onOptionSelect logic
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	},
});

let leftMovie;
let rightMovie;

// making a followup request
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get('http://www.omdbapi.com', {
		params: {
			apikey: 'c68ca0f0',
			i: movie.imdbID,
		},
	});

	summaryElement.innerHTML = movieTemplate(response.data);

	// compare
	if (side === 'left') {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

// comparison logic
const runComparison = () => {
	const leftSideStats = document.querySelectorAll(
		'#left-summary .notification'
	);
	const rightSideStats = document.querySelectorAll(
		'#right-summary .notification'
	);

	// updating styles
	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};

// rendering an expanded summary
const movieTemplate = movieDetail => {
	// extracting dollars
	const dollars = parseInt(
		movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
	);
	// extracting metascore
	const metascore = parseInt(movieDetail.Metascore);
	// extracing imdbRating
	const imdbRating = parseFloat(movieDetail.imdbRating);
	// extracting imdbVotes
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
	// extracting awards
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);
	console.log(awards);

	return `
	<article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
	`;
};
