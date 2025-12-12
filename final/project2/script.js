// ==========================================
// Term Project Draft 1 - Screen Time vs Sleep
// ==========================================

// 1. DATA COLLECTION
// I manually transcribed this data from my tracking sheet and used sort to get the data sorted,
// Updated to include "Sleep Duration" (how long I actually slept).
const rawData = [
    { date: "19/10/2025", duration: "02:10", sleep: "06:20", activity: "Social media", quality: 2, wellbeing: 1 },
    { date: "20/10/2025", duration: "02:15", sleep: "05:35", activity: "Social media", quality: 1, wellbeing: 1 },
    { date: "21/10/2025", duration: "01:45", sleep: "06:15", activity: "Assignment/School", quality: 2, wellbeing: 1 },
    { date: "22/10/2025", duration: "04:30", sleep: "04:40", activity: "Assignment/School", quality: 2, wellbeing: 2 },
    { date: "23/10/2025", duration: "02:52", sleep: "06:48", activity: "Weekend TV show", quality: 3, wellbeing: 2 },
    { date: "24/10/2025", duration: "01:41", sleep: "06:53", activity: "Family comms", quality: 3, wellbeing: 2 },
    { date: "25/10/2025", duration: "02:06", sleep: "05:09", activity: "Television/news", quality: 1, wellbeing: 2 },
    { date: "26/10/2025", duration: "01:33", sleep: "07:13", activity: "Social media", quality: 4, wellbeing: 4 },
    { date: "27/10/2025", duration: "03:15", sleep: "07:08", activity: "Social media", quality: 4, wellbeing: 3 },
    { date: "28/10/2025", duration: "01:18", sleep: "08:57", activity: "Social media", quality: 5, wellbeing: 4 },
    { date: "29/10/2025", duration: "00:17", sleep: "06:33", activity: "Weekend TV show", quality: 3, wellbeing: 3 },
    { date: "30/10/2025", duration: "03:35", sleep: "06:08", activity: "Religious meeting", quality: 3, wellbeing: 2 },
    { date: "31/10/2025", duration: "00:20", sleep: "07:25", activity: "Assignment/School", quality: 4, wellbeing: 4 },
    { date: "01/11/2025", duration: "01:50", sleep: "06:45", activity: "Social media", quality: 3, wellbeing: 4 },
    { date: "02/11/2025", duration: "02:37", sleep: "05:55", activity: "Social media", quality: 2, wellbeing: 3 },
    { date: "03/11/2025", duration: "03:08", sleep: "04:56", activity: "Family comms", quality: 1, wellbeing: 2 },
    { date: "04/11/2025", duration: "03:08", sleep: "05:16", activity: "Family comms", quality: 5, wellbeing: 5 },
    { date: "05/11/2025", duration: "01:50", sleep: "06:45", activity: "Social media", quality: 5, wellbeing: 5 },
    { date: "06/11/2025", duration: "02:37", sleep: "06:45", activity: "Social media", quality: 5, wellbeing: 5 },
    { date: "07/11/2025", duration: "02:58", sleep: "04:56", activity: "Family comms", quality: 4, wellbeing: 5 },
    { date: "08/11/2025", duration: "01:50", sleep: "06:53", activity: "Social media", quality: 3, wellbeing: 4 },
    { date: "09/11/2025", duration: "02:37", sleep: "05:38", activity: "Social media", quality: 2, wellbeing: 3 },
    { date: "10/11/2025", duration: "03:08", sleep: "04:56", activity: "Family comms", quality: 1, wellbeing: 2 }
];

// 2. DATA PROCESSING
function parseDuration(durationStr) {
    const parts = durationStr.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    return hours + (minutes / 60);
}
//This code takes a time like “02:30”, splits it into hours and minutes,
//converts both to numbers, turns minutes into part of an hour, and returns the total as a decimal number.


const data = rawData.map(function(d) {
    return {
        date: d.date,
        duration: d.duration,
        sleep: d.sleep,
        activity: d.activity,
        quality: d.quality,
        wellbeing: d.wellbeing,
        screenHours: parseDuration(d.duration),
        sleepHours: parseDuration(d.sleep)
    };
});

// 3. VISUALIZATION SETUP
const margin = { top: 40, right: 130, bottom: 60, left: 60 };
const width = document.getElementById("visualization-container").clientWidth - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 4. AXIS CONFIGURATION
const x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d.screenHours; }) * 1.1])
    .range([0, width]);
    //This line builds the vertical scale. Taking into consideration 
    //the smallest screen ttime 0 and then add extra space so 
    //the circles don’t touch the edges of the chart.

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10));

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text("Screen Hours Before Bed");

const y = d3.scaleLinear()
    .domain([0, 5.5])
    .range([height, 0]);
    //This line builds the horizontal scale. Taking into consideration 
    //the smallest screen ttime 0 and then add extra space so
    //the circles don’t touch the edges of the chart.

svg.append("g")
    .call(d3.axisLeft(y).ticks(6));

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .text("Sleep Quality Rating (0–5)");

// 5. COLOR SCALE
const color = d3.scaleSequential()
    .domain([0, 5])
    .interpolator(d3.interpolateViridis); 
    // interpolator creates a color scale, something that maps numbers to colors.
    // virdis makes bubble chart easy to read

// 6. TOOLTIP
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

// 7. BUBBLES
const sizeScale = d3.scaleLinear()
    .domain([0, 5])
    .range([8, 25]);

svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", function(d){ return x(d.screenHours); })
    .attr("cy", function(d){ return y(d.quality); })
    .attr("r", function(d){ return sizeScale(d.wellbeing); })
    .style("fill", function(d){ return color(d.wellbeing); })
    .style("opacity", 0.85)
    .style("stroke", "#333")
    .style("stroke-width", 1.5)
    .on("mouseover", function(event, d) {

        d3.select(this)
            .attr("r", sizeScale(d.wellbeing) + 5)
            .style("opacity", 1);

        tooltip.transition().duration(200).style("opacity", 1); 
        // This is the little info box that appears when I hover on a bubble.

        tooltip.html(
            "<strong>Date:</strong> " + d.date + "<br/>" +
            "<strong>Screen Time:</strong> " + d.screenHours.toFixed(1) + " hrs<br/>" +
            "<strong>Sleep Quality:</strong> " + d.quality + "/5<br/>" +
            "<strong>Mental Wellbeing:</strong> " + d.wellbeing + "/5<br/>" +
            "<strong>Activity:</strong> " + d.activity
        )
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
        // This is possibly where the bubbles vanishes from but how to debug for me is the bigest issue.

        d3.select(this)
            .attr("r", sizeScale(d.wellbeing))
            .style("opacity", 0.85);

        tooltip.transition().duration(500).style("opacity", 0); // or maybe here?
    });

// 8. COLOR LEGEND
// this refers to the small color bar on the right side of my chart that explains what the colors mean.
// i.e sleep quality on the right side of the chart
const defs = svg.append("defs");

const linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%").attr("y1", "100%")
    .attr("x2", "0%").attr("y2", "0%");

const colorTicks = color.ticks();
linearGradient.selectAll("stop")
    .data(colorTicks.map(function(t, i){
        return { offset: (100 * i / colorTicks.length) + "%", color: color(t) };
    }))
    .enter()
    .append("stop")
    .attr("offset", function(d){ return d.offset; })
    .attr("stop-color", function(d){ return d.color; });

const legendWidth = 20;
const legendHeight = 200;
const legendX = width + 40;
const legendY = (height - legendHeight) / 2;

const legend = svg.append("g")
    .attr("transform", "translate(" + legendX + "," + legendY + ")");

legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);

const legendScale = d3.scaleLinear()
    .domain([0, 5])
    .range([legendHeight, 0]);

const legendAxis = d3.axisRight(legendScale).ticks(6);
// This creates a vertical axis on the right side of the legend, using the wellbeing scale
// and show 6 tick i.e the gradient bar.
legend.append("g")
    .attr("transform", "translate(" + legendWidth + ",0)")
    .call(legendAxis)
    .style("font-size", "12px");

legend.append("text")
    .attr("x", -10)
    .attr("y", -20)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("Mental Wellbeing");

// 9. TREND LINE
// trend line also known as regression line. The red dotted lines in my visualization.
const xMean = d3.mean(data, function(d){ return d.screenHours; });
const yMean = d3.mean(data, function(d){ return d.quality; });

let numerator = 0;
let denominator = 0;

data.forEach(function(d){
    numerator += (d.screenHours - xMean) * (d.quality - yMean);
    denominator += Math.pow((d.screenHours - xMean), 2);
});

const m = numerator / denominator;
const b = yMean - m * xMean;

const x1 = 0;
const y1 = m * x1 + b;
const x2 = d3.max(data, function(d){ return d.screenHours; }) * 1.1;
const y2 = m * x2 + b;

svg.append("line")
    .attr("x1", x(x1))
    .attr("y1", y(y1))
    .attr("x2", x(x2))
    .attr("y2", y(y2))
    .attr("stroke", "#f43f5e")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5");
