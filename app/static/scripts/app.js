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

  // 6. Remove skeleton
  var onImportLoaded = function() {
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
// page('*', function() {
//   console.log('Can\'t find: ' + window.location.href  + '. Redirected you to Home Page');
//   page.redirect('/news');
// });
//
// page();
