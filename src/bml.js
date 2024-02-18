(function() {
	var randomElementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/randomElements.json";
	var elementsUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/elements.json";
	var defaultDataUrl = "https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/defaultData.json";
	var defaultData = {
		"elements": []
	};
	fetch(defaultDataUrl).then(response => response.json()).then(data => {
		// Assuming 'data' is an array of objects
		defaultData = data; // Assign the fetched data to 'elements' key
		console.log('Default data with fetched elements:', defaultData);
	}).catch(error => {
		console.error('Error fetching JSON:', error);
	});

	function setup() {
		// Check if the key "setupPerformed" exists
		if(!localStorage.getItem("setupPerformed")) {
			// If it doesn't exist, create it and set its value to "0"
			localStorage.setItem('setupPerformed', '0');
		}
		// Check if the value of "setupPerformed" is "0"
		if(localStorage.getItem("setupPerformed") === "0") {
			// Your code to perform when the condition is met
			// Update localStorage to set the value to "1" to indicate setup is performed
			localStorage.setItem('setupPerformed', '1');
			// Perform additional actions
			localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
			localStorage.setItem('custom-data', JSON.stringify({
				"elements": []
			}));
			window.location.reload();
			console.log("Data reset!");
		}
	}
	// Call the setup function
	setup();

	function loadElementsFromUrl(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if(xhr.status === 200) {
					var elementsData = JSON.parse(xhr.responseText);
					callback(null, elementsData);
				}
				else {
					callback("Failed to load elements: " + xhr.status);
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	}

	function giveAllExcept(elementsData) {
		elementsData.forEach(function(categoryData) {
			// Skip the "Custom" category
			if(categoryData.category.toLowerCase() === 'custom') {
				return;
			}
			categoryData.elements.forEach(function(element) {
				// Check if the element is not fire, wind, earth, or water
				if(element.text.toLowerCase() !== 'fire' && element.text.toLowerCase() !== 'wind' && element.text.toLowerCase() !== 'earth' && element.text.toLowerCase() !== 'water') {
					addItemToLocalStorage(element.text, element.emoji, element.discovered);
				}
			});
		});
	}

	function showElementPicker(elementsData) {
		// Remove existing element picker container if it exists
		var existingElementPicker = document.getElementById('elementPickerContainer');
		if(existingElementPicker) {
			document.body.removeChild(existingElementPicker);
		}
		else {
			// Create the element picker container
			var elementPickerContainer = document.createElement('div');
			elementPickerContainer.id = 'elementPickerContainer'; // Assign id to the container
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
			elementPickerContainer.style.border = '2px solid #CDCDCD'; // Change border color
			elementPickerContainer.style.borderRadius = '10px'; // Round corners
			// Hide scrollbar
			elementPickerContainer.style.msOverflowStyle = 'none'; // IE and Edge
			elementPickerContainer.style.scrollbarWidth = 'none'; // Firefox
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
			if(!Array.isArray(elementsData) || elementsData.length === 0) {
				console.error("Invalid elements data:", elementsData);
				return;
			}
			var optionsCategory = document.createElement('div');
			optionsCategory.style.textAlign = 'center'; // Center align Options category
			elementPickerContainer.appendChild(optionsCategory);
			// Create the category title for Options
			var optionsCategoryTitle = document.createElement('h3');
			optionsCategoryTitle.textContent = 'Options';
			optionsCategoryTitle.style.marginTop = '0'; // No margin for the first category
			optionsCategoryTitle.style.marginBottom = '10px'; // Add margin bottom
			optionsCategory.appendChild(optionsCategoryTitle);
			// Create the list for Options
			var optionsList = document.createElement('ul');
			optionsList.style.listStyleType = 'none';
			optionsList.style.padding = '0'; // Remove default padding
			optionsCategory.appendChild(optionsList);
			// Create the "Give All" button
			var giveAllButton = document.createElement('li');
			giveAllButton.textContent = 'Give All';
			giveAllButton.style.cursor = 'pointer';
			giveAllButton.style.padding = '10px';
			giveAllButton.style.borderBottom = '1px solid #ccc';
			giveAllButton.style.marginBottom = '5px'; // Add margin between items
			giveAllButton.style.listStyleType = 'none'; // Remove bullet point
			giveAllButton.addEventListener('click', function() {
				giveAllExcept(elementsData);
				document.body.removeChild(elementPickerContainer);
			});
			optionsList.appendChild(giveAllButton);
			// Create the "Add Element" button
			var addElementButton = document.createElement('li');
			addElementButton.textContent = 'Add Element';
			addElementButton.style.cursor = 'pointer';
			addElementButton.style.padding = '10px';
			addElementButton.style.borderBottom = '1px solid #ccc';
			addElementButton.style.marginBottom = '5px'; // Add margin between items
			addElementButton.style.listStyleType = 'none'; // Remove bullet point
			addElementButton.addEventListener('click', addItem);
			optionsList.appendChild(addElementButton);
			// Create the "Remove Element" button
			var removeElementButton = document.createElement('li');
			removeElementButton.textContent = 'Remove Element';
			removeElementButton.style.cursor = 'pointer';
			removeElementButton.style.padding = '10px';
			removeElementButton.style.borderBottom = '1px solid #ccc';
			removeElementButton.style.marginBottom = '5px'; // Add margin between items
			removeElementButton.style.listStyleType = 'none'; // Remove bullet point
			removeElementButton.addEventListener('click', removeItem);
			optionsList.appendChild(removeElementButton);
			// Create the "Add Random Element" button
			var addRandomElementButton = document.createElement('li');
			addRandomElementButton.textContent = 'Random Element';
			addRandomElementButton.style.cursor = 'pointer';
			addRandomElementButton.style.padding = '10px';
			addRandomElementButton.style.borderBottom = '1px solid #ccc';
			addRandomElementButton.style.marginBottom = '5px'; // Add margin between items
			addRandomElementButton.style.listStyleType = 'none'; // Remove bullet point
			addRandomElementButton.addEventListener('click', addRandomItem);
			optionsList.appendChild(addRandomElementButton);
			// Create the "Reset Elements" button
			var resetElementsButton = document.createElement('li');
			resetElementsButton.textContent = 'Reset Elements';
			resetElementsButton.style.cursor = 'pointer';
			resetElementsButton.style.padding = '10px';
			resetElementsButton.style.borderBottom = '1px solid #ccc';
			resetElementsButton.style.marginBottom = '5px'; // Add margin between items
			resetElementsButton.style.listStyleType = 'none'; // Remove bullet point
			resetElementsButton.addEventListener('click', resetData);
			optionsList.appendChild(resetElementsButton);
			// Create the "Credits" button
			var creditsButton = document.createElement('li');
			creditsButton.textContent = 'Credits';
			creditsButton.style.cursor = 'pointer';
			creditsButton.style.padding = '10px';
			creditsButton.style.borderBottom = '1px solid #ccc';
			creditsButton.style.marginBottom = '5px'; // Add margin between items
			creditsButton.style.listStyleType = 'none'; // Remove bullet point
			creditsButton.addEventListener('click', showCredits);
			optionsList.appendChild(creditsButton);
			// Iterate through categories and create sections for each
			elementsData.forEach(function(categoryData) {
				var categorySection = document.createElement('div');
				categorySection.style.textAlign = 'center'; // Center align category section
				elementPickerContainer.appendChild(categorySection);
				// Create the category title
				var categoryTitle = document.createElement('h3');
				categoryTitle.textContent = categoryData.category; // Set category name as title
				categoryTitle.style.marginTop = '20px'; // Add margin top for category title
				categoryTitle.style.textAlign = 'center'; // Center align category titles
				categoryTitle.style.lineHeight = '1.5'; // Set line height to match menu items
				categorySection.appendChild(categoryTitle);
				// Create the list for elements in the category
				var itemList = document.createElement('ul');
				itemList.style.listStyleType = 'none';
				itemList.style.padding = '0'; // Remove default padding
				categorySection.appendChild(itemList);
				// Iterate over elements in the category and create list items
				categoryData.elements.forEach(function(element) {
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
					itemList.appendChild(listItem);
				});
			});
			// Append the element picker container
			document.body.appendChild(elementPickerContainer);
		}
	}

	function loadRandomElementsFromUrl(callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if(xhr.status === 200) {
					var randomElementsData = JSON.parse(xhr.responseText);
					console.log("Loaded all data! Ignore:\n" + randomElementsData);
					callback(null, randomElementsData);
				}
				else {
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
			if(error) {
				console.error(error);
				return;
			}
			// Reset selection if all items have been chosen
			if(selectedIndices.length >= randomElementsData.length) {
				console.log("Resetting selection.");
				localStorage.removeItem('selectedIndices');
				selectedIndices = [];
			}
			// Filter out the indices that have already been selected
			var filteredIndices = randomElementsData.reduce(function(acc, _, index) {
				if(!selectedIndices.includes(index)) {
					acc.push(index);
				}
				return acc;
			}, []);
			if(filteredIndices.length === 0) {
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

	function addItem() {
		var itemName = prompt("What's the name of the element?");
		if(itemName === null) {
			return; // Cancelled, do nothing
		}
		var itemEmoji = prompt("What's the emoji for " + itemName + "?");
		if(itemEmoji === null) {
			return; // Cancelled, do nothing
		}

		function capitalizeName(name) {
			var exceptions = ["or", "the", "and", "of", "as"];
			var words = name.toLowerCase().split(' ');
			for(var i = 0; i < words.length; i++) {
				if(i === 0 || !exceptions.includes(words[i])) {
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
			var customStoredData = localStorage.getItem('custom-data');
			var customData = customStoredData ? JSON.parse(customStoredData) : {
				"elements": []
			};
		}
		catch (error) {
			console.error("Error parsing JSON data from localStorage:", error);
			return;
		}
		var existingItemIndex = data.elements ? data.elements.findIndex(function(element) {
			return element.text.toLowerCase() === itemName.toLowerCase();
		}) : -1;
		var isDiscovered = false;
		if(existingItemIndex === -1) {
			var discoveryConfirmation = confirm("Is '" + itemEmoji + " " + itemName + "' a first discovery? (cancel for no)");
			if(discoveryConfirmation) {
				isDiscovered = true;
			}
		}
		else {
			isDiscovered = data.elements[existingItemIndex].discovered;
		}
		addItemToLocalStorage(itemName, itemEmoji, isDiscovered);
	}

	function addItemToLocalStorage(itemName, itemEmoji, isDiscovered) {
		try {
			var storedData = localStorage.getItem('infinite-craft-data');
			var data = storedData ? JSON.parse(storedData) : {
				"elements": []
			};
			console.log('Parsed data:', data); // Log parsed data
			var customStoredData = localStorage.getItem('custom-data');
			var customData = customStoredData ? JSON.parse(customStoredData) : {
				"elements": []
			};
		}
		catch (error) {
			console.error("Error parsing JSON data from localStorage:", error);
			return;
		}
		data.elements = data.elements || []; // Ensure data.elements is an array
		console.log('Data elements:', data.elements); // Log data.elements
		customData.elements = customData.elements || []; // Ensure customData.elements is an array
		console.log('Custom data elements:', customData.elements); // Log customData.elements
		data.elements = data.elements || [];
		customData.elements = customData.elements || [];
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
		localStorage.setItem('infinite-craft-data', JSON.stringify(data));
		localStorage.setItem('custom-data', JSON.stringify(customData));
		window.location.reload();
		console.log('Created item ' + itemEmoji + ' ' + itemName + '.');
	}

	function removeItem() {
		var itemNameToRemove = prompt("What's the name of the element you want to remove?");
		if(itemNameToRemove === null) {
			return; // Cancelled, do nothing
		}
		itemNameToRemove = itemNameToRemove.toLowerCase();
		try {
			var storedData = localStorage.getItem('infinite-craft-data');
			var data = storedData ? JSON.parse(storedData) : {
				"elements": []
			};
			var customStoredData = localStorage.getItem('custom-data');
			var customData = customStoredData ? JSON.parse(customStoredData) : {
				"elements": []
			};
		}
		catch (error) {
			console.error("Error parsing JSON data from localStorage:", error);
			return;
		}
		var indexToRemove = data.elements.findIndex(function(element) {
			return element.text.toLowerCase() === itemNameToRemove;
		});
		if(indexToRemove !== -1) {
			data.elements.splice(indexToRemove, 1);
			localStorage.setItem('infinite-craft-data', JSON.stringify(data));
			window.location.reload();
			console.log('Removed item ' + itemNameToRemove + ' from infinite-craft-data.');
		}
		else {
			console.log('Item ' + itemNameToRemove + ' not found in infinite-craft-data.');
		}
		var customIndexToRemove = customData.elements.findIndex(function(element) {
			return element.text.toLowerCase() === itemNameToRemove;
		});
		if(customIndexToRemove !== -1) {
			customData.elements.splice(customIndexToRemove, 1);
			localStorage.setItem('custom-data', JSON.stringify(customData));
			console.log('Removed item ' + itemNameToRemove + ' from custom-data.');
		}
		else {
			console.log('Item ' + itemNameToRemove + ' not found in custom-data.');
		}
	}

	function resetData() {
		if(confirm("Are you sure you want to reset to the default elements?")) {
			localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
			localStorage.setItem('custom-data', JSON.stringify({
				"elements": []
			}));
			window.location.reload();
			console.log("Data reset!")
		}
	}

	function showCredits() {
		window.open("https://github.com/unfiltering/Infinite-Craft-Element-Manager/");
	}

	function addButton() {
		var addButtonContainer = document.querySelector('.add-item-button-container');
		if(!addButtonContainer) {
			addButtonContainer = document.createElement('div');
			addButtonContainer.className = 'add-item-button-container';
			addButtonContainer.style.position = 'fixed';
			addButtonContainer.style.bottom = '10px';
			addButtonContainer.style.left = '10px';
			document.body.appendChild(addButtonContainer);
		}
		// Create the HTML content
		addButtonContainer.innerHTML = `<button id="elementPickerButton" style="margin-right: 5px; background-image: url('https://raw.githubusercontent.com/unfiltering/Infinite-Craft-Element-Manager/main/src/open.png'); background-size: cover; width: 50px; height: 50px; border: 1px solid #CDCDCD; border-radius: 5px;"></button>`;
		// Add event listener to the dynamically created button
		var elementPickerButton = document.getElementById('elementPickerButton');
		if(elementPickerButton) {
			elementPickerButton.addEventListener('click', function() {
				loadElementsFromUrl(elementsUrl, function(error, elementsData) {
					if(error) {
						console.error(error);
						return;
					}
					showElementPicker(elementsData);
					console.log("Elements Data:", elementsData); // Log elementsData to see its structure
				});
			});
		}
		// Add event listeners to other buttons if they exist
		var resetElementsButton = document.getElementById('resetElementsButton');
		if(resetElementsButton) {
			resetElementsButton.addEventListener('click', resetData);
		}
		var creditsButton = document.getElementById('creditsButton');
		if(creditsButton) {
			creditsButton.addEventListener('click', showCredits);
		}
	}

	function toggleMenu() {
		loadElementsFromUrl(elementsUrl, function(error, elementsData) {
			if(error) {
				console.error(error);
				return;
			}
			showElementPicker(elementsData);
		})
	}
	document.addEventListener('keydown', function(event) {
		if(event.key === 'q' || event.key === 'Q') {
			toggleMenu();
		}
	});
	addButton();
	loadElementsFromUrl(elementsUrl, function(error, elementsData) {
		console.log("Elements Data:", elementsData);
	});
	console.log('Infinite Craft Element Manager script loaded successfully.');
})();
