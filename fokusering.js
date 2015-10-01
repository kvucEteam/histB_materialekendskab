var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;

// MARK 4


function elementInArray(tArray, element){
    for (x in tArray){
        if (tArray[x] == element) return true 
    }
    return false;
}
console.log("elementInArray - true: " + elementInArray([1,2,3,4,5], 3));
console.log("elementInArray - false: " + elementInArray([1,2,3,4,5], 6));



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



// ================================================================================================
//      Fokusering - new code
// ================================================================================================


function returnSourcePages(jsonData){
    var HTML = '';
    for (n in jsonData) {
        HTML += '<div class="SourcePage">';
        // HTML += '<div class="SourceAndNoteWrapper">';
        HTML +=     '<div class="Source">'+returnSourcelItem(n, jsonData)+'</div>';
        HTML +=     '<div class="NoteField">'+'Placer et felt til kursistens noter her? <br/> <i>Note '+String(parseInt(n)+1)+': Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam...</i></div>';
        HTML +=     '<div class="Clear"></div>';
        // HTML += '</div>';
        HTML +=     '<div '+'id="btnContainer_'+n+'" class="BtnContainer">';
        var btnArray = jsonData[n].userInterface.btn;
        for (m in btnArray){
            HTML += '<span class="btn btn-default StudentAnswer">'+btnArray[m]+'</span>';
        }
            HTML += '</div>';
        HTML += '</div>';
    }
    return HTML;
}


function returnSourcelItem(questionNum, jsonData){
    var itemData = jsonData[questionNum].quizData;
    var HTML = '';
    switch(itemData.kildeData.type) {
        case "img":
            HTML += '<img class="img-responsive" src="'+itemData.kildeData.src+'" alt="'+itemData.kildeData.alt+'"/>';
            break;
        case "text":
            HTML += '<div class="TextHolder">'+itemData.kildeData.text+'</div>';
            break;
        case "video":
            HTML += '<div class="embed-responsive embed-responsive-16by9 col-xs-12 col-md-12">' + 
                        '<iframe class="embed-responsive-item" src="'+itemData.kildeData.src+'?rel=0" allowfullscreen="1"></iframe>' + 
                    '</div>';
            break;
        default:
            alert('Invalid "type"');
    }
    console.log("returnSourcelItem: " + HTML);
    return HTML;
}


function interfaceChanger(ActiveLinkNum){
    $( document ).on('click', ".PagerButton", function(event){
        var PagerNum = $(this).text();
        $("#header").html(jsonData[parseInt(PagerNum)-1].userInterface.header);   // Shows the initial heading.
        $("#subHeader").html(jsonData[parseInt(PagerNum)-1].userInterface.subHeader);    // Shows the initial subheading.

        console.log("interfaceChanger - PagerNum: " + PagerNum); // + ' - ' + jsonData[parseInt(PagerNum)-1].userInterface.header);

        console.log("interfaceChanger - ActiveLinkNum: " + ActiveLinkNum);
    });
}


function countCorrectAnswers(jsonData){
    correct_total = 0;
    error_total = 0;
    var error_displayed_total = 0;
    var numOfQuestions = 0;
    for (k in jsonData){
        var correct = 0; var error_missed = 0; var error_wrong = 0; var error_displayed = 0;
        var answerArray = jsonData[k].quizData.correctAnswer;
        var numOfSrudentAnswers = $("#btnContainer_"+k+" > .btnPressed").length;
        var numOfCorrectAnswers = answerArray.length;
        for (var n in answerArray){
            if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed")){
                correct++;   // Counting correct answers.
                // $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").toggleClass("CorrectAnswer");
                $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").addClass("CorrectAnswer");
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
            if (($(element).hasClass("btnPressed")) && !(elementInArray(answerArray, index))){
                ++error_displayed;
                // $(element).toggleClass("WrongAnswer");
                $(element).addClass("WrongAnswer");
            }
        });

        // correct_total += (correct  // <-------------------------   IMPORTANT: THIS WILL GIVE TWO POINTS IF TWO CORRECT ANSWERS ARE GIVEN IN ONE QUESTION!!!
        correct_total += (correct >= 1)? 1 : 0;   // <-------------------------   IMPORTANT: THIS ENFORCES _ONE_ POINT IF THERE ARE TWO OR MORE CORRECT ANSWERS!!!!!
        error_total += error_wrong + error_missed - correct;
        error_displayed_total += error_displayed;

        ++numOfQuestions;
    }

    $(".QuestionCounter").text(correct_total+'/'+numOfQuestions);
    $(".ErrorCount").text(error_displayed_total);
    console.log("countCorrectAnswers - correct_total: " + correct_total + ", error_total: " + error_total + ", error_displayed_total: " + error_displayed_total);
}


function returnTable(tableSelector, headerArray, bodyArray2D, footerArray){
    var HTML = '<table '+((tableSelector.indexOf("#")!==-1)?'id="'+tableSelector.replace("#","")+'"':((tableSelector.indexOf(".")!==-1)?'class="'+tableSelector.replace(".","")+'"':''))+'>';
    if (headerArray.length > 0){  // Content in headerArray is not required - just an empty array 
        HTML += '<thead><tr>';
        for (i in headerArray){
            HTML += '<th>'+headerArray[i]+'</th>';
        }
        HTML += '</tr></thead>';
    }
    if (footerArray.length > 0){  // Content in footerArray is not required - just an empty array 
        HTML += '<tfoot><tr>';
        for (i in footerArray){
            HTML += '<td>'+footerArray[i]+'</td>';
        }
        HTML += '</tr></tfoot>';
    }
    HTML += '<tbody>';
    for (var y = 0; y < bodyArray2D.length; y++) {
        HTML += '<tr>';
        for (var x = 0; x < bodyArray2D[y].length; x++) {
            HTML += '<td>'+bodyArray2D[y][x]+'</td>'+((bodyArray2D[y].length-1 == x)?'</tr>':'');
        };
    };
    HTML += '</tbody></table>';
    console.log("returnTable - HTML: " + HTML);
    return HTML;
}
// $("body").append(returnTable(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]],["F1", "F2", "F3"]));
// $("body").append(returnTable(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]],[]));


function returnDivTable(tableSelector, headerArray, bodyArray2D){
    bodyArray2D = matrixTranspose(bodyArray2D);
    var HTML = '<div '+((tableSelector.indexOf("#")!==-1)?'id="'+tableSelector.replace("#","")+'"':((tableSelector.indexOf(".")!==-1)?'class="'+tableSelector.replace(".","")+'"':''))+'>';
    for (var y = 0; y < bodyArray2D.length; y++) {
        HTML += '<div class="DivColumn">';
        if (headerArray.length > 0){  // Content in headerArray is not required - just an empty array 
            HTML += '<div class="tth">'+headerArray[y]+'</div>';
        }
        for (var x = 0; x < bodyArray2D[y].length; x++) {
            HTML += '<div class="ttd">'+bodyArray2D[y][x]+'</div>'+((bodyArray2D[y].length-1 == x)?'</div>':'');
        };
    };
    HTML += '</div>';
    console.log("returnTable - HTML: " + HTML);
    return HTML;
}
// $("body").append(returnDivTable(".resultTable", ["HHHHH 1", "HHHHH 2", "HHHHH 3"], [["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]]));


// Function that "interchanges" rows and columns in a matrix (2 dimensional array):  
function matrixTranspose(matrix) {
    var matrixTranspose = [];
    for (var x = 0; x < matrix[0].length; x++) {
        var rowArray = [];
        for (var y = 0; y < matrix.length; y++) {
            rowArray.push(matrix[y][x]);
        }
        matrixTranspose.push(rowArray);
    };
    // console.log("matrixTranspose: " + JSON.stringify(matrixTranspose));
    return matrixTranspose;
}
console.log("matrixTranspose 1: " + JSON.stringify(matrixTranspose([["B11", "B12", "B13"], ["B21", "B22", "B23"], ["B31", "B32", "B33"], ["B41", "B42", "B43"]])));
console.log("matrixTranspose 2: " + JSON.stringify(matrixTranspose([["B11","B21","B31","B41"],["B12","B22","B32","B42"],["B13","B23","B33","B43"]])));


function makeEndGameSenario(jsonData){
    var sourceArray = [];
    var correctAnswerMatrix = [];  // 2 dimensional array!
    for (n in jsonData) {
        sourceArray.push(returnSourcelItem(n, jsonData));
        var rowArray = [];
        correctAnswerMatrix.push(jsonData[n].quizData.feedbackData);  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
    }
    console.log("makeEndGameSenario - correctAnswerMatrix: " + JSON.stringify(correctAnswerMatrix));

    var TcorrectAnswerMatrix = matrixTranspose(correctAnswerMatrix);
    console.log("makeEndGameSenario - TcorrectAnswerMatrix: " + JSON.stringify(TcorrectAnswerMatrix));

    var HTML = '<div id="EndGameSenario">' + returnTable('.resultTable', sourceArray, TcorrectAnswerMatrix, []) + '</div>';

    // UserMsgBox("body", HTML);
    // UserMsgBox_SetWidth(".container-fluid", 0.7);

    $("#DataInput").append(HTML);

    // $("#EndGameSenario th").css("width", String(100/sourceArray.length)+'%');

}

// MARK 3

function makeEndGameSenario_2(jsonData){
    var sourceArray = [];
    var correctAnswerMatrix = [];  // 2 dimensional array!
    for (n in jsonData) {
        sourceArray.push(returnSourcelItem(n, jsonData));
        var rowArray = [];
        // correctAnswerMatrix.push(jsonData[n].userInterface.btn);  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        for (k in jsonData[n].userInterface.btn){
            rowArray.push('<div'+((elementInArray(jsonData[n].quizData.correctAnswer, k))?' class="CorrectAnswer"':'')+'>'+jsonData[n].userInterface.btn[k]+'</div>');  // Pushing array of correct answers into correctAnswerMatrix, which becomes 2 dimensional.
        }
        correctAnswerMatrix.push(rowArray);
    }
    console.log("makeEndGameSenario - correctAnswerMatrix: " + JSON.stringify(correctAnswerMatrix));  // '<div class="">'

    var TcorrectAnswerMatrix = matrixTranspose(correctAnswerMatrix);
    console.log("makeEndGameSenario - TcorrectAnswerMatrix: " + JSON.stringify(TcorrectAnswerMatrix));

    var HTML = '<div id="EndGameSenario">' + returnDivTable('.resultTable', sourceArray, TcorrectAnswerMatrix) + '</div>';

    UserMsgBox("body", HTML);
    // UserMsgBox_SetWidth(".container-fluid", 1.0);

    // $("#DataInput").append(HTML);

    // $("#EndGameSenario th").css("width", String(100/sourceArray.length)+'%');

}



$(document).on('click', ".StudentAnswer", function(event) {
    // event.preventDefault(); // Prevents sending the user to "href". 

    if (jsonData[CurrentQuestionId].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
        UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse.");
        UserMsgBox_SetWidth(".container-fluid", 0.7);
    } else {
        if ($(this).hasClass("btnPressed")){
            $(this).removeClass("btnPressed CorrectAnswer WrongAnswer");
        } else {
            $(this).toggleClass("btnPressed");
        }

        // if ($(this).hasClass("btnPressed"))
        //     $(this).css(CSS_OBJECT.btnPressed);
        // else
        //     $(this).css(CSS_OBJECT.StudentAnswer);
    }

});

$(document).on('click', ".checkAnswer", function(event) {
    // event.preventDefault(); // Prevents sending the user to "href".

    if (jsonData[CurrentQuestionId].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
        UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse.");
        UserMsgBox_SetWidth(".container-fluid", 0.7);
    } else {
        countCorrectAnswers(jsonData);

        // Gives the right answer a green color, and display a list of feedback:
        $("#btnContainer_"+CurrentQuestionId+" > .StudentAnswer").each(function( index, element ) {

            console.log("checkAnswer - index: " + index);
            // if ($(element).hasClass("CorrectAnswer"))
            //     $(element).css(CSS_OBJECT.CorrectAnswer); // Sets the color to the style of .CorrectAnswer which is green...
    
            if ($(element).hasClass("btnPressed")){  // Only if the student has marked an answer as correct, do...
                jsonData[CurrentQuestionId].answered = true; // Locks the student question for further answers/alterations to their first/initial answer.
                // if (!$(element).hasClass("CorrectAnswer"))
                //     $(element).css(CSS_OBJECT.WrongAnswer); // Sets the color to the style of .WrongtAnswer which is red...
                // giveFeedback(jsonData, CurrentQuestionId);   // Give feedback
            }
        });

    }
});

$(document).on('click', ".checkAllAnswers", function(event) {
    makeEndGameSenario_2(jsonData);
}); 



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

    if (NumOfPages == 1) {
        HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
    }

    if ((1 < NumOfPages) && (NumOfPages <= Range + 1)) {
        for (var i = 1; i <= NumOfPages; i++) {
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
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
        }
        if (StartIndex > 2)
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li><li> ... </li>';
        for (var j = StartIndex; j < Range + StartIndex; j++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + j + '</a></li>';
        }
        if (Range + StartIndex == NumOfPages)
            for (var k = Range + StartIndex; k <= NumOfPages; k++) {
                HTML += '<li><a href="#" class="PagerButton btn btn-default">' + k + '</a></li>';
            } else
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

        ActiveLinkNum = $(this).text();
        console.log("ActiveLinkNum 2: " + ActiveLinkNum);

        // TargetSelectorChildText = $(TargetSelectorChild).text();
        // console.log("TargetSelectorChildText: " + TargetSelectorChildText);


        Pager(PagerSelector, TargetSelectorChild, CssId); // Update the pager by recursive call
    });

    var LastElement = null;

    // Set the chosen color if the pager-button is showen:
    $(PagerSelector + " li a").each(function(index, element) {
        if ($(element).text() == ActiveLinkNum) {
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


// ================================
//      Run code
// ================================


$(document).ready(function() {
// $(window).load(function() {

 //    var CssProp = ["background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color"];
 //    getCss([".StudentAnswer", ".CorrectAnswer", ".WrongAnswer", ".btnPressed", ".WrongAnswer_hover"], CssProp);
 //    console.log("CSS_OBJECT: " + CSS_OBJECT);


    var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj) );

    ReturnAjaxData("GET", "json/QuizData"+UlrVarObj.file+".json", false, "json");

 //        	// returnQuizlHtml(0, jsonData);  // TEST

 //        	// returnCarouselItem(3, jsonData);  // TEST

 //        	// returnCarouseList(jsonData);      // TEST

 //    // $("#DataInput").html(returnQuizlHtml(0, jsonData));  // Insert carousel HTML

 //    console.log("jsonData: " + JSON.stringify(jsonData) );

    $("#header").html(jsonData[0].userInterface.header);   // Shows the initial heading.
    $("#subHeader").html(jsonData[0].userInterface.subHeader);    // Shows the initial subheading.

 //    $(".btnContainer").hide();      // Hides all button containers.
 //    $("#btnContainer_"+0).show();   // Shows the first button container.

    $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

 //    // CheckStudentAnswers(jsonData);

	// userInterfaceChanger(jsonData);

 //    hoverCss([".CorrectAnswer_hover", ".WrongAnswer_hover"]);


    // ==================================

    $("#DataInput").html(returnSourcePages(jsonData));

    Pager("#PagerContainer", "#DataInput > div", "Pager");

    interfaceChanger(ActiveLinkNum);

    // makeEndGameSenario(jsonData);
    // makeEndGameSenario_2(jsonData);

    $(window).load(function () {
        // $(".NoteField").height($(".Source").height());
    });

    $(window).resize(function () {
        // $(".NoteField").height($(".Source").height());
    });
});