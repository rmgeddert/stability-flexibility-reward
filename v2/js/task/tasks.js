function practiceTask(name, task, func, trials){
  sectionType = "pracTask";
  taskName = name;
  hideInstructions();
  $("#taskCanvas").show();
  createArrays(trials, task);
  taskFunc = func;
  countDown(3);
}

function mainTask(){
  sectionType = "mainTask";
  taskName = "mainTask";
  blockType = blockOrder[block-1];
  hideInstructions();
  $("#taskCanvas").show();
  createArrays(trialsPerBlock * nBlocks, "");
  taskFunc = runMainTrial;
  countDown(3);
}

function createArrays(nTrials, task){
  let taskStimPairs = createStimPairs(nTrials, task);
  taskStimuliSet = getStimSet(taskStimPairs);
  cuedTaskSet = getTaskSet(taskStimPairs);
  congruencyArr = getCongruencyArr(taskStimPairs);
  switchRepeatArr = getSwitchRepeatArr(cuedTaskSet);
  actionSet = createActionArray();
}

function runPracticeTrial(){
  if (openerNeeded == false || opener != null) {

    if (trialCount <= taskStimuliSet.length){
      // if (expType == 3){ //check if key is being held down
      //   expType = 4;
      //   promptLetGo();
      // } else {
        // check if screen size is big enough
        if (screenSizeIsOk()){
          fixationScreen();
        } else {
          promptScreenSize();
        }
      // }

    } else { //if practice block is over, go to feedback screen
      practiceAccuracyFeedback( Math.round( accCount / (trialCount - 1) * 100 ) );
    }

  } else {
    promptMenuClosed();
  }
}

function runMainTrial(){
  if (openerNeeded == false || opener != null) {

    if (trialCount <= trialsPerBlock * nBlocks){

      // checks if block break
      if (trialCount > 1 && trialCount != trialsPerBlock * nBlocks && (trialCount - 1)%trialsPerBlock == 0 && !breakOn) {
        breakOn = true;
        blockBreak();
      } else {
        breakOn = false;
        if (screenSizeIsOk()){
          fixationScreen();
        } else {
          promptScreenSize();
        }
      }

    } else {
      breakOn = false;
      navigateInstructionPath();
    }

  } else {
    promptMenuClosed();
  }
}

function fixationScreen(){
  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "black";
  // fixation
  ctx.fillText("",canvas.width/2,canvas.height/2);
  // next function
  setTimeout(stimScreen, fixInterval);
}

function stimScreen(){
  // if (keyListener == 5) {
  //
  //   keyListener = 6;
  //   promptLetGo();
  //
  // } else {

    // stim onset and prep canvas
    stimOnset = new Date().getTime() - runStart;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw rectangular cue
    drawRect();
    drawStimulus();

    //reset all response variables and await response (keyListener = 1)
    keyListener = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;

    // proceed to ITI screen after timeout
    stimTimeout = setTimeout(itiScreen,stimInterval);
  // }
}

function itiScreen(){
  if (keyListener == 1) { // participant didn't respond
    keyListener = 0;
  } else if (keyListener == 2) { //participant still holding down response key
    keyListener = 3;
  }

  if (sectionType == "mainTask") {
    trialPoints = getPoints();
    drawPoints();
  } else {
    trialPoints = NaN;
    drawFeedback();
  }

  // variable for readability below
  let stim = taskStimuliSet[trialCount - 1];

  // log data
  data.push([taskName, sectionType, block, blockType, trialCount,
    blockTrialCount, getAccuracy(acc), respTime, stim,
    congruencyArr[trialCount-1], cuedTaskSet[trialCount-1], switchRepeatArr[trialCount-1], trialPoints, partResp, stimOnset, respOnset, actionSet[trialCount-1][1], NaN, NaN, NaN]);
  console.log(data);

  // trial finished. iterate trial counters
  trialCount++; blockTrialCount++;

  // proceed to next trial or to next section after delay
  setTimeout(taskFunc, ITIInterval());
}

function drawStimulus(){
  ctx.fillStyle = "black";
  ctx.font = "bold 100px Arial";
  ctx.fillText(taskStimuliSet[trialCount - 1],canvas.width/2,canvas.height/2);
}

function drawPoints(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 60px Arial";

  if (acc == 1) {
    let pointsText = String(trialPoints);
    // if (points < 10) {
    //   pointText = "0" + String(points)
    // } else {
    //   pointText = String(points)
    // }
    ctx.fillStyle = "green";
    ctx.fillText("+"+pointsText,canvas.width/2,canvas.height/2);
  } else if (acc == 0) {
    ctx.fillStyle = "red";
    ctx.fillText("Incorrect",canvas.width/2,canvas.height/2);
  } else {
    ctx.fillStyle = "black";
    ctx.fillText("Too slow",canvas.width/2,canvas.height/2);
  }
}

function getPoints(){
  let congruencyPoints = blockRewards[blockOrder[block-1]][congruencyArr[trialCount - 1]];
  let switchTypePoints = blockRewards[blockOrder[block-1]][switchRepeatArr[trialCount - 1]];
  if (congruencyPoints == 1 && switchTypePoints == 1) {
    return 10;
  } else {
    return 1;
  }
}

function drawFeedback(){
  ctx.fillStyle = accFeedbackColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 60px Arial";
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
}

function drawRect(){
  // text margin
  let borderMargin = 40;

  // set size of rectangle
  let frameWidth = 160;
  let frameHeight = 160;

  // draw box
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = (cuedTaskSet[trialCount - 1] == "m") ? magnitudeColor : parityColor;
  ctx.rect((canvas.width/2) - (frameWidth/2), (canvas.height/2) - (frameHeight/2) - 5, frameWidth, frameHeight);
  ctx.stroke();
}

function practiceAccuracyFeedback(accuracy){
  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  keyListener = 6;

  // display feedback
  if (accuracy < practiceAccCutoff) { //if accuracy is too low
    repeatNecessary = true;

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

  } else { //otherwise proceed to next section
    repeatNecessary = false;

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Press any button to go on to the next section.",canvas.width/2,canvas.height/2 + 100);
  }
}

function blockBreak(){
  sectionType = "blockBreak";
  sectionStart = new Date().getTime() - runStart;
  keyListener = 0; //else keylistener stays = 1 till below runs
  setTimeout(function(){keyListener = 7},1000);

  // display break screen (With timer)
  drawBreakScreen("02","00");
  blockBreakFunction(1,59);

  function blockBreakFunction(minutes, seconds){
    let time = minutes*60 + seconds;
    ctx.fillStyle = "black";
    sectionTimer = setInterval(function(){
      if (time < 0) {return}
      ctx.fillStyle = (time <= 60) ? "red" : "black";
      let minutes = Math.floor(time / 60);
      if (minutes < 10) minutes = "0" + minutes;
      let seconds = Math.floor(time % 60);
      if (seconds < 10) seconds = "0" + seconds;
      drawBreakScreen(minutes, seconds);
      time--;
    }, 1000);
  }

  function drawBreakScreen(minutes, seconds){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw timer (with color from previous function)
    ctx.font = "bold 45px Arial";
    ctx.fillText(minutes + ":" + seconds,canvas.width/2,canvas.height/2 - 100);

    // display miniblock text
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("This is a short break. Please don't pause for more than 2 minutes.",canvas.width/2,canvas.height/2 - 150);
    if (nBlocks - block > 1) {
      ctx.fillText("You are finished with block " + block + ". You have " + (nBlocks  - block) + " blocks left.",canvas.width/2,canvas.height/2);
    } else {
      ctx.fillText("You are finished with block " + block + ". You have " + (nBlocks - block) + " block left.",canvas.width/2,canvas.height/2);
    }
    ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2+50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 200);
  }
}
