let TIMEOUT_SECONDS = 180;
let TIMEOUT_STRING = "three minutes";
let secondsRemaining = TIMEOUT_SECONDS;

let oldVal;
let problemNumber = 0;
let problemPoints = 0;
let currentScore = 0;
let numCorrect = 0;
let problemsOrder;
let debug = false;
let lastTarget = '';
let mobile = false;

function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayLaTeXInBody() {
    renderMathInElement(document.body, {
        options: {
            throwOnError: false,
            display: false
        }
    });
}

// A simple timer
function displayTime(secs) {
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    let displayText = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    $("#timer").text(displayText);
}

function startTimer(onTimeoutFunc) {
    secondsRemaining = TIMEOUT_SECONDS;
    let timer = setInterval(function() {
        secondsRemaining--;
        displayTime(secondsRemaining);
        if (secondsRemaining == 0) {
            clearInterval(timer);
            onTimeoutFunc();
        }
    }, 1000);
}

function showIntro() {
    $("#game-window").hide();
    $("#ending-window").hide();
    $("#intro-window").show();

    let introText =  "This is a game to test your \\(\\LaTeX\\) skills." +
                     " Type as many formulas as you can in " + TIMEOUT_STRING + "!";
    $("#intro-text").text(introText);

    if (mobileCheck()) {
      $("#hint-list").prepend("<li><span style=\"color:red\"><b>Consider switching to a desktop browser</b></span></li>")
      mobile = true;
    }

    displayLaTeXInBody();
    $("#container").show();
}

function endGame() {
    $("#intro-window").hide();
    $("#game-window").hide();
    $("#ending-window").show();
    displayLaTeXInBody();

    let problemsText = numCorrect + ((numCorrect == 1) ? " problem" : " problems");
    let endingText = "You finished " + problemsText + " in " + TIMEOUT_STRING +
                     ", for a total score of " + currentScore + "!";
    $("#ending-text").text(endingText);
}


function startGame() {
    problemNumber = 0;
    currentScore = 0;
    numCorrect = 0;
    oldVal = "";
    problemsOrder = [...Array(problems.length).keys()];
    shuffleArray(problemsOrder);

    $("#intro-window").hide();
    $("#ending-window").hide();
    $("#game-window").show();

    displayLaTeXInBody();

    $("#score").text(0);

    displayTime(TIMEOUT_SECONDS);

    // Reset and start the timer
    loadProblem();
    startTimer(function() {
        endGame(currentScore);
    });
}

function loadProblem() {
    // clear current work
    $('#out').empty();
    $('#user-input').val('');

    // reset styling
    $('#out').parent().removeClass("correct");
    $('#user-input').prop("disabled", false);
    if (!mobile) {
      $('#user-input').focus();
    }

    // load problem
    let target = problems[problemsOrder[problemNumber % problems.length]];
    if (debug) {
      target = problems[problems.length-1];
    }
    problemNumber += 1;

    // load problem text
    let problemText = "Problem " + problemNumber + ": " + target.title;
    $("#problem-title").text(problemText);
    problemPoints = Math.ceil(target.latex.length / 10.0);
    let pointsText = "(" + problemPoints + ((problemPoints == 1) ? " point)" : " points)");
    $("#problem-points").text(pointsText);

    displayLaTeXInBody();

    // load problem body
    katex.render(target.latex, $("#target")[0], {
        throwOnError: false,
        displayMode: true
    });

    oldVal = "";
};

function validateProblem() {
    let currentVal = $("#user-input").val();
    if (currentVal == oldVal) {
        return; // check to prevent multiple simultaneous triggers
    }

    oldVal = currentVal;
    // action to be performed on textarea changed
    katex.render(currentVal, $("#out")[0], {
        throwOnError: false,
        displayMode: true
    });

    if (currentVal == '') {
      // Defensively return if the input is empty.
      return;
    }


    if ($("#target").width() != $("#out").width()) {
        // Return if the element widths are different.
        return;
    }

    html2canvas($('#target')[0], {}).then(function (targetCanvas) {
        $('#out').parent().removeClass("correct");
        let width = targetCanvas.width;
        let height = targetCanvas.height;
        let targetData = targetCanvas.getContext("2d").getImageData(0, 0, width, height);
        let curTarget = $('#problem-title').text();
        html2canvas($('#out')[0], {}).then(function (outCanvas) {
            if (outCanvas.width != width || outCanvas.height != height) {
              console.log("doesn't match");
              return;
            }
            let outData = outCanvas.getContext("2d").getImageData(0, 0, width, height);
            let diff = pixelmatch(targetData.data, outData.data, undefined, width, height, {threshold: 0.1});
            let result = "";
            console.log("diff is " + diff)
            if (diff == 0) {
                if (lastTarget == curTarget) {
                  return;
                }
                lastTarget = curTarget;
                currentScore += problemPoints;
                numCorrect += 1;

                // Styling changes
                $('#out').parent().addClass("correct");
                $('#user-input').prop("disabled", true);
                $("#score").text(currentScore);

                // Load new problem
                setTimeout(loadProblem, 1500);
            }
        });
    });
}

// Start by showing the intro.
$(document).ready(function() {
    // Handlers
    $("#start-button").click(function() {
        startGame();
    });

    $("#reset-button").click(function() {
        startGame();
    });

    $("#skip-button").click(function() {
        loadProblem();
    });

    $("#user-input").on("change keyup paste", function() {
        validateProblem()
    });

    showIntro();
});
