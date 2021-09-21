// see function navigateInstructionPath() in tasks.js for naviagtion code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "prac2": 1, "prac3": 1, "main1-1": 1, "main1-2":1,"final": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 6, "prac1-2": 5, "prac2": 5, "prac3": 5, "main1-1": 4, "main1-2": 4, "final": 3
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, buttonPressNextSection, buttonPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": 'buttonPressStartTask',
    "prac2": 'buttonPressStartTask',
    "prac3": 'buttonPressStartTask',
    "main1-1": '#nextSectionButton',
    "main1-2": 'buttonPressStartTask',
    "final": 'buttonPressStartTask'
  }
};
let iterateAgain = false, task;

function navigateInstructionPath(repeat = false){
  if (repeat == true) {
    block++;
    repeatNecessary = false;
    // if multi stage instructions, ensures it goes back to first not second
    switch (expStage){
      // case "prac1-1":
      // case "prac1-2":
      //   expStage = "prac1-1";
      //   break;
    }
    runInstructions();
  } else {
    block = 1;
    switch (expStage){
      case "prac1-1":
        expStage = "prac1-2";
        break;
      case "prac1-2":
        expStage = "prac2";
        break;
      case "prac2":
        expStage = "prac3";
        break;
      case "prac3":
        expStage = "main1-1";
        break;
      case "main1-1":
        expStage = "main1-2";
        break;
      case "main1-2":
        expStage = "final";
        break;
    }
    runInstructions();
  }
}

function displayDefaults(stage){
  // default values of instruction blocks. add any special cases
  switch(stage){
    case "final":
      showFirst();
      $('.instruction-header').hide();
      break;
    default:
      showFirst();
      $('.instruction-header').show();
      break;
  }
}

function getNextInstructions(slideNum, expStage){
/* use the following options when modifying text appearance
    -  iterateAgain = true;
    -  changeTextFormat('#instructions' + slideNum,'font-weight','bold');
    -  changeTextFormat('#instructions' + slideNum,'font-size','60px');
    -  changeTextFormat('#instructions' + slideNum,'color','red');
    -  changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
    -  changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
    - $("<img src='../pics/finalpics/M33.jpg' class='insertedImage'>").insertAfter( "#instructions" + slideNum);
*/
  switch (expStage){
    case "prac1-1":
      switch (slideNum){
        case 1:
          return "Welcome to the experiment, thank you for your participation!";
        case 2:
          return "Remember, do not touch or close the previous window (that said 'Click continue to start the main task').";
        case 3:
          $( getImageText(instructionImages[2]) ).insertBefore( "#instructions" + slideNum);
          return "In this task, you will see a single number (1-9 excluding 5) appear in the middle of the screen. You will either need to identify the number as " + first_task() + " or identify the number as " + second_task() + ". On each trial, a colored rectangle surrounding the number will tell you how you should classify the number.";
        case 4:
          return "You will begin with a few practice tasks before beginning the main experiment. You will need to get at least " + practiceAccCutoff + "% correct on each practice section before you can move on to the next one.";
        case 5:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen.";
        case 6:
          return "Always respond as quickly and as accurately as possible during the tasks.";
      }
    case "prac1-2":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[get_task_image(1)]) ).insertAfter( "#instructions" + slideNum);
          return "In the first practice task, you will indicate whether the number in the center of the screen is " + first_task() + ".";
        case 2:
          return "Press 'Z' with your left hand index finger if the number is " + task_instruction(1,1) + ".";
        case 3:
          return "Press 'M' with your right hand index finger if the number is " + task_instruction(1,2) + ".";
        case 4:
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          iterateAgain = true;
          return "This block contains " + nPracticeTrials + " trials. Please place your hands on the 'Z' and 'M' keys as shown.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
    case "prac2":
      task = 2;
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[get_task_image(2)]) ).insertAfter( "#instructions" + slideNum);
          return "In the second practice task, you will indicate whether the number in the center of the screen is " + second_task() + ".";
        case 2:
          return "Press 'Z' with your left hand index finger if the number is " + task_instruction(2,1) + ".";
        case 3:
          return "Press 'M' with your right hand index finger if the number is " + task_instruction(2,2) + ".";
        case 4:
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          iterateAgain = true;
          return "This block contains " + nPracticeTrials + " trials. Please place your hands on the 'Z' and 'M' keys as shown.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
    case "prac3":
      switch (slideNum){
        case 1:
          return "In this last practice task, you will either indicate if the number is " + first_task() + " or if the number is " + second_task() + ", based on the color of the rectangle surrounding the number.";
        case 2:
          $( getImageText(instructionImages[get_task_image(1)]) ).insertBefore( "#instructions" + slideNum);
          return "If the rectangle is " + colorFirstTask() + ", indicate if the number is " + first_task() + " using the 'Z' and 'M' keys, respectively." ;
        case 3:
          $( getImageText(instructionImages[get_task_image(2)]) ).insertBefore( "#instructions" + slideNum);
          return "If the rectangle is " + colorSecondTask() + ", indicate if the number is " + second_task() + " using the 'Z' and 'M' keys, respectively." ;
        case 4:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "This block contains "+nPracticeTrials+" trials. Please place your hands on the 'Z' and 'M' keys as shown.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
      }
    case "main1-1":
      switch (slideNum){
        case 1:
          return "Great job! You are now ready to begin the main experiment.";
        case 2:
          return "In the main task, you will follow the same procedure as in the last practice task. The task will take approximately 20 minutes, and is divided into 4 sections, each lasting about 5 minutes.";
        case 3:
          return "You will receive points for each correct response. Some trials will be worth more points than others.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Your objective is to score as many points as possible. ";
      }
    case "main1-2":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[get_task_image(1)]) ).insertBefore( "#instructions" + slideNum);
          return "Remember, if the rectangle is " + colorFirstTask() + ", indicate if the number is " + first_task() + " using the 'Z' and 'M' keys, respectively." ;
        case 2:
          $( getImageText(instructionImages[get_task_image(2)]) ).insertBefore( "#instructions" + slideNum);
          return "If the rectangle is " + colorSecondTask() + ", indicate if the number is " + second_task() + " using the 'Z' and 'M' keys, respectively." ;
        case 3:
          iterateAgain = true;
          $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
          return "Please place your hands on the 'Z' and 'M' keys as shown.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin.";
        }
    case "final":
      switch (slideNum){
        case 1:
          iterateAgain = true;
          return "Thank you for your participation. Press any button to return to the other experiment window, which you used to open this experiment window. Be sure to read the final paragraph carefully and then submit your data to receive your confirmation code.";
        case 2:
          iterateAgain = true;
          return "DO NOT GO BACK TO THE OTHER WINDOW WITHOUT FIRST CLOSING THIS SCREEN VIA BUTTON PRESS. Doing otherwise may result in you losing all data from your participation.";
        case 3:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button on your keyboard to close this window.";
      }
  }
}

function runInstructions(){
  document.body.style.cursor = 'auto';

  // main instruction function (come here at start of instruction block)
  sectionStart = new Date().getTime() - runStart;
  sectionType = "instructions";

  // hide/clear everything, just in case
  hideInstructions();

  // hide canvas if visible
  canvas.style.display = "none";

  // if need to repeat instructions (e.g., participant failed to meet accuracy requirement), then reshow all instructions
  if (instructions["iterator"][expStage] >= instructions["max"][expStage]){

    // loop through instructions and show
    for (var i = 1; i <= instructions["max"][expStage]; i++) {
      $('#instructions' + i).text( getNextInstructions( i, expStage ));
    }

    // reset iterateAgain incase looping turned it on by accident
    iterateAgain = false;

    // display instructions and prepare exit response mapping
    $('.instructions').show();
    exitResponse();

  } else {

    // remove any previous click listeners, if any
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");

    // clear all previous instructions, reset styles, and remove pictures
    for (let i = 1; i <= 8; i++) {
      $('#instructions' + i).text("");
      resetDefaultStyles('#instructions' + i);
      $('.insertedImage').remove();
    }

    // display proper instruction components, in case they are hidden
    $('.instructions').show();
    $('#nextInstrButton').show();
    $('#nextSectionButton').hide();
    $('#startExpButton').hide();
    displayDefaults(expStage);
  }

  /* code for "Next" button click during instruction display
        if running from Atom, need to use $(document).on, if through Duke Public Home Directory, either works.
        https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing
  */
  $(document).on("click", "#nextInstrButton", function(){
  // $("#nextInstrButton").on('click', function(){
    iterateInstruction();
  });

  // code for click startExperiment button
  $(document).on('click', '#startExpButton', function(){
    $('.instructions').hide();
    $('#startExpButton').hide();
    $('.insertedImage').remove();

    // log data for time spent on this section
    sectionEnd = new Date().getTime() - runStart;
    data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
    console.log(data);

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    experimentFlow();
  });

  $(document).on('click', '#nextSectionButton', function(){
    // log data for time spent on this section
    sectionEnd = new Date().getTime() - runStart;
    data.push([expStage, sectionType, block, blockType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
    console.log(data);

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    navigateInstructionPath();
  });
};

function iterateInstruction(){
  let instrNum = instructions["iterator"][expStage];
  $('#instructions' + instrNum).text( getNextInstructions( instrNum, expStage));

  // iterate as appropriate or allow next phase
  if (instrNum < instructions["max"][expStage]){
    instructions["iterator"][expStage]++;
  } else{
    exitResponse();
  }

  if (iterateAgain == true) {
    iterateAgain = false;
    iterateInstruction();
  }
}

function exitResponse(){
  $('#nextInstrButton').hide();
  if (instructions["exitResponse"][expStage] == "#startExpButton"){
    $('#startExpButton').show();
  } else if (instructions["exitResponse"][expStage] == "#nextSectionButton") {
    $('#nextSectionButton').show();
  } else if (instructions["exitResponse"][expStage] == "buttonPressStartTask"){
    setTimeout(function(){keyListener = 5;},250);
  } // else if (instructions["exitResponse"][expStage] == "keyPressNextSection"){
  //   keyListener = 9;
  // }
}

function getImageText(imageURL){
  let fileName = getFileName(imageURL);
  return "<img src='" + imageURL + "' class='insertedImage' id='"+ fileName +"'>";
}

function getFileName(path){
  let n = path.lastIndexOf('/');
  return path.substring(n + 1);
}

function showFirst() {
  iterateInstruction();
}

function changeTextFormat(elementName, property ,changeTo){
  $(elementName).css( property , changeTo );
}

function hideInstructions(){
  // remove any previous click listeners, if any
  $(document).off("click","#nextInstrButton");
  $(document).off("click","#startExpButton");
  $(document).off("click","#nextSectionButton");

  // hide instruction DOMs
  $('.instructions').hide();
  $('#startExpButton').hide();
  $('#nextSectionButton').hide();

  // clear text from instruction DOMs
  for (let i = 1; i <= 8; i++) {
    $('#instructions' + i).text("");
    resetDefaultStyles('#instructions' + i);
    $('.insertedImage').remove();
  }
}

function resetDefaultStyles(domObject){
  $(domObject).css('font-weight','');
  $(domObject).css('font-size','');
  $(domObject).css('color','');
  $(domObject).css('margin-top','');
  $(domObject).css('margin-bottom','');
}
