// from data.js
var tableData = data;

// YOUR CODE HERE!
var submit = d3.select("#filter-btn");

var clear = d3.select("#clear-filter-btn");

var filterDate;
var filterObj = {};
var selectedFilter = "none";
var selectedFilterType = d3.select("#selected-filter-type");

var dateBtn = d3.select("#date-filter-btn");
var cityBtn = d3.select("#city-filter-btn");
var stateBtn = d3.select("#state-filter-btn");
var countryBtn = d3.select("#country-filter-btn");
var shapeBtn = d3.select("#shape-filter-btn");

var tempkey;
var tempval;

dateBtn.on("click", function() {
  selectedFilterType.text("Filter by Date");
  SetFilterType("datetime")
});
cityBtn.on("click", function() {
  selectedFilterType.text("Filter by City");
  SetFilterType("city")
});
stateBtn.on("click", function() {
  selectedFilterType.text("Filter by State");
  SetFilterType("state")
});
countryBtn.on("click", function() {
  selectedFilterType.text("Filter by Country");
  SetFilterType("country")
});
shapeBtn.on("click", function() {
  selectedFilterType.text("Filter by Shape");
  SetFilterType("shape")
});


function SetFilterType(type){
  selectedFilter = type;
}

/*function DateFilter(dataEntry){
  return new Date(dataEntry.datetime).getTime() == filterDate.getTime();
}*/

/*function FilterBy(key,val){
  filteredData = filteredData.filter(function Filter(dataEntry){ return new dataEntry[key] == val;});
}*/

function FilterBy(key,val){
  tempkey = key;
  tempval = val;
  filteredData = filteredData.filter(Filter);
}

function Filter(dataEntry){
  return dataEntry[tempkey] == tempval;
}

function GenerateTable(){
  tbody = d3.select("tbody");
  tbody.remove();
  d3.select("#ufo-table").append("tbody");
  tbody = d3.select("tbody");
  d3.event.preventDefault();
  if (filterObj === {}){
      alert("Please include a filter");
  }
  else {
    filteredData = tableData;
    Object.entries(filterObj).forEach(([key,val]) => FilterBy(key,val));

    for (data of filteredData){

      tr = tbody.append("tr");
      tr.append("td").text(data.datetime);
      tr.append("td").text(data.city);
      tr.append("td").text(data.state);
      tr.append("td").text(data.country);
      tr.append("td").text(data.shape);
      tr.append("td").text(data.durationMinutes);
      tr.append("td").text(data.comments);
    }
  }
}

submit.on("click", function() {
  if (selectedFilter === "none"){
    alert("Please Select a Filter Type.");
  }
  else if (d3.select("#filter-input").property("value") === "") {
    alert("Please Enter a Value Into the Field.");
  }
  else {
    filterObj[selectedFilter] = d3.select("#filter-input").property("value");
    console.log("Generating a table with the following filters:");
    console.log(filterObj);
    GenerateTable();
    ul = d3.select("#current-filters");
    ul.selectAll("*").remove();
    Object.entries(filterObj).forEach(([key,val]) => ul.append("li").text(`${key}: ${val}`));
  }
});

clear.on("click",function() {
  filterObj = {};

  ul = d3.select("#current-filters");
  ul.selectAll("*").remove();
  GenerateTable();
});

function GenerateFirstTable(){
  tbody = d3.select("tbody");
  for (data of tableData){
    tr = tbody.append("tr");
    tr.append("td").text(data.datetime);
    tr.append("td").text(data.city);
    tr.append("td").text(data.state);
    tr.append("td").text(data.country);
    tr.append("td").text(data.shape);
    tr.append("td").text(data.durationMinutes);
    tr.append("td").text(data.comments);
  }
}
//Old version where only filtering by date
/*submit.on("click", function() {

  tbody = d3.select("tbody");
  tbody.remove();
  d3.select("#ufo-table").append("tbody");
  tbody = d3.select("tbody");
  d3.event.preventDefault();

  var inputNode = d3.select("#datetime");
  value = inputNode.property("value");
  filterDate = new Date(value);
  //console.log(`The date entered after conversion is: ${filterDate}`);

  filteredData = tableData.filter(DateFilter);
  //console.log(filteredData);

  for (data of filteredData){

    tr = tbody.append("tr");
    tr.append("td").text(data.datetime);
    tr.append("td").text(data.city);
    tr.append("td").text(data.state);
    tr.append("td").text(data.country);
    tr.append("td").text(data.shape);
    tr.append("td").text(data.durationMinutes);
    tr.append("td").text(data.comments);
  }

});
*/
