$(document).ready(function(){

  $(document).on("click", "#no-consent-btn", function(){
    $("#consent-form").hide();
    $("#consent-buttons").hide();
    $("#decline-to-participate").show();
  });

  $(document).on("click", "#yes-consent-btn", function(){
      let netID;
      while (!netID) {
          netID = prompt("Please enter your SONA ID Code (5 digits)", "");
      }
      window.open("menu.html?" + "workerid=" + netID + "&hitid=" + "SONA_sfr_1" + "&assid=" + netID , "_self");
  });
});
