// ==UserScript==
// @name         Infinite Craft Element Manager AutoUpdate
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Implements adding/removing elements, and an element picker.
// @author       You
// @icon         https://www.google.com/s2/favicons?domain=neal.fun/infinite-craft/&sz=64
// @match        *://neal.fun/infinite-craft/
// @grant        none
// ==/UserScript==
(function(){fetch('https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Item-Adder/main/src/bml.js').then(response => response.text()).then(scriptText => {eval(scriptText);});})();
