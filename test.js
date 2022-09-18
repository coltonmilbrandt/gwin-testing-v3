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
let ethPrice;

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

const foo = 0;
const startingPrice = 0;
const endingPrice = 0;
const preCalcLongBal = 0;
const preCalcDimBal = 0;
const endLongBal = 0;
const endDimBal = 0;
const endLongUSD = 0;
const endDimUSD = 0;
const preCalcLongUSD = 0;
const preCalcDimUSD = 0;

function getCurrentValues() {
  preCalcLongBal = sheet.getRange('longAllocation').getValue();
  preCalcDimBal = sheet.getRange('diminishedAllocation').getValue();
  endLongBal = sheet.getRange('longETHBal').getValue();
  endDimBal = sheet.getRange('diminishedETHBalance').getValue();
  endLongUSD = sheet.getRange('longEndUSD').getValue();
  endDimUSD = sheet.getRange('diminishedEndUSD').getValue();
  preCalcLongUSD = sheet.getRange('longStartUSD').getValue();
  preCalcDimUSD = sheet.getRange('diminishedStartUSD').getValue();
}

const state = {
  userBalances: {},
  trancheBalances: {
    longTranche: {
      ethBal: 0,
      usdBal: 0
    },
    diminishedTranche: {
      ethBal: 0,
      usdBal: 0
    }
  }
}

let userBalance = {
  user: foo,
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

let tx = {
  transactionID: foo,
  ethPrice: foo,
  stateSnapOne: foo,
  trasactionDetails: {

  },
  stateSnapTwo: foo,
}

const txHistory = {}

// const longAllocation = sheet.getRange('longAllocation');

function changeValueBy(range, value) {
  let cellValue = sheet.getRange(range).getValue();
  let newValue = cellValue + value;
  sheet.getRange(range).setValue(newValue);
}

function setValue(range, value) {
  sheet.getRange(range).setValue(value);
}

function initialAllocation(long, diminished) {
  setValue('longAllocation', long);
  setValue('diminishedAllocation', diminished);
}

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

function setState() {

}

function simulateUse() {
  addInteractionSheet();
  // Set Starting Price
  ethPrice = 1000;
  setValue('startingPrice', ethPrice);
  setValue('endingPrice', ethPrice);
  // initialAllocation()
  initialAllocation(5,5);
  // setState()
  

  // changePrice()
  // changePrice(0.10);
  // reallocate()
  // recordState()
  // deposit() or withdraw()
  // reallocate()
  // recordState()
}

// user: 0 is Protocol, 1 is Alice, 2 is Bob, 3 is Chris, 4 is Dan
// ethPercentChange: percent change in ETH/USD,  
// type: '0' is deposit, '1' is withdraw
// tranche: 'longAllocation' or 'diminishedAllocation'
// amount: amount of ETH to transact
function transact(user, ethPercentChange, type, tranche, amount) {
  // do not reallocate if either tranch is 0
  getCurrentValues();
  if(preCalcLongBal > 0 && preCalcDimBal > 0) {
    // reallocate
    console.log('good to go');
  }
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


