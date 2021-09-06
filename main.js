//https://javascript.info/strict-mode
"use strict";

// for testing
let testMode = false;
let speed = "normal"; //fast, normal
speed = (testMode == true) ? "fast" : speed; //testMode defaults to "fast"
let skipPractice = false; // turn practice blocks on or off
let openerNeeded = false; // require menu.html to run task (needed for mturk)

// ----- Experiment Paramenters (CHANGE ME) ----- //
let stimInterval = (speed == "fast") ? 10 : 1500; //1500 stimulus interval
let fixInterval = (speed == "fast") ? 10 : 500; //500 ms intertrial interval
let nBlocks = 4, trialsPerBlock = 128; // (multiples of 16)
let nPracticeTrials = 16;
let miniBlockLength = 0; // break within block, every n trials. 0 to turn off
let practiceAccCutoff = (testMode == true) ? 0 : 75;
let taskAccCutoff = (testMode == true) ? 0 : 75;

function ITIInterval(){
  let itiMin = (speed == "fast") ? 20 : 1200; //1200
  let itiMax = (speed == "fast") ? 20 : 1400; //1400
  let itiStep = 50; //step size
  // random number between itiMin and Max by step size
  return itiMin + (Math.floor( Math.random() * ( Math.floor( (itiMax - itiMin) / itiStep ) + 1 ) ) * itiStep);
}

//initialize global task variables
let taskStimuliSet, cuedTaskSet, actionSet, switchRepeatArr, congruencyArr;
let canvas, ctx;
let expStage = (skipPractice == true) ? "main1-1" : "prac1-1";
let trialCount, blockTrialCount, acc, accCount, stimOnset, respOnset, respTime, block = 1, partResp, runStart, blockType = NaN, trialPoints;
let stimTimeout, breakOn = false, repeatNecessary = false, data=[];
let sectionStart, sectionEnd, sectionType, sectionTimer;
let screenSizePromptCount = 0, numScreenSizeWarnings = 2;
let keyListener = 0; // see below
/*  keyListener explanations:
      0: key press turned off
      1: task key press expected
      2: awaiting key up after task key press
      3: bad key press awaiting key up
*/

let pracOrder = randIntFromInterval(1,2);
  // case 1: practice parity first
  // case 2: practice magnitude first

let taskMapping = randIntFromInterval(1,4);
  // case 1: odd/even: "z" and "m", greater/less: "z" and "m"
  // case 2: odd/even: "z" and "m", greater/less: "m" and "z"
  // case 3: odd/even: "m" and "z", greater/less: "z" and "m"
  // case 4: odd/even: "m" and "z", greater/less: "m" and "z"

let colorMapping = randIntFromInterval(1,2);
  // case 1: odd/even = Red, greater/less = Blue
  // case 2: greater/less = Blue, odd/even = Red

// instrction variables based on mappings
let parityColor = (colorMapping == 1) ? "red" : "blue";
let magnitudeColor = (colorMapping == 1) ? "blue" : "red";
let parity_z = (taskMapping == 1 || taskMapping == 2) ? "odd" : "even";
let parity_m = (parity_z == "odd") ? "even" : "odd";
let magnitude_z = (taskMapping == 1 || taskMapping == 3) ? "greater than 5" : "less than 5";
let magnitude_m = (magnitude_z == "greater than 5") ? "less than 5" : "greater than 5";

let blockOrder = getBlockOrder(randIntFromInterval(1,4));
  // Latin square counterbalancing
  // 1:   A   B   D   C
  // 2:   B   C   A   D
  // 3:   C   D   B   A
  // 4:   D   A   C   B
  // see counterbalancing.js for details

  function experimentFlow(){
    if (openerNeeded == true && opener == null) {
      promptMenuClosed();
    } else {
      // reset block and trial counts
      accCount = 0;
      blockTrialCount = 1;
      trialCount = 1;

      // go to the correct task based on expStage variable
      if (expStage.indexOf("prac1") != -1){
        practiceTask("firstPractice", getFirstPracticeTask(), runPracticeTrial)
      } else if (expStage.indexOf("prac2") != -1){
        practiceTask("secondPractice", getSecondPracticeTask(), runPracticeTrial)
      } else if (expStage.indexOf("prac3") != -1){
        practiceTask("thirdPractice", "", runPracticeTrial)
      } else if (expStage.indexOf("main1") != -1){
        mainTask();
      } else {
        endOfExperiment();
      }
    }
  }

// ------ EXPERIMENT STARTS HERE ------ //
$(document).ready(function(){

  // prepare task canvas
  canvas = document.getElementById('taskCanvas');
  ctx = canvas.getContext('2d');
  ctx.font = "bold 60px Arial";
  ctx.textBaseline= "middle";
  ctx.textAlign="center";

  // create key press listener
  $("body").keypress(function(event){
    if (keyListener == 0) { //bad press
      keyListener = 3;
    } else if (keyListener == 1){ //good press
      keyListener = 2; //await key up

      partResp = event.which;
      acc = (actionSet[trialCount - 1].indexOf(partResp)) != -1 ? 1 : 0;
      if (acc == 1){accCount++;}

      // reaction time
      respOnset = new Date().getTime() - runStart;
      respTime = respOnset - stimOnset;
    }
  })

  // create key release listener
  $("body").keyup(function(event){
    if (keyListener == 2){
      keyListener = 0;
      clearTimeout(stimTimeout);
      itiScreen();
    } else if (keyListener == 3) {
      keyListener = 0;
    } else if (keyListener == 4) { //screen size warning
      keyListener = 0;
      countDown(3);
    } else if (keyListener == 5) { //start task (instructions)
      keyListener = 0;

      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([expStage, sectionType, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);

      // proceed to next task
      experimentFlow();
    } else if (keyListener == 6) { //instructions feedback
      keyListener = 0;

      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([expStage, sectionType, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);

      // proceed to instructions
      keyListener = 0;
      navigateInstructionPath(repeatNecessary);
    } else if (keyListener == 7) { //block break
      keyListener = 0;
      clearInterval(sectionTimer);

      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([expStage, sectionType, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
      console.log(data);

      // set block information
      block++;
      blockTrialCount = 1;
      blockType = blockOrder[block-1];

      // proceed to task
      sectionType = "mainTask";
      countDown(3);
    }

  });

  // see if menu.html is still open
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    runStart = new Date().getTime();
    runInstructions();
  }
});

function endOfExperiment(){
  try {
    // upload data to menu.html's DOM element
    $("#RTs", opener.window.document).val(data.join(";"));

    // call menu debriefing script
    opener.updateMainMenu(3);

    // close the experiment window
    JavaScript:window.close();
  } catch (e) {
    alert("Data upload failed. Did you close the opener window?");
  }
}

function promptMenuClosed(){
  $("#taskCanvas").hide();
  $('#instructionsDiv').hide();
  $('#MenuClosedPrompt').show();
}
