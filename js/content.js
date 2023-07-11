// Retrieve the saved keywords from storage
function applyFiltering() {
    chrome.storage.local.get('keywords', function(result) {
        var keywords = result.keywords || [];
        doFilter(keywords);
    });
}

// Function to apply the filtering logic
function doFilter(keywords) {
    console.log("[DEBUG] filtering keywords ");
    console.log(keywords);
    // Get the search result container
    const searchResultsContainer = document.getElementById('searchDisplay-div');


    // Get the search result elements within the container
    const searchResults = searchResultsContainer.querySelectorAll('.search-card');

    // Iterate over the search result elements and hide those that don't match the keywords
    var cnt = 0;
    for (const result of searchResults) {
        const jobTitleElement = result.querySelector('.card-title-link');
        const jobTitle = jobTitleElement.textContent.toLowerCase();

        // Check if the job title contains any of the keywords
        const isMatchingKeyword = keywords.some(keyword => jobTitle.includes(keyword.toLowerCase()));

        if (isMatchingKeyword) {
            result.style.display = 'none';
            cnt++;
        }
    }
    console.log(`[DEBUG] filtered ${cnt} jobs`);
}

// Function to observe changes in the DOM
function observeDOM() {
    // Target the search result container parent element
    const parentElement = document.body;

    // Create a new MutationObserver
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.id === 'searchDisplay-div') {
                    // If the desired div is added to the DOM, stop observing and apply the filtering logic
                    observer.disconnect();
                    applyFiltering();
                    observeContentChanges(document.getElementById('searchDisplay-div'));
                    return;
                }
            }
        }
    });

    // Configure and start observing
    observer.observe(parentElement, {
        childList: true,
        subtree: true
    });
}

// Function to observe changes in the content of searchDisplay-div
function observeContentChanges(searchDisplayDiv) {
    const observer = new MutationObserver(function(mutations) {
        observer.disconnect();
        applyFiltering();
        observer.observe(searchDisplayDiv, {
            childList: true,
            subtree: true
        });
    });

    // Start observing the searchDisplay-div for content changes
    observer.observe(searchDisplayDiv, {
        childList: true,
        subtree: true
    });
}

// Call the observeDOM function to start observing changes in the DOM
observeDOM();
