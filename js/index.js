$(document).ready(function(){
  console.log("updated as of 9/16/21 6:23");
  let url = window.location.href;
  let subID = Boolean(url) ? url.split("?")[1] : "No_ID_specified";

  $(document).on("click", "#no-consent-btn", function(){
    $("#consent-form").hide();
    $("#consent-buttons").hide();
    $("#decline-to-participate").show();
  });

  $(document).on("click", "#yes-consent-btn", function(){
      window.open("menu.html?" + "workerid=" + subID + "&hitid=" + "SONA_sfr_1" + "&assid=" + subID , "_self");
  });
});
