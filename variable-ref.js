var person = {
  name: 'Andrew',
  age:21
};

function updatePerson (obj) {
  // obj = {
  //   name: 'Andrew',
  //   age:24
  // };
  obj.age = 24;
}

updatePerson(person);
console.log(person);

var grades = [15, 30]

function addGrades (grades) {
  grades.push(40)
  debugger;
  grades = [12, 14, 19]
}

addGrades(grades)
console.log(grades);
