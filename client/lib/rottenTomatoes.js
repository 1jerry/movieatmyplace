
searchRotten = function(term) {
	var API = "https://yts.ag/api/v2/list_movies.jsonp";
	var parameters = {
		query_term: term,
		limit: 5,
        with_rt_ratings: true
	};
	$.getJSON(API, parameters, function(data){
		Session.set('movieSearch', data.data.movies);
	})
	.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	});
};

getRottenMovieDetails = function(movieId, rottenId) {
	var API = "https://yts.ag/api/v2/movie_details.json?with_images=true&with_cast=true&movie_id=" + rottenId;
	var parameters = {
	};
	$.getJSON(API, parameters, function(data){
		addRottenDetailsToMovie(movieId, data.data.movie);
	})
	.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	});
};

addRottenDetailsToMovie = function(movieId, details) {

	// Format information
	rottenData = {
		rottenId:       isset(details['id'])            ? details['id']                        : null,
		imdbId:         isset(details['imdb_code'])     ? details['imdb_code']     : null,
		title:          isset(details['title'])         ? details['title']                     : null,
		year:           isset(details['year'])          ? details['year']                      : null,
		studio:         isset(details['studio'])        ? details['studio']                    : null,
		thumbnail:      isset(details['small_cover_image'])       ? details['small_cover_image']     : null,
		poster:      isset(details['large_cover_image'])       ? details['large_cover_image']     : null,
		background:      	isset(details['background_image'])       ? details['background_image']      : null,
		rating:         isset(details['rating'])       ? details['rating']  : null,
		duration:       isset(details['runtime'])       ? details['runtime']                   : null,
		synopsis:       isset(details['synopsis'])      ? details['synopsis']                  : details.description_intro,
        date_added: new Date()
	};

	if (isset(details['cast'])) {
		var actors = [];
        details.cast.forEach(function(actor) {actors.push(actor.name)})
		rottenData['cast'] = actors.join(', ');
	}

	if (isset(details['abridged_directors'])) {
		var directors = [];
		$.each(details.abridged_directors, function(director) {
			directors.push(director.name);
		});
		rottenData['directors'] = directors.join(', ');
	}

	if (isset(details['genres'])) {
		rottenData['genres'] = details.genres.join(', ');
	}

	// Add already saved data (like votes)
	var movieIndex = findMovieIndexInCollectionById(movieId);
	var movie = Events.findOne({_id: Session.get('eId')}).movies[movieIndex];
	$.each(movie, function(key, value) {
		if (!isset(rottenData[key]))
			rottenData[key] = value;
	});

	// Save
	var data = {};
	data['movies.' + movieIndex] = rottenData;
	Events.update({_id: Session.get('eId')}, {$set: data});
};
