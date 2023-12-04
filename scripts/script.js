// To Do List
    // 1. allow user to input a search
    // 2. allow user to select a colour
    // 3. display images based on these 2 inputs

// Pseudocode
    // Create event listener for the form submit
    // Create event listener for the colour options (dropdown or radio buttons?)
    // Get inputs and use that to...
        // Make API call to Pexels
    // Create the html...
        // to display the images
        // to change the background colour
    // Append the html to the page


// namespace
const picAColour = {};


// array of colours
const colours = [
    `red`,
    `orange`, 
    `yellow`, 
    `green`, 
    `turquoise`, 
    `blue`, 
    `violet`, 
    `pink`, 
    `brown`, 
    `black`, 
    `gray`, 
    `white`
];


// cache jquery selectors
const $select = $(`select`);
const $searchInput = $(`#searchInput`);
const $body = $(`body`);
const $results = $(`.results`);
const $loadingOverlay = $(`.loading-overlay`);
const $form = $(`form`);


// pexels api key
picAColour.apiKey = `563492ad6f91700001000001b97355808adf488898873ed470925318`;


// populate dropdown with colour values in array
picAColour.populateSelect = function() {
    colours.forEach((colour) => {

        const selectHTML = `<option value="${colour}">${colour}</option>`

        $select.append(selectHTML);
    });
};


// get user input for image search
picAColour.getUserInput = function(e) {
    e.preventDefault();
    picAColour.query = $searchInput.val();
    picAColour.getImages();
};


// event listener for colour selection
$select.on(`change`, function() {
    picAColour.colourSelection = $(`select option:selected`).val();
    console.log(picAColour.colourSelection);
});


// change background colour based on user selection
picAColour.changeColour = function(e) {
    e.preventDefault();
    colours.forEach((colour) => {
        if (picAColour.colourSelection === colour) {
            $body
                .css(`background`, `linear-gradient(45deg, ${colour}, white)`)
                .css(`background-attachment`, `fixed`)
                .css(`background-size`, `200% 200%`)
                .css(`animation`, `gradient 15s ease infinite`)
                .css(`height`, `100vh`);
        };
    });
};


// api call based on user input
picAColour.getImages = function() {
    $.ajax({
        url: `https://api.pexels.com/v1/search`,
        method: `GET`,
        dataType: `json`,
        headers: {
            Authorization: picAColour.apiKey,
        },
        data: {
            query: picAColour.query,
            color: picAColour.colourSelection,
            per_page: 60
        },
    }).then(function(response) {
        $results.empty();
        picAColour.displayImages(response.photos);
    }).catch(function() {
        $results.empty();
        picAColour.displayErrorMsg();
    });
};


// error handling a failed api call
picAColour.displayErrorMsg = function() {
    const errorMsg = `

        <p class="errorMsg">Whoops something went wrong with your search. Please try again later.</p>

    `;
    $results.append(errorMsg);
};


// display image results on page
picAColour.displayImages = function(photos) {
    photos.forEach((photo) => {
        
        const imageHTML = `
            
            <div class="pexelResult">
                <div class="imageContainer">
                    <a href="${photo.src.original}" target="_blank"><img src="${photo.src.medium}" alt="${picAColour.query}, taken by ${photo.photographer}"></a>
                </div>
                <p>Photo by <strong>${photo.photographer}</strong> on <a href="${photo.photographer_url}" target="_blank">Pexels</a></p>
            </div>

        `;

        $results.append(imageHTML);
    });
};


// loading overlay
picAColour.loading = function() {
    $(document)
    .ajaxSend(() => {
        $loadingOverlay.fadeIn(300);
    })
    .ajaxStop(() => {
        setTimeout(() => {
            $loadingOverlay.fadeOut(300);
        }, 500);
    });
};


// init
picAColour.init = function() {
    picAColour.populateSelect();
    $form
        .on(`submit`, picAColour.getUserInput)
        .on(`submit`, picAColour.changeColour)
        .on(`submit`, picAColour.loading);
};


// document ready
$(document).ready(function() {
    picAColour.init();
});