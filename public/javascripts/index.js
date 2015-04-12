$(document).ready(function() {
    $('#search-form').submit(function(e) {
        e.preventDefault();
        window.location.pathname = '/api/' + $('#search').val();
    });
    /* var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({
                        value: str
                    });
                    console.log(str);
                }
            });

            cb(matches);
        };
    };
    $.ajax('/api/typeahead', { success: function(data) {
      var parsed = [];
      for (var i = data.length - 1; i >= 0; i--) {
        parsed.push(data[i].name);
        console.log(parsed);
      }
      $('#search').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
          name: 'components',
          source: substringMatcher(parsed)
      });
    }});
    */
});
