// ==UserScript==
// @name         Infinity Craft Element Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Implements adding/removing elements, and an element picker.
// @author       You
// @icon         https://www.google.com/s2/favicons?domain=neal.fun/infinite-craft/&sz=64
// @match        *://neal.fun/infinite-craft/
// @grant        none
// ==/UserScript==
(function() {
    var randomElementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/randomElements.json";
    var elementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/elements.json";
    function loadElementsFromUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var elementsData = JSON.parse(xhr.responseText);
                    callback(null, elementsData);
                } else {
                    callback("Failed to load elements: " + xhr.status);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    function showElementPicker(elementsData) {
        console.log("Elements Data:", elementsData); // Log elementsData to see its structure

        // Create the element picker container
        var elementPickerContainer = document.createElement('div');
        elementPickerContainer.style.position = 'fixed';
        elementPickerContainer.style.top = '50%';
        elementPickerContainer.style.left = '50%';
        elementPickerContainer.style.transform = 'translate(-50%, -50%)';
        elementPickerContainer.style.backgroundColor = 'white';
        elementPickerContainer.style.padding = '20px';
        elementPickerContainer.style.border = '2px solid black';
        elementPickerContainer.style.height = '80%';
        elementPickerContainer.style.overflow = 'auto';
        elementPickerContainer.style.width = '42%';
        elementPickerContainer.style.textAlign = 'center'; // Center align all content


        // Hide scrollbar
        elementPickerContainer.style.msOverflowStyle = 'none'; // IE and Edge
        elementPickerContainer.style.scrollbarWidth = 'none'; // Firefox

        // WebKit (Chrome, Safari, etc.)
        elementPickerContainer.style.webkitOverflowScrolling = 'touch'; // Momentum scrolling

        // Create and append the close button
        var closeButton = document.createElement('img');
        closeButton.src = 'https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/close.png';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.left = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '50px';
        closeButton.style.height = '50px';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(elementPickerContainer);
        });
        elementPickerContainer.appendChild(closeButton);

        // Check if elementsData is valid
        if (!Array.isArray(elementsData) || elementsData.length === 0) {
            console.error("Invalid elements data:", elementsData);
            return;
        }

        // Iterate over each category in elementsData
        elementsData.forEach(function(categoryData, index) {
            if (!categoryData || !Array.isArray(categoryData.elements) || categoryData.elements.length === 0) {
                console.error("Invalid category data:", categoryData);
                return;
            }

            // Create the category title
            var categoryTitle = document.createElement('h3');
            categoryTitle.textContent = categoryData.category;
            categoryTitle.style.marginTop = index === 0 ? '0' : '20px'; // Add margin only for non-first categories
            categoryTitle.style.textAlign = 'center'; // Center align category titles
            categoryTitle.style.lineHeight = '1.5'; // Set line height to match menu items
            elementPickerContainer.appendChild(categoryTitle);

            // Create the category list
            var categoryList = document.createElement('ul');
            categoryList.style.listStyleType = 'none';
            categoryList.style.padding = '0'; // Remove default padding
            elementPickerContainer.appendChild(categoryList);

            // Iterate over each element in the category
            categoryData.elements.forEach(function(element) {
                // Create the list item for each element
                var listItem = document.createElement('li');
                listItem.textContent = element.emoji + ' ' + element.text;
                listItem.style.cursor = 'pointer';
                listItem.style.padding = '10px';
                listItem.style.borderBottom = '1px solid #ccc';
                listItem.style.marginBottom = '5px'; // Add margin between items
                listItem.addEventListener('click', function() {
                    addItemToLocalStorage(element.text, element.emoji, element.discovered);
                    document.body.removeChild(elementPickerContainer);
                });
                categoryList.appendChild(listItem);
            });
        });

        // Append the element picker container to the body
        document.body.appendChild(elementPickerContainer);
    }

    function loadRandomElementsFromUrl(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var randomElementsData = JSON.parse(xhr.responseText);
                    console.log("Loaded all data! Ignore:\n" + randomElementsData);
                    callback(null, randomElementsData);
                } else {
                    callback("Failed to load random elements: " + xhr.status);
                }
            }
        };
        xhr.open("GET", randomElementsUrl, true);
        xhr.send();
    }


    function addRandomItem() {
        var storedIndices = localStorage.getItem('selectedIndices');
        var selectedIndices = storedIndices ? JSON.parse(storedIndices) : [];

        loadRandomElementsFromUrl(function(error, randomElementsData) {
            if (error) {
                console.error(error);
                return;
            }

            // Reset selection if all items have been chosen
            if (selectedIndices.length >= randomElementsData.length) {
                console.log("Resetting selection.");
                localStorage.removeItem('selectedIndices');
                selectedIndices = [];
            }

            // Filter out the indices that have already been selected
            var filteredIndices = randomElementsData.reduce(function(acc, _, index) {
                if (!selectedIndices.includes(index)) {
                    acc.push(index);
                }
                return acc;
            }, []);

            if (filteredIndices.length === 0) {
                console.log("All items have been selected.");
                return;
            }

            var randomIndex = Math.floor(Math.random() * filteredIndices.length);
            var selectedIndex = filteredIndices[randomIndex];
            var randomElement = randomElementsData[selectedIndex];
            addItemToLocalStorage(randomElement.text, randomElement.emoji, randomElement.discovered);

            // Store the index of the selected item
            selectedIndices.push(selectedIndex);
            localStorage.setItem('selectedIndices', JSON.stringify(selectedIndices));
        });
    }

    function addItemToLocalStorage(itemName, itemEmoji, isDiscovered) {
        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {
                "elements": []
            };
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }

        data.elements.push({
            "text": itemName,
            "emoji": itemEmoji,
            "discovered": isDiscovered
        });

        localStorage.setItem('infinite-craft-data', JSON.stringify(data));
        window.location.reload();
        console.log('Created item ' + itemEmoji + ' ' + itemName + '.');
    }

    function addItem() {
        var itemName = prompt("What's the name of the element?");
        if (itemName === null) {
            return; // Cancelled, do nothing
        }
        var itemEmoji = prompt("What's the emoji for " + itemName + "?");
        if (itemEmoji === null) {
            return; // Cancelled, do nothing
        }

        function capitalizeName(name) {
            var exceptions = ["or", "the", "and", "of", "as"];
            var words = name.toLowerCase().split(' ');
            for (var i = 0; i < words.length; i++) {
                if (i === 0 || !exceptions.includes(words[i])) {
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
            }
            return words.join(' ');
        }
        itemName = capitalizeName(itemName);
        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {
                "elements": []
            };
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }
        var existingItemIndex = data.elements.findIndex(function(element) {
            return element.text.toLowerCase() === itemName.toLowerCase();
        });
        var isDiscovered = false;
        if (existingItemIndex === -1) {
            var discoveryConfirmation = confirm("Is '" + itemEmoji + " " + itemName + "' a first discovery? (cancel for no)");
            if (discoveryConfirmation) {
                isDiscovered = true;
            }
        } else {
            isDiscovered = data.elements[existingItemIndex].discovered;
        }
        addItemToLocalStorage(itemName, itemEmoji, isDiscovered);
    }

    function removeItem() {
        var itemNameToRemove = prompt("What's the name of the element you want to remove?");
        if (itemNameToRemove === null) {
            return; // Cancelled, do nothing
        }
        itemNameToRemove = itemNameToRemove.toLowerCase();
        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {
                "elements": []
            };
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }
        var indexToRemove = data.elements.findIndex(function(element) {
            return element.text.toLowerCase() === itemNameToRemove;
        });
        if (indexToRemove !== -1) {
            data.elements.splice(indexToRemove, 1);
            localStorage.setItem('infinite-craft-data', JSON.stringify(data));
            window.location.reload();
            console.log('Removed item ' + itemNameToRemove + '.');
        } else {
            console.log('Item ' + itemNameToRemove + ' not found.');
        }
    }

    function resetData() {
        if (confirm("Are you sure you want to reset to the default elements?")) {
            var defaultData = {
                "elements": [{
                        "text": "Water",
                        "emoji": "💧",
                        "discovered": false
                    },
                    {
                        "text": "Fire",
                        "emoji": "🔥",
                        "discovered": false
                    },
                    {
                        "text": "Wind",
                        "emoji": "🌬️",
                        "discovered": false
                    },
                    {
                        "text": "Earth",
                        "emoji": "🌍",
                        "discovered": false
                    }
                ]
            };
            localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
            window.location.reload();
            console.log("Data reset!")
        }
    }

    function showCredits() {
        window.open("https://github.com/unfiltering/Infinite-Craft-Element-Manager/");
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

        // Create the HTML content
        addButtonContainer.innerHTML =
            `<button id="addElementButton" style="margin-right: 5px;">Add Element</button>
        <button id="removeElementButton" style="margin-right: 5px;">Remove Element</button>
        <button id="addRandomElementButton" style="margin-right: 5px;">Random Element</button>
        <button id="elementPickerButton" style="margin-right: 5px;">Element Picker</button>
        <button id="resetElementsButton" style="margin-right: 5px;">Reset Elements</button>
        <button id="creditsButton">Credits</button>`;

        // Add event listeners to the buttons
        document.getElementById('addElementButton').addEventListener('click', addItem);
        document.getElementById('removeElementButton').addEventListener('click', removeItem);
        document.getElementById('addRandomElementButton').addEventListener('click', addRandomItem);
        document.getElementById('elementPickerButton').addEventListener('click', function() {
            loadElementsFromUrl(elementsUrl, function(error, elementsData) {
                if (error) {
                    console.error(error);
                    return;
                }
                showElementPicker(elementsData);
            });
        });
        document.getElementById('resetElementsButton').addEventListener('click', resetData);
        document.getElementById('creditsButton').addEventListener('click', showCredits);
    }

    addButton();
    console.warn("[Infinity Craft Element Manager]: Loaded!");
})();
