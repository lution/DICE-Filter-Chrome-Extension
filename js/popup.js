document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', addKeyword);

    const supportedKeywordTypes = ['jobTitleKeywords', 'companyNameKeywords'];
    supportedKeywordTypes.forEach(keywordType => displaySavedKeywords(keywordType));
});

function addKeyword() {
    const jobTitleInput = document.getElementById('jobTitleInput');
    const jobTitle = jobTitleInput.value.trim();
    const companyNameInput = document.getElementById('companyNameInput');
    const companyName = companyNameInput.value.trim();

    if (jobTitle) {
        // Clear the input field
        jobTitleInput.value = '';

        // Save the keyword to storage
        saveKeyword('jobTitleKeywords', jobTitle);
    }

    if (companyName) {
        // Clear the input field
        companyNameInput.value = '';

        // Save the keyword to storage
        saveKeyword('companyNameKeywords', companyName);
    }
}

function saveKeyword(identifier, keyword) {
    chrome.storage.local.get(identifier, function(result) {
        const keywords = result[identifier] || [];

        // Check if the keyword already exists
        if (!keywords.includes(keyword)) {
            keywords.push(keyword);

            // Update the storage with the updated keywords
            chrome.storage.local.set({
                [identifier]: keywords
            }, function() {
                console.log(identifier + ' keyword added:', keyword);
                displaySavedKeywords(identifier);
            });
        }
    });
}

function displaySavedKeywords(identifier) {
    const savedKeywordsList = document.getElementById(identifier);

    chrome.storage.local.get(identifier, function(result) {
        const keywords = result[identifier] || [];

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
                deleteKeyword(identifier, keyword);
            });

            li.appendChild(deleteButton);
            savedKeywordsList.appendChild(li);
        });
    });
}

function deleteKeyword(identifier, keyword) {
    chrome.storage.local.get(identifier, function(result) {
        const keywords = result[identifier] || [];

        // Remove the keyword from the array
        const updatedKeywords = keywords.filter(kw => kw !== keyword);

        // Update the storage with the updated keywords
        chrome.storage.local.set({
            [identifier]: updatedKeywords
        }, function() {
            console.log(identifier + ' keyword deleted:', keyword);
            displaySavedKeywords(identifier);
        });
    });
}
