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

// update the users percent ownership of the tranche (after price change or deposit)
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

// Average ETH hold time is 113 days
// Long tranche should trade every month
// Dim tranche could hold for 3 months
// 

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
 
let currentDay = 0;
let tradeLog = {
  1: {
    name: 'Alice',
    asset: '',
    buys: [],
    tradePrices: [],
    longRatios: [],
    avgLongRatioEntry: 0,
    longRatioEnd: 0,
    usdSpent: 0,
    ethSpent: 0,
    usdEnd: 0,
    ethEnd: 0,
    usdGain: 0,
    expGain: 0,
    gainDiff: 0,
    ethGain: 0,
  },
  2: {
    name: 'Bob',
    buys: [],
    tradePrices: [],
    longRatios: [],
    avgLongRatioEntry: 0,
    longRatioEnd: 0,
    asset: '',
    usdSpent: 0,
    ethSpent: 0,
    usdEnd: 0,
    ethEnd: 0,
    usdGain: 0,
    expGain: 0,
    gainDiff: 0,
    ethGain: 0,
  },
  3: {
    name: 'Chris',
    buys: [],
    tradePrices: [],
    longRatios: [],
    avgLongRatioEntry: 0,
    longRatioEnd: 0,
    asset: '',
    usdSpent: 0,
    ethSpent: 0,
    usdEnd: 0,
    ethEnd: 0,
    usdGain: 0,
    expGain: 0,
    gainDiff: 0,
    ethGain: 0,
  },
  4: {
    name: 'Dan',
    buys: [],
    tradePrices: [],
    longRatios: [],
    avgLongRatioEntry: 0,
    longRatioEnd: 0,
    asset: '',
    usdSpent: 0,
    ethSpent: 0,
    usdEnd: 0,
    ethEnd: 0,
    usdGain: 0,
    expGain: 0,
    gainDiff: 0,
    ethGain: 0,
  },
}

let tradeTxs = [];

// receive buy - record aggregated entry price
// receive sell - record sell price
  // RECORD
    // USD buy {
      // USD buy 1
        // amount ETH deposited
        // ETH price
        // USD value
      // USD buy 2 ...
    //}
    // USD aggregate entry
    // USD sell
    // % profit
    // ETH in
    // ETH out
    // % gain

    // expected gain
      // change since tx * weight * trancheMult (for each transaction)

let tradeCol = 5;
let tradeRow = 86;

// setTrades(user, percentChangeConversion, type, tranche, amount, tradePrice);
function setTrades(user, percentChangeConversion, type, tranche, amount, tradePrice, ratio) {
  transactor = tradeLog[user];
  if(ratio == undefined) {
    tradeLongRatio = state.trancheBalances.longTranche.ethBal / state.trancheBalances.diminishedTranche.ethBal;
  } else {
    tradeLongRatio = ratio;
  }
  switch (type) {
    case 'deposit':
      transactor.asset = tranche;
      transactor.usdSpent += amount * tradePrice;
      transactor.buys.push(amount * tradePrice);
      transactor.longRatios.push(tradeLongRatio);
      transactor.tradePrices.push(tradePrice);
      transactor.ethSpent += amount;
      break;
    case 'withdrawal':
      transactor.longRatios.push(tradeLongRatio);
      transactor.usdEnd = amount * tradePrice;
      transactor.ethEnd = amount;
      transactor.usdGain = (transactor.usdEnd - transactor.usdSpent) / transactor.usdSpent;
      transactor.ethGain = (transactor.ethEnd - transactor.ethSpent) / transactor.ethSpent;
      
      let mult = 1.5;
      if (tranche == 'diminishedTranche'){
        mult = 0.5;
      };

      let expectedGain = 0;
      let percCheck = 0;

      for (let i = 0; i < transactor.buys.length; i++) {
        let percWeight = transactor.buys[i] / transactor.usdSpent;
        let actualEthGain = (tradePrice - transactor.tradePrices[i]) / transactor.tradePrices[i];
        expectedGain += (actualEthGain * percWeight) * mult;
        percCheck += percWeight;
      };

      let averageBuyLongRatio = 0;
      let percCheckTwo = 0;

      for (let i = 0; i < (transactor.longRatios.length - 1); i++) {
        console.log('check: ');
        console.log(transactor.buys[i]);
        console.log(transactor.usdSpent);
        let percWeight = transactor.buys[i] / transactor.usdSpent;
        let portion = percWeight * transactor.longRatios[i];
        console.log('percweight ' + percWeight);
        console.log('long ratio ' + transactor.longRatios[i])
        averageBuyLongRatio += portion;
        percCheckTwo += percWeight;
      };

      transactor.avgLongRatioEntry = averageBuyLongRatio;
      transactor.longRatioEnd = tradeLongRatio;

      console.log('Perc Check!! Should equal 1: ' + percCheck);
      console.log('Perc Check TWO!! Should equal 1: ' + percCheckTwo);
      transactor.expGain = expectedGain;
      transactor.gainDiff = transactor.usdGain - transactor.expGain;
      tradeTxs.push(JSON.parse(JSON.stringify(transactor)));
      console.log(JSON.stringify(tradeTxs));

      // export trades
      let txSheet = SpreadsheetApp.getActive().getSheetByName('Interaction');
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.name);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.asset);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.usdSpent);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.usdEnd);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.usdGain);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.expGain);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.usdGain - transactor.expGain);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.expGain / mult);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.ethSpent);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.ethEnd);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.ethGain);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.avgLongRatioEntry);
      tradeCol++;
      txSheet.getRange(tradeRow,tradeCol).setValue(transactor.longRatioEnd);
      tradeCol++;
      
      tradeCol = 5;
      tradeRow++;

      transactor.buys = [];
      transactor.tradePrices = [];
      transactor.asset = '';
      transactor.usdSpent = 0;
      transactor.ethSpent = 0;
      transactor.usdEnd = 0;
      transactor.ethEnd = 0;
      transactor.usdGain = 0;
      transactor.expGain = 0;
      transactor.ethGain = 0;
      transactor.longRatios = [];
      transactor.avgLongRatioEntry = 0;
      transactor.longRatioEnd = 0;
      transactor.gainDiff = 0;

      break;
  }
}

// Random Version
function simulateRandomUse() {
  addInteractionSheet();
  txSheet = SpreadsheetApp.getActive().getSheetByName('Interaction');
  txSheet.getRange('dataOne').clearContent();
  txSheet.getRange('dataTwo').clearContent();
  // Set Starting Price
  ethPrice = 1700;
  startingPrice = ethPrice;
  endingPrice = ethPrice;
  setValue('startingPrice', startingPrice);
  setValue('endingPrice', endingPrice);
  // initialAllocation()
  // initialAllocation(1,5);
  initialAllocation(20,20);
  // set and record initial state
  setInitialState();
  createUsers();
  let priceSheet = SpreadsheetApp.getActive().getSheetByName('ethPrice');
  let ethPriceArray = priceSheet.getRange('ethPriceArray').getValues();
  
  function trade(user, day, type, tranche, amount, ratio) {
    if (day < currentDay) {
      console.error('Error: day is already past. You do not have a time machine.');
      console.error('Simulation aborted.');
      return;
    }
    currentDay = day;
    let tradePrice = ethPriceArray[day];
    let percentChangeConversion = (tradePrice - startingPrice) / startingPrice;
    transact(user, percentChangeConversion, type, tranche, amount);
    setTrades(user, percentChangeConversion, type, tranche, amount, tradePrice, ratio);
  };
  function withdrawAll(user, day, tranche) {
    let tradePrice = ethPriceArray[day];
    let percentChangeConversion = (tradePrice - startingPrice) / startingPrice;

    getCurrentValues();
    changePriceBy(percentChangeConversion);
    reallocate(percentChangeConversion);
    updateUserState();
    adjustForNewTx();
    let ratio = state.trancheBalances.longTranche.ethBal / state.trancheBalances.diminishedTranche.ethBal;
    let withdrawalAmount;
    switch (tranche) {
      case 'longTranche':
        withdrawalAmount = state.userBalances[user].longTranche.ethBal;
        break;
      case 'diminishedTranche':
        withdrawalAmount = state.userBalances[user].diminishedTranche.ethBal;
        break;
    };
    console.log('looking for this: ' + ratio);
    trade(user, day, 'withdrawal', tranche, withdrawalAmount, ratio);
  };
  // user, day                       amount
  // trade(1, 1, 'deposit', 'longTranche', 1);
  // trade(4, 1, 'deposit', 'diminishedTranche', 1);
  // trade(2, 2, 'deposit', 'longTranche', 1);
  // trade(3, 2, 'deposit', 'diminishedTranche', 1);
  // withdrawAll(4, 8, 'diminishedTranche');
  // withdrawAll(2, 15, 'longTranche');
  // trade(2, 20, 'deposit', 'diminishedTranche', 1);
  // withdrawAll(3, 31, 'diminishedTranche');

  txDay = 0;

  // START common sense simulation
  for (let i = 0; i < 50; i++) {
    let transactionType = randomIntFromInterval(1,2);
    let transactionTranche = randomIntFromInterval(1,2);
    let userToTransact = randomIntFromInterval(1,4);
    // let daysSinceLastTx = randomIntFromInterval(20,40); 
    let daysSinceLastTx = 10;
    let amountToTransact = randomIntFromInterval(1,10) / 10;
    txDay += daysSinceLastTx;
    console.log('on day ' + txDay + ' ' + transactionType + ' of ' + amountToTransact + ' to ' + transactionTranche);
    let l = state.trancheBalances.longTranche.ethBal; // 1
    let d = state.trancheBalances.diminishedTranche.ethBal; // 2
    
    let longRatio = l / d;
    if (longRatio < 0.8) {
      if (longRatio < 0.50) {
        amountToTransact = (0.5 * d) - l;
      };
      // userToTransact = randomIntFromInterval(1,2);
      transactionTranche = 1;
      transactionType = 1;
    } else if (longRatio > 1.3) {
      if (longRatio > 1.5) {
        amountToTransact = (0.6667 * l) - d;
      };
      // userToTransact = randomIntFromInterval(3,4);
      transactionTranche = 2;
      transactionType = 1;
    };

    let lDif = l - d;
    let dDif = d - l;
    let lMax = ((lDif + l) * 2) - l ;
    let dMax = ((dDif + d) * 2) - d ;
    let halfLMax = lMax / 2;
    let halfDMax = dMax / 2;
    if(l > d && transactionType == 1 && transactionTranche == 2) {
      if(amountToTransact > lMax) {
        amountToTransact = randomIntFromInterval(halfLMax,lMax);
      }
    } else if (d > l && transactionType == 1 && transactionTranche == 1) {
      if(amountToTransact > dMax) {
        amountToTransact = randomIntFromInterval(halfDMax,dMax);
      }
    }

    switch (transactionType) {
      case 1: // deposit
        console.log('deposit');
        switch (transactionTranche) {
          case 1: // long
            console.log('long');
            if(state.userBalances[userToTransact].diminishedTranche.ethBal > 0) {
              withdrawAll(userToTransact, txDay, 'diminishedTranche');
              console.log('withdraw diminished');
            };
            trade(userToTransact, txDay, 'deposit', 'longTranche', amountToTransact, undefined);
            console.log('and then deposit long');
            break;
          case 2: // diminished
          console.log('diminished');
            if(state.userBalances[userToTransact].longTranche.ethBal > 0) {
              withdrawAll(userToTransact, txDay, 'longTranche');
              console.log('withdraw long');
            };
            trade(userToTransact, txDay, 'deposit', 'diminishedTranche', amountToTransact, undefined);
            console.log('and then deposit diminished');
            break;
        }
        break;
      case 2: // withdraw
        console.log('withdawal');
        switch (transactionTranche) {
          case 1: // long
            console.log('long');
            if(state.userBalances[userToTransact].longTranche.ethBal > 0) {
              withdrawAll(userToTransact, txDay, 'longTranche');
              console.log('withdraw deposit');
            } else if (state.userBalances[userToTransact].diminishedTranche.ethBal > 0) {
              withdrawAll(userToTransact, txDay, 'diminishedTranche');
              console.log('withdraw diminished');
            } else {
              console.log('deposit diminished');
              trade(userToTransact, txDay, 'deposit', 'diminishedTranche', amountToTransact, undefined);
            }
            break;
          case 2: // diminished
            console.log('diminished');
            if(state.userBalances[userToTransact].diminishedTranche.ethBal > 0) {
              withdrawAll(userToTransact, txDay, 'diminishedTranche');
              console.log('withdraw diminished');
            } else if (state.userBalances[userToTransact].longTranche.ethBal > 0) {
              withdrawAll(userToTransact, txDay, 'longTranche');
              console.log('withdraw long');
            } else {
              trade(userToTransact, txDay, 'deposit', 'longTranche', amountToTransact, undefined);
              console.log('deposit long');
            }
            break;
        }
        break;
    }
  }
  // END common sense simulation

  // START classic simulation
  // for (let i = 0; i < 50; i++) {
  //   let transactionType = randomIntFromInterval(1,2);
  //   let transactionTranche = randomIntFromInterval(1,2);
  //   let userToTransact = randomIntFromInterval(1,4);
  //   // let daysSinceLastTx = randomIntFromInterval(20,40); 
  //   let daysSinceLastTx = 10;
  //   let amountToTransact = randomIntFromInterval(1,100) / 10;
  //   txDay += daysSinceLastTx;
  //   console.log('on day ' + txDay + ' ' + transactionType + ' of ' + amountToTransact + ' to ' + transactionTranche);
  //   switch (transactionType) {
  //     case 1: // deposit
  //       console.log('deposit');
  //       switch (transactionTranche) {
  //         case 1: // long
  //           console.log('long');
  //           if(state.userBalances[userToTransact].diminishedTranche.ethBal > 0) {
  //             withdrawAll(userToTransact, txDay, 'diminishedTranche');
  //             console.log('withdraw diminished');
  //           };
  //           trade(userToTransact, txDay, 'deposit', 'longTranche', amountToTransact);
  //           console.log('and then deposit long');
  //           break;
  //         case 2: // diminished
  //         console.log('diminished');
  //           if(state.userBalances[userToTransact].longTranche.ethBal > 0) {
  //             withdrawAll(userToTransact, txDay, 'longTranche');
  //             console.log('withdraw long');
  //           };
  //           trade(userToTransact, txDay, 'deposit', 'diminishedTranche', amountToTransact);
  //           console.log('and then deposit diminished');
  //           break;
  //       }
  //       break;
  //     case 2: // withdraw
  //       console.log('withdawal');
  //       switch (transactionTranche) {
  //         case 1: // long
  //           console.log('long');
  //           if(state.userBalances[userToTransact].longTranche.ethBal > 0) {
  //             withdrawAll(userToTransact, txDay, 'longTranche');
  //             console.log('withdraw deposit');
  //           } else if (state.userBalances[userToTransact].diminishedTranche.ethBal > 0) {
  //             withdrawAll(userToTransact, txDay, 'diminishedTranche');
  //             console.log('withdraw diminished');
  //           } else {
  //             console.log('deposit diminished');
  //             trade(userToTransact, txDay, 'deposit', 'diminishedTranche', amountToTransact);
  //           }
  //           break;
  //         case 2: // diminished
  //           console.log('diminished');
  //           if(state.userBalances[userToTransact].diminishedTranche.ethBal > 0) {
  //             withdrawAll(userToTransact, txDay, 'diminishedTranche');
  //             console.log('withdraw diminished');
  //           } else if (state.userBalances[userToTransact].longTranche.ethBal > 0) {
  //             withdrawAll(userToTransact, txDay, 'longTranche');
  //             console.log('withdraw long');
  //           } else {
  //             trade(userToTransact, txDay, 'deposit', 'longTranche', amountToTransact);
  //             console.log('deposit long');
  //           }
  //           break;
  //       }
  //       break;
  //   }
  // }
  // END classic simulation


  // trade(3, 1, 'deposit', 'longTranche', 1);
  // trade(3, 1, 'withdrawal', 'longTranche', 1);
  // trade(3, 1, 'deposit', 'diminishedTranche', 1);
  // trade(3, 1, 'withdrawal', 'diminishedTranche', 1);
  
  
  // console.log('final state');
  // console.log(JSON.stringify(state));
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function adjustForNewTx() {
  getCurrentValues();
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
  setValue('endingPrice', endingPrice);
  recordProtocolState();
  recordUserState();
}

function createUsers() {
  for (var i = 1; i <= 4; i++) {
    let newUser = {
      user: i,
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
  }
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
      if (state.userBalances.some(u => u.user === user) == false) {
        console.error('User does not exist.');
        return;
      };
      if (state.userBalances[user][tranche].ethBal < amount) {
        console.error('Not enough ETH to withdraw.');
        return;
      };
    };
    // update the users percent ownership of the tranche after price change
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
            console.log('depositing...');
            state.userBalances[user].diminishedTranche.ethBal += amount;
            state.trancheBalances.diminishedTranche.ethBal += amount;
            changeValueBy('diminishedAllocation', amount);
            break;
          case 'withdrawal':
            console.log('withdrawing...');
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
    // update user percent owned and usd balance AFTER the deposit or withdrawal
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

    // txHistory.push(tx); // temporary comment
    // console.log(JSON.stringify(tx));
    // console.log(JSON.stringify(state));
    exportData(tx.transactionDetails);
  };
};

let txRow = 2;

function exportData(tx) {
  let txSheet = SpreadsheetApp.getActive().getSheetByName('Interaction');
  txSheet.getRange(txRow,1).setValue(ethPrice);
  txSheet.getRange(txRow,2).setValue(state.trancheBalances.longTranche.ethBal);
  txSheet.getRange(txRow,3).setValue(state.trancheBalances.diminishedTranche.ethBal);
  let col = 4;
  let userId = 0;
  while (col < 32) {
    if(state.userBalances.some(u => u.user === userId) == true) {
      txSheet.getRange(txRow,col).setValue(state.userBalances[userId].longTranche.ethBal);
      col++;
      txSheet.getRange(txRow,col).setValue(state.userBalances[userId].longTranche.usdBal);
      col++;
      txSheet.getRange(txRow,col).setValue(state.userBalances[userId].longTranche.percent);
      col++;
      txSheet.getRange(txRow,col).setValue(state.userBalances[userId].diminishedTranche.ethBal);
      col++;
      txSheet.getRange(txRow,col).setValue(state.userBalances[userId].diminishedTranche.usdBal);
      col++;
      txSheet.getRange(txRow,col).setValue(state.userBalances[userId].diminishedTranche.percent);
      col++;
    } else {
      txSheet.getRange(txRow,col,1,6).setValue([0,0,0,0,0,0]);
      col = col + 6;
    }
    userId++;
  }
  txSheet.getRange(txRow,col).setValue(tx.user);
  col++;
  txSheet.getRange(txRow,col).setValue(tx.tranche);
  col++;
  txSheet.getRange(txRow,col).setValue(tx.txType);
  col++;
  txSheet.getRange(txRow,col).setValue(tx.ethAmount);
  col++;
  txSheet.getRange(txRow,col).setValue(tx.usdAmount);
  col++;
  txRow++;
}

function addInteractionSheet() {
  // Create new sheet if it doesn't exist already
  let txSheet;
  if (SpreadsheetApp.getActive().getSheetByName('Interaction') == null) {
    txSheet = ss.insertSheet('Interaction');
  } else {
    txSheet = SpreadsheetApp.getActive().getSheetByName('Interaction');
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


