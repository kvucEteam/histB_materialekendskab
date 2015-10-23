var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;
var error_total = 0;



function returnBtnContainer(jsonData, SourceId){
    var Num = parseInt(ActiveLinkNum) - 1;
	var HTML = '';
	// for (k in jsonData){
		var btnArray = jsonData[SourceId].userInterface.btn;   // ActiveLinkNum
		HTML += '<div id="btnContainer_'+String(SourceId)+'" class="btnContainer">';
        HTML += (( (jsonData[SourceId].quizData.hasOwnProperty("taskText")) && (jsonData[SourceId].quizData.taskText !='') )?'<h4>'+jsonData[SourceId].quizData.taskText+'</h4>':'');
		for (n in btnArray){
			HTML += '<span class="btn btn-default StudentAnswer" href="#">'+btnArray[n]+'</span>';
		}
		HTML += '</div>';
	// }
    HTML += '<span class="checkAnswer btn btn-primary" href="#"> Tjek svar </span>';
    HTML += '<h5>Korrekte svar: <span class="QuestionCounter QuestionTask">0/0</span> Fejl: <span class="ErrorCount QuestionTask">0</span> </h5>';
	return HTML;
}



function elementInArray(tArray, element){
    for (x in tArray){
        if (tArray[x] == element) return true 
    }
    return false;
}
console.log("elementInArray - true: " + elementInArray([1,2,3,4,5], 3));
console.log("elementInArray - false: " + elementInArray([1,2,3,4,5], 6));



function countCorrectAnswers(jsonData){
	correct_total = 0;
    window.FirstTime = true;
	error_total = 0;
    var error_displayed_total = 0;
    var numOfQuestions = 0;
	for (k in jsonData){
		var correct = 0; var error_missed = 0; var error_wrong = 0; var error_displayed = 0;
	    var answerArray = jsonData[k].quizData.correctAnswer;
	    var numOfSrudentAnswers = $("#btnContainer_"+k+" > .btnPressed").length;
	    var numOfCorrectAnswers = answerArray.length;
        jsonData[k].StudentAnswers = {Correct : [], Wrong: []};
	    for (var n in answerArray){
	        // if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed")){
            if ( ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed")) || 
                  $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("CorrectAnswer")){  // NY
                // if ((typeof jsonData_old !== "undefined") && ())
	            correct++;   // Counting correct answers.
                jsonData[k].StudentAnswers.Correct.push(n);
                // $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").toggleClass("CorrectAnswer");
                $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").addClass("CorrectAnswer").removeClass("btnPressed");
	       } else {
	    		error_missed++;  // Counting missed correct answers, eg. if there are two or more correct answers and the student does not answer all of the answers, then this counter counts the missed correct answers.
	       }
            error_wrong += numOfSrudentAnswers - (correct + error_missed); // Counts all the wrong answers chosen by the student. 
            error_wrong = (error_wrong < 0) ?  0 : error_wrong;

            console.log("countCorrectAnswers - CurrentQuestionId: " + CurrentQuestionId + 
            "\nnumOfSrudentAnswers: " + numOfSrudentAnswers + ", numOfCorrectAnswers: " + numOfCorrectAnswers + 
            "\ncorrect: " + correct  + ", error_missed: " + error_missed  + ", error_wrong: " + error_wrong);
		}

        $("#btnContainer_"+k+" > .StudentAnswer").each(function( index, element ) {
            // if (($(element).hasClass("btnPressed")) && !(elementInArray(answerArray, index))){
            if ((($(element).hasClass("btnPressed")) || ($(element).hasClass("WrongAnswer"))) && !(elementInArray(answerArray, index))){  // NY
                ++error_displayed;
                jsonData[k].StudentAnswers.Wrong.push(index);
                // $(element).toggleClass("WrongAnswer");
                $(element).addClass("WrongAnswer").removeClass("btnPressed");
            }
        });

        // correct_total += (correct  // <-------------------------   IMPORTANT: THIS WILL GIVE TWO POINTS IF TWO CORRECT ANSWERS ARE GIVEN IN ONE QUESTION!!!
        // if ( (typeof jsonData_old !== "undefined") && (!CompareArrays(jsonData[k].StudentAnswers.Correct, jsonData_old[k].StudentAnswers.Correct)) )
	    correct_total += (correct >= 1)? 1 : 0;   // <-------------------------   IMPORTANT: THIS ENFORCES _ONE_ POINT IF THERE ARE TWO OR MORE CORRECT ANSWERS!!!!!
	    error_total += error_wrong + error_missed - correct;
        error_displayed_total += error_displayed;

        ++numOfQuestions;
	}

    $(".QuestionCounter").text(correct_total+'/'+numOfQuestions);
    $(".ErrorCount").text(error_displayed_total);
	console.log("countCorrectAnswers - correct_total: " + correct_total + ", error_total: " + error_total + ", error_displayed_total: " + error_displayed_total);

    // if (typeof jsonData_old !== "undefined") {
       window.jsonData_old = JSON.parse(JSON.stringify(jsonData));
        console.log("jsonData_old: " + JSON.stringify(jsonData_old));
    // }
}


function CompareArrays(Array1, Array2){ 
    if (Array1.length != Array2.length) return false;
    for (var n in Array1){
        if (Array1[n] !== Array2[n]) return false;
    }
    return true;
}
console.log("CompareArrays: " + CompareArrays([1,2,3,4,5], [1,2,3,4]));
console.log("CompareArrays: " + CompareArrays([1,2,3,4,5], [1,2,3,4,100]));
console.log("CompareArrays: " + CompareArrays([1,2,3,4,5], [1,2,3,4,5]));


function giveFeedback(jsonData, questionNum){
    var HTML = "<h2>Feedback</h2>";
    var questionArray = jsonData[questionNum].userInterface.btn;
    var feedbackArray = jsonData[questionNum].quizData.feedbackData; 
    for (var n in questionArray){
        if (($("#btnContainer_"+questionNum+" > .StudentAnswer:eq("+n+")").hasClass("CorrectAnswer")) || 
            ($("#btnContainer_"+questionNum+" > .StudentAnswer:eq("+n+")").hasClass("WrongAnswer")) )
            HTML += "<p>"+feedbackArray[n]+"</p>";
    }

    console.log("giveFeedback - CurrentQuestionId: " + CurrentQuestionId + ", HTML: " + JSON.stringify(HTML));

    UserMsgBox("body", HTML);
    UserMsgBox_SetWidth(".container-fluid", 0.7);
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
        alert("Ajax failed to fetch data - the requested quizdata might not exist...");
    });
}


function ReturnURLPerameters(UlrVarObj){
    var UrlVarStr = window.location.search.substring(1);
    console.log("ReturnURLPerameters - UrlVarStr: " + UrlVarStr);
    var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&");  // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
    console.log("ReturnURLPerameters - UrlVarPairArray: " + UrlVarPairArray);
    for (var i in UrlVarPairArray){
        var UrlVarSubPairArray = UrlVarPairArray[i].split("=");  // & = %3D
        if (UrlVarSubPairArray.length == 2){
            UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
        }
    }
    console.log("ReturnURLPerameters - UlrVarObj: " + JSON.stringify( UlrVarObj ));
    return UlrVarObj;
}


// Controles til width of the UserMsgBox
function UserMsgBox_SetWidth(TargetSelector, WidthPercent){
    var Width = $(TargetSelector).width();
    $("#UserMsgBox").width(WidthPercent*Width);
}


// ==============================================================================

function returnSourcePages(jsonData){
    var HTML = '';
    for (n in jsonData) {
        HTML += '<div class="SourcePage">';
        HTML += returnBtnContainer(jsonData, n);
        HTML +=     '<div class="Source">'+returnSourcelItem(n, jsonData)+'</div>';
        // HTML +=     '<div id="btnContainer_'+n+'" class="BtnContainer">';
        // HTML += returnBtnContainer(jsonData);
        // HTML +=     '</div>';
        HTML += '</div>';
    }
    return HTML;
}

function returnSourcelItem(questionNum, jsonData){
    var itemData = jsonData[questionNum].quizData;
    var HTML = '';
    switch(itemData.slideData.type) {
        case "img":
            // HTML += '<div class="SourceWrapper" data-toggle="modal" data-target="#myModal"> <img class="img-responsive SourceImg" src="'+itemData.kildeData.src+'" alt="'+itemData.kildeData.alt+'"/> </div>';
            HTML += '<div class="SourceWrapper" data-toggle="modal" data-target="#myModal"> <img class="img-responsive SourceImg" src="'+itemData.slideData.src+'" alt="'+itemData.slideData.alt+'"/> </div>';
            break;
        case "text":
            HTML += '<div class="TextHolder SourceWrapper">'+itemData.slideData.text+'</div>';
            break;
        case "video":
            HTML += '<div class="SourceWrapper embed-responsive embed-responsive-16by9 col-xs-12 col-md-12">' + 
                        '<iframe class="embed-responsive-item" src="'+itemData.slideData.src+'?rel=0" allowfullscreen="1"></iframe>' + 
                    '</div>';
            break;
        default:
            alert('Invalid "type"');
    }
    console.log("returnSourcelItem: " + HTML);
    return HTML;
}


// DETTE HAR INGEN FUNKTIONALITET ENDNU
$( document ).on('click', ".PagerButton", function(event){
    var PagerNum = $(this).text().replace("kilde","").trim();
    
    console.log("interfaceChanger - PagerNum: " + PagerNum); // + ' - ' + jsonData[parseInt(PagerNum)-1].userInterface.header);

    console.log("interfaceChanger - ActiveLinkNum: " + ActiveLinkNum);

});


$( document ).on('click', ".StudentAnswer", function(event){
    var ParentObj = $(this).parent();
    $(".StudentAnswer", ParentObj).removeClass("btnPressed CorrectAnswer WrongAnswer"); // Removes all previous answers in the view
    $(this).toggleClass("btnPressed");                                                  // Marks the pressed button as selected.
    console.log("interfaceChanger - ActiveLinkNum: " + ActiveLinkNum);
});


$(document).on('click', ".checkAnswer", function(event) {
    event.preventDefault(); // Prevents sending the user to "href".

    if (!$("#btnContainer_"+String(ActiveLinkNum-1)+" > .StudentAnswer").hasClass("btnPressed")) {
        UserMsgBox("body", "Du skal svare på et spørgsmål før du tjekker svar.");
        UserMsgBox_SetWidth(".container-fluid", 0.7);
        return 0;
    }

    if (jsonData[ActiveLinkNum-1].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
        UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse.");
        UserMsgBox_SetWidth(".container-fluid", 0.7);
    } else {
        countCorrectAnswers(jsonData);
        giveFeedback(jsonData, ActiveLinkNum-1);
    }
});


// $( document ).on('click', ".StudentAnswer", function(event){
//     $(this).addClass("btnPressed");
//     console.log("interfaceChanger - ActiveLinkNum: " + ActiveLinkNum);
// });


// ================================
//      Pager
// ================================


var Range = 9;
var ActiveLinkNum = 1;

// Pager("#PagerContainer", "#FormsContainer > div", "Pager");
function Pager(PagerSelector, TargetSelectorChild, CssId) {

    var NumOfPages = 0;
    $(TargetSelectorChild).each(function(index, element) {
        ++NumOfPages;
    });
    console.log("NumOfPages : " + NumOfPages);


    var HTML = '<ul id="' + CssId + '" class="PagerClass">';

    // MARK XXX

    if (NumOfPages == 1) {
        // HTML += '<li><a href="#" class="PagerButton btn btn-default"> Kilde 1 </a></li>';
        HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
    }

    if ((1 < NumOfPages) && (NumOfPages <= Range + 1)) {
        for (var i = 1; i <= NumOfPages; i++) {
            // HTML += '<li><a href="#" class="PagerButton btn btn-default">Kilde ' + i + '</a></li>';
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + i + '</a></li>';
        }
    }

    if (NumOfPages > Range + 1) {
        var StartIndex = ActiveLinkNum - Math.round((Range - 1) / 2); // Find the startindex based on ActiveLinkNum
        if (StartIndex < 1) StartIndex = 1; // Ajust startindex for low ActiveLinkNum
        if (Range + StartIndex > NumOfPages) StartIndex = NumOfPages - Range; // Ajust startindex for high ActiveLinkNum

        // StartIndex = Math.round((NumOfPages - Range)/2);
        console.log("StartIndex : " + StartIndex);


        if (StartIndex == 2) { // Ugly special case...
            // HTML += '<li><a href="#" class="PagerButton btn btn-default"> Kilde 1 </a></li>';
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
        }
        if (StartIndex > 2)
            // HTML += '<li><a href="#" class="PagerButton btn btn-default"> Kilde 1 </a></li><li> ... </li>';
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li><li> ... </li>';
        for (var j = StartIndex; j < Range + StartIndex; j++) {
            // HTML += '<li><a href="#" class="PagerButton btn btn-default">Kilde ' + j + '</a></li>';
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + j + '</a></li>';
        }
        if (Range + StartIndex == NumOfPages)
            for (var k = Range + StartIndex; k <= NumOfPages; k++) {
                // HTML += '<li><a href="#" class="PagerButton btn btn-default">Kilde ' + k + '</a></li>';
                HTML += '<li><a href="#" class="PagerButton btn btn-default">' + k + '</a></li>';
            } else
                // HTML += '<li> ... </li><li><a href="#" class="PagerButton btn btn-default">Kilde ' + NumOfPages + '</a></li>';
                HTML += '<li> ... </li><li><a href="#" class="PagerButton btn btn-default">' + NumOfPages + '</a></li>';

    }
    HTML += '</ul>';

    // Generate the pager:
    $(PagerSelector).html(HTML);

    $(TargetSelectorChild).removeClass("dshow");
    $(TargetSelectorChild + ":eq(" + (parseInt(ActiveLinkNum) - 1) + ")").addClass("dshow"); // TargetSelectorChild

    // 
    $("#" + CssId + " .PagerButton").click(function(e) {
        e.preventDefault(); // Prevent the link-nature of the anchor-tag.
        $("#" + CssId + " .PagerButton").removeClass("btn-default btn-primary");
        $("#" + CssId + " .PagerButton").addClass("btn-default");
        $(this).toggleClass("btn-default btn-primary");

        ActiveLinkNum = $(this).text().replace("Kilde","").trim();
        console.log("ActiveLinkNum 2: " + ActiveLinkNum);

        // TargetSelectorChildText = $(TargetSelectorChild).text();
        // console.log("TargetSelectorChildText: " + TargetSelectorChildText);


        Pager(PagerSelector, TargetSelectorChild, CssId); // Update the pager by recursive call
    });

    var LastElement = null;

    // Set the chosen color if the pager-button is showen:
    $(PagerSelector + " li a").each(function(index, element) {
        if ($(element).text().replace("Kilde","").trim() == ActiveLinkNum) {
            $(element).toggleClass("btn-default btn-primary");
        }
        LastElement = element;
    });

    // If the last STOP (n) is selected, and the user deletes the current STOP (n), then the user needs to "routed" to the second-last STOP (n-1):
    if ( ActiveLinkNum > NumOfPages){
        ActiveLinkNum = NumOfPages;
        $(LastElement).toggleClass("btn-default btn-primary");
        $(TargetSelectorChild + ":eq(" + (parseInt(ActiveLinkNum) - 1) + ")").addClass("dshow"); // TargetSelectorChild
    }

    console.log("ActiveLinkNum 1: " + ActiveLinkNum + ", NumOfPages: " + NumOfPages);
}



$(document).ready(function() {


    var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj) );

	ReturnAjaxData("GET", "json/QuizData"+UlrVarObj.file+".json", false, "json");


    $("#DataInput").html(returnSourcePages(jsonData));

    console.log("jsonData: " + JSON.stringify(jsonData) );

    $("title").html(jsonData[0].userInterface.header);
    $("#header").html(jsonData[0].userInterface.header);   // Shows the initial heading.
    if (jsonData[0].userInterface.hasOwnProperty("taskNumber")) 
        $("#header").append('<img class="TaskNumberImg" src="../library/img/TaskNumbers_'+jsonData[0].userInterface.taskNumber+'.svg">');
    $("#subHeader").html(jsonData[0].userInterface.subHeader);    // Shows the initial subheading.


    $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

    Pager("#PagerContainer", "#DataInput > div", "Pager");


});