/*jshint esversion: 6 */
/*globals $:false */
(function () {
  "use strict";

const studentsPerPage = 10;// sets the number of students shown per page                 
const studentList = document.getElementById("student-list");//retrieve student list
const clonedNode = studentList.cloneNode(true);//a clone of the students as a default list

const studentSearchDiv = document.getElementById("student-search");//retrieve search div              
const searchBar = '<input id="search" type="text" placeholder="Search students name..."><button id="searchButton">Reset</button>';              

studentSearchDiv.innerHTML = searchBar;//adding the search input and reset button html to the page

const searchInput = document.getElementById("search");//retrieving the search input

const pagUl = document.getElementById("paginationUL");//retrieving the pagination UL
const studDiv = document.getElementById("studentsDiv");//retrieving the students div

const listClear = element => element.innerHTML = " ";//list clear function 

const resetButton = document.querySelector("#searchButton");//retrieving the reset button

//reference list function
const referenceList = () => {
  if(searchInput.value === ""){
    return clonedNode;//returns default list
  }
  return searchList();//returns search input result list
};
//pagination: reference list and page link as arguments (empty link will display the first page as the default)
const pagination = (refList, link = 1) => {
  let listClone = refList;//renames reference list
  let listLength = listClone.children.length;//number of students in reference list
  //calculates the number of pages in reference to students per page and rounds up
  let stdRef = Math.ceil(listLength / studentsPerPage);
  //creates pagnation link for the required number of pages 
  for(let i = 1;i <= stdRef; i++){ 

    let listItem = document.createElement("li");//new list element
    let anchor = document.createElement("a");//new anchor element
    anchor.innerText = i;//anchor button page number
    anchor.setAttribute('href', "#");//back to page top
    
    if(i == link){
    anchor.className = 'active';//chosen link becomes active
    } else {
        anchor.className = 'in-active';//all other links become in-active
      }
    listItem.appendChild(anchor);//append anchor to list item
    pagUl.appendChild(listItem);//append list item to unordered list
  }
};
// The pageSwitch builds the page according to the selected page and calculates which students belong to that page
const pageSwitch = (refList, page = 1) => {
  let listClone = refList;
  let list = document.createElement("ul");
  // The pageref calculates the start point of the student selection 
  let pageref = (((page * studentsPerPage) - studentsPerPage) );
  // The studRef calculates the finish point of the student selection
  let studRef = studentsPerPage*page;
  // The if statement below calculates the start and finish to the final page taking into account that it probably wont be a complete list of students
  if((listClone.children.length / page) < studentsPerPage){
    studRef = ((studentsPerPage*page) - studentsPerPage) + (listClone.children.length % studentsPerPage);  
  }//The for statement below appends the students from the start to the finish of the given reference points
  for(let i = pageref; i < studRef; i++){
    let tempNode = listClone.cloneNode(true); 
    list.appendChild(tempNode.children[i]);
  } 
  // appends the list to the students div
  studDiv.appendChild(list);
  // JQuery used for the simple animation; it hides the new students list and then fades it in slowly
  $( "#studentsDiv" ).hide();
  $( "#studentsDiv" ).fadeIn( "slow" ); 
};
// The searchList function checks the input field value and uses either the default list or creates a list by checking the default list with regular expression
const searchList = () => {
  let tempNode = clonedNode.cloneNode(true);
  let list = document.createElement("ul"); 
  list.className = "searchListItems";// attribute attached is not currently being used
  // check for input value that isnt blank
  if(searchInput.value > ""){
    for(let i = 0; i < tempNode.children.length; i ++){
      //regular expression that matches the beginning of the search input and is not case sensitive    
      let regex = new RegExp("^" + searchInput.value, "i");
      //test the name for a match (returns true or false)
      let testMatch1 = regex.test(tempNode.children[i].children[0].children[1].textContent);
      //test the email for a match (returns true or false)
      let testMatch2 = regex.test(tempNode.children[i].children[0].children[2].textContent);
      // either true test will append the child to the list
      if (testMatch1 || testMatch2){
            let tempNode = clonedNode.cloneNode(true);
            list.appendChild(tempNode.children[i]);
      } 
    }// blank list will add a message to the list
    if(list.children.length === 0){
      list.innerHTML = '<li> "There were no matched result." </li>';
    }//returns populated list
    return list;
  } 
};
// functions run on page load
  listClear(pagUl);//clears pagination
  listClear(studDiv);//clears student list
  pagination(referenceList());//pagination with reference to default list
  pageSwitch(referenceList());//student list with reference to default list

// listener checks for keyup on input field runs functions with new input reference list 
searchInput.addEventListener("keyup", () => {
  listClear(pagUl);//clears pagination
  listClear(studDiv);//clears student list
  pagination(referenceList());//pagination with reference to default list
  pageSwitch(referenceList());//student list with reference to default list
});
// listener checks all pagination anchor elements for mouse click
pagUl.addEventListener("click", (event) => {
  if(event.target.tagName == "A"){
    let snack = event.target.textContent;//retrieves the number of the page clicked
    console.log(`page ${snack}`);//logs selected page to the console
    listClear(pagUl);//clears pagination
    listClear(studDiv);//clears student list
    pagination(referenceList(),snack);//selected page will over-ride the default page argument
    pageSwitch(referenceList(),snack);//selected page will over-ride the default page argument
  }
});
//reset button listener
resetButton.addEventListener("click", () =>{
  listClear(pagUl);//clears pagination
  listClear(studDiv);//clears student list
  searchInput.value = "";//clears search input field
  searchInput.focus();//sets focus back on the input field
  pagination(referenceList());//pagination with reference to default list
  pageSwitch(referenceList());//student list with reference to default list       
});
}());
