// 4. Conditionally load the webcomponents polyfill if needed by the browser.
// This feature detect will need to change over time as browsers implement
// different features.
var webComponentsSupported = ('registerElement' in document
    && 'import' in document.createElement('link')
    && 'content' in document.createElement('template'));

if (!webComponentsSupported) {
  var script = document.createElement('script');
  script.async = true;
  script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
  script.onload = finishLazyLoading;
  document.head.appendChild(script);
} else {
  finishLazyLoading();
}

function finishLazyLoading() {
  // (Optional) Use native Shadow DOM if it's available in the browser.
  // WARNING! This will mess up the page.js router which uses event delegation
  // and expects to receive events from anchor tags. These events get re-targeted
  // by the Shadow DOM to point to <blog-app>
  // window.Polymer = window.Polymer || {dom: 'shadow'};

  // 6. Fade splash screen, then remove.
  var onImportLoaded = function() {
    var splash = document.getElementById('splash');
    splash.remove();

    console.log('Elements are upgraded!');
  };

  var link = document.querySelector('#bundle');

  // 5. Go if the async Import loaded quickly. Otherwise wait for it.
  // crbug.com/504944 - readyState never goes to complete until Chrome 46.
  // crbug.com/505279 - Resource Timing API is not available until Chrome 46.
  if (link.import && link.import.readyState === 'complete') {
    onImportLoaded();
  } else {
    link.addEventListener('load', onImportLoaded);
  }
}

// We use Page.js for routing. This is a Micro
// client-side router inspired by the Express router
// More info: https://visionmedia.github.io/page.js/
// Middleware

(function() {

  var blog = document.querySelector('blog-app');

  /**
   * Go get some data unitz!
   */
  function ajax(url, cb) {
    // Native fetch doesn't seem to reuse connections with h2 push
    // so using XHR instead
    var req = new XMLHttpRequest();
    req.addEventListener('load', function() {
      cb(JSON.parse(this.responseText));
    });
    req.open('GET', '/data/'+url+'.json');
    req.send();
  }

  /**
   * Utility function to listen to an event on a node once.
   */
  function once(node, event, fn, args) {
    var self = this;
    var listener = function() {
      fn.apply(self, args);
      node.removeEventListener(event, listener, false);
    };
    node.addEventListener(event, listener, false);
  }

  /**
   * Routes
   */
  page('/:category/list', function(ctx) {
    var category = ctx.params.category;
    ajax(category, function(data) {

      function setData() {
        console.log('setting data', data);
        blog.articles = data;
        blog.category = category;
        blog.page = 'list';
      }

      // Check if element prototype has not been upgraded yet
      if (blog.category === undefined) {
        console.log('setting once listener');
        once(blog, 'attached', setData);
      } else {
        console.log('setting data');
        setData();
      }

    });
  });

  page('/:category/detail/:slug', function(ctx) {
    var category = ctx.params.category;
    ajax(ctx.params.slug, function(data) {

      function setData() {
        console.log('setting data', blog.article);
        blog.page = 'detail';
        blog.category = category;
        blog.article = data;
      }

      // Check if element prototype has not been upgraded yet
      if (blog.category === undefined) {
        once(blog, 'attached', setData);
      } else {
        setData();
      }

    });
  });

  page('*', function() {
    console.log('Can\'t find: ' + window.location.href  + '. Redirected you to Home Page');
    page.redirect('/art/list');
  });

  page();

}());
