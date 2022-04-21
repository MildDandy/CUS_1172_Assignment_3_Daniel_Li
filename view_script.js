//var quizData = JSON.parse(db);
/*
var quiz_1  = [
    {
      name: "Question 1",
      question : "How are you doing?",
      option_a : "Great",
      option_b : "Alright",
      option_c : "Okay",
      option_d : "Meh",
      correct_option : "Alright",
      questionType : "mc"
    },
    {
      name: "Question 2",
      question : "Can you pull this off?",
      option_a : "Maybe",
      option_b : "Definitely",
      option_c : "Nope",
      option_d : "For sure!",
      correct_option : "Maybe",
      questionType : "mc"
    },
    {
      name: "Question 3",
      question : "JavaScript is _____.",
      option_a : "a language",
      option_b : "bearable",
      option_c : "a mess",
      option_d : "potential",
      correct_option : "a language",
      questionType : "mc"
    }
  ];
*/

//Variable that tells what quiz was chosen
var quiz_number = "";
var queue = {};

//Variable that is keeping ALL information on the current view.
  var appState = {
      current_view : "#intro_view",
      current_question : -1,
      current_model : {},
      current_score : 0
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
  console.log("Button was pressed.");
  //console.log(e.target);
  //console.log(e.target.id);
  console.log(e.target.dataset.action);
  //console.log(e.target.class);
  //document.querySelector()
  //alert(quizData.quiz_1);

/*
  if(e.target.dataset.action == "button_quiz_1"){
    update_view("#question_view_mc");
    console.log(db.json)
    //var first_name = document.getElementById("first_name").value;
  }
  */
  if(e.target.dataset.action == "button_quiz_2"){
    quiz_number = "quiz_2";
    update_view("#ending_view");
  }

  if (appState.current_view == "#intro_view"){
    if (e.target.dataset.action == "button_quiz_1") {

        quiz_number = "quiz_1";
        appState.current_question = 0;
        setQuestionView(appState);
    }
  }

  // Handle the answer event.
  if (appState.current_view == "#question_view_mc") {

    if (e.target.dataset.action == "submit") {
       // Controller - implement logic.
       isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       // Update the state.
       appState.current_question = appState.current_question + 1;
       setQuestionView(appState);

     }
   }
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

    // Handle answer event for  text questions.
    if (appState.current_view == "#end_view") {
        if (e.target.dataset.action == "start_again") {
          appState.current_view =  "#intro_view";
          appState.current_model = {
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

//Quiz timer
var sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
setInterval( function(){
    $("#seconds").html(pad(++sec%60));
    $("#minutes").html(pad(parseInt(sec/60,10)));
}, 1000);



function check_user_response(user_answer, model) {
  if (user_answer == model.correctAnswer) {
    return true; //Congrats for 1 second aka make another function
  }
  return false; //Wrong answer aka display the feedback view
}

function updateQuestion(appState) {
    if (appState.current_question < quiz_1.length-1) {
      appState.current_question =   appState.current_question + 1;
      appState.current_model = results[appState.current_question];
    }
    else {
      appState.current_question = -2;
      appState.current_model = {};
    }
}

async function setQuestionView(appState) {
  if (appState.current_question == -2) {
    appState.current_view  = "#end_view";
    return
  }
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
console.log(queue);

  if (appState.current_model.question_type == "mc")
    appState.current_model = queue[appState.current_question];
    appState.current_view = "#question_view_mc";
    console.log(queue[appState.current_question].question_text);
    console.log(appState);
    update_view(appState);
    console.log(appState);
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
  }


//Updating the View widget
function update_view(appState){
  var html = render_view(appState.current_view, appState.current_model);
  console.log(queue);
  document.querySelector("#view_widget").innerHTML = html;
}

function pass_fail(score, first_name){
  if(score >= 16){
      document.getElementById("demo").innerHTML = "Congratulations {{name}}! You pass the quiz!";
  }
  else{
      document.getElementById("demo").innerHTML = "Sorry {{name}}, you fail the quiz.";
  }
}


/*
async function fetch_users() {
  try {
    // Notice: the fetch call returns a Promise Object.
    // await 'pauses' the execution in this code sequece waiting for the
    // promise to be fullfilled (i.e. the data arrive)  - in a non-clocking way.
    // Once promise is fullfilled the 'response' variable  holds an object of type Response
    const response = await fetch('https://randomuser.me/api/')
    // Notice: the json() method itself returns a Promise object
    // (since parsing the json response might take some time). Hence we need to
    // await for the parsiong to complete.
    const result = await response.json()
    // At this point we have the actual json parsed results .
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
*/
// Invoke the async function.

function makeRequest(location) {
  return new Promise((resolve, reject) => {
    console.log("Making Quest to ${location}")
    if(location === "Google"){
      resolve("Google says hi")
    } else {
      reject("We can only talk to Google")
    }
  })
}

function processRequest(response) {
  return new Promise((resolve, reject) => {
    console.log("Processing response")
    resolve("Extra information + ${response}")
  })
}

makeRequest("Facebook").then(response => {
  console.log("Response Received")
  return processRequest(response)
}).then(processResponse => {
  console.log(processResponse)
}).catch(err => {
  console.log(err)
})
