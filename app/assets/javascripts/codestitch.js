function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function setCurrentLevel(cs_lvl) {
    csCurrentLevel = cs_lvl;
    setCookie("csLevel", cs_lvl, 7300); //20 years
}

//Google Analytics
(function (i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-76776475-1', 'auto');
  ga('send', 'pageview');

/*
<Add a description of the game here>
The code in this game is built upon a javascript interpreter by 
Peter Jipsen - referenced here by way of thanks.
Version of Jan 3, 2013, (c) Peter Jipsen http://www.chapman.edu/~jipsen
Latest version at http://www.chapman.edu/~jipsen/js
If you use it on a webpage, please send the URL to jipsen@chapman.edu
Mr. Jipsen's interpreter and this game are both 
free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or (at
your option) any later version.
This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License (at http://www.gnu.org/copyleft/gpl.html) 
for more details.
*/
// Global variables
var KnitShopStitchHeight=18;
var KnitShopStitchWidth=30;
var stitches = [];
var alreadyDrawing;
var KnitShopXPosition,KnitShopYPosition;
var ksr,ksg,ksb;
var ksColor;
var knitspeed = 200;
var csCurrentLevel = 0;
var csLevelsCompleted = [];
var csMySolution = "";
var csHerSolution = "";
var kcThumbnail;

JSoutput = function(a) {
    var str = "["
    if (typeof(a)=="object" && a.length) {
        for (var i=0; i < a.length; i++) 
            if (typeof(a[i])=="object" && a[i].length) {
                str += (i==0?"":" ")+"["
                for (var j=0; j<a[i].length; j++) 
                    str += a[i][j]+(j==a[i].length-1?
                            "]"+(i==a.length-1?"]":",")+"\n":", ");
            } else str += a[i]+(i==a.length-1?"]":", ");
    } else str = a;
    return str;
}


newRow = function() {
	stitches.push("newrow");
	drawQueue();
}
setColor = function(r,g,b) {
   ksr = r;
   ksg = g;
   ksb = b;
 
   if(r != null && g == null && b == null) {
      //assume at this point that a string was given as first argument
      //if the argument begins with #, it's a hex color, otherwise it's text
  if(r.charAt(0) == '#') {
	  ksColor=r;
	  return;
  }
  
  switch (r) {
        case "purple":
	   ksColor="#A020F0";
	   ksr=160;
	   ksg=32;
	   ksb=240;
	   break;
	case "black":
	   ksColor="#000000";
           ksr=0;
	   ksg=0;
	   ksb=0;
           break;
        case "white":
	   ksColor="#FFFFFF";
           ksr=255;
	   ksg=255;
	   ksb=255;
           break;    
        case "red":
	   ksColor="#FF0000";
           ksr=255;
	   ksg=0;
	   ksb=0;
           break;
        case "green":
	   ksColor="#00FF00";
           ksr=0;
	   ksg=255;
	   ksb=0;
           break;
        case "blue":
	   ksColor="#0000FF";
           ksr=0;
	   ksg=0;
	   ksb=255;
           break;
        case "yellow":
	   ksColor="#FFFF00";
	   ksr=255;
	   ksg=255;
	   ksb=0;
	   break;
	case "orange":
	   ksColor="#FFA500";
	   ksr=255;
	   ksg=165;
	   ksb=0;
	   break;
	default:
           ksColor="#ffffff";
	   //stitchRGB(0,0,0);
     }
   }
}
stitch = function(x) {
   if(x == null) x=1;
   if(ksColor == null) ksColor="#000000";
   for(stitchindex = 0; stitchindex<x; stitchindex++){
	stitches.push(ksColor);
   }
   drawQueue();
}

blankStitch = function(x) {
   if(x == null) x=1;
   for(stitchindex = 0; stitchindex<x; stitchindex++){
        stitches.push("blankstitch");
   }
   drawQueue();
}


function drawQueue() {
	if(alreadyDrawing) {
		return;
	}
	alreadyDrawing = true;
	
	setTimeout(function drawStitches() {
		var drawColor = stitches.shift();
		if(!drawColor) {
			alreadyDrawing = false;
			//we've completed drawing the whole queue, now test for level completion
                        var lvlCompleted = csTestLevelCompleted();
		        if(lvlCompleted) {
			   if( $('#current_user').length > 0 ) {
				//save the solution under this user's collection of solutions
				var solutionString = escape(document.getElementById("JSprogram").value);
				var csrfToken = $('#csrf-token').val();
		           //we're going to do this the AJAX way so our game
			   //remains a single-page application.
				$.ajax("/solutions", {type: "POST", async: true, data: {content: solutionString, level: csCurrentLevel }})
			   }
		           csAdvanceLevel();
		        }
		        if(!lvlCompleted) {
                          if( $('#current_user').length > 0 ) {
			   //Save the attempt for future reference
			   var solutionString = escape(document.getElementById("JSprogram").value);
			   $.ajax("/attempts", {type: "POST", async: true, data: {content: solutionString, level: csCurrentLevel }})
                          }
		           // output something in the hint field
			   $( "#dialogFail" ).dialog( "open" ); 
			   var ran = Math.random();
			   ran = Math.floor(ran*100 % csSnarkyRemarks.length);
			   $( "#csComments" ).html(csSnarkyRemarks[ran]);
		        }
                        
			return;
		}
		//If the previous if didn't catch, then we're still drawing the queue elements
		if(drawColor == "newrow" || drawColor == "blankstitch") {
			if(drawColor == "newrow") drawNewRow();
			if(drawColor == "blankstitch") drawBlankStitch();
		}
		else {
			draw(drawColor);
		}
		setTimeout(drawStitches, knitspeed);
	},knitspeed); //end of first setTimeout call
  
}
function draw(rgb) {
    
	var c = document.getElementById("html5canvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("stitchpng");
    
    //c.setAttribute("width",c.width+KnitShopStitchWidth);
    ctx.fillStyle=rgb;
    ctx.fillRect(KnitShopXPosition,KnitShopYPosition,KnitShopStitchWidth,KnitShopStitchHeight)
    ctx.drawImage(img,KnitShopXPosition,KnitShopYPosition,KnitShopStitchWidth,KnitShopStitchHeight);
    KnitShopXPosition+=KnitShopStitchWidth;

    /*
    // DEBUG: constantly write out a png version of the canvas.
    var tmppng = c.toDataURL('png');
    var tmpimage = document.getElementById("thumbnail");
    tmpimage.setAttribute("src",tmppng);*/

    //cropImageFromCanvas(ctx, c);
	
}
function drawNewRow() {

  //var c = document.getElementById("html5canvas");
  //c.setAttribute("height",c.height+KnitShopStitchHeight);
  KnitShopXPosition=0;
  KnitShopYPosition += KnitShopStitchHeight;

}
function drawBlankStitch() {
	KnitShopXPosition += KnitShopStitchWidth;
	//var c = document.getElementById("html5canvas");    
    //c.setAttribute("width",c.width+KnitShopStitchWidth);
    
}


//This function unfortunately didn't allow for a repaint between actions, so it's not useful
KSWait = function(KnitShopms){
//TODO: make KnitShopms variable depending on a configurable parameter.
    if(!KnitShopms || KnitShopms>10000) KnitShopms=250;
    var start = new Date().getTime();
    var current = new Date().getTime();
    var end = start+KnitShopms;
    while(current < end) {
       current = new Date().getTime();
    }
}
//TODO: define the size of the canvas, or query it, and add as numbers below
clearCanvas = function() {
  KnitShopXPosition = 0;
  KnitShopYPosition = 0;
  var c = document.getElementById("html5canvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);
  //var canvas = document.getElementById("canvas");
	//canvas.innerHTML = "<img class='csKnittingNeedle' src='<%= asset_path('woodknitneedle.png') %>' style='width:100%'><div class='csRow'></div>";
}
JSrun = function() {
    //Easter Egg
    if(document.getElementById("JSprogram").value.trim() == "MEOW") {
	document.getElementById("csCheats").style.display = "block";
        ga('set', 'page', '/csMEOW');
        ga('send', 'pageview');
	return;
    }
    // Notify Google Analytics of user activity each time the user hits "GO"
    // Find definition of this function in codeStitch.js

    //Google says do not create new trackers in Single Page Apps, so this is commented out.
    //ga('create', 'UA-76776475-1', 'auto');
    var csGAPageName = "/csKnitCircle";
    ga('set', 'page', csGAPageName);
    ga('send', 'pageview');
 

    var str;
    alreadyDrawing = false;
    clearCanvas();
    var outnode = document.getElementById("JSoutput");
    outnode.value = "";
    //d = new Date().getTime();
    try {
        with (Math) {
	    
            str = JSoutput(eval(document.getElementById("JSprogram").value));
        }
    } catch(e) {
        str = e.name+" at line "+(e.lineNumber-56)+": "+e.message;
        if( $("#current_user" ).length > 0) {
          //AJAX call to insert failed attempt
	  var solutionString = escape(document.getElementById("JSprogram").value);
          $.ajax("/attempts", {type: "POST", async: true, data: {content: solutionString, level: csCurrentLevel }})
        }

    }
    //var tnode = document.getElementById("JStiming");
    //tnode.innerHTML = ""+(new Date().getTime()-d)/1000;
    if (str != undefined) {outnode.value += str;}
}
csTestLevelCompleted = function() {
   return true;
	
}

addToPatterns = function(sol_id) {
	$.ajax({url: "/patterns", async: true, type: "POST", data: {solution_id: sol_id}});
 };
saveSolution = function(level_number) {
        var solutionString = escape(document.getElementById("JSprogram").value);
        $.ajax("/solutions", {type: "POST", async: true, data: {content: solutionString, level: level_number }})

};
csPresentAlternateSolution = function() {
                //AJAX call to retrieve compare solution
                //Note that calling /solutions will return an html formatted
                //representation of the solution, but calling /solutions.json
                //will return an object of type Solution.

		csMySolution = document.getElementById("JSprogram").value;

                $.ajax({url: "/solutions.json", async: true, data: {level: csCurrentLevel-1 }, datatype: "json"}).done( 
                        function( data ) {$("#dialogCompareRight").html("<h3>"+data.first_name +"\'s Solution:</h3><a id=\"addPattern\" title=\"Click to save in your Patterns Drawer\" href=# onclick=\"addToPatterns("+data.id+");return false;\">Save in Patterns</a><textarea style=\"width: 100%; height: 4in\">"+unescape(data.content)+"</textarea>")}
                );

                $("#dialogCompareLeft").html("<h3>Your Solution:</h3><a id=\"addMyPattern\" title=\"Click to save in your Patterns Drawer\" href=# onclick=\"addToPatterns(0);return false;\">Save in Patterns</a><textarea style=\"width: 100%; height: 4in\">"+csMySolution+"</textarea>");
                $("#dialogCOMPARE").dialog( "open" );

}
csAdvanceLevel = function() {
   //Do nothing.
}
JSselect = function() {
    var id = document.getElementById("JSexamples").value;
    var str = document.getElementById(id).value;
    document.getElementById("JSprogram").value = str;
    JSrun();
}
keyUp = function(event){
  if (event.which==77 && event.ctrlKey) JSrun();
}
/*
//General TODO's
- Look up the pixel width on an ipad in portrait mode and make the <tr> containing the code and output
  add up to that width. No messing with percentages, make this explicit.
X must implement game flow and level logic.
- come up with at least 12 levels of incremental difficulty.
X find some way to animate the knitting instead of immediately showing the result.
- Show user name instead of user ID in the patterns box next to saved solutions.
- Show thumbnail images of patterns next to their code in the patterns box.

*/

var getCurrentLevelButton = function(levelIndex) {
        if(levelIndex <= 5 ) {
           return  "#opener1"+btnIndex;
        }
        if(levelIndex > 5) {
           var lvlname = levelIndex -6;
           return "#opener2"+lvlname ;
        }

}

  //This script will run once upon loading the page
  //The following is JQuery UI scripting for User Interface effects
  $(function() {
    var enablebutton;
    $( ".csDialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
	  buttons: [ {
		text: "Okay",
		click: function() { $(this).dialog("close");}
	   }
	  ],
      width: 500,
    });
    $( "#dialogCOMPARE" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
          buttons: [ {
                text: "Okay",
                click: function() { $(this).dialog("close");}
           }
          ],
      width: 1000,
      height: 700,
    });
    $( "#dialogPATTERNS" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
          buttons: [ {
                text: "Okay",
                click: function() { $(this).dialog("close");}
           }
          ],
      width: 1000,
    });


    $( ".csDiaBtn" ).button();
    for (btnIndex=0; btnIndex <= getCookie("csLvl"); btnIndex++) {
	enablebutton = getCurrentLevelButton(btnIndex);
	$( enablebutton).button("enable");
	csCurrentLevel = btnIndex;
    }
    $( ".kcSaveThumbnail" ).button();
    
    $( "#radioset" ).buttonset();
    $( "#knitnowbutton" ).button();
    
    
    $( "#csKnitPatterns" ).on('click', function() {
      //Fill the patternsTable with content via AJAX query
      $.ajax({url: "/patterns.json", async: true, datatype: "json"}).done( 
	function(data) {
          //for each pattern in data, make a table row showing user and content
 	 if(data.length > 0) { $( "#patternsTable").html(""); }
         $.each(data,  function(index) {
	    var newPatternRow = document.createElement("tr");
            var newPatternName = document.createElement("td");
            var newPatternContent = document.createElement("td");
	    var newTextarea = document.createElement("textarea");
            newTextarea.setAttribute("style", "width: 100%;");

            var csNode = document.createTextNode("User: " +data[index].user_id + ", Level: "+data[index].level);
            newPatternName.appendChild(csNode);
            csNode = document.createTextNode(unescape(data[index].content));
            newPatternContent.appendChild(newTextarea);
	    newTextarea.appendChild(csNode);
            //var stitchnode = document.createElement("img");
        //stitchnode.setAttribute("src", "//public/images/stitch_semitrans.png");
	    newPatternRow.appendChild(newPatternName);
	    newPatternRow.appendChild(newPatternContent);
	    $( "#patternsTable" ).append(newPatternRow);
	 });

        }
      ); //end of ajax call. 
      $( "#dialogPATTERNS" ).dialog( "open" );
    });
    
    $( "#openerSBX" ).click(function() {
      $( "#csLevelGoal").html("<p>Sandbox - open play<br/> What will <b>you</b> make?</p>");
      csCurrentLevel = 999;

      if( $("#current_user" ).length > 0) {
	// First save this solution under the User's ID...
	// Second, add a pattern link to the solution just saved.
        $( "#csLevelGoal").html("<p>Sandbox - open play<br/> What will <b>you</b> make?</p><a id=\"addSBXPattern\" title=\"Click to save in your Patterns Drawer\" href=# onclick=\"addToPatterns(0);return false;\">Save in Patterns</a>");
      }
    });
    $( "#kcSave" ).click(function() {
        var c = document.getElementById("html5canvas");
        var ctx = c.getContext("2d");
        cropImageFromCanvas(ctx, c);
        alert("Saved to your patterns box.");
        
    });

    $('#noIndColor').colorpicker({
	displayIndicator: false,
	defaultPalette: 'web',
	color: '#17b13a'
    });
    $( enablebutton ).click();
  });

function cropImageFromCanvas(ctx, canvas) {
    var origCanvasWidth = canvas.width;
    var origCanvasHeight = canvas.height;
    var w = canvas.width,
    h = canvas.height,
    pix = {x:[], y:[]},
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
    x, y, index;

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index+3] > 0) {

                pix.x.push(x);
                pix.y.push(y);

            }   
        }
    }
    pix.x.sort(function(a,b){return a-b});
    pix.y.sort(function(a,b){return a-b});
    var n = pix.x.length-1;

    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];
    var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(cut, 0, 0);

    kcThumbnail = canvas.toDataURL();
    //return canvas size to what it was before
    canvas.width = origCanvasWidth;
    canvas.height = origCanvasHeight;
    ctx.putImageData(cut, 0, 0);

    //Do something with this cropped thumbnail
    var tmpimage = document.getElementById("thumbnail");
    tmpimage.setAttribute("src",kcThumbnail);

};