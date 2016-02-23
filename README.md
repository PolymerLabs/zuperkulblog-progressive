# Zuperkülblog (Progressive)

A Progressive Web App built with Polymer.

## How it was built

* [Chrome DevSummit 2015 video](https://www.youtube.com/watch?v=g7f1Az5fxgU)
* [slides](https://speakerdeck.com/robdodson/building-progressive-web-apps-with-polymer)

## Setup

This app requires the [Python App Engine SDK](https://cloud.google.com/appengine/downloads?hl=en).
After downloading, open the App Engine Launcher and let it setup symlinks (it should prompt you).

```
git clone https://github.com/PolymerLabs/zuperkulblog-progressive
cd zuperkulblog-progressive
npm install && bower install
gulp
dev_appserver.py .
```
