var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;
var error_total = 0;


var HTML1 = '<li data-target="#questionCarousel" data-slide-to="0" class="active"></li>' +
            '<li data-target="#questionCarousel" data-slide-to="1"></li>' +
            '<li data-target="#questionCarousel" data-slide-to="2"></li>' +
            '<li data-target="#questionCarousel" data-slide-to="3"></li>';

var HTML2 =  '<div class="carousel-inner" role="listbox">' + 
                '<div class="item active">' + 
                    '<div class="TextHolder">' + 
                        '<h2>Test: Opgavetest tekst til kursisten</h2>' +
                        '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam... 1 </p>' + 
                        '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam... 2 </p>' +
                        '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam... 3 </p>' +
                        '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam... 4 </p>' +
                        '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam... 5 </p>' +
                        '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam, Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam... 6 </p>' +
                    '</div>' + 
                '</div>' + 
                '<div class="item">' + 
                    '<h2 class="indent">Test: Billede fra ekstern kilde</h2>' + 
                    '<img class="img-responsive" src="http://www.danskmoent.dk/meyer/j001-c.gif" alt="Jellingsten 1 stor">' + 
                '</div>' + 
                '<div class="item">' + 
                    '<h2 class="indent">Test: Billede fra egen PC/server</h2>' + 
                    '<img class="img-responsive" src="img/Jellingsten_stor_3.jpg" alt="Jellingsten 2 stor">' +    
                '</div>' + 
                '<div class="item">' + 
                    '<h2 class="indent">Test: Youtube video indlejring</h2>' + 
                    '<div class="col-sm-12 col-md-12 video_container">' + 
                        '<div class="embed-responsive embed-responsive-16by9 col-xs-12 col-md-12 vid_container">' + 
                            '<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/QnDUiIRUSo8?rel=0" allowfullscreen="1"></iframe>' + 
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

var HTML = '<div id="questionCarousel" class="carousel slide" data-ride="carousel" data-interval="false">' +
                '<ol class="carousel-indicators">' +
                    HTML1 + 
                '</ol>' +
                '<div class="carousel-inner" role="listbox">' +
                    HTML2 + 
                '</div>' +
                '<a class="left carousel-control" href="#questionCarousel" role="button" data-slide="prev">' +
                    '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
                    '<span class="sr-only">Previous</span>' +
                '</a>' +
                '<a class="right carousel-control" href="#questionCarousel" role="button" data-slide="next">' +
                    '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
                    '<span class="sr-only">Next</span>' +
                '</a>' +
            '</div>';

// The function makes the carousel-indicator for the carousel:
function returnCarouselIndicators(jsonData){
	var HTML = '';
	for (var i = 0; i < jsonData.length; i++) {
		HTML += '<li data-target="#questionCarousel" data-slide-to="'+i+'"'+((i==0)?' class="active"':'')+'></li>';
	};
	console.log("returnCarouselIndicators: " + HTML);

	return HTML;
}
// XXX = [{1:1},{2:2},{3:3},{4:4},{5:5}];
// returnCarouselIndicators(XXX);


function returnCarouselItem(questionNum, jsonData){
	var itemData = jsonData[questionNum].quizData;

	var HTML = '<div id="question_'+questionNum+'" class="item'+((questionNum==0)?' active':'')+'">' +
					'<h2 class="indent">'+itemData.taskText+'</h2>';

	switch(itemData.slideData.type) {
	    case "img":
	        HTML += '<img class="img-responsive" src="'+itemData.slideData.src+'" alt="'+itemData.slideData.alt+'"/>';
	        break;
	    case "text":
	        HTML += '<div class="TextHolder">'+itemData.slideData.text+'</div>';
	        break;
	    case "video":
	        HTML += '<div class="embed-responsive embed-responsive-16by9 col-xs-12 col-md-12">' + 
                        '<iframe class="embed-responsive-item" src="'+itemData.slideData.src+'?rel=0" allowfullscreen="1"></iframe>' + 
                    '</div>';
	        break;
	    default:
	        alert('Invalid "type"');
	}

	HTML += '</div>';
	
	console.log("returnCarouselItem: " + HTML);

	return HTML;
}


function returnCarouseList(jsonData){
	var HTML = '';
	for (n in jsonData){
		HTML += returnCarouselItem(n, jsonData);
	}

	console.log("returnCarouseList: " + HTML);
	
	return HTML;
}



function returnBtnContainer(jsonData){
	var HTML = '';
	for (k in jsonData){
		var btnArray = jsonData[k].userInterface.btn;
		HTML += '<span id="btnContainer_'+k+'" class="btnContainer">';
		for (n in btnArray){
			HTML += '<a class="btn btn-default StudentAnswer" href="#">'+btnArray[n]+'</a>';
		}
		HTML += '</span>';
	}
	return HTML;
}



// { 
// 	"userInterface" : {
// 		"btn" : ["Valg 1 (#)", "Valg 2"]
// 	},
// 	"quizData" : {
//		"taskText" : "Opgaveforklaring til kursist - 0",
// 		"slideData" : {"type": "img", "src": "http://www.danskmoent.dk/meyer/j001-c.gif", "alt": "Eksternt billede..."},
// 		"correctAnswer" : ["0"],
// 		"feedbackData" : ["(1) Korrekt...", "(2) Forkert..."]
// 	}
// }
function returnCarouselHtml(questionNum, jsonData){
	var btnArray = jsonData[questionNum].userInterface.btn;
	// var HTML = '<div class="btnContainer">';
	// for(n in btnArray){
	// 	HTML += '<a class="btn btn-default" href="#">'+btnArray[n]+'</a>';
	// }
	// HTML = '</div>';
	var HTML = '';

	HTML += returnBtnContainer(jsonData);

	console.log("ReturnQustionHtml - btnHtml: " + HTML);

	HTML += '<a class="btn btn-default CheckAnswer" href="#"> Tjek svar </a>';

	HTML += '<div id="questionCarousel" class="carousel slide" data-ride="carousel" data-interval="false">' +
                '<ol class="carousel-indicators">' +
                    returnCarouselIndicators(btnArray) + 
                '</ol>' +
                '<div class="carousel-inner" role="listbox">' +
                    returnCarouseList(jsonData) + 
                '</div>' +
                '<a class="left carousel-control" href="#questionCarousel" role="button" data-slide="prev">' +
                    '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
                    '<span class="sr-only">Previous</span>' +
                '</a>' +
                '<a class="right carousel-control" href="#questionCarousel" role="button" data-slide="next">' +
                    '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
                    '<span class="sr-only">Next</span>' +
                '</a>' +
            '</div>';
	return HTML;
}


function userInterfaceChanger(jsonData){
	var questionId, nextQuestionId;
	$(document).on('click', ".glyphicon-chevron-left", function(event) {
        questionId = parseInt($(".carousel-inner > .active").prop("id").split("_")[1]);
        nextQuestionId = ((questionId - 1) < 0) ? jsonData.length - 1 : questionId - 1;
        console.log("userInterfaceChanger - questionId: " + questionId + ", nextQuestionId: " + nextQuestionId);
        CurrentQuestionId = nextQuestionId;

        $(".btnContainer").hide();
        $("#btnContainer_"+CurrentQuestionId).show();
    });

    $(document).on('click', ".glyphicon-chevron-right", function(event) {
        var questionId = parseInt($(".carousel-inner > .active").prop("id").split("_")[1]);
        nextQuestionId = ((questionId + 1) > jsonData.length - 1) ? 0 : questionId + 1;
        console.log("userInterfaceChanger - questionId: " + questionId + ", nextQuestionId: " + nextQuestionId);
        CurrentQuestionId = nextQuestionId;

        $(".btnContainer").hide();
        $("#btnContainer_"+CurrentQuestionId).show();
    });
}


function countCorrectAnswers(jsonData){
	correct_total = 0;
	error_total = 0;
	for (k in jsonData){
		var correct = 0; var error_missed = 0; var error_wrong = 0;
	    var answerArray = jsonData[k].quizData.correctAnswer;
	    var numOfSrudentAnswers = $("#btnContainer_"+k+" > .btnPressed").length;
	    var numOfCorrectAnswers = answerArray.length;
	    for (var n in answerArray){
	    	if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed"))
	    		correct++;   // Counting correct answers.
	    	else
	    		error_missed++;  // Counting missed correct answers, eg. if there are two or more correct answers and the student does not answer all of the answers, then this counter counts the missed correct answers.
	    
	    	error_wrong += numOfSrudentAnswers - (correct + error_missed); // Counts all the wrong answers chosen by the student. 
	    	error_wrong = (error_wrong < 0) ?  0 : error_wrong;

		    console.log("XXX - CurrentQuestionId: " + CurrentQuestionId + 
		    	"\nnumOfSrudentAnswers: " + numOfSrudentAnswers + ", numOfCorrectAnswers: " + numOfCorrectAnswers + 
		    	"\ncorrect: " + correct  + ", error_missed: " + error_missed  + ", error_wrong: " + error_wrong);
		}

	    correct_total += correct;
	    error_total += error_wrong + error_missed;
	}
	console.log("countCorrectAnswers - correct_total: " + correct_total + ", error_total: " + error_total);
}


function CheckStudentAnswers(jsonData){
    $(document).on('click', ".StudentAnswer", function(event) {
    	event.preventDefault(); // Prevents sending the user to "href". 
        $(this).toggleClass("btnPressed");

        if ($(this).hasClass("btnPressed"))
        	$(this).css({backgroundColor: "#1da6db", color: "#fff" });
        else
        	$(this).css({backgroundColor: "transparent", color: "#000" });

    });

    $(document).on('click', ".CheckAnswer", function(event) {
        event.preventDefault(); // Prevents sending the user to "href".

        var correct = 0; var error_missed = 0; var error_wrong = 0;
        var answerArray = jsonData[CurrentQuestionId].quizData.correctAnswer;
        var numOfSrudentAnswers = $("#btnContainer_"+CurrentQuestionId+" > .btnPressed").length;
        var numOfCorrectAnswers = answerArray.length;
        for (var n in answerArray){
        	if ($("#btnContainer_"+CurrentQuestionId+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed"))
        		correct++;   // Counting correct answers.
        	else
        		error_missed++;  // Counting missed correct answers, eg. if there are two or more correct answers and the student does not answer all of the answers, then this counter counts the missed correct answers.
        }
        error_wrong = numOfSrudentAnswers - (correct + error_missed); // Counts all the wrong answers chosen by the student. 
        error_wrong = (error_wrong < 0) ?  0 : error_wrong;

        console.log("CheckStudentAnswers - CurrentQuestionId: " + CurrentQuestionId + 
        	"\nnumOfSrudentAnswers: " + numOfSrudentAnswers + ", numOfCorrectAnswers: " + numOfCorrectAnswers + 
        	"\ncorrect: " + correct  + ", error_missed: " + error_missed  + ", error_wrong: " + error_wrong);

        // $(".QuestionCounter").text(correct_total+'/'+numOfQuestions);
        // $(".ErrorCount").text(error_total);

        // countCorrectAnswers(jsonData);
    });
}


function ReturnAjaxData(Type, Url, Async, DataType) {
    $.ajax({
        type: Type,
        url: Url,
        async: Async,
        dataType: DataType,
        success: function(Data) {
            console.log("ReturnAjaxData: " + JSON.stringify(Data));
            jsonData = JSON.parse(JSON.stringify(Data));
            // JsonExternalData = JSON.parse(JSON.stringify(Data));
            // console.log("HowWhyData: " + HowWhyData);
        }
    }).fail(function() {
        alert("Ajax failed to fetch data");
    });
}

$(document).ready(function() {
// $(window).load(function() {

	// ReturnAjaxData("GET", "json/QuizData.json", false, "json");
	ReturnAjaxData("GET", "json/QuizData.json", false, "json");

	// returnCarouselHtml(0, jsonData);  // TEST

	// returnCarouselItem(3, jsonData);  // TEST

	// returnCarouseList(jsonData);      // TEST

    // $("#DataInput").html(HTML);
    $("#DataInput").html(returnCarouselHtml(0, jsonData));

    console.log("jsonData: " + JSON.stringify(jsonData) );

    $(".btnContainer").hide();
    $("#btnContainer_"+0).show();

    CheckStudentAnswers(jsonData);

	userInterfaceChanger(jsonData);

});