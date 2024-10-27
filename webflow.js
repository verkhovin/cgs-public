document.addEventListener('DOMContentLoaded', function() {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    const templateDiv = document.getElementById('cgs_template');
    if (!templateDiv) {
        console.error('CGS Template element not found');
        return;
    }

    // Check if the 'cgs_enabled=true' query parameter is present
    if (!currentUrl.searchParams.get('cgs_enabled') || currentUrl.searchParams.get('cgs_enabled') !== 'true') {
        console.log('CGS is not enabled for this page.');
        return;
    }

    // Get the current URL without query parameters as the source_url
    let sourceUrl = currentUrl.origin + currentUrl.pathname;

    let leadId = localStorage.getItem('lead_id');

    // Create the request payload
    let requestData = {
        source_url: sourceUrl
    };

    // If lead_id exists, add it to the requestData
    if (leadId) {
        requestData.lead_id = leadId;
    }
    
    // API request to fetch recommended articles
    fetch('https://cgs.azurewebsites.net/articles/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(response => {
        if (response.lead_id) {
            localStorage.setItem('lead_id', response.lead_id);
        }

        // Find the template div
        const templateDiv = document.getElementById('cgs_template');
        if (!templateDiv) {
            console.error('Template element not found');
            return;
        }

        // Store the template content
        const templateContent = templateDiv.innerHTML;

        // Clear the template div to insert new content later
        templateDiv.innerHTML = '';

        // Create a document fragment to optimize DOM manipulation
        const fragment = document.createDocumentFragment();

        // Loop through the API response data
        response.recommendations.forEach(article => {
            // Create a new div for each article
            const newElement = document.createElement('div');
            
            // Replace the placeholders in the template content
            newElement.innerHTML = templateContent
                .replace('http://{{link}}', article.link || '#')
                .replace('{{subtitle}}', article.subtitle)
                .replace('{{title}}', article.title);

            // Append the new element to the fragment
            fragment.appendChild(newElement);
        });

        // Append the fragment with all new elements to the template div
        templateDiv.appendChild(fragment);
        templateDiv.removeAttribute("hidden");
    })
    .catch(error => {
        console.error('Error fetching recommended articles:', error);
    });
});
