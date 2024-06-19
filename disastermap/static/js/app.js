
//Directly loading csv to simulate old behavior without heroku.  In the original deployment api calls were sent to a python backend to serve data

var parsedcsvdata = []
var groupedcsvdata = {}
var stateCodeHash = {AL:1,
AK:2,
AZ:4,
AR:5,
CA:6,
CO:8,
CT:9,
DE:10,
DC:11,
FL:12,
GA:13,
HI:15,
ID:16,
IL:17,
IN:18,
IA:19,
KS:20,
KY:21,
LA:22,
ME:23,
MD:24,
MA:25,
MI:26,
MN:27,
MS:28,
MO:29,
MT:30,
NE:31,
NV:32,
NH:33,
NJ:34,
NM:35,
NY:36,
NC:37,
ND:38,
OH:39,
OK:40,
OR:41,
PA:42,
PR:72,
RI:44,
SC:45,
SD:46,
TN:47,
TX:48,
UT:49,
VT:50,
VA:51,
VI:78,
WA:53,
WV:54,
WI:55,
WY:56}
$.get("../Resources/final_merged.csv", function(csvdata){
split = csvdata.split('\n')
labels = split[0].split(',')
for(x=1;x<split.length; x++){
	let obj = {}
	let hold = ''
	if (split[x].includes('"')){
		first = split[x].indexOf('"')
		last = split[x].indexOf('"',first+1)
		hold = split[x].substr(first,last-first+1)
		split[x] = split[x].replace(hold,'%hold%')
	}
	let line = split[x].split(',')
	for(y=0; y<labels.length; y++){
		obj[labels[y]] = (line[y] == '%hold%')? hold:line[y]
	}
	parsedcsvdata.push(obj)
}
console.log(parsedcsvdata)
groupedcsvdata = Object.groupBy(parsedcsvdata,function(item){return item['Disaster Number']+item['State ']})
;})

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
  let buttonOffText = buttoncanvas.append("text").attr("dx", 7*buttonwidth/4 - 2).attr("dy",buttonheight/2).attr("text-anchor", "middle")
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
    .attr("style","fill-opacity:0;stroke:#1F1F1F;stroke-width:9")

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
    b.offText.transition().duration(1000).attr("dx",3*buttonwidth/4 - 2);
    b.state = "off";
  }
  else{
    b.onText.transition().duration(1000).attr("dx",buttonwidth/4);
    b.innerRect.transition().duration(1000).attr("width", buttonwidth);
    b.offText.transition().duration(1000).attr("dx",7*buttonwidth/4 - 2);
    b.state = "on";
  }
  updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer)
}

function appendStateButton(id) {

//Important to use "let" here to avoid overlap for button functionality

let buttonState = "state"


//svg canvas for the button

buttoncanvas = d3.select(id).append("svg").attr("width", 1.5*buttonwidth).attr("height", buttonheight).attr("display","inline");


//This is the rectangle which is visible while off

//Bottom-most layer that becomes visible as other rectangles move off of it

buttoncanvas.append("rect").attr("x",3).attr("y",3).attr("width",1.5*buttonwidth-6).attr("height",buttonheight-6).attr("style","fill:#3333AA");


//Text on off-layer

let buttonOffText = buttoncanvas.append("text")
.attr("dx", 7*1.5*buttonwidth/4 - 6).attr("dy",buttonheight/2)
.attr("text-anchor", "middle")

.attr("dominant-baseline", "middle")
           .attr("textLength", "48px")

.attr("lengthAdjust", "spacingAndGlyphs").text("COUNTY")

.attr("style","fill:white; font-size:16px; font-family: Trebuchet, Arial, sans-serif;")


//Rectangle visible while on

//Covers up off-layer rectangle and text

let buttonInnerRect = buttoncanvas.append("rect").attr("x",3).attr("y",3).attr("width",1.5*buttonwidth-6).attr("height",buttonheight-6).attr("style","fill:#AA3333");

 //Text on on-layer

let buttonOnText = buttoncanvas.append("text")
.attr("dx", 1.5*buttonwidth/4)
.attr("dy",buttonheight/2)
.attr("text-anchor", "middle")

.attr("dominant-baseline", "middle")

.attr("textLength", "40px")

.attr("lengthAdjust", "spacingAndGlyphs").text("STATE")

.attr("style","fill:white; font-size:16px; font-family: Trebuchet, Arial, sans-serif;")


//Thick border same color as background to cover up moving pieces

//Transparent interior so we can still see on and off-layers in center

buttoncanvas.append("rect").attr("x",0).attr("y",0).attr("rx",15).attr("ry",15).attr("width",1.5*buttonwidth).attr("height",buttonheight)
   .attr("style","fill-opacity:0;stroke:#1F1F1F;stroke-width:9")


//Now that the moving pieces are defined, create button object to use for functions and to return at end

let button = {"innerRect":buttonInnerRect, "onText":buttonOnText, "offText":buttonOffText, "state":buttonState}


//Top-most layer

//Visible border

//Attaches click-event to this topmost layer

buttoncanvas.append("rect").attr("x",3).attr("y",3).attr("rx",20).attr("ry",20).attr("width",1.5*buttonwidth-6).attr("height",buttonheight-6)
   .attr("style","fill-opacity:0;stroke:#666666;stroke-width:3").on("click", function() {toggleStateButton(button)})


return button
}


//Changes button from On to Off or vice versa by moving movable pieces and updates state to reflect changes

function toggleStateButton(b) {

if (b.state == "state"){

b.onText.transition().duration(1000).attr("dx",-3*1.5*buttonwidth/4);

b.innerRect.transition().duration(1000).attr("width", 0);

b.offText.transition().duration(1000).attr("dx",3*1.5*buttonwidth/4 - 6);

b.state = "county";

maptype = "county"; }

else{

b.onText.transition().duration(1000).attr("dx",1.5*buttonwidth/4);

b.innerRect.transition().duration(1000).attr("width", 1.5*buttonwidth);

b.offText.transition().duration(1000).attr("dx",7*1.5*buttonwidth/4 - 6);

b.state = "state";
maptype = "state";

}

updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer)
}
hurricaneButton = appendButton("#HurricaneButton")
earthquakeButton = appendButton("#EarthquakeButton")
tornadoButton = appendButton("#TornadoButton")
wildfireButton = appendButton("#WildfireButton")
floodButton = appendButton("#FloodButton")
viewButton = appendStateButton("#StateButton")

tableChoice = 24

function updateTableData(b) {
 //console.log("Trying to update table data")
 d3.json(`/table/${b}`).then(function(data){
   //console.log("Loaded data for table")
   //console.log(data)
   tabledata = d3.select("#tabledata")
   tabledata.select("table").remove()
   table = tabledata.append("table")
   tablerow = table.append("tr")
   tablerow.append("th").text("Disaster Number")
   tablerow.append("th").text("Begin Date")
   tablerow.append("th").text("Title")

   try {
     //console.log("Successfully tried")
     len = Object.keys(data.Title).length
     for(x = 0; x<len; x++){
       tablerow = table.append("tr")
       tablerow.append("td").text(data["Disaster Number"][x])
       tablerow.append("td").text(data["Incident Begin Date"][x])
       tablerow.append("td").text(data["Title"][x])
     }
   }
   catch(err) {
     //console.log("Error in try")
     tabledata.append("tr").append("td").text("No Data")
   }


 })

}

updateTableData(tableChoice)

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
  return '#000000';
}

//Load Base map
var myMap = L.map("map-id", {
  center: [40, -96],
  zoom: 4,
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
}).addTo(myMap);

var maptype = "state";


$.getJSON("../static/js/countiesgeojson.json", function(json) {
  //console.log(json)
  countyLayer = new L.geoJson(json,{
    style: function(feature){
      return {
      color: "#333333",
      weight: 1,
      fillColor: chooseColor(),
      fillOpacity: 0.5
    }}
  });
  //countyLayer.addTo(myMap);
});


$.getJSON("../static/js/statesgeojson.json", function(json) {
  //console.log(json)
  stateLayer = new L.geoJson(json,{
    style: function(feature){
      return {
      color: "#333333",
      weight: 1,
      fillColor: chooseColor(),
      fillOpacity: 0.5
    }}
  });
  stateLayer.addTo(myMap)
});


function updateMap(hurricaneState,earthQuakeState,tornadoState,wildfireState, floodState, startDate,endDate, newMapType, stateLayer, countyLayer){
  /*query= "/"+ newMapType +"/";

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

  query = query + startDate +endDate*/

  if (newMapType == "county") {
    //d3.json(query).then( function(data) {
      //console.log(data)
      //console.log(data["02170"])
	var result = {}
	$.each(parsedcsvdata,function(key,item){
		countyCode = ((''+item['FIPS Code'])||(''+item['FIPS Code\r'])||'').trim()
		if (!result[countyCode]) result[countyCode] = {TOTAL: 0, HurricaneCount: 0, EarthquakeCount: 0, TornadoCount: 0, FireCount: 0, FloodCount:0}
		switch(item['Incident Type']){
			case 'Hurricane':
				if (hurricaneState == 'on' && item.Year <= endDate && item.Year >= startDate){
					result[countyCode].TOTAL += 1
					result[countyCode].HurricaneCount += 1
				}
				break;
			case 'Earthquake':
				if (earthQuakeState == 'on' && item.Year <= endDate && item.Year >= startDate){
					result[countyCode].TOTAL+= 1
					result[countyCode].EarthquakeCount += 1
				}
				break;
			case 'Tornado':
				if (tornadoState == 'on' && item.Year <= endDate && item.Year >= startDate){
					result[countyCode].TOTAL += 1
					result[countyCode].TornadoCount += 1
				}
				break;
			case 'Fire':
				if (wildfireState == 'on' && item.Year <= endDate && item.Year >= startDate){
					result[countyCode].TOTAL += 1
					result[countyCode].FireCount += 1
				}
				break;
			case 'Flood':
				if (floodState == 'on' && item.Year <= endDate && item.Year >= startDate){
					result[countyCode].TOTAL += 1
					result[countyCode].FloodCount += 1
				}
				break;
		}
	
	})

      myMap.removeLayer(stateLayer);
      myMap.removeLayer(countyLayer);
      countyLayer.eachLayer(function(i){i.setStyle({
      color: "#666666",
      weight: 1,
      fillColor: getColor(result[parseInt("" + i.feature.properties.STATE + i.feature.properties.COUNTY)]),
      fillOpacity: 0.8
      })
      i.bindTooltip("<strong>" + i.feature.properties.NAME + " " + i.feature.properties.LSAD + "</strong>: " + getTooltipMessage(result[parseInt("" + i.feature.properties.STATE + i.feature.properties.COUNTY)]))})
      countyLayer.addTo(myMap)
    //})
  }
  else {
    //d3.json(query).then( function(data) {
	var result = {}
	$.each(groupedcsvdata,function(key,item){
		stateCode = stateCodeHash[item[0]['State ']]
		if (!result[stateCode]) result[stateCode] = {TOTAL: 0, HurricaneCount: 0, EarthquakeCount: 0, TornadoCount: 0, FireCount: 0, FloodCount:0}
		switch(item[0]['Incident Type']){
			case 'Hurricane':
				if (hurricaneState == 'on' && item[0].Year <= endDate && item[0].Year >= startDate){
					result[stateCode].TOTAL += 1
					result[stateCode].HurricaneCount += 1
				}
				break;
			case 'Earthquake':
				if (earthQuakeState == 'on' && item[0].Year <= endDate && item[0].Year >= startDate){
					result[stateCode].TOTAL += 1
					result[stateCode].EarthquakeCount += 1
				}
				break;
			case 'Tornado':
				if (tornadoState == 'on' && item[0].Year <= endDate && item[0].Year >= startDate){
					result[stateCode].TOTAL += 1
					result[stateCode].TornadoCount += 1
				}
				break;
			case 'Fire':
				if (wildfireState == 'on' && item[0].Year <= endDate && item[0].Year >= startDate){
					result[stateCode].TOTAL += 1
					result[stateCode].FireCount += 1
				}
				break;
			case 'Flood':
				if (floodState == 'on' && item[0].Year <= endDate && item[0].Year >= startDate){
					result[stateCode].TOTAL += 1
					result[stateCode].FloodCount += 1
				}
				break;
		}
	
	})

      myMap.removeLayer(stateLayer);
      myMap.removeLayer(countyLayer);
      stateLayer.eachLayer(function(i){ i.setStyle({
      color: "#666666",
      weight: 1,
      fillColor: getColor(result[parseInt(i.feature.properties.STATE)]),
      fillOpacity: 0.8
      })
      i.bindTooltip("<strong>" + i.feature.properties.NAME + "</strong>: " + getTooltipMessage(result[parseInt(i.feature.properties.STATE)]))
      i.on({click: function(){updateTableData(i.feature.properties.STATE)}})
    })

      stateLayer.addTo(myMap)
//    })
  }

};

/*function getColor(data){
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

}*/

function getColor(data){
  try {
    total = data.TOTAL;
  }
  catch(err) {
    total = 0;
  }
  total = parseInt(total)
  if (total == 0){
    result = "#FFFFFF"
  }
  else if (total <3){
    result = "#FFBBBB"
  }
  else if (total < 5){
    result = "#FF9999"
  }
  else if (total < 7){
    result = "#FF6666"
  }
  else if (total < 10){
    result = "#FF3333"
  }
  else if (total > 9){
    result = "#FF0000"
  }
  else {
    result = "#FFFFFF"
  }
  return result;

}

function getTooltipMessage(data){

  try {
    message = "Total: " + data.TOTAL
    message = message + (data.HurricaneCount?"\nHurricanes: " + data.HurricaneCount : '')
    message = message + (data.EarthquakeCount?"\nEarthquakes: " + data.EarthquakeCount : '')
    message = message + (data.TornadoCount?"\nTornados: " + data.TornadoCount : '')
    message = message + (data.FireCount?"\nWildfires: " + data.FireCount : '')
    message = message + (data.FloodCount?"\nFloods: " + data.FloodCount : '')
  }
  catch(err) {
    message = "No Disasters"
  }

  return (data && data.TOTAL)? message : "No Disasters"
}


//Testbutton is used for debug purposes, checking how switches and sliders are read and testing how to update map.
/*testbutton = d3.select("#button").append("button").attr("type","button").text("BUTTON").on("click", function() { console.log(`The current state of HurricaneButton is ${hurricaneButton.state} and the current state of EarthquakeButton is ${earthquakeButton.state}`);
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
});*/
setTimeout(()=>{updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);
//d3.select("#button").append("button").attr("type","button").text("Button2").on("click", ()=>{console.log("Trying to click button2"); updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer)})
}, 30000);
//d3.select("#stateView").on("click", ()=>{maptype = "state"; updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);});
//d3.select("#countyView").on("click", ()=>{maptype = "county"; updateMap(hurricaneButton.state,earthquakeButton.state,tornadoButton.state,wildfireButton.state, floodButton.state, $("#slider-range").slider("values",0),$("#slider-range").slider("values",1), maptype, stateLayer, countyLayer);});
