'use strict';

// Store Constructor Function
function Store(locationName, minCustomersPerHour, maxCustomersPerHour, avgCookiesPerSale) {
  this.locationName = locationName;
  this.minCustomersPerHour = minCustomersPerHour;
  this.maxCustomersPerHour = maxCustomersPerHour;
  this.avgCookiesPerSale = avgCookiesPerSale;
  this.cookiesEachHour = [];
  this.dailyTotal = 0;

  this.estimate = function() {
    this.cookiesEachHour = estimateSales(this);
    this.calculateDailyTotal();
  };

  this.calculateDailyTotal = function() {
    this.dailyTotal = this.cookiesEachHour.reduce((sum, cookies) => sum + cookies, 0);
  };
}

// Helper Methods
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function estimateSales(store) {
  const sales = [];
  for (let i = 0; i < hours.length; i++) {
    const numCustomers = random(store.minCustomersPerHour, store.maxCustomersPerHour);
    const hourSales = Math.ceil(numCustomers * store.avgCookiesPerSale);
    sales.push(hourSales);
  }
  return sales;
}

function calculateHourlyTotals() {
  const hourlyTotals = new Array(hours.length).fill(0);
  let grandTotal = 0;

  stores.forEach(store => {
    store.cookiesEachHour.forEach((cookies, i) => {
      hourlyTotals[i] += cookies;
    });
    grandTotal += store.dailyTotal;
  });

  return { hourlyTotals, grandTotal };
}

function renderSalesTable() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found!');
    return;
  }

  // Clear any existing content
  root.innerHTML = '';

  // Create the table
  const table = document.createElement('table');
  table.id = 'salesTable';
  
  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  // Add empty cell for location column
  headerRow.appendChild(document.createElement('th'));
  
  // Add hour headers
  hours.forEach(hour => {
    const th = document.createElement('th');
    th.textContent = hour;
    headerRow.appendChild(th);
  });
  
  // Add daily total header
  const totalHeader = document.createElement('th');
  totalHeader.textContent = 'Daily Total';
  headerRow.appendChild(totalHeader);
  
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  
  // Add row for each store
  stores.forEach(store => {
    const row = document.createElement('tr');
    
    // Add store name
    const nameCell = document.createElement('td');
    nameCell.textContent = store.locationName;
    row.appendChild(nameCell);
    
    // Add hourly sales
    store.cookiesEachHour.forEach(cookies => {
      const td = document.createElement('td');
      td.textContent = cookies;
      row.appendChild(td);
    });
    
    // Add daily total
    const totalCell = document.createElement('td');
    totalCell.textContent = store.dailyTotal;
    totalCell.classList.add('daily-total');
    row.appendChild(totalCell);
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);

  // Create table footer with totals
  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  
  // Add 'Totals' label
  const totalsLabel = document.createElement('td');
  totalsLabel.textContent = 'Hourly Totals';
  footerRow.appendChild(totalsLabel);
  
  // Calculate and add hourly totals
  const { hourlyTotals, grandTotal } = calculateHourlyTotals();
  
  hourlyTotals.forEach(total => {
    const td = document.createElement('td');
    td.textContent = total;
    footerRow.appendChild(td);
  });
  
  // Add grand total
  const grandTotalCell = document.createElement('td');
  grandTotalCell.textContent = grandTotal;
  grandTotalCell.classList.add('grand-total');
  footerRow.appendChild(grandTotalCell);
  
  tfoot.appendChild(footerRow);
  table.appendChild(tfoot);

  // Add table to the page
  root.appendChild(table);
}

// Application State
const hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

// Create store instances
const stores = [
  new Store('Seattle', 23, 65, 6.3),
  new Store('Tokyo', 3, 24, 1.2),
  new Store('Dubai', 11, 38, 3.7),
  new Store('Paris', 20, 38, 2.3),
  new Store('Lima', 2, 16, 4.6)
];

// Initialize and render
function initialize() {
  stores.forEach(store => store.estimate());
  renderSalesTable();
}

// Run the application
initialize();