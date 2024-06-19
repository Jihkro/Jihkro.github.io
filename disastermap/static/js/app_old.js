
buttonwidth = 80;
buttonheight = 32;


//This function appends a button at the provided div id in the html
function appendButton(id) {
  //Important to use "let" here to avoid overlap for button functionality
  let buttonState = "on"

  //svg canvas for the button
  buttoncanvas = d3.select(id).append("svg").attr("width", buttonwidth).attr("height", buttonheight).attr("display","inline");

  //This is the rectangle which is visible while off
  //Bottom-most layer that becomes visible as other rectangles move off of it
  buttoncanvas.append("rect").attr("x",3).attr("y",3).attr("width",buttonwidth-6).attr("height",buttonheight-6).attr("style","fill:#999999");

  //Text on off-layer
  let buttonOffText = buttoncanvas.append("text").attr("dx", 7*buttonwidth/4-1).attr("dy",buttonheight/2).attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("textLength", "24px")
            .attr("lengthAdjust", "spacingAndGlyphs").text("OFF")
            .attr("style","fill:black; font-size:16px; font-family: Trebuchet, Arial, sans-serif;")

  //Rectangle visible while on
  //Covers up off-layer rectangle and text
  let buttonInnerRect = buttoncanvas.append("rect").attr("x",3).attr("y",3).attr("width",buttonwidth-6).attr("height",buttonheight-6).attr("style","fill:#119911");

  //Text on on-layer
  let buttonOnText = buttoncanvas.append("text").attr("dx", buttonwidth/4).attr("dy",buttonheight/2).attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("textLength", "19px")
            .attr("lengthAdjust", "spacingAndGlyphs").text("ON")
            .attr("style","fill:white; font-size:16px; font-family: Trebuchet, Arial, sans-serif;")

  //Thick border same color as background to cover up moving pieces
  //Transparent interior so we can still see on and off-layers in center
  buttoncanvas.append("rect").attr("x",0).attr("y",0).attr("rx",15).attr("ry",15).attr("width",buttonwidth).attr("height",buttonheight)
    .attr("style","fill-opacity:0;stroke:#333333;stroke-width:9")

  //Now that the moving pieces are defined, create button object to use for functions and to return at end
  let button = {"innerRect":buttonInnerRect, "onText":buttonOnText, "offText":buttonOffText, "state":buttonState}

  //Top-most layer
  //Visible border
  //Attaches click-event to this topmost layer
  buttoncanvas.append("rect").attr("x",3).attr("y",3).attr("rx",20).attr("ry",20).attr("width",buttonwidth-6).attr("height",buttonheight-6)
    .attr("style","fill-opacity:0;stroke:#666666;stroke-width:3").on("click", function() {toggleButton(button)})

  return button
}

//Changes button from On to Off or vice versa by moving movable pieces and updates state to reflect changes
function toggleButton(b) {
  if (b.state == "on"){
    b.onText.transition().duration(1000).attr("dx",-3*buttonwidth/4);
    b.innerRect.transition().duration(1000).attr("width", 0);
    b.offText.transition().duration(1000).attr("dx",3*buttonwidth/4-1);
    b.state = "off";
  }
  else{
    b.onText.transition().duration(1000).attr("dx",buttonwidth/4);
    b.innerRect.transition().duration(1000).attr("width", buttonwidth);
    b.offText.transition().duration(1000).attr("dx",7*buttonwidth/4);
    b.state = "on";
  }
  updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer)
}

hurricaneButton = appendButton("#HurricaneButton")
earthquakeButton = appendButton("#EarthquakeButton")
tornadoButton = appendButton("#TornadoButton")
wildfireButton = appendButton("#WildfireButton")
floodButton = appendButton("#FloodButton")


//Create Date Slider
$( "#slider-range" ).slider({
  range: true,
  min: 1970,
  max: 2018,
  step: 1,
  values: [1990, 2000],
  slide: function( event, ui ) {
    $( "#amount" ).val( ui.values[0].toString() + " - " + ui.values[1].toString());
    updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);
  },
  change: function( event, ui ) {
    updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);
  }
});
$( "#amount" ).val($( "#slider-range" ).slider( "values", 0) + " - " + ($( "#slider-range" ).slider( "values", 1)))

//Random Color Generator For Testing Purposes
function chooseColor(){
  // return "#808080".tostring(16);
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

//Load Base map
var myMap = L.map("map-id", {
  center: [40, -96],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var maptype = "county";

$.getJSON("../static/js/countiesgeojson.json", function(json) {
  console.log(json)
  countyLayer = new L.geoJson(json,{
    style: function(feature){
      return {
      color: "#EE3333",
      weight: 1,
      fillColor: chooseColor(),
      fillOpacity: 0.5
    }}
  });
  countyLayer.addTo(myMap);
});


$.getJSON("../static/js/statesgeojson.json", function(json) {
  console.log(json)
  stateLayer = new L.geoJson(json,{
    style: function(feature){
      return {
      color: "#EE3333",
      weight: 1,
      fillColor: chooseColor(),
      fillOpacity: 0.5
    }}
  });
  //stateLayer.addTo(myMap)
});


function updateMap(hurricaneState,earthQuakeState,tornadoState,wildfireState, floodState, startDate,endDate, newMapType, stateLayer, countyLayer){
  query= "/"+ newMapType +"/";

  if (hurricaneState == "on"){
    query = query + "1"
  }
  else {
    query = query + "0"
  }
  if (earthQuakeState == "on"){
    query = query + "1"
  }
  else {
    query = query + "0"
  }
  if (tornadoState == "on"){
    query = query + "1"
  }
  else {
    query = query + "0"
  }
  if (wildfireState == "on"){
    query = query + "1"
  }
  else {
    query = query + "0"
  }
  if (floodState == "on"){
    query = query + "1"
  }
  else {
    query = query + "0"
  }

  query = query + startDate +endDate

  if (newMapType == "county") {
    d3.json(query).then( function(data) {
      console.log(data)
      console.log(data["02170"])
      myMap.removeLayer(stateLayer);
      myMap.removeLayer(countyLayer);
      countyLayer.eachLayer(function(i){i.setStyle({
      color: "#EE3333",
      weight: 1,
      fillColor: getColor(data["" + i.feature.properties.STATE + i.feature.properties.COUNTY]),
      fillOpacity: 0.8
      })
      i.bindTooltip("<strong>" + i.feature.properties.NAME + " " + i.feature.properties.LSAD + "</strong>: " + getTooltipMessage(data["" + i.feature.properties.STATE + i.feature.properties.COUNTY]))})
      countyLayer.addTo(myMap)
    }
  )}
  else {
    d3.json(query).then( function(data) {
      myMap.removeLayer(stateLayer);
      myMap.removeLayer(countyLayer);
      stateLayer.eachLayer(function(i){ i.setStyle({
      color: "#EE3333",
      weight: 1,
      fillColor: getColor(data[parseInt(i.feature.properties.STATE)]),
      fillOpacity: 0.8
      })
      i.bindTooltip("<strong>" + i.feature.properties.NAME + "</strong>: " + getTooltipMessage(data[parseInt(i.feature.properties.STATE)]))})

      stateLayer.addTo(myMap)
    })
  }

};

function getColor(data){
  try {
    total = data.TOTAL;
  }
  catch(err) {
    total = 0;
  }
  total = parseInt(total)
  if (total == 0){
    result = "#000000"
  }
  else if (total <3){
    result = "#333333"
  }
  else if (total < 5){
    result = "#666666"
  }
  else if (total < 7){
    result = "#999999"
  }
  else if (total < 10){
    result = "#BBBBBB"
  }
  else if (total > 9){
    result = "#FFFFFF"
  }
  else {
    result = "#000000"
  }
  return result;

}

function getTooltipMessage(data){

  try {
    message = "Total: " + data.TOTAL
    message = message + "\nHurricanes: " + data.HurricaneCount
    message = message + "<br>Earthquakes: " + data.EarthquakeCount
    message = message + "\nTornados: " + data.TornadoCount
    message = message + "\nWildfires: " + data.FireCount
    message = message + "\nFloods: " + data.FloodCount
  }
  catch(err) {
    message = "No Disasters"
  }

  return message
}


//Testbutton is used for debug purposes, checking how switches and sliders are read and testing how to update map.
testbutton = d3.select("#button").append("button").attr("type","button").text("BUTTON").on("click", function() { console.log(`The current state of HurricaneButton is ${hurricaneButton.state} and the current state of EarthquakeButton is ${earthquakeButton.state}`);
console.log(`The current values on the slider are ${$("#slider-range" ).slider("values",0)} and ${$("#slider-range").slider("values",1)}`);
if (maptype == "state"){
myMap.removeLayer(stateLayer);
maptype = "county";
countyLayer.eachLayer(function(i){ i.setStyle({
color: "#EE3333",
weight: 1,
fillColor: chooseColor(),
fillOpacity: 0.5
})})
countyLayer.addTo(myMap)
}
else{
  myMap.removeLayer(countyLayer);
    maptype = "state";
  stateLayer.eachLayer(function(i){ i.setStyle({
  color: "#EE3333",
  weight: 1,
  fillColor: chooseColor(),
  fillOpacity: 0.5
  })})
  stateLayer.addTo(myMap);
}
});
setTimeout(()=>{
d3.select("#button").append("button").attr("type","button").text("Button2").on("click", ()=>{console.log("Trying to click button2"); updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer)})
}, 1500);
d3.select("#stateView").on("click", ()=>{maptype = "state"; updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);});
d3.select("#countyView").on("click", ()=>{maptype = "county"; updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);});
