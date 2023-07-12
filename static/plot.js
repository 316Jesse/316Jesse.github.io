function filterChartData(data, timePeriod) {
  if (timePeriod === '1m') {
    // Filter data for the month of June 2023
    const startDate = new Date('6/1/2023');
    const endDate = new Date('6/30/2023');

    return data.filter(item => {
      const date = new Date(item.Date);
      return date >= startDate && date <= endDate;
    });
  } else if (timePeriod === '1y') {
    // Filter data for the year starting from 6/30/2022 to 6/30/2023
    const startDate = new Date('6/30/2022');
    const endDate = new Date('6/30/2023');

    return data.filter(item => {
      const date = new Date(item.Date);
      return date >= startDate && date <= endDate;
    });
  } else {
    // Return all data
    return data;
  }
}


function formatChartData(data) {
  return data.map(item => {
    const dateParts = item.Date.split('/');
    const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
    const formattedPrice = parseFloat(item.Price.replace(',', ''));
    return {
      Date: formattedDate,
      Price: formattedPrice,
      Ticker: item.Ticker,
    };
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const chartForm = document.getElementById('chartForm');
  const coinSelect = document.getElementById('coin');
  const timePeriodSelect = document.getElementById('time_period');
  let timePeriod = 'all'; // Declare timePeriod variable outside the event listener

  // Set default selected coin and time period
  coinSelect.value = 'BTC';
  timePeriodSelect.value = 'all';

  chartForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const coin = coinSelect.value;
    timePeriod = timePeriodSelect.value; // Update the value of timePeriod

    fetch(`/api/v1.0/${coin}`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the retrieved data

        const formattedData = formatChartData(data);
        const filteredData = filterChartData(formattedData, timePeriod);
        filteredData.sort((a, b) => new Date(a.Date) - new Date(b.Date)); // Sort the data by date

        console.log(filteredData); // Check the filtered and sorted data

        const dates = filteredData.map(item => item.Date);
        const prices = filteredData.map(item => parseFloat(item.Price));

        console.log(dates); // Check the dates array
        console.log(prices); // Check the prices array

        const trace = {
          x: dates,
          y: prices,
          type: 'scatter',
          mode: 'lines',
          line: {
            color: 'rgb(75, 192, 192)',
          },
          hovertemplate: '%{y:$,.2f}', // Format the hover label to display price with commas and 2 decimal places
        };

        const layout = {
          title: 'Crypto Price Chart',
          xaxis: {
            title: 'Date',
          },
          yaxis: {
            title: 'Price',
          },
        };

        Plotly.react('chart', [trace], layout);
      })
      .catch(error => {
        console.error('Error:', error);
        // Display an error message to the user
        const errorContainer = document.getElementById('chartContainer');
        errorContainer.innerHTML = '<p>An error occurred while loading the chart. Please try again later.</p>';
      });
  });

  // Load BTC all-time chart by default
  fetch('/api/v1.0/BTC')
    .then(response => response.json())
    .then(data => {
      console.log(data); // Check the retrieved data

      const formattedData = formatChartData(data);
      const filteredData = filterChartData(formattedData, timePeriod);
      filteredData.sort((a, b) => new Date(a.Date) - new Date(b.Date)); // Sort the data by date

      console.log(filteredData); // Check the filtered and sorted data

      const dates = filteredData.map(item => item.Date);
      const prices = filteredData.map(item => parseFloat(item.Price));

      console.log(dates); // Check the dates array
      console.log(prices); // Check the prices array

      const trace = {
        x: dates,
        y: prices,
        type: 'scatter',
        mode: 'lines',
        line: {
          color: 'rgb(75, 192, 192)',
        },
        hovertemplate: '%{y:$,.2f}', // Format the hover label to display price with commas and 2 decimal places
      };

      const layout = {
        title: 'Crypto Price Chart',
        xaxis: {
          title: 'Date',
        },
        yaxis: {
          title: 'Price',
        },
      };

      Plotly.react('chart', [trace], layout);
    })
    .catch(error => {
      console.error('Error:', error);
      // Display an error message to the user
      const errorContainer = document.getElementById('chartContainer');
      errorContainer.innerHTML = '<p>An error occurred while loading the chart. Please try again later.</p>';
    });
});