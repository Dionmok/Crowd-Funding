/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");
// create a function that adds all data from the games array to the page
function addGamesToPage(GAMES_JSON) {
    // loop over each item in the data
    for (const game of GAMES_JSON) {
        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");
        // add the class game-card to the list
        gameCard.classList.add("game-card");
        // set the inner HTML using a template literal to display some info 
        // about each game
        gameCard.innerHTML = `
        <img class="game-img" src="${game.img}" alt="${game.name}" />
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <p>Pledged: $${game.pledged}</p>
        <p>Goal: $${game.goal}</p>
        <p>Backers: ${game.backers}</p>
      `;

        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")


        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let backers_array = []
for(const game of GAMES_JSON){
    backers_array = [...backers_array, game["backers"]]
}

let backers_sum = backers_array.reduce((accumulator, current_value) => {
    return accumulator + current_value 
}, 0) 
// set the inner HTML using a template literal and toLocaleString to get a number with commas

contributionsCard.innerHTML = `
<p>${backers_sum.toLocaleString('en-US')}</p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let pledged_array = []
for(const game of GAMES_JSON){
    pledged_array = [...pledged_array, game["pledged"]]
}

let pledged_sum = pledged_array.reduce((accumulator, current_value) => {
    return accumulator + current_value 
}, 0) 

// set inner HTML using template literal
raisedCard.innerHTML = `
<p>$${pledged_sum.toLocaleString('en-US')}</p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const game_nums = GAMES_JSON.length

gamesCard.innerHTML = `
<p>${game_nums}</p>
`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

let unfunded = []
// show only games that do not yet have enough funding
function filterUnfundedOnly(GAMES_JSON) {
   // deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have not yet met their goal
    unfunded = GAMES_JSON.filter((game) => {
        return game["pledged"] < game["goal"]
    });
    // use the function we previously created to add the unfunded games to the DOM
    //addGamesToPage(unfunded);
}
filterUnfundedOnly(GAMES_JSON);

// show only games that are fully funded
function filterFundedOnly(GAMES_JSON) {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const funded = GAMES_JSON.filter((game) => {
        return game["pledged"] >= game["goal"]
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(funded);
}

// show all games
function showAllGames(GAMES_JSON) {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click",() => {
    deleteChildElements(gamesContainer);
    addGamesToPage(unfunded);
});

fundedBtn.addEventListener("click",() => {
    filterFundedOnly(GAMES_JSON)
});

allBtn.addEventListener("click",() => {
    showAllGames(GAMES_JSON)
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedCount = unfunded.reduce((accumulator)=>{
    return accumulator + 1
},0)
console.log("Totla Unfunded:",unfunded)
// create a string that explains the number of unfunded games using the ternary operator
const displayStr1 = `A total of $${pledged_sum.toLocaleString('en-US')} has been raised for ${game_nums} games. Currently, 1 game 
remains unfunded. We need your help to fund these amazing games! `

const displayStr2 = `A total of $${pledged_sum.toLocaleString('en-US')} has been raised for ${game_nums} games. Currently, ${unfundedCount} games 
remain unfunded. We need your help to fund these amazing games! `
// create a new DOM element containing the template string and append it to the description container
const finalStr = unfundedCount > 1 ? displayStr2 : displayStr1;
descriptionContainer.innerHTML +=`
<p>${finalStr}<\p>
`

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [item1, item2] = [...sortedGames];


// create a new element to hold the name of the top pledge game, then append it to the correct element

firstGameContainer.innerHTML +=`
<p1>${item2["name"]}<\p1>
`


// do the same for the runner up item
secondGameContainer.innerHTML +=`
<p1>${item2["name"]}<\p1>
`