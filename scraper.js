var request = require('request'),
    jsdom = require('jsdom'),
    jquery = require('jquery'),
    async = require('async'),
    noop = function(){};

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
	this.doneCallback = noop;
	this.started = this.completed = 0;
}

Scraper.prototype.run = function(cb) {
	this.doneCallback = cb || noop;
	this.running = true;
	var that = this;
	this.queue.forEach(function(url) {
		that.parse(url);
	});
};

/* Register the url; returns true if URL wasn't registered before */
Scraper.prototype.registerUrl = function(url) {
	var ret = !this.addUrls[url];
	this.addUrls[url] = true;
	return ret;
};

Scraper.prototype.addUrl = function(url) {
	if(this.registerUrl(url)) {
		if(!this.running) {
			this.queue.push(url);
		} else {
			this.parse(url);
		}
	}
};
Scraper.prototype.addUrls = function(urls) {
	var that = this;
	urls.forEach(function(url) {
		that.addUrl(url);
	});
};

Scraper.prototype.parse = function(url) {
	this.started++;
	var that = this;
	loadUrlAsJquery(url, function(err, $) {
		that.pageHandler(url, $);
		that.completed++;
		if(that.started == that.completed) {
			that.doneCallback();
		}
	});
};

module.exports = Scraper;
