var request = require('request'),
    jsdom = require('jsdom'),
    jquery = require('jquery'),
    async = require('async'),
    _ = require('underscore');

// Create a jQuery object from the given html page
function createJqueryObject(page, cb) {
  async.waterfall([
    function(cb) {
      jsdom.env({html: page, done: cb});
    },
    function(window, cb) {
      cb(null, jquery.create(window));
    }
  ], cb);
}

// Download the specified url and return a jQuery object
function loadUrlAsJquery(url, cb) {
	async.waterfall([
		function(cb) {
        request(url, cb);
      },
      function(response, body, cb) {
        createJqueryObject(body, cb);
      }
	], cb);
}

// Class for a scraper
function Scraper() {
	this.addedUrls = {};
	this.queue = [];
	this.running = false;
	this.doneCallback = null;
	this.started = this.completed = 0;
}

Scraper.prototype.run = function(cb) {
	this.doneCallback = cb;
	this.running = true;
	this.queue.forEach(this.parse);
};

Scraper.prototype.addUrl = function(url) {
	if(!this.addedUrls[url]) {
		this.addedUrls[url] = true;
		if(!this.running) {
			this.queue.push(url);
		} else {
			this.parse(url);
		}
	}
};

Scraper.prototype.parse = function(url) {
	this.started++;
	loadUrlAsJquery(url, function(err, $) {
		this.completed++;
		if(this.started == this.completed) {
			this.doneCallback();
		}
	});
};