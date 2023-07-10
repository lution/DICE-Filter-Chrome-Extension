document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', addKeyword);

    displaySavedKeywords();
});

function addKeyword() {
    const keywordInput = document.getElementById('keywordInput');
    const keyword = keywordInput.value.trim();

    if (keyword) {
        // Clear the input field
        keywordInput.value = '';

        // Save the keyword to storage
        saveKeyword(keyword);
    }
}

function saveKeyword(keyword) {
    chrome.storage.local.get('keywords', function(result) {
        const keywords = result.keywords || [];

        // Check if the keyword already exists
        if (!keywords.includes(keyword)) {
            keywords.push(keyword);

            // Update the storage with the updated keywords
            chrome.storage.local.set({
                keywords: keywords
            }, function() {
                console.log('Keyword added:', keyword);
                displaySavedKeywords();
            });
        }
    });
}

function displaySavedKeywords() {
    const savedKeywordsList = document.getElementById('savedKeywords');

    chrome.storage.local.get('keywords', function(result) {
        const keywords = result.keywords || [];

        // Clear existing keywords
        savedKeywordsList.innerHTML = '';

        // Display each keyword in a list item
        keywords.forEach(keyword => {
            const li = document.createElement('li');
            li.textContent = keyword;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                // Delete the keyword from storage and update the display
                deleteKeyword(keyword);
            });

            li.appendChild(deleteButton);
            savedKeywordsList.appendChild(li);
        });
    });
}

function deleteKeyword(keyword) {
    chrome.storage.local.get('keywords', function(result) {
        const keywords = result.keywords || [];

        // Remove the keyword from the array
        const updatedKeywords = keywords.filter(kw => kw !== keyword);

        // Update the storage with the updated keywords
        chrome.storage.local.set({
            keywords: updatedKeywords
        }, function() {
            console.log('Keyword deleted:', keyword);
            displaySavedKeywords();
        });
    });
}