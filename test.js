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

let txID = 0;

let foo = 0;
let startingPrice = 0;
let endingPrice = 0;
let preCalcLongBal = 0;
let preCalcDimBal = 0;
let endLongBal = 0;
let endDimBal = 0;
let preCalcLongUSD = 0;
let preCalcDimUSD = 0;
let endLongUSD = 0;
let endDimUSD = 0;
let longPercentGainUSD = 0;
let dimPercentGainUSD = 0;
let longGainDiff;
let dimGainDiff;

function getCurrentValues() {
  preCalcLongBal = sheet.getRange('longAllocation').getValue();
  preCalcDimBal = sheet.getRange('diminishedAllocation').getValue();
  endLongBal = sheet.getRange('longETHBal').getValue();
  endDimBal = sheet.getRange('diminishedETHBalance').getValue();
  preCalcLongUSD = sheet.getRange('longStartUSD').getValue();
  preCalcDimUSD = sheet.getRange('diminishedStartUSD').getValue();
  endLongUSD = sheet.getRange('longEndUSD').getValue();
  endDimUSD = sheet.getRange('diminishedEndUSD').getValue();
  longPercentGainUSD = sheet.getRange('longUSDGain').getValue();
  dimPercentGainUSD = sheet.getRange('diminishedGainUSD').getValue();
  longGainDiff = sheet.getRange('longGainDiff').getValue();
  dimGainDiff = sheet.getRange('diminishedGainDiff').getValue();
}

const txHistory = [];

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

const state = {
  userBalances: [],
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

function setInitialState() {
  getCurrentValues();
  let protocolUserBal = {
    user: 0,
    longTranche: {
      ethBal: preCalcLongBal,
      usdBal: preCalcLongUSD,
      percent: 1,
    },
    diminishedTranche: {
      ethBal: preCalcDimBal,
      usdBal: preCalcDimUSD,
      percent: 1,
    }
  }
  state.userBalances.push(protocolUserBal);

  state.trancheBalances.longTranche.ethBal = endLongBal;
  state.trancheBalances.longTranche.usdBal = endLongUSD;
  state.trancheBalances.diminishedTranche.ethBal = endDimBal;
  state.trancheBalances.diminishedTranche.usdBal = endDimUSD;

  let initTx = {
    transactionID: 0,
    ethPrice: ethPrice,
    stateSnapOne: JSON.parse(JSON.stringify(state)),
    transactionDetails: {},
    stateSnapTwo: JSON.parse(JSON.stringify(state)),
  };

  txHistory.push(initTx);
  console.log(txHistory);
  console.log(txHistory.find(x => x.transactionID === 0).stateSnapTwo);
}

// TRANSACTION OBJECT
  // Transaction ID
  // ETH price
  // State Snapshot One (after reallocation using txHistory[-1].snapshotTwo)
  // Transaction Details
    // Affected Tranche
    // Transaction amount ETH
    // Transaction amount USD
  // State Snapshot Two (after 2nd reallocation using State Snapshot One)



function recordState() {
  getCurrentValues();

}

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
  // set and record initial state
  setInitialState();
  // transact()
  transact(1, 0.1, 'deposit', 'longAllocation', 1); // user 1, +10% change, 1 ETH
  // reallocate()
  // recordState()


  // deposit() or withdraw()
  // reallocate()
  // recordState()
}

// user: 0 is Protocol, 1 is Alice, 2 is Bob, 3 is Chris, 4 is Dan
// ethPercentChange: percent change in ETH/USD,  
// type: 'deposit' or 'withdawal'
// tranche: 'longAllocation' or 'diminishedAllocation'
// amount: amount of ETH to transact
function transact(user, ethPercentChange, type, tranche, amount) {
  // do not reallocate if either tranch is 0
  getCurrentValues();
  changePriceBy(ethPercentChange);
  if(preCalcLongBal > 0 && preCalcDimBal > 0) {
    // reallocate()
    // reallocation process >>>(FINISH!!!!)<<< create a function
      // calculate allocations at new price (the two tranches just)
        // search through array of users for percent ownership
        // assign ETH according to (tranchBal * percentOwned)
          // update userBalances being sure to clear all old data
    console.log('good to go');
    let preTxState = JSON.parse(JSON.stringify(state));
    // add user, if non-existent
    if(state.userBalances.find(x => x.user !== user)) {
      console.log('user not found');
      let newUser = {
        user: user,
        longTranche: {
          ethBal: 0,
          usdBal: 0,
          percent: 0,
        },
        diminishedTranche: {
          ethBal: 0,
          usdBal: 0,
          percent: 0,
        }
      }
      state.userBalances.push(newUser);
    };
    // actual transaction here...
      // add users funds to tranch balance
      // reallocate()

    // end transaction here^
    let postTxState = JSON.parse(JSON.stringify(state));
    txID++; // if tx fails, fill a tx with 'fail' text
    let tx = {
      transactionID: txID,
      type: type,
      ethPrice: ethPrice,
      percentChange: ethPercentChange,
      stateSnapOne: preTxState,
      transactionDetails: {
        // User
        user: user,
        // Affected Tranche
        tranche: tranche,
        // Transaction amount ETH
        amount: amount,
        // Transaction amount USD
      },
      stateSnapTwo: postTxState,
    };

    txHistory.push(tx);
    console.log(tx);
    console.log(txHistory);
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

function changePriceBy(percentChange) {
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


