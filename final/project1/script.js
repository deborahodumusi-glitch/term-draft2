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

const data = rawData.map(function(d){
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

// 3. SVG SETUP
const margin = { top: 40, right: 130, bottom: 60, left: 60 };
const width = document.getElementById("visualization-container").clientWidth - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 4. AXES
const x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d.screenHours; }) * 1.1])
    .range([0, width]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10));

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text("Screen Hours Before Bed");

const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d.sleepHours; }) * 1.1])
    .range([height, 0]);

svg.append("g")
    .call(d3.axisLeft(y).ticks(10));

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .text("Sleep Duration (hours)");

// 5. COLOR SCALE — Sleep Quality
const color = d3.scaleSequential()
    .domain([0, 5])
    .interpolator(d3.interpolateViridis);

// 6. TOOLTIP
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

// 7. DRAW BUBBLES
const sizeScale = d3.scaleLinear()
    .domain([0, 5])
    .range([8, 25]);

svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", function(d){ return x(d.screenHours); })
    .attr("cy", function(d){ return y(d.sleepHours); })
    .attr("r", function(d){ return sizeScale(d.quality); })
    .style("fill", function(d){ return color(d.quality); })
    .style("opacity", 0.85)
    .style("stroke", "#333")
    .style("stroke-width", 1.5)
    .on("mouseover", function(event, d){

        d3.select(this)
            .attr("r", sizeScale(d.quality) + 5)
            .style("opacity", 1);

        tooltip.transition().duration(200).style("opacity", 1);

        tooltip.html(
            "<strong>Date:</strong> " + d.date + "<br/>" +
            "<strong>Screen Time:</strong> " + d.screenHours.toFixed(1) + " hrs<br/>" +
            "<strong>Sleep Duration:</strong> " + d.sleepHours.toFixed(1) + " hrs<br/>" +
            "<strong>Sleep Quality:</strong> " + d.quality + "/5<br/>" +
            "<strong>Activity:</strong> " + d.activity
        )
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d){

        d3.select(this)
            .attr("r", sizeScale(d.quality))
            .style("opacity", 0.85);

        tooltip.transition().duration(500).style("opacity", 0);
    });

// 8. COLOR LEGEND
// legend refers to the small color bar on the right side of my chart that explains what the colors mean.
// i.e mental wellbeing on the right side of the chart
const defs = svg.append("defs");

const gradient = defs.append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%").attr("y1", "100%")
    .attr("x2", "0%").attr("y2", "0%");

const ticks = color.ticks(6);

gradient.selectAll("stop")
    .data(ticks.map(function(t, i) {
        return { offset: (100 * i / ticks.length) + "%", color: color(t) };
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
    .style("fill", "url(#legend-gradient)");

const legendScale = d3.scaleLinear()
    .domain([0, 5])
    .range([legendHeight, 0]);

legend.append("g")
    .attr("transform", "translate(" + legendWidth + ",0)")
    .call(d3.axisRight(legendScale).ticks(6));

legend.append("text")
    .attr("x", -10)
    .attr("y", -15)
    .style("font-weight", "bold")
    .text("Sleep Quality");

// 9. TREND LINE (sleepHours vs screenHours)
// trend line also known as regression line
const xMean = d3.mean(data, function(d){ return d.screenHours; });
const yMean = d3.mean(data, function(d){ return d.sleepHours; });

let numerator = 0;
let denominator = 0;

data.forEach(function(d){
    numerator += (d.screenHours - xMean) * (d.sleepHours - yMean);
    denominator += Math.pow((d.screenHours - xMean), 2);
});

const m = numerator / denominator;
const b = yMean - m * xMean;

const lineX1 = 0;
const lineY1 = m * lineX1 + b;
const lineX2 = d3.max(data, function(d){ return d.screenHours; }) * 1.1;
const lineY2 = m * lineX2 + b;

svg.append("line")
    .attr("x1", x(lineX1))
    .attr("y1", y(lineY1))
    .attr("x2", x(lineX2))
    .attr("y2", y(lineY2))
    .attr("stroke", "#f43f5e")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5");
