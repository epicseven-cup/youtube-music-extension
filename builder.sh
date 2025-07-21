#!/bin/sh

init()
{
  mkdir -p "build/chrome"
  mkdir -p "build/chrome/scripts"


  mkdir -p "build/firefox"
  mkdir -p "build/firefox/scripts"

  cp "manifests/chrome.json" "build/chrome/manifest.json"
  cp "manifests/firefox.json" "build/firefox/manifest.json"

  rollup --config rollup.config.mjs --format umd
}

build_chrome(){
  cp "shared/content-script.js" "build/chrome/scripts/"
}


build_firefox(){
  cp "shared/content-script.js" "build/firefox/scripts/"
}

zip() {
  mkdir "out/"
  zip -r "out/chrome.zip" "build/chrome"
  zip -r "out/firefox.zip" "build/firefox"
}

clean_up(){
  rm -r "build/"
  rm -r "out/"
}


init
build_chrome
build_firefox

