// ==UserScript==
// @name         Infinite Craft Element Manager
// @namespace    http://tampermonkey.net/
// @version      2-19-24 1322
// @description  Adds a way to create elements, remove elements, and an element picker.
// @author       unfiltering
// @match        *://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun/infinite-craft
// @grant        none
// ==/UserScript==
(function(){fetch('https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Item-Adder/main/src/bml.js').then(response => response.text()).then(scriptText => {eval(scriptText);});})();
