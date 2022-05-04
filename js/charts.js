function init() {
 
  var selector = d3.select("#selDataset");


  d3.json("samples.json").then((data) => {

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

  
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


init();

function optionChanged(newSample) {
 
  buildMetadata(newSample);
  buildCharts(newSample);
  
}


function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
 
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    var PANEL = d3.select("#sample-metadata");

  
    PANEL.html("");

  
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


function buildCharts(sample) {
 
  d3.json("samples.json").then((data) => {
    console.log(data);
    
    var samples = data.samples;
    
    var resultsArray = samples.filter(obj => obj.id == sample);
   
    var result = resultsArray[0];
   
    var otuIDs = result.otu_ids;
    var otuLabs = result.otu_labels;
    var sampleVals = result.sample_values; 
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaResult = metadataArray[0];
    var washingFreq = parseInt(metaResult.wfreq);

    
 

    var yticks = otuIDs.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
    var xticks = sampleVals.slice(0,10).reverse();
    var labels = otuLabs.slice(0,10).reverse();


    var barData = {
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: labels
    };
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    };

    Plotly.newPlot("bar", [barData], barLayout);

   
    var bubbleData = {
      x: otuIDs,
      y: sampleVals,
      text: otuLabs,
      mode: 'markers',
      marker: {
        size: sampleVals,
        color: otuIDs
      }
    };
    
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false
    };
    

    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);   


   
    var gaugeData = {
      value: washingFreq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color:"#ea2c2c"},
          {range: [2,4], color:"#ea822c"},
          {range: [4,6], color:"#ee9c00"},
          {range: [6,8], color:"#eecc00"},
          {range: [8,10], color:"#d4ee00"}
        ]
      }
    };

    var gaugeLayout = {
      width: 600, height: 450, margin: {t: 0, b: 0}
    };

    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);

  });
 };


