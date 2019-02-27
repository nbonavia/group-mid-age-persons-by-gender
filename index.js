// Question:
// Write a JavaScript method receiving an array of objects containing name+age+gender, 
// returning everyone between 30 and 40 years old grouped by gender. Keep it simple but reusable. 
// Create a secret gist (https://gist.github.com/) and paste the URL below. *

// Defining Constants to define minimum and maximum age.
// These can be contained either in a config file, loaded from a database
// or set up as an Object properties that can be modified as need-be
const AGE_MID_MIN=30;
const AGE_MID_MAX=40

// The persons data that will be processed.
// The code will also take into consideration that this data needs to scale
const persons = [
  {
    name: "Manal Rios",
    age: 50,
    gender: "M"
  },
  {
    name: "Bella-Rose Hartley",
    age: 35,
    gender: "F"
  },
  {
    name: "Pierre Ibarra",
    age: 39,
    gender: "M"
  },
  {
    name: "Fallon Zamora",
    age: 30,
    gender: "F"
  }
];

// Creating a filterable function that returns true / false if the person is middle age
const isPersonMiddleAge = (person) => (person.age>=AGE_MID_MIN && person.age <= AGE_MID_MAX );

// When processing an array, it is always important to reduce scans as much as possible, and although
// it is possible to apply a persons.filter().reduce() that makes the process more modular, this involves
// an array scan to filter the data, then another scan on the result for the reduce. In order to avoid 
// multiple data scanning, I am including the filter inside a dedicated reduce funtion.
const groupMiddleAgedPersonsByGender = (genderGroups, person) => {
    // Including the filtering logic inside the reduce process
    if (!isPersonMiddleAge(person)) {
      return genderGroups;
    }
  
    let persons = genderGroups[person.gender.toLowerCase()];
    if (!persons) {
      persons = genderGroups[person.gender.toLowerCase()] = [];
    }
    persons.push(person);
    return genderGroups;
}

// Adopting the approach of use reduce that filters and groups the data
genderBetweenRange = persons
      .reduce(groupMiddleAgedPersonsByGender, {});

console.log('The result of filtering and grouping data in one process')
console.log(genderBetweenRange);
console.log('--------------------------------------------------------')

// One important thing to notice here is that to process the reduce function, 
// the entire array has to be loaded in memory. If the implementation is not
// bound to basic JavaScript, it is possible to utilise streams, where the data
// can be loaded in a stream (for this example, I'm using streamify to convert
// an array into a stream), then it's possible to apply the filter and reduce
// filters, while still process the entire data in separate streams, but
// utilising one data scan, and with reduced memory consumption to process
// the data. 
// Note: Streams process every object individually, so a person object is first applied
//       to the filter, and if ok, then it passes directly to the reduce.
const streamify = require('stream-array');
const filter = require("stream-filter");
const reduce = require("stream-reduce");

// Creating a reducable function that adds the given person to the gender groups's gender property
// If a gender does not exist, the function will create the property automatically
const groupPersonsByGender = (genderGroups, person) => {
    let persons = genderGroups[person.gender.toLowerCase()];
    if (!persons) {
      persons = genderGroups[person.gender.toLowerCase()] = [];
    }
    persons.push(person);
    return genderGroups;
}

streamify(persons)
  .pipe(filter.obj(isPersonMiddleAge))
  .pipe(reduce(groupPersonsByGender,{}))
  .on('data', personsGroup => {
      // here one get array of unique elements
      console.log('The result of filtering data, then grouping by gender using streams');
      console.log(personsGroup);
      console.log('--------------------------------------------------------');
  });

// If I were to deploy the code on production, I will use the streams option if I can, if not, 
// I will use the group and filter in one reduce function (groupMiddleAgedPersonsByGender)