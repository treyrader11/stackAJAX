'use strict'


$(document).ready(function() {
	$('.unanswered-getter').submit( function (e){ //why attached to form? in form
		e.preventDefault();
		$('.results').html(''); //results is an empty div
		var tags = $(this).find("input[name='tags']").val(); // 'this' refers to 'form.unaswered-getter'.
		getUnanswered(tags); //so you're passing in the value of <input name="tags">.
	});

	$('.inspiration-getter').submit(function (e){ 
		e.preventDefault();
		$('.results').html(''); 
		var tag = $(this).find("input[name='answerers']").val(); //'this' refers to ".inspiration-getter"
		getInspiration(tag); //so you're passing in the value of <input name="tags">.
	});
});

function getUnanswered(tags) { 

	var request = { 
		tagged: tags, //again, this is the value of the first <input>
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};

	$.ajax({
		type: "GET",
		data: request,
		url: "https://api.stackexchange.com/2.2/questions/unanswered",
		dataType: "jsonp",
		success: function(result) { //result is the data/the data is the result of our key/value pairs in our request object.
			//console.log(result);
			var searchResults = showSearchResults(request.tagged, result.items.length);
			$('.search-results').html(searchResults);
			$.each(result.items, function(index, value) {
				var question = showQuestion(value); //the entire function is an unanswerwed question
				$('.results').append(question); //this loop gets ran as many times as the length of result.items
			});
		},
		error: function(jqXHR, error) {
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		}
	});
}


function getInspiration(tag) { //a function for making a GETRequest for obtaining the specified tags

	var request = { 
		site: 'stackoverflow',
	};

	$.ajax({
		type: "GET",
		data: request,
		url: "https://api.stackexchange.com/2.2/tags/" +tag+ "/top-answerers/all_time", //the endpoint stops before the query (?)
		dataType: "jsonp",
		success: function(result) {
			var searchResults = showSearchResults(tag, result.items.length);
			$('.search-results').html(searchResults);
			$.each(result.items, function(index, value) {
				var inspiration = showInspiration(value);
				$('.results').append(inspiration);
				//console.log("inside the each function, the items are: " +value)
			});
		},
		error: function(jqXHR, error) {
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		}

	});	
}


function showQuestion(question) {//question is the 'value' and the value is results.items
	
	// clone our result template code
	var result = $('.templates .question').clone(); //clones a <div> and a <dl> each time the function is called
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a'); //this is a link
	questionElem.attr('href', question.link); //the link of the question gets inserted as the value of the href
	questionElem.text(question.title); //the link then gets text inserted in it. crazy!
	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date); //have no idea what this does
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=https://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	); //this is the template

	return result; //after going thru each statement, the result is return to whatever called it.
};


function showInspiration(value) {
	var result = $('.templates .inspiration').clone();
	var user = result.find('.user a')
	user.attr('href', value.user.link)
	user.text(value.user.display_name);
    var image = "<img src='" + value.user.profile_image + "' alt='" + value.user.display_name + "'>";
    $(user).append(image);
	result.find('.post-count').text(value.post_count);
	result.find('.score').text(value.score);

	return result;
};

function showError(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

function showSearchResults(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};
	




		

