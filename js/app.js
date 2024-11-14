'use strict'
// Define the hours of operation for the cookie stands
const hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

// Get the sales table element from the HTML where data will be displayed
const tableElement = document.getElementById('sales-table');

// Define a state object to hold all cookie stands data
const state = {
  allCookieStands: [], // Array to store each cookie stand instance
};

// Constructor function for creating a new CookieStand object
function CookieStand(locationName, minCustomersPerHour, maxCustomersPerHour, avgCookiesPerSale) {
  this.locationName = locationName;
  this.minCustomersPerHour = minCustomersPerHour;
  this.maxCustomersPerHour = maxCustomersPerHour;
  this.avgCookiesPerSale = avgCookiesPerSale;
  this.customersEachHour = []; // Array to store random customer count per hour
  this.cookiesEachHour = [];   // Array to store projected cookie sales per hour
  this.totalDailyCookies = 0;  // Total cookies sold in a day
}

// Method to calculate a random number of customers each hour for a cookie stand
CookieStand.prototype.calcCustomersEachHour = function() {
  for (let i = 0; i < hours.length; i++) {
    // Generate a random customer count within min and max for each hour
    this.customersEachHour.push(random(this.minCustomersPerHour, this.maxCustomersPerHour));
  }
};

// Method to calculate cookies sold each hour based on customersEachHour and avgCookiesPerSale
CookieStand.prototype.calcCookiesEachHour = function() {
  this.calcCustomersEachHour(); // Calculate customers first
  for (let i = 0; i < hours.length; i++) {
    // Calculate cookies sold for each hour and round up
    const oneHour = Math.ceil(this.customersEachHour[i] * this.avgCookiesPerSale);
    this.cookiesEachHour.push(oneHour); // Store the hourly cookie sales
    this.totalDailyCookies += oneHour;  // Add to daily total cookies
  }
};

// Method to render a row in the sales table for this CookieStand instance
CookieStand.prototype.render = function() {
  this.calcCookiesEachHour(); // Calculate cookies sold per hour
  const tableRow = document.createElement('tr'); // Create a new table row
  let tableDataElement = document.createElement('td');
  tableDataElement.textContent = this.locationName; // Set location name
  tableRow.appendChild(tableDataElement);

  // Populate hourly sales data
  for (let i = 0; i < hours.length; i++) {
    tableDataElement = document.createElement('td');
    tableDataElement.textContent = this.cookiesEachHour[i];
    tableRow.appendChild(tableDataElement);
  }

  // Add the total daily cookies sold for this location
  const tableHeader = document.createElement('th');
  tableHeader.textContent = this.totalDailyCookies;
  tableRow.appendChild(tableHeader);

  // Append the completed row to the table
  tableElement.appendChild(tableRow);
};

// Instantiate multiple CookieStand objects and add them to the state
let seattle = new CookieStand('Seattle', 23, 65, 6.3);
let tokyo = new CookieStand('Tokyo', 3, 24, 1.2);
let dubai = new CookieStand('Dubai', 11, 38, 3.7);
let paris = new CookieStand('Paris', 20, 38, 2.3);
let lima = new CookieStand('Lima', 2, 16, 4.6);
state.allCookieStands.push(seattle, tokyo, dubai, paris, lima);

// Helper function to generate a random integer between min and max, inclusive
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create the header row of the table with hours and 'Location Totals'
function makeHeaderRow() {
  const tableRow = document.createElement('tr');
  let tableHeader = document.createElement('th');
  tableHeader.textContent = 'Locations'; // First column header
  tableRow.appendChild(tableHeader);

  // Populate headers for each hour
  for (let i = 0; i < hours.length; i++) {
    tableHeader = document.createElement('th');
    tableHeader.textContent = hours[i];
    tableRow.appendChild(tableHeader);
  }

  // Add final header for daily total column
  tableHeader = document.createElement('th');
  tableHeader.textContent = 'Location Totals';
  tableRow.appendChild(tableHeader);

  // Append the header row to the table
  tableElement.appendChild(tableRow);
}

// Function to create the footer row showing totals for each hour across all locations
function makeFooterRow() {
  const tableRow = document.createElement('tr');
  let tableHeader = document.createElement('th');
  tableHeader.textContent = 'Hourly Totals for All Locations';
  tableRow.appendChild(tableHeader);

  let totalOfTotals = 0; // Accumulator for overall daily total

  // Calculate totals for each hour by summing sales across all locations
  for (let i = 0; i < hours.length; i++) {
    let hourlyTotal = 0;
    for (let j = 0; j < state.allCookieStands.length; j++) {
      hourlyTotal += state.allCookieStands[j].cookiesEachHour[i]; // Sum each location's hourly sales
      totalOfTotals += state.allCookieStands[j].cookiesEachHour[i]; // Add to total of totals
    }
    tableHeader = document.createElement('th');
    tableHeader.textContent = hourlyTotal; // Set hourly total in the footer
    tableRow.appendChild(tableHeader);
  }

  // Add the grand total for all locations
  tableHeader = document.createElement('th');
  tableHeader.textContent = totalOfTotals;
  tableRow.appendChild(tableHeader);

  // Append the footer row to the table
  tableElement.appendChild(tableRow);
}

// Self-invoking function to render the table
(function renderTable() {
  makeHeaderRow(); // Create and append the header row
  for (let i = 0; i < state.allCookieStands.length; i++) {
    state.allCookieStands[i].render(); // Render each location's row
  }
  makeFooterRow(); // Create and append the footer row
})();