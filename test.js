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
};

const txHistory = [];

// const longAllocation = sheet.getRange('longAllocation');

function changeValueBy(range, value) {
  let cellValue = sheet.getRange(range).getValue();
  let newValue = cellValue + value;
  sheet.getRange(range).setValue(newValue);
};

function setValue(range, value) {
  sheet.getRange(range).setValue(value);
};

function initialAllocation(long, diminished) {
  setValue('longAllocation', long);
  setValue('diminishedAllocation', diminished);
};

// NEEDED FUNCTIONS
  // deposit to tranche
    // reallocate with new price
    // update user tranche percent ownerships
    // deposit new allocation
    // update user tranche percent ownerships
  // withdraw from tranche
    // reallocate with new price
    // update user tranche percent ownerships
    // withdraw allocation
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
};

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
  };
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
};

// TRANSACTION OBJECT
  // Transaction ID
  // ETH price
  // State Snapshot One (after reallocation using txHistory[-1].snapshotTwo)
  // Transaction Details
    // Affected Tranche
    // Transaction amount ETH
    // Transaction amount USD
  // State Snapshot Two (after 2nd reallocation using State Snapshot One)



function recordProtocolState() {
  getCurrentValues();
  state.trancheBalances.longTranche.ethBal = endLongBal;
  state.trancheBalances.longTranche.usdBal = endLongUSD;
  state.trancheBalances.diminishedTranche.ethBal = endDimBal;
  state.trancheBalances.diminishedTranche.usdBal = endDimUSD;
};

function recordUserState() {
  // for loop to set percents for each user balance
  // loop through array
  getCurrentValues();
  for (let i = 0; i < state.userBalances.length; i++) {
    let x = endLongBal;
    let y = state.userBalances[i].longTranche.percent;
    state.userBalances[i].longTranche.ethBal = x * y;
    let k = endDimBal;
    let z = state.userBalances[i].diminishedTranche.percent;
    state.userBalances[i].diminishedTranche.ethBal = k * z;
  };
  // percent owned only changes when allocations change
};

function updateUserState() {
  getCurrentValues();
  for (let i = 0; i < state.userBalances.length; i++) {
    let x = endLongBal;
    let y = state.userBalances[i].longTranche.ethBal;
    state.userBalances[i].longTranche.percent = y / x;
    let k = endDimBal;
    let z = state.userBalances[i].diminishedTranche.ethBal;
    state.userBalances[i].diminishedTranche.percent = z / k;

    state.userBalances[i].longTranche.usdBal = y * ethPrice;
    state.userBalances[i].diminishedTranche.usdBal = z * ethPrice;
  };
};

// Manual Version
function simulateUse() {
  addInteractionSheet();
  // Set Starting Price
  ethPrice = 1000;
  startingPrice = ethPrice;
  endingPrice = ethPrice;
  setValue('startingPrice', startingPrice);
  setValue('endingPrice', endingPrice);
  // initialAllocation()
  initialAllocation(5,5);
  // set and record initial state
  setInitialState();
  // transact()
  // transact(user, ethPercentChange, type, tranche, amount)
  transact(1, 0.1, 'deposit', 'longTranche', 1); 
  transact(1, 0.1, 'deposit', 'longTranche', 1);
  transact(1, 0.1, 'withdrawal', 'longTranche', 1);
  console.log('final state');
  console.log(JSON.stringify(state));
}

function adjustForNewTx() {
  getCurrentValues();
  console.log(startingPrice);
  console.log(endingPrice);
  startingPrice = endingPrice;
  setValue('startingPrice', startingPrice);
  let l = endLongBal;
  let d = endDimBal;
  setValue('longAllocation', l);
  setValue('diminishedAllocation', d);
  getCurrentValues();
};

function reallocate(priceChange) {
  endingPrice = startingPrice + (startingPrice * priceChange);
  console.log('ending price: ' + endingPrice);
  setValue('endingPrice', endingPrice);
  recordProtocolState();
  recordUserState();
}

const users = {
  0: 'Protocol',
  1: 'Alice',
  2: 'Bob',
  3: 'Chris',
  4: 'Dan',
}

// user: 0 is Protocol, 1 is Alice, 2 is Bob, 3 is Chris, 4 is Dan
// ethPercentChange: percent change in ETH/USD,  
// type: 'deposit' or 'withdawal'
// tranche: 'longTranche' or 'diminishedTranche'
// amount: amount of ETH to transact
function transact(user, ethPercentChange, type, tranche, amount) {
  // do not reallocate if either tranch is 0
  getCurrentValues();
  changePriceBy(ethPercentChange);
  if(preCalcLongBal > 0 && preCalcDimBal > 0) {
    reallocate(ethPercentChange);
    if (type == 'withdrawal') {
      if (state.userBalances.some(u => u.user === user) == false || state.userBalances[user][tranche].ethBal < amount) {
        console.log('User does not exist, or not enough ETH to withdraw');
        return;
      };
    };
    updateUserState();
    let preTxState = JSON.parse(JSON.stringify(state));
    // add user, if non-existent
    if(state.userBalances.some(u => u.user === user) == false) {
      console.log('User not found. Creating user...');
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
    // takes ending balances, writes them to beg. balances, startingPrice = endingPrice
    adjustForNewTx();

    // actually add the amount to the tranche
    switch (tranche) {
      case 'longTranche':
        switch (type) {
          case 'deposit':
            console.log('depositing...');
            state.userBalances[user].longTranche.ethBal += amount;
            state.trancheBalances.longTranche.ethBal += amount;
            changeValueBy('longAllocation', amount);
            break;
          case 'withdrawal':
            console.log('withdrawing...');
            state.userBalances[user].longTranche.ethBal -= amount;
            state.trancheBalances.longTranche.ethBal -= amount;
            changeValueBy('longAllocation', -amount);
            break;
        };
        break;
      case 'diminishedTranche':
          switch (type) {
          case 'deposit':
            state.userBalances[user].diminishedTranche.ethBal += amount;
            state.trancheBalances.diminishedTranche.ethBal += amount;
            changeValueBy('diminishedAllocation', amount);
            break;
          case 'withdrawal':
            state.userBalances[user].diminishedTranche.ethBal -= amount;
            state.trancheBalances.diminishedTranche.ethBal -= amount;
            changeValueBy('diminishedAllocation', -amount);
            break;
        };
        break;
    }
    console.log('user: ' + user + ', ' + users[user] + 's new balance follows:')
    console.log('long: ' + state.userBalances[user].longTranche.ethBal);
    console.log('diminished: ' + state.userBalances[user].diminishedTranche.ethBal);
    // update user percent owned and usd balance
    updateUserState();
    recordUserState();
    recordProtocolState();

    // end transaction here^
    let postTxState = JSON.parse(JSON.stringify(state));
    txID++; // if tx fails, fill a tx with 'fail' data
    let usdTxAmount = amount * ethPrice;
    let tx = {
      transactionID: txID,
      type: type,
      ethPrice: ethPrice,
      percentChange: ethPercentChange,
      stateSnapOne: preTxState,
      transactionDetails: {
        user: user,
        tranche: tranche,
        txType: type,
        ethAmount: amount,
        usdAmount: usdTxAmount,
      },
      stateSnapTwo: postTxState,
    };

    txHistory.push(tx);
    console.log(JSON.stringify(tx));
    console.log(JSON.stringify(state));
  };
};

function exportData() {
  let row = [];
  
}



function addInteractionSheet() {
  // Create new sheet if it doesn't exist already
  if (SpreadsheetApp.getActive().getSheetByName('Interaction') == null) {
    var txSheet = ss.insertSheet('Interaction');
  } else {
    var txSheet = SpreadsheetApp.getActive().getSheetByName('Interaction');
  };
  return txSheet;
};

function changePriceBy(percentChange) {
  ethPrice = ethPrice * (1 + percentChange);
  sheet.getRange('endingPrice').setValue(ethPrice);
};

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


