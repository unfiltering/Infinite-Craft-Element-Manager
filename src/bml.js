(function() {
var randomElementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/randomElements.json";
var defaultData = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/defaultData.json";
var elementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/elements.json";
function setup() {
    if (!localStorage.getItem("setupPerformed")) {
        localStorage.setItem('setupPerformed', '0');
    }
    if (localStorage.getItem("setupPerformed") === "0") {
        localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
        localStorage.setItem('setupPerformed', '1');
        localStorage.setItem('elementManagerButtonVisibility', 'visible');
        localStorage.setItem('custom-data', '{"elements":[]}');
        alert("Hello!\n It seems it's the first time you're using our script!\nDon't worry, we'll walk you through!");
        alert("Controls:\nPress Q to open the Element Manager!\n");
        alert("Credits:\nThis menu was made by unfiltering.\nNorth Asian Teeth Epidemic.");
        window.location.reload();
    }
}
setup();
function loadElementsFromUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
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
function giveAllExcept(elementsData) {
    elementsData.forEach(function (categoryData) {
        if (categoryData.category.toLowerCase() === 'custom') {
            return;
        }
        categoryData.elements.forEach(function (element) {
            if (element.text.toLowerCase() !== 'fire' && element.text.toLowerCase() !== 'wind' && element.text.toLowerCase() !== 'earth' && element.text.toLowerCase() !== 'water') {
                addItemToLocalStorage(element.text, element.emoji, element.discovered);
            }
        });
    });
}
function showElementPicker(elementsData) {
    var existingElementPicker = document.getElementById('elementPickerContainer');
    if (existingElementPicker) {
        document.body.removeChild(existingElementPicker);
    } else {
        var elementPickerContainer = document.createElement('div');
        elementPickerContainer.id = 'elementPickerContainer';
        elementPickerContainer.style.position = 'fixed';
        elementPickerContainer.style.top = '50%';
        elementPickerContainer.style.left = '50%';
        elementPickerContainer.style.transform = 'translate(-50%, -50%)';
        elementPickerContainer.style.backgroundColor = 'white';
        elementPickerContainer.style.padding = '20px';
        elementPickerContainer.style.border = '2px solid #CDCDCD';
        elementPickerContainer.style.borderRadius = '18px';
        elementPickerContainer.style.height = '75%';
        elementPickerContainer.style.overflow = 'auto';
        elementPickerContainer.style.width = '42%';
        elementPickerContainer.style.textAlign = 'center';
        elementPickerContainer.style.msOverflowStyle = 'none';
        elementPickerContainer.style.scrollbarWidth = 'none';
        elementPickerContainer.style.webkitOverflowScrolling = 'touch';
        var closeButton = document.createElement('img');
        closeButton.src = 'https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/close.png';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.left = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '50px';
        closeButton.style.height = '50px';
        closeButton.addEventListener('click', function () {
            document.body.removeChild(elementPickerContainer);
        });
        elementPickerContainer.appendChild(closeButton);
        if (!Array.isArray(elementsData) || elementsData.length === 0) {
            console.error("Invalid elements data:", elementsData);
            return;
        }
        var optionsCategory = document.createElement('div');
        optionsCategory.style.textAlign = 'center';
        elementPickerContainer.appendChild(optionsCategory);
        var optionsCategoryTitle = document.createElement('h3');
        optionsCategoryTitle.textContent = 'Elements Manager';
        optionsCategoryTitle.style.marginTop = '0';
        optionsCategoryTitle.style.marginBottom = '10px';
        optionsCategory.appendChild(optionsCategoryTitle);
        var optionsList = document.createElement('ul');
        optionsList.style.listStyleType = 'none';
        optionsList.style.padding = '0';
        optionsCategory.appendChild(optionsList);
        var giveAllButton = document.createElement('li');
        giveAllButton.textContent = 'Give All';
        giveAllButton.style.cursor = 'pointer';
        giveAllButton.style.padding = '10px';
        giveAllButton.style.borderBottom = '1px solid #ccc';
        giveAllButton.style.marginBottom = '5px';
        giveAllButton.style.listStyleType = 'none';
        giveAllButton.addEventListener('click', function () {
            giveAllExcept(elementsData);
            document.body.removeChild(elementPickerContainer);
        });
        optionsList.appendChild(giveAllButton);
        var addElementButton = document.createElement('li');
        addElementButton.textContent = 'Add Element';
        addElementButton.style.cursor = 'pointer';
        addElementButton.style.padding = '10px';
        addElementButton.style.borderBottom = '1px solid #ccc';
        addElementButton.style.marginBottom = '5px';
        addElementButton.style.listStyleType = 'none';
        addElementButton.addEventListener('click', addItem);
        optionsList.appendChild(addElementButton);
        var removeElementButton = document.createElement('li');
        removeElementButton.textContent = 'Remove Element';
        removeElementButton.style.cursor = 'pointer';
        removeElementButton.style.padding = '10px';
        removeElementButton.style.borderBottom = '1px solid #ccc';
        removeElementButton.style.marginBottom = '5px';
        removeElementButton.style.listStyleType = 'none';
        removeElementButton.addEventListener('click', removeItem);
        optionsList.appendChild(removeElementButton);
        var addRandomElementButton = document.createElement('li');
        addRandomElementButton.textContent = 'Random Element';
        addRandomElementButton.style.cursor = 'pointer';
        addRandomElementButton.style.padding = '10px';
        addRandomElementButton.style.borderBottom = '1px solid #ccc';
        addRandomElementButton.style.marginBottom = '5px';
        addRandomElementButton.style.listStyleType = 'none';
        addRandomElementButton.addEventListener('click', addRandomItem);
        optionsList.appendChild(addRandomElementButton);
        var resetElementsButton = document.createElement('li');
        resetElementsButton.textContent = 'Reset Elements';
        resetElementsButton.style.cursor = 'pointer';
        resetElementsButton.style.padding = '10px';
        resetElementsButton.style.borderBottom = '1px solid #ccc';
        resetElementsButton.style.marginBottom = '5px';
        resetElementsButton.style.listStyleType = 'none';
        resetElementsButton.addEventListener('click', resetData);
        optionsList.appendChild(resetElementsButton);
        var resetAllButton = document.createElement('li');
        resetAllButton.textContent = 'Reset All';
        resetAllButton.style.cursor = 'pointer';
        resetAllButton.style.padding = '10px';
        resetAllButton.style.borderBottom = '1px solid #ccc';
        resetAllButton.style.marginBottom = '5px';
        resetAllButton.style.listStyleType = 'none';
        resetAllButton.addEventListener('click', resetAll);
        optionsList.appendChild(resetAllButton);
        var creditsButton = document.createElement('li');
        creditsButton.textContent = 'Credits';
        creditsButton.style.cursor = 'pointer';
        creditsButton.style.padding = '10px';
        creditsButton.style.borderBottom = '1px solid #ccc';
        creditsButton.style.marginBottom = '5px';
        creditsButton.style.listStyleType = 'none';
        creditsButton.addEventListener('click', showCredits);
        optionsList.appendChild(creditsButton);
        elementsData.forEach(function (categoryData) {
            var categorySection = document.createElement('div');
            categorySection.style.textAlign = 'center';
            elementPickerContainer.appendChild(categorySection);
            var categoryTitle = document.createElement('h3');
            categoryTitle.textContent = categoryData.category;
            categoryTitle.style.marginTop = '20px';
            categoryTitle.style.textAlign = 'center';
            categoryTitle.style.lineHeight = '1.5';
            categorySection.appendChild(categoryTitle);
            var itemList = document.createElement('ul');
            itemList.style.listStyleType = 'none';
            itemList.style.padding = '0';
            categorySection.appendChild(itemList);
            categoryData.elements.forEach(function (element) {
                var listItem = document.createElement('li');
                listItem.textContent = element.emoji + ' ' + element.text;
                listItem.style.cursor = 'pointer';
                listItem.style.padding = '10px';
                listItem.style.borderBottom = '1px solid #ccc';
                listItem.style.marginBottom = '5px';
                listItem.addEventListener('click', function () {
                    addItemToLocalStorage(element.text, element.emoji, element.discovered);
                    document.body.removeChild(elementPickerContainer);
                });
                itemList.appendChild(listItem);
            });
        });
        document.body.appendChild(elementPickerContainer);
    }
}
function loadRandomElementsFromUrl(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
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
    loadRandomElementsFromUrl(function (error, randomElementsData) {
        if (error) {
            console.error(error);
            return;
        }
        if (selectedIndices.length >= randomElementsData.length) {
            console.log("Resetting selection.");
            localStorage.removeItem('selectedIndices');
            selectedIndices = [];
        }
        var filteredIndices = randomElementsData.reduce(function (acc, _, index) {
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
        var customStoredData = localStorage.getItem('custom-data');
        var customData = customStoredData ? JSON.parse(customStoredData) : {
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
    customData.elements.push({
        "text": itemName,
        "emoji": itemEmoji,
        "discovered": isDiscovered
    });
    window.location.reload();
    try {
        localStorage.setItem('infinite-craft-data', JSON.stringify(data));
        localStorage.setItem('custom-data', JSON.stringify(customData));
    } catch (error) {
        console.error("Error storing data in localStorage:", error);
    }
}
function addItem() {
    var itemName = prompt("Please enter the name of the element:");
    var itemEmoji = prompt("Please enter the emoji for the element:");
    if (itemName && itemEmoji) {
        addItemToLocalStorage(itemName, itemEmoji, false);
    }
}
function removeItem() {
    var itemName = prompt("Please enter the name of the element you want to remove:");
    if (itemName) {
        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {
                "elements": []
            };
            var customStoredData = localStorage.getItem('custom-data');
            var customData = customStoredData ? JSON.parse(customStoredData) : {
                "elements": []
            };
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }
        data.elements = data.elements.filter(function (element) {
            return element.text.toLowerCase() !== itemName.toLowerCase();
        });
        customData.elements = customData.elements.filter(function (element) {
            return element.text.toLowerCase() !== itemName.toLowerCase();
        });
        try {
            localStorage.setItem('infinite-craft-data', JSON.stringify(data));
            localStorage.setItem('custom-data', JSON.stringify(customData));
        } catch (error) {
            console.error("Error storing data in localStorage:", error);
        }
    }
}
function resetData() {
    if (confirm("Are you sure you want to reset all elements?")) {
        var defaultData = {
            "elements": [{
                "text": "Water",
                "emoji": "💧",
                "discovered": false
            }, {
                "text": "Fire",
                "emoji": "🔥",
                "discovered": false
            }, {
                "text": "Wind",
                "emoji": "🌬️",
                "discovered": false
            }, {
                "text": "Earth",
                "emoji": "🌍",
                "discovered": false
            }]
        };
        localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
        alert("Data Reset!");
        window.location.reload();
    }
}
function resetAll() {
    if (confirm("Are you sure you want to reset all localstorage?")) {
        localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
        localStorage.setItem('setupPerformed', '0');
        localStorage.setItem('custom-data', '{"elements":[]}');
        window.location.reload();
    }
}
function showCredits() {
    window.open("https://github.com/unfiltering/Infinite-Craft-Element-Manager/");
}
function toggleMenu() {
    loadElementsFromUrl(elementsUrl, function (error, elementsData) {
        if (error) {
            console.error(error);
            return;
        }
        showElementPicker(elementsData);
    })
}
document.addEventListener('keydown', function (event) {
    if (event.key === 'q' || event.key === 'Q') {
        toggleMenu();
    }
});})();
