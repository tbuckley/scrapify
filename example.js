var Scraper = require('./scraper');


/* Get the full url for the given page number */
function toListingUrl(pageNum) {
  return 'http://www.drinksmixer.com/cat/1/'+pageNum;
}

/* Get full urls for all the pages in the given range */
function getListingUrls(startPage, endPage) {
  var urls = [];
  for(var i = startPage; i<endPage+1; i++) {
    urls.push(toListingUrl(i));
  }
  return urls;
}


var listings = new Scraper();
var drinks = new Scraper();

listings.pageHandler = function(url, $) {
  var urls = $('div.clr a').each(function() {
    drinks.addUrl('http://www.drinksmixer.com/'+this.href);
  });
};

drinks.pageHandler = function(url, $) {
  var title = $('h1.recipe_title').text(),
      instructions = $('div.instructions').text(),
      ingredients = $('span.ingredient');
  title = title.substring(0, title.length - 7);
  ingredients = ingredients.map(function() {
    var $this = $(this),
        name = $this.find('.name').text(),
        amount = $this.find('.amount').text();
    return {name: name, amount: amount};
  }).toArray();
  console.log(title, instructions, ingredients);
};

console.log("Starting...");
listings.addUrls(getListingUrls(1,1));
listings.run(function() {console.log("Done with listings!");});
drinks.run(function() {console.log("Done with drinks!");});