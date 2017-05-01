var str = "this string \
is broken \
across multiple\
lines."
console.log(str); // this string is broken across multiplelines.

var poem = "Roses are red,\n\
Violets are blue.\n\
Sugar is sweet,\n\
and so is foo."
console.log(poem);

// Basic literal string creation
console.log(`In JavaScript '\n' is a line-feed.`)

// Multiline strings
//`In JavaScript this is
//not legal.`

// String interpolation
var name = "Bob",
    time = "today";
console.log('Hello ${name}, how are you ${time}?');

function post(url, cb) {
    return cb(url);
}
// Construct an HTTP request prefix is used to interpret the replacements and construction
var credentials = ["x", "y"];
var foo = 'foo';
var bar = 'bar';

post(`http://foo.org/bar?a=${name}&b=${time}
     Content-Type: application/json
     X-Credentials: ${credentials}
     { "foo": ${foo},
       "bar": ${bar}}`, myOnReadyStateChangeHandler);

function myOnReadyStateChangeHandler(resp) {
    console.log(resp);
}
