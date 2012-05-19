# Scraper.js

Create a web scraper quickly like so:

    var Scraper = require('scraperjs');

    // Create the scraper
    var s = new Scraper();

    // Set a function that will be called for each URL
    s.pageHandler = function(url, $) {
      var links = $('.linklisting .link .title a'); // get all the links

      // Add more links to the scraper within the page handler using addUrl!
      links.each(function() {
        var url = this.href;
        s.addUrl((url[0] == '/') ? 'http://reddit.com'+url : url);
      });
    };

    // Add a URL to the scraper to get started. Use s.addUrls() to add a
    // list of URLs at once.
    s.addUrl("http://reddit.com");

    // Run the scraper and provide a callback, which will be called once the
    // scraper completes.
    s.run(function() {
      console.log("Done!");
    });