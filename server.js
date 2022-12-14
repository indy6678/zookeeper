// declarations
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require("./data/animals.json");

// sets up a function to handle filter functionality
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];

  // note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    //save personalityTraits as a dedicated array
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits]; //if personalityTraits is a string, place it into a new array and save.
    } else {
      personalityTraitsArray = query.personalityTraits;
    }

    // loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // return the filtered results
  return filteredResults;
}
// filter the animal from the animalsArray that matches the ID entered
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// adds api/animals route where data can be requested from
app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// add route using ID fpr search
app.get('/api/animals/:id', (req, res)=>{
  const result = findById(req.params.id, animals);
  if(result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

app.post('/api/animals',(req, res) => {
  // req.body is where our incoming content will be
  console.log(req.body);
  res.json(req.body);
});

// starts the server with a message
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
