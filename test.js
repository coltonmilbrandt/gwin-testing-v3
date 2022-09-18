var ss = SpreadsheetApp.getActiveSpreadsheet()
var sheet = SpreadsheetApp.getActive().getSheetByName('Simulation');
var randomizer = sheet.getRange('change');
var profitPercentage;
var longRate;
var tranches = [];
var profitPercentages = [];
var gainDifferentials = [];
var longRates = [];
var profitRange = [];
var ethPrice;

function simulateGainDiff() {
  
  profitsSimulation();
  
}

// Changes a checkbox on the spreadsheet to refresh values
function refresh() {
  if(randomizer == false) {
    randomizer = true;
  } else {
    randomizer = false;
  }
  sheet.getRange('change').setValue(randomizer);
}

// Creates a range value
function setRange(column, row) {
  var range = column + row;
  return range;
}

function profitsSimulation() {
  // Create new sheet if it doesn't exist already
  if (!ss.outputG) {
    var outputG = SpreadsheetApp.getActive().getSheetByName('Output');
  } else {
    var outputG = ss.insertSheet('Output');
  }
  
  // Create new sheet if it doesn't exist already
  if (!ss.output) {
    var output = SpreadsheetApp.getActive().getSheetByName('Profit');
  } else {
    var output = ss.insertSheet('Profit');
  }

  // Get tranch values from Simulation Sheet
  tranches.push(sheet.getRange('tranches').getValues());
  var length = tranches.length * 3;
  console.log(length);
  // Print tranch header to Output sheet
  output.getRange(1,2,1,3).setValues(tranches);

  output.getRange(1,5).setValue('Long Rates');

  // Print tranch header to Output sheet
  outputG.getRange(1,2,1,3).setValues(tranches);

  outputG.getRange(1,5).setValue('Long Rates');
  // Count to determine cell ranges for when values are set on Output sheet
  count = 0;
  
  // For loop to run simulation i times
  for (var i = 1; i <= 300; i++) {
    refresh();
    // DO NOT change any values on the sheet or the data won't match !!!!!!
    
    // Retrieve values from Simulation Sheet
    longRate = sheet.getRange('longRate').getValue();
    profitPercentage = sheet.getRange('profitPercentage').getValue();
    profitRange.push(sheet.getRange('UsdPercentageGain').getValues());
    gainDifferentials.push(sheet.getRange('gainDifferential').getValues());
    // profitPercentages.push([i],[profitPercentage],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""],[""]);
    
    // Push profit percentage values to array
    profitPercentages.push([profitPercentage]);

    longRates.push([longRate]);
    console.log(profitPercentages);
    console.log(tranches);
    console.log(gainDifferentials);
    count++;
  }
  // Print profit percentages array in row 2, column 1 as y-axis key for gain differentials
  output.getRange(2,1,count).setValues(profitPercentages);
  // Print gain differentials array starting at row 2, column 2
  output.getRange(2,2,count,3).setValues(profitRange);
  // Print long rates array starting at row 2, column 23
  output.getRange(2,5,count).setValues(longRates);

  // Print profit percentages array in row 2, column 1 as y-axis key for gain differentials
  outputG.getRange(2,1,count).setValues(profitPercentages);
  // Print gain differentials array starting at row 2, column 2
  outputG.getRange(2,2,count,3).setValues(gainDifferentials);
  // Print long rates array starting at row 2, column 23
  outputG.getRange(2,5,count).setValues(longRates);
}

function simulateUse() {
  addInteractionSheet();
  // Set Starting Price
  ethPrice = 1000;
  sheet.getRange('startingPrice').setValue(ethPrice);
  console.log("1000 = " + ethPrice);
  // changePrice()
  changePrice(0.10);
  console.log("1100 = " + ethPrice);
  // initialAllocation()
  // reallocate()
  // recordState()
  // deposit() or withdraw()
  // reallocate()
  // recordState()
}

function addInteractionSheet() {
  // Create new sheet if it doesn't exist already
  if (SpreadsheetApp.getActive().getSheetByName('Interaction') == null) {
    console.log('1');
    var txSheet = ss.insertSheet('Interaction');
  } else {
    console.log('2');
    var txSheet = SpreadsheetApp.getActive().getSheetByName('Interaction');
  }
  return txSheet;
}

function changePrice(percentChange) {
  ethPrice = ethPrice * (1 + percentChange);
  sheet.getRange('endingPrice').setValue(ethPrice);
}

const tx = {
  transactionID: foo,
  ethPrice: foo,
  stateSnapOne: foo,
  trasactionDetails: {

  },
  stateSnapTwo: foo,
}

const txHistory = {}

// TRANSACTION HISTORY OBJECT
  // transaction 1
  // transaction 2 ...

// TRANSACTION OBJECT
  // Transaction ID
  // ETH price
  // State Snapshot One (after reallocation using txHistory[-1].snapshotTwo)
  // Transaction Details
    // Affected Tranche
    // Transaction amount ETH
    // Transaction amount USD
  // State Snapshot Two (after 2nd reallocation using State Snapshot One)

const state = {
  userBalances: {},
  trancheBalances: {
    longTranche: {
      ethBal: foo,
      usdBal: foo
    },
    diminishedTranche: {
      ethBal: foo,
      usdBal: foo
    }
  }
}

let userBalance = {
  longTranche: {
    ethBal: foo,
    usdBal: foo,
    percent: foo
  },
  diminishedTranche: {
    ethBal: foo,
    usdBal: foo,
    percent: foo
  }
}

// STATE OBJECT (Represents the current state of the protocol)
  // User Balances: {
    // User: {
      // Long Tranche
        // ETH Balance
        // USD Balance
        // Percent Ownership
      // Diminished Tranche
        // ETH Balance
        // USD Balance
        // Percent Ownership
    // }
  // }
  // Tranche Balances
    // Long Tranche
      // ETH Balance
      // USD Balance
    // Diminished Tranche
      // ETH Balance
      // USD Balance

// NEEDED FUNCTIONS
  // deposit to tranche
    // reallocate with new price
    // update user tranche percent ownerships
    // deposit new allocation
    // reallocate including new deposit
    // update user tranche percent ownerships
  // withdraw from tranche
    // reallocate with new price
    // update user tranche percent ownerships
    // withdraw allocation
    // reallocated including new withdraw
    // update user tranche percent ownerships
  // change price
    // change price (by percentage or?)
    // record price
  // create output sheet to record transactions
  // create arrays to store allocations, transactions, and tx details
