// ==UserScript==
// @name         Neal.Fun Item Adder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to add items to the list
// @author       You
// @icon         https://www.google.com/s2/favicons?domain=neal.fun/infinite-craft/&sz=64
// @match        *://neal.fun/infinite-craft/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addItem() {
        var itemName = prompt("What's the name of the element?");
        if (itemName === null) {
            return; // Cancelled, do nothing
        }
        var itemEmoji = prompt("What's the emoji for the element?");
        if (itemEmoji === null) {
            return; // Cancelled, do nothing
        }

        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {"elements": []};
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }

        data.elements.push({"text": itemName, "emoji": itemEmoji, "discovered": false});
        localStorage.setItem('infinite-craft-data', JSON.stringify(data));
        window.location.reload();
        console.log('Created item ' + itemEmoji + ' ' + itemName + '.');
    }

    function resetData() {
        if (confirm("Are you sure you want to reset to default?")) {
            var defaultData = {
                "elements": [
                    {"text": "Water", "emoji": "💧", "discovered": false},
                    {"text": "Fire", "emoji": "🔥", "discovered": false},
                    {"text": "Wind", "emoji": "🌬️", "discovered": false},
                    {"text": "Earth", "emoji": "🌍", "discovered": false}
                ]
            };
            localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
            window.location.reload();
            console.log("Data reset!")
        }
    }

    function addButton() {
        var addButtonContainer = document.querySelector('.add-item-button-container');
        if (!addButtonContainer) {
            addButtonContainer = document.createElement('div');
            addButtonContainer.className = 'add-item-button-container';
            addButtonContainer.style.position = 'fixed';
            addButtonContainer.style.bottom = '10px';
            addButtonContainer.style.left = '10px';
            document.body.appendChild(addButtonContainer);
        }

        var addButton = document.createElement('button');
        addButton.textContent = 'Add Item';
        addButton.style.marginRight = '5px';
        addButton.addEventListener('click', addItem);
        addButtonContainer.appendChild(addButton);

        var resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.marginRight = '5px';
        resetButton.addEventListener('click', resetData);
        addButtonContainer.appendChild(resetButton);
    }

    // Initially add the buttons
    addButton();
    console.log("[Neal.fun Item Adder]: Thanks for using!");
})();