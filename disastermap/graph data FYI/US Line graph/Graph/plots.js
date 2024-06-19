//the graph starts here
var trace2 = {
    x: data.map(row => row.Year),
    y: data.map(row => row.Hurricanes),
    name: "Hurricanes",
    type: "bar"
};

var trace3 = {
    x: data.map(row => row.Year),
    y: data.map(row => row.Earthquakes),
    name: "Earthquakes",
    type: "bar"
};

var trace4 = {
    x: data.map(row => row.Year),
    y: data.map(row => row.Floods),
    name: "Floods",
    type: "bar"
};

var trace5 = {
    x: data.map(row => row.Year),
    y: data.map(row => row.Tornadoes),
    name: "Tornadoes",
    type: "bar"
};

var trace6 = {
    x: data.map(row => row.Year),
    y: data.map(row => row.Fires),
    name: "Fires",
    type: "bar"
};


// set up the data variable
var data = [trace2, trace3, trace4, trace5, trace6];

// set up the layout variable
var layout = {
    title: "National Disaster Summary",
    xaxis: { title: "Year" },
    yaxis: { title: "Number of Disaster Events" },
    barmode: 'stack'
  };

// Note that we omitted the layout object this time
// This will use default parameters for the layout
Plotly.newPlot("plot", data, layout);


