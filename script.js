// Fetch the data from the provided URL
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json()) // Convert the response to JSON format
    .then(data => { // Once the data is fetched, continue with the code
        const dataset = data.data; // Extract the dataset containing the GDP data

        // Set up margins, width, and height for the chart
        const margin = { top: 20, right: 30, bottom: 40, left: 40 }; // Margins for spacing around the chart
        const width = 900 - margin.left - margin.right; // Calculate the width of the chart, considering the margins
        const height = 500 - margin.top - margin.bottom; // Calculate the height of the chart, considering the margins

        // Create the SVG container for the chart
        const svg = d3.select('#chart') // Select the chart element by its ID
            .attr('width', width + margin.left + margin.right) // Set the width of the SVG container
            .attr('height', height + margin.top + margin.bottom) // Set the height of the SVG container
            .append('g') // Add a <g> element inside the SVG to group all chart elements
            .attr('transform', `translate(${margin.left}, ${margin.top})`); // Apply the margins to the group

        // Set up the x and y scales for the chart
        const x = d3.scaleTime() // Create a time scale for the x-axis
            .domain(d3.extent(dataset, d => new Date(d[0]))) // Set the domain based on the date range of the dataset
            .range([0, width]); // Set the range to match the width of the chart

        const y = d3.scaleLinear() // Create a linear scale for the y-axis
            .domain([0, d3.max(dataset, d => d[1])]) // Set the domain based on the maximum GDP value
            .nice() // Automatically adjust the domain to be round numbers
            .range([height, 0]); // Set the range to match the height of the chart

        // Create the x-axis and position it at the bottom of the chart
        svg.append('g')
            .attr('id', 'x-axis') // Assign an ID to the x-axis group element
            .attr('transform', `translate(0,${height})`) // Position the x-axis at the bottom of the chart
            .call(d3.axisBottom(x)); // Add the ticks and labels to the x-axis

        // Create the y-axis and position it to the left of the chart
        svg.append('g')
            .attr('id', 'y-axis') // Assign an ID to the y-axis group element
            .call(d3.axisLeft(y)); // Add the ticks and labels to the y-axis

        svg.append('g')
            .append('text') // Append a text element
            .attr('transform', 'rotate(-90)') // Rotate the text for vertical alignment
            .attr('y', 37) // Position the text above the horizontally
            .attr('x', -height / 5) // Center the text vertically
            .style('text-anchor', 'middle') // Center the text horizontally
            .text('Gross Domestic Product'); // The text to display

        // Create the bars for the bar chart
        svg.selectAll('.bar') // Select all the bars (none exist initially)
            .data(dataset) // Bind the data to the bars
            .enter() // Create a new element for each data point
            .append('rect') // Append a <rect> (rectangle) for each data point
            .attr('class', 'bar') // Assign the 'bar' class to each rectangle
            .attr('data-date', d => d[0]) // Set the 'data-date' attribute to the date of each data point
            .attr('data-gdp', d => d[1]) // Set the 'data-gdp' attribute to the GDP of each data point
            .attr('x', d => x(new Date(d[0]))) // Set the x-position based on the date
            .attr('y', d => y(d[1])) // Set the y-position based on the GDP value
            .attr('width', width / dataset.length) // Set the width of each bar, based on the number of data points
            .attr('height', d => height - y(d[1])) // Set the height of the bar based on the GDP value
            .on('mouseover', function (event, d) { // Add mouseover event for the tooltip
                const tooltip = d3.select('#tooltip'); // Select the tooltip element by its ID
                tooltip.transition().duration(200).style('visibility', 'visible'); // Show the tooltip with a transition
                tooltip
                    .attr('data-date', d[0]) // Set the 'data-date' attribute of the tooltip to the date of the bar
                    .html(`<strong>Date:</strong> ${d[0]}<br><strong>GDP:</strong> ${d[1]} Billion`) // Set the content of the tooltip
                    .style('top', `${event.pageY + 5}px`) // Position the tooltip based on mouse position
                    .style('left', `${event.pageX + 5}px`); // Position the tooltip based on mouse position
            })
            .on('mouseout', function () { // Add mouseout event to hide the tooltip
                d3.select('#tooltip').transition().duration(200).style('visibility', 'hidden'); // Hide the tooltip
            });
    });
