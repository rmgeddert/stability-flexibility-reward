function createStimPairs(nTrials, task){
  let congruenciesArr = createCongruencyArray(nTrials);
  let taskArr = createTaskArray(nTrials, task);
  let targetArr = createTargetsArr(nTrials, congruenciesArr);
  return stimTaskPairArr = targetArr.map((s, i) => [s, taskArr[i], congruenciesArr[i]]);
}

function createCongruencyArray(nTrials){
  // create shuffled 50/50 congruency array
  let nConTrials = Math.ceil(nTrials * 0.5);
  let nIncTrials = nTrials - nConTrials;
  return shuffle(new Array(nConTrials).fill("c").concat(new Array(nIncTrials).fill("i")));
}

function createTaskArray(nTrials, task){
  if (task == "") {
    let taskA = "m", taskB = "p";

    // calc how many switch and repeat trials needed
    let nSwitchTrials = Math.ceil(nTrials * 0.5);
    let nRepeatTrials = nTrials - nSwitchTrials;

    // choose which task is first
    let task1 = (Math.random() > 0.5) ? taskA : taskB;
    let task2 = (task1 == taskA) ? taskB : taskA;

    //build array with switch trial pairs ("A", "B") x ###
    let taskArr = [];
    for (let i = 0; i < Math.ceil((nTrials * 0.5) / 2); i++) {
      taskArr.push(task1);
      taskArr.push(task2);
    }

    // get number of switches
    nSwitches = taskArr.length;

    //function to get all indices of a certain value(val) in an array (arr)
    function getAllIndexes(arr, val) {
      var indexes = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {indexes.push(i);}
      }
      return indexes;
    }

    // insert repeat trials into taskArr
    for (let i = 0; i < Math.ceil((nTrials - nSwitches) / 2); i++) {
      // insert an A task
      let a_indexes = getAllIndexes(taskArr,taskA);
      let repeatloc_a = a_indexes[Math.floor(Math.random()*a_indexes.length)];
      taskArr.splice(repeatloc_a, 0, taskA);

      // insert task B
      let b_indexes = getAllIndexes(taskArr,taskB);
      let repeatloc_b = b_indexes[Math.floor(Math.random()*b_indexes.length)];
      taskArr.splice(repeatloc_b, 0, taskB);
    }

    return taskArr;
  } else {
    return new Array(nTrials).fill(task);
  }
}

// create what correct answer on each trial is
function createTargetsArr(nTrials, congruenciesArr){
  let targetsArr = [];
  for (let i = 0; i < nTrials; i++) {
    if (congruenciesArr[i] == "c") {
      if (taskMapping == 1 || taskMapping == 4) {
        if (i != 0) {
          targetsArr.push(_.sample([2,4,7,9].filter(n => n != targetsArr[i - 1])));
        } else {
          targetsArr.push(_.sample([2,4,7,9]));
        }
      } else {
        if (i != 0) {
          targetsArr.push(_.sample([1,3,6,8].filter(n => n != targetsArr[i - 1])));
        } else {
          targetsArr.push(_.sample([1,3,6,8]));
        }
      }
    } else {
      if (taskMapping == 1 || taskMapping == 4) {
        if (i != 0) {
          targetsArr.push(_.sample([1,3,6,8].filter(n => n != targetsArr[i - 1])));
        } else {
          targetsArr.push(_.sample([1,3,6,8]));
        }
      } else {
        if (i != 0) {
          targetsArr.push(_.sample([2,4,7,9].filter(n => n != targetsArr[i - 1])));
        } else {
          targetsArr.push(_.sample([2,4,7,9]));
        }
      }
    }
  }
  return targetsArr;
}

// determine if trial is switch or repeat (first trials in blocks are "n")
function getSwitchRepeatArr(taskArr){
  let switchRepeatArr = [], prevTask;
  for (let i = 0; i < taskArr.length; i++){
    // check if task switch/repeat and increment
    if ((i % trialsPerBlock != 0) && (i % miniBlockLength != 0)) {
      //if not first trial of block
      if (taskArr[i] == prevTask) { //trial is repeat
        switchRepeatArr.push("r");
      } else { //trial is switch
        switchRepeatArr.push("s");
      }
    } else {
      //first trial so not switch or repeat, classify as "n"
      switchRepeatArr.push("n");
    }

    //prepare prevTask for next loop iteration
    prevTask = taskArr[i];
  }
  return switchRepeatArr;
}

// extracts just stimulus from stim/task array
function getStimSet(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][0]); //0 b/c stim are 1st in stimTaskPair arr
  }
  return newArr;
}

// extracts just task from stim/task array
function getTaskSet(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][1]); //1 b/c task is 2nd in stimTaskPair arr
  }
  return newArr;
}

function getCongruencyArr(arr){
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
   newArr = newArr.concat(arr[i][2]); //1 b/c task is 2nd in stimTaskPair arr
  }
  return newArr;
}

function createActionArray(){
  let responseMappings = {
    1: {
      odd : [90,122],
      even : [77,109],
      larger : [90,122],
      smaller : [77,109]
    },
    2: {
      odd : [90,122],
      even : [77,109],
      larger : [77,109],
      smaller : [90,122]
    },
    3: {
      odd : [77,109],
      even : [90,122],
      larger : [90,122],
      smaller : [77,109]
    },
    4: {
      odd : [77,109],
      even : [90,122],
      larger : [77,109],
      smaller : [90,122]
    }
  };

  // for each stimulus and associated task, identify required action for correct response
  let actionArr = [];
  taskStimuliSet.forEach(function(taskStim, index){
    let task = cuedTaskSet[index];
    actionArr.push(responseMappings[taskMapping][getCategory(taskStim, task)]);
  })
  return actionArr;
}

function getCategory(number, task){
  if (task == "m") {
    if (number < 5) {
      return "smaller";
    } else {
      return "larger";
    }
  } else {
    if (number%2 == 0) {
      return "even";
    } else {
      return "odd";
    }
  }
}
