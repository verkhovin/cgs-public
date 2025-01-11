const LEAD_ID_LOCALSTORAGE_ITEM_NAME = "cgs_lead_id"
document.addEventListener('DOMContentLoaded', () =>{
    const currentUrl = new URL(window.location.href);
    const sourceUrl = currentUrl.origin + currentUrl.pathname;
    const leadId = localStorage.getItem(LEAD_ID_LOCALSTORAGE_ITEM_NAME);
    const requestData = {
        sourceUrl: sourceUrl
    };
    
    if (leadId) {
        requestData.leadId = leadId;
    }
    fetch('https://cgs.azurewebsites.net/interactions/o', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }).then(response => response.json())
    .then(response => {
        if (response.lead_id) {
            localStorage.setItem(LEAD_ID_LOCALSTORAGE_ITEM_NAME, response.lead_id);
        }
    }).catch(error => {
        console.error("Could not send interaction", error);
    });
})
