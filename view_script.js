//var quizData = JSON.parse(db);

var answered = false;
//Variable that tells what quiz was chosen
var quiz_number = "";

var queue = {};

//Variable that is keeping ALL information on the current view.
  var appState = {
      current_view : "#intro_view",
      current_question : -1,
      current_model : {},
      current_score : 0,
      response : "CORRECT!!!",
      result : "",
      name : ""
  }


  document.addEventListener('DOMContentLoaded', () => {
    appState.current_view =  "#intro_view";
    appState.current_model = {
    }
    update_view(appState);
    //document.querySelector("#app_widget").innerHTML = widget_html;
    document.querySelector("#view_widget").onclick = (e) => {
        handle_app_widget_event(e);
    }
  });



function handle_app_widget_event(e){
  //console.log("Button was pressed.");
  //console.log(e.target);
  //console.log(e.target.id);
  //console.log(e.target.dataset.answer);
  //console.log(e.target.class);

  if (appState.current_view == "#intro_view"){
    if (e.target.dataset.action == "button_quiz_1") {
        sec = 0;
        quiz_number = "quiz_1";
        appState.name = document.querySelector("#first_name").value;
        appState.current_question = 1;
        setQuestionView(appState);
    }
    if (e.target.dataset.action == "button_quiz_2") {
        sec = 0;
        quiz_number = "quiz_2";
        appState.name = document.querySelector("#first_name").value;
        appState.current_question = 1;
        setQuestionView(appState);
    }
  }

  // Handle the answer event.
  if (appState.current_view == "#question_view_mc") {

    if (e.target.dataset.action == "submit") {
       // Controller - implement logic.
       //isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       // Update the state.
       appState.current_question = appState.current_question + 1;
       setQuestionView(appState);
       answered = false;
       text3.classList.add("hide");
       text4.classList.add("hide");
       //appState.current_score += 1;
     }
     if(answered == false){
       if(e.target.dataset.answer == "a" || "b" || "c" || "d"){
         isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       }
   }
   }

   /*
  if (appState.current_view == "#question_view_true_false") {

    if (e.target.dataset.action == "answer") {
       // Controller - implement logic.
       isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);

       // Update the state.
       appState.current_question =   appState.current_question + 1;
       appState.current_model = quiz_1[appState.current_question];
       setQuestionView(appState);

       // Update the view.
       update_view(appState);

     }
   }
*/
/*
   // Handle answer event for  text questions.
   if (appState.current_view == "#question_view_text_input") {
       if (e.target.dataset.action == "submit") {

           user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;
           isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
           updateQuestion(appState)
           //appState.current_question =   appState.current_question + 1;
           //appState.current_model = quiz_1[appState.current_question];
           setQuestionView(appState);
           update_view(appState);

       }
    }
*/
    // Handle answer event for  text questions.
    if (appState.current_view == "#ending_view") {
        if (e.target.dataset.action == "menu") {
          appState = {
              current_view : "#intro_view",
              current_question : -1,
              current_model : {},
              current_score : 0,
              response : "CORRECT!!!"
          }
          update_view(appState);

        }
      }

}
//End of Event Handler

var render_view = (view_id, model_index) => {
  console.log("Rendering View");
  var source = document.querySelector(view_id).innerHTML;
  var template = Handlebars.compile(source);
  var html = template({model_index, appState});
  //console.log(html);
  //console.log(model_index);
  document.querySelector("#view_widget").innerHTML = html;
  return html;
}


//Quiz 1 will have a pink background
//Quiz 2 will have a light-green background

function display(){
  let text = document.getElementById("type");
  let text6 = document.getElementById("question-choices");
  text.classList.remove("hide");
  text6.classList.remove("clickable");
  setTimeout(function () {
    text.classList.add("fade-in");
    setTimeout(function () {
      text.classList.remove("fade-in");
      setTimeout(function () {
        text.classList.add("hide");
        text6.classList.add("clickable");
        appState.current_question = appState.current_question + 1;
        setQuestionView(appState);
        answered = false;
      }, 1000);
    }, 2000);
  });
}

function explain(){
  let text2 = document.getElementById("explanation");
  text2.classList.remove("hide");
  let text7 = document.getElementById("question-choices");
  text7.classList.remove("clickable");
}

//Quiz timer
var sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
setInterval( function(){
    $("#seconds").html(pad(++sec%60));
    $("#minutes").html(pad(parseInt(sec/60,10)));
}, 1000);


function check_user_response(user_answer, model) {
  //console.log("Your Answer: "+ user_answer);
  //console.log("Correct Answer: "+ model.correct_answer);
  answered = true;
  if (user_answer === model.correct_answer) {
    appState.current_score += 1;
    appState.response = "CORRECT!!!";
    display();
    return true; //Congrats for 1 second aka make another function
  }
  else{
    explain();
    return false; //Wrong answer aka display the feedback view
  }
}

async function setQuestionView(appState) {

  console.log(appState.current_question);

await fetch(`https://my-json-server.typicode.com/MildDandy/CUS_1172_Assignment_3_Daniel_Li/${quiz_number}`).then(
      (response) => {
        return response.json()
      }
    ).then((results) => {
      queue = results;
      //Stores 1 question at a time
    }
  ).catch((err) => {
    console.error(err);
  }
  )
//console.log(queue);
  if (appState.current_question == 1) {
      appState.current_model = queue[appState.current_question-1];
  }
  if (appState.current_model.question_type == "mc"){
    appState.current_model = queue[appState.current_question-1];
    //onsole.log(appState.current_model);
    //console.log(queue[appState.current_question]);
    appState.current_view = "#question_view_mc";
    //console.log(queue[appState.current_question].question_text);
    update_view(appState);
    //console.log(appState)
    //console.log(queue[appState.current_question-1].question_text);
    //console.log(appState.current_model);
  }
/*
  else if (appState.current_model.questionType == "tf") {
    appState.current_model = quiz_1[appState.current_question];
    appState.current_view = "#question_view_tf";
    update_view(appState);
  else if (appState.current_model.questionType == "text") {
    appState.current_model = quiz_1[appState.current_question];
    appState.current_view = "#question_view_text";
    update_view(appState);
*/
  //console.log(appState.current_model.length);
if (appState.current_question == 11) {
  pass_fail();
  appState.current_view  = "#ending_view";
  update_view(appState);
}
}

//Updating the View widget
function update_view(appState){
  var html = render_view(appState.current_view, appState.current_model);
  //console.log(queue);
  document.querySelector("#view_widget").innerHTML = html;
}

function pass_fail(){
  if(appState.current_score >= 8){
      appState.result = "You passed the quiz! Good job ";
  }
  else{
      appState.result = "You didn't pass the quiz. Try again ";
  }
}
