(function() {
    var randomElementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/randomElements.json";

    function loadRandomElementsFromUrl(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var randomElementsData = JSON.parse(xhr.responseText);
                    console.log("Loaded all data! Ignore:\n" + randomElementsData)
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
        var addButton = document.createElement('button');
        addButton.textContent = 'Add Element';
        addButton.style.marginRight = '5px';
        addButton.addEventListener('click', addItem);
        addButtonContainer.appendChild(addButton);
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Element';
        removeButton.style.marginRight = '5px';
        removeButton.addEventListener('click', removeItem);
        addButtonContainer.appendChild(removeButton);
        var resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Elements';
        resetButton.style.marginRight = '5px';
        resetButton.addEventListener('click', resetData);
        addButtonContainer.appendChild(resetButton);
        var addRandomButton = document.createElement('button');
        addRandomButton.textContent = 'Random Element';
        addRandomButton.style.marginRight = '5px';
        addRandomButton.addEventListener('click', addRandomItem);
        addButtonContainer.appendChild(addRandomButton);
        var creditsButton = document.createElement('button');
        creditsButton.textContent = 'Credits';
        creditsButton.style.marginRight = '5px';
        creditsButton.addEventListener('click', showCredits);
        addButtonContainer.appendChild(creditsButton);
    }
    addButton();
    console.log("[Neal.fun Element Manager]: Loaded!");
})();
