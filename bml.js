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
    alert("Refresh to see changes!")
    console.log('Created item ' + itemEmoji + ' ' + itemName + '.');
}

function removeItem() {
    var itemNameToRemove = prompt("What's the name of the element you want to remove?");
    if (itemNameToRemove === null) {
        return; // Cancelled, do nothing
    }
    
    // Convert input name to lowercase
    itemNameToRemove = itemNameToRemove.toLowerCase();

    try {
        var storedData = localStorage.getItem('infinite-craft-data');
        var data = storedData ? JSON.parse(storedData) : {"elements": []};
    } catch (error) {
        console.error("Error parsing JSON data from localStorage:", error);
        return;
    }

    var indexToRemove = data.elements.findIndex(function(element) {
        // Convert stored item name to lowercase for comparison
        return element.text.toLowerCase() === itemNameToRemove;
    });

    if (indexToRemove !== -1) {
        data.elements.splice(indexToRemove, 1);
        localStorage.setItem('infinite-craft-data', JSON.stringify(data));
        alert("Refresh to see changes!")
        console.log('Removed item ' + itemNameToRemove + '.');
    } else {
        console.log('Item ' + itemNameToRemove + ' not found.');
    }
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
        alert("Refresh to see changes!")
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

    var removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Item';
    removeButton.style.marginRight = '5px';
    removeButton.addEventListener('click', removeItem);
    addButtonContainer.appendChild(removeButton);

    var resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.marginRight = '5px';
    resetButton.addEventListener('click', resetData);
    addButtonContainer.appendChild(resetButton);
}

// Initially add the buttons
addButton();
console.log("[Neal.fun Item Adder]: Thanks for using!");
