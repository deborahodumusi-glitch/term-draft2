// ==========================================
// Term Project Draft 1 - Screen Time vs Sleep
// ==========================================

// 1. DATA COLLECTION
// I manually transcribed this data from my tracking sheet.
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
// Helper function to turn "HH:MM" strings into decimal numbers (e.g., "01:30" -> 1.5 hours)
// NOTE: I used AI assistance to generate this specific parsing logic.
function parseDuration(durationStr) {
    const [hours, minutes] = durationStr.split(':').map(Number);
    return hours + (minutes / 60);
}

// Map over the raw data to create a clean dataset
const data = rawData.map(d => ({
    ...d,
    screenHours: parseDuration(d.duration), // X-Axis
    sleepHours: parseDuration(d.sleep),     // Y-Axis
    quality: Math.min(d.quality, 5) // Clamp quality to max 5
}));

// 3. VISUALIZATION SETUP (D3.js)
// Increased right margin to make room for the vertical legend
const margin = { top: 40, right: 100, bottom: 60, left: 60 };
const width = document.getElementById('visualization-container').clientWidth - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 4. AXES CONFIGURATION
// X Axis: Screen Time (Hours)
const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.screenHours) * 1.1])
    .range([0, width]);

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(10))
    .attr("class", "axis");

svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text("Screen Hours Before Bed");

// Y Axis: Sleep Duration (Hours) - NEW
// Domain: from min sleep to max sleep (with some padding)
const yMin = d3.min(data, d => d.sleepHours);
const yMax = d3.max(data, d => d.sleepHours);
const y = d3.scaleLinear()
    .domain([yMin * 0.9, yMax * 1.1])
    .range([height, 0]);

svg.append("g")
    .call(d3.axisLeft(y).ticks(6))
    .attr("class", "axis");

svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .text("Sleep Hours");

// 5. THE 3RD FACTOR: COLOR SCALE (Sleep Quality)
// Using Viridis scale from 0 to 5
const color = d3.scaleSequential()
    .domain([0, 5])
    .interpolator(d3.interpolateViridis);

// 6. INTERACTIVITY (Tooltip)
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

// 7. PLOTTING THE DATA POINTS
// Bubble size varies by quality rating (larger = higher quality)
const sizeScale = d3.scaleLinear()
    .domain([0, 5])
    .range([8, 25]); // Min 8px, Max 25px

svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.screenHours))
    .attr("cy", d => y(d.sleepHours))
    .attr("r", d => sizeScale(d.quality)) // Size by quality
    .style("fill", d => color(d.quality))
    .style("opacity", 0.85)
    .style("stroke", "#333")
    .style("stroke-width", 1.5)
    .on("mouseover", function (event, d) {
        d3.select(this).attr("r", sizeScale(d.quality) + 5).style("opacity", 1);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`
            <strong>Date:</strong> ${d.date}<br/>
            <strong>Screen Time:</strong> ${d.screenHours.toFixed(1)} hrs<br/>
            <strong>Sleep Duration:</strong> ${d.sleepHours.toFixed(1)} hrs<br/>
            <strong>Sleep Quality:</strong> ${d.quality}/5<br/>
            <strong>Activity:</strong> ${d.activity}
        `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
        d3.select(this).attr("r", d => sizeScale(d.quality)).style("opacity", 0.85);
        tooltip.transition().duration(500).style("opacity", 0);
    });

// 8. LEGEND (Vertical Gradient Bar on Right)
// Creating a gradient definition
const defs = svg.append("defs");
const linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%"); // Vertical Gradient (Bottom to Top)

linearGradient.selectAll("stop")
    .data(color.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: color(t) })))
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

// Draw the vertical rectangle with the gradient
const legendWidth = 20;
const legendHeight = 200;
const legendX = width + 40;
const legendY = (height - legendHeight) / 2;

const legend = svg.append("g")
    .attr("transform", `translate(${legendX}, ${legendY})`);

legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);

// Legend Axis (Scale 0-5)
const legendScale = d3.scaleLinear()
    .domain([0, 5])
    .range([legendHeight, 0]);

const legendAxis = d3.axisRight(legendScale)
    .ticks(6);

legend.append("g")
    .attr("transform", `translate(${legendWidth}, 0)`)
    .call(legendAxis)
    .style("font-size", "12px")
    .selectAll("text")
    .style("fill", "#1a202c");

// Legend Title
legend.append("text")
    .attr("x", -10)
    .attr("y", -20)
    .style("fill", "#1a202c")
    .style("font-weight", "bold")
    .style("font-size", "12px")
    .text("Sleep Quality");

// 9. TREND LINE (Screen Time vs Sleep Duration)
// NOTE: AI assistance used for regression math.
const xMean = d3.mean(data, d => d.screenHours);
const yMean = d3.mean(data, d => d.sleepHours);

let numerator = 0;
let denominator = 0;
data.forEach(d => {
    numerator += (d.screenHours - xMean) * (d.sleepHours - yMean);
    denominator += (d.screenHours - xMean) ** 2;
});
const m = numerator / denominator;
const b = yMean - m * xMean;

const x1 = 0;
const y1 = m * x1 + b;
const x2 = d3.max(data, d => d.screenHours) * 1.1;
const y2 = m * x2 + b;

svg.append("line")
    .attr("x1", x(x1))
    .attr("y1", y(y1))
    .attr("x2", x(x2))
    .attr("y2", y(y2))
    .attr("stroke", "#f43f5e")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5");