			var allQuestions = [
			{
				question: "Why are you so sad?",
				choices: ["Because I got a new bike.", "I will join the English club.", "Because Minjae broke my robot.", "Go straight and turn right."],
				correctAnswer: 2
			},
			{
				question: "________ do you get up?",
				choices: ["What time", "Usual", "Which", "Because"],
				correctAnswer: 0
			},
			{
				question: "_______ are you from?",
				choices: ["How", "Because", "When", "Where"],
				correctAnswer: 3
			},
			{
				question: "Who is she?",
				choices: ["I am Sunny.", "I'm fine. And you?", "I can't wait!", "She is my mom."],
				correctAnswer: 3
			},
			{
				question: "What time is it?",
				choices: ["I'm hungry.", "I'm 12 years old.", "It's time for lunch!", "I can't swim."],
				correctAnswer: 1
			},
			{
				question: "Where is the bakery?",
				choices: ["I live in Jinju.", "Good. Let's go!", "I live on a boat.", "It's next to the park."],
				correctAnswer: 3
			},
			{
				question: "Can I ____ you?",
				choices: ["okay", "run", "swim", "help"],
				correctAnswer: 3
			},
			{
				question: "How old are you?",
				choices: ["I can swim.", "There are two birds.", "I am five years old.", "I am Sunny."],
				correctAnswer: 2
			},
			{
				question: "_____ can I get to the park?",
				choices: ["How", "Where", "Why", "What"],
				correctAnswer: 0
			},
			{
				question: "Which is your favorite color?",
				choices: ["I like rain.", "I will play in the snow.", "My favorite color is red.", "My favorite color is July."],
				correctAnswer: 2
			},
			{
				question: "How are you?",
				choices: ["I'm happy.", "I'm big.", "I'm Hayun.", "He is sad."],
				correctAnswer: 2
			},
			{
				question: "Wow! You are ______ skiing!",
				choices: ["like it", "good at", "can good", "will go"],
				correctAnswer: 1
			},
			{
				question: "Do you know about YutNori?",
				choices: ["He's a Korean singer.", "I like reading science books.", "It's a Korean snack.", "It's a Korean game."],
				correctAnswer: 3
			},
			{
				question: "________, where is the park?",
				choices: ["Go straight", "Happy Birthday", "Goodbye", "Excuse me"],
				correctAnswer: 3
			},
			{
				question: "What do you want to be?",
				choices: ["I want to be a doctor.", "I can't sing.", "I can't wait!", "I am from America."],
				correctAnswer: 0
			}
			];

			var questionCount;
			var correctAnsCount;
			var curQuestion = allQuestions[questionCount];
			var userAnsArray = [];
			var actualAnsArray = [];
			var ms = 0;
			var startTime;
			var bgmPaused = false;
			var gameLoopSpd;
			var damageDealtByEnemy;
			var stringshotFired;
			var enemyMoveSpd;
			var powerPoints;
			var lastRun = 0;
			var gameOver;
			if( localStorage ){
				
				var arrayOfPrevBestScores = JSON.parse( localStorage.getItem( "arrayOfBestScores" )) || [
				{"name":"Sunny","corAnsw":20,"mstime":55555},
				{"name":"Lance","corAnsw":20,"mstime":66666},
				{"name":"Agatha","corAnsw":20,"mstime":77777},
				{"name":"Bruno","corAnsw":20,"mstime":88888},
				{"name":"Lorelei","corAnsw":20,"mstime":99999}
				];
			}
			
			//show radio buttons, questions, answers, timer, next button, hide start button, call load next question
			var showBtns = function(){

				var radBtns = document.querySelectorAll( "input[type='radio']" );

				for( var b = 0; b <= ( radBtns.length - 1 ); b++ ){
					radBtns[b].className = radBtns[b].className.replace( "hideMe", "" );
					radBtns[b].checked = false;
				}

				showTds();

				setBaseScores();

				updateAudioSrc( "sounds/pokeQuizElite.ogg", "sounds/pokeQuizElite.mp3");

				$( "#stats" ).removeClass( "hideMe" );
				$( "#nextBtn" ).removeClass( "hideMe" );
				$( "#startOfQuiz" ).addClass( "displayNone" );
				$( "h1" ).addClass( "displayNone" );

				$( "#pikachu" ).removeClass( "displayNone" );
				setPosition( "pikachu", "200" );
				$( "#enemy1" ).removeClass( "displayNone" );
				setPosition( "enemy1", "350", "0", true );

				loadNextQuestion();
			};

			//set position of element according to x and y 
			var setPosition = function( elementId, yPos, xPos, setFromRight ){
				
				if( yPos === undefined ){
					yPos = 0;
				}

				else if( xPos === undefined ){
					xPos = 0;
				}

				if( setFromRight === true ){
					document.getElementById( elementId ).style.right = xPos + "px";
				}

				else{
					document.getElementById( elementId ).style.left = xPos + "px";
				}

				document.getElementById( elementId ).style.top = yPos + "px";
				
			};

			var setBaseScores = function(){
				
				gameOver = false;
				questionCount = 0;
				correctAnsCount = 0;
				userAnsArray = [];

				gameLoopSpd = 100;
				powerPoints	= 10;
				$( "#hud" ).html( "PP: " + powerPoints + "/10" );
				damageDealtByEnemy = 9999;
				$( "#dmgTaken" ).html( "Enemy Dmg: " + damageDealtByEnemy );
				enemyMoveSpd = 40;
				$( "#enemySpeed" ).html( "Enemy Spd: " + enemyMoveSpd );

				ms = 0;
				startTime = window.setInterval( tickTock, 10 );
			};

			var showTds = function(){

				var tdArray = document.myForm.querySelectorAll( "td" );

				for( var x = 0; x < 7; x++ ){
					tdArray[x].className = tdArray[x].className.replace( "hideMe", "" );
				}
			};

			//get current question from list and load it to the screen, hide back button if user can't go back, check answers upon finishing last question
			var loadNextQuestion = function(){

				var possibleAnsLabel = document.myForm.querySelectorAll( "label" );
				curQuestion = allQuestions[questionCount];

				showHideBackBtn();

				if( questionCount > ( allQuestions.length - 1 ) ){
					
					checkAns();
					return;			
				}
				
				document.getElementById( "questionHere" ).innerHTML = curQuestion.question;

				for( var i = 0; i < possibleAnsLabel.length; i++){
					possibleAnsLabel[i].innerHTML = curQuestion.choices[i];
				}

				increaseDifficulty();
			};

			//increase difficulty by decreasing time it takes to run through a game loop
			var increaseDifficulty = function(){

				if( gameLoopSpd > 20 ){
					
					gameLoopSpd = gameLoopSpd - 5;
				}
			};

			var showHideBackBtn = function(){
				
				if( questionCount === 0 ){
					$( "#backBtn" ).addClass( "hideMe" );
				}
				
				else if( questionCount > 0 ){
					$( "#backBtn" ).removeClass( "hideMe" );
				}
			};

			//validate to make sure user checked something, look for user's selected answer and push to userAnsArray
			var onNextBtn = function(){

				var isChecked = false;

				$( "#nothingChecked" ).addClass( "displayNone" );
				
				for ( var i = 0; i < document.myForm.optionBtn.length; i++ ) {
					
					if( document.myForm.optionBtn[i].checked ){
						
						isChecked = true;
						var userAns = parseInt( document.myForm.optionBtn[i].value );
						userAnsArray.push( userAns );
						
						questionCount = questionCount + 1;
						
						//clear radio btn selection
						$( 'input[name="optionBtn"]' ).prop( "checked", false );

						loadNextQuestion();
					}		
				}
				
				if( !isChecked ){
					$( "#nothingChecked" ).removeClass( "displayNone" );
					$( "#nothingChecked" ).addClass( "warning" );
					return false;
				}
			};

			//remember the user's most recent ans and check it so they don't have to check it again. Pop off the last answer pushed to the userAnsArray and go back one question.
			var onBack = function(){
				
				if( questionCount > 0 ){
					var mostRecentAns = userAnsArray[( userAnsArray.length - 1 )];

					switch( mostRecentAns ){
						
						case 0:
						document.myForm.btnA.checked = true;
						break;
						case 1:
						document.myForm.btnB.checked = true;
						break;
						case 2:
						document.myForm.btnC.checked = true;
						break;
						case 3:
						document.myForm.btnD.checked = true;
						break;
						default:
						return;
					}

					userAnsArray.pop();
					questionCount = questionCount - 1;
					loadNextQuestion();
				}	
				
			};

			//get correctAnswers from list and push to actualAnsarray. check it against userAnsArray and show score
			var checkAns = function(){

				for( var key in allQuestions ){

					if( allQuestions.hasOwnProperty( key ) ){
						actualAnsArray.push( allQuestions[key].correctAnswer );
					}
				}

				for( var x = 0; x <= ( allQuestions.length - 1 ); x++ ){

					if( actualAnsArray[x] === userAnsArray[x] ){
						correctAnsCount = correctAnsCount + 1;
					}
				}

				showFinalScore();
			};

			//hide questions, answers, next, back buttons, and timer. show end of quiz screen and final score. show enter name section and try again.
			var showFinalScore = function(){

				var bonusPoints = powerPoints * 2000;

				

				gameOver = true;
				ms = ms - bonusPoints;

				hideTds();
				updateAudioSrc( "sounds/pokeEnding.ogg", "sounds/pokeEnding.mp3");

				$( "#endOfQuiz" ).removeClass( "hideMe" );
				
				document.getElementById( "showScore" ).innerHTML = "Correct Answers: " + correctAnsCount + " out of " + questionCount + " questions</br>" + "Bonus from remaining PP: " + bonusPoints + "<br>Final Time: " + ms + "s";

				clearInterval( startTime );
				$( "#stats" ).addClass( "hideMe" );
				$( "#nextBtn" ).addClass( "hideMe" );
				$( "#backBtn" ).addClass( "hideMe" );
				
				$( "#pikachu" ).addClass( "displayNone" );
				$( "#enemy1" ).addClass( "displayNone" );
				$( "#fireball" ).addClass( "displayNone" );

				$( "h1" ).removeClass( "displayNone" );	
				$( "#enterNameSect" ).removeClass( "hideMe" );
				$( "#tryAgainBtn" ).removeClass( "displayNone" );

				if( !localStorage ){
					$( "#enterNameSect" ).addClass( "hideMe" );
				}

			};

			var hideTds = function(){

				var tdArray = document.myForm.querySelectorAll( "td" );

				for( var x = 0; x < 6; x++ ){
					tdArray[x].className = tdArray[x].className + "hideMe";
				}
			};

			//validate input, access localStorage to get prev record or make a new record. 
			var onEnterNameBtn = function(){			

				if( document.getElementById( "enterNameHere" ).value !== "" ){
					
					localStorage.setItem( "arrayOfBestScores", JSON.stringify( arrayOfPrevBestScores ) );
					$( "#enterNameSect" ).addClass( "hideMe" );

					if( correctAnsCount === allQuestions.length ){
						
						checkIfUserEnterHallOfFame();
					}

					else{
						document.getElementById( "newHighScore" ).innerHTML = "You lost to the Elite Four. Try again!";
						showListOfHighScores();
					}
				}
				
				else{
					document.querySelector("[for='enterNameHere']").className = "warning";
					document.getElementById( "enterNameHere" ).focus();
					return false;
				}
			};

			//compare user score and see if they make it on the high score wall. if so, add user score to localstorage record. call show high scores.
			var checkIfUserEnterHallOfFame = function(){

				var currentUserInfo = {
					"name": document.getElementById( "enterNameHere" ).value,
					"corAnsw": correctAnsCount,
					"mstime": ms
				};

				for( var z = 0; z < arrayOfPrevBestScores.length; z++ ){

					if( currentUserInfo.mstime < arrayOfPrevBestScores[z].mstime ){

						arrayOfPrevBestScores.push(currentUserInfo);
						arrayOfPrevBestScores.sort( function(a, b){ return a.mstime - b.mstime; } );
						arrayOfPrevBestScores.pop();
						document.getElementById( "newHighScore" ).innerHTML = "You've made it into the Hall of Fame!";
						localStorage.setItem( "arrayOfBestScores", JSON.stringify( arrayOfPrevBestScores ) );
						showListOfHighScores();
						return;
					}

				}
				document.getElementById( "newHighScore" ).innerHTML = "You lost to the Elite Four. Try again!";
				showListOfHighScores();
			};

			//write high scores to HTML
			var showListOfHighScores = function(){
				
				var highScores = JSON.parse( localStorage.getItem( "arrayOfBestScores" ) );
				var champTable = document.getElementById( "elite4Table" );
				var writeChampsNamesHere = champTable.querySelectorAll( ".elite4Name" );
				var writeChampsTimesHere = champTable.querySelectorAll( ".elite4Time" ); 
				
				for( var y = 0; y < highScores.length; y++){
					if( y === 0 ){
						writeChampsNamesHere[y].textContent = "PokeChamp " + highScores[y].name;
						writeChampsTimesHere[y].textContent = highScores[y].mstime + "s";
					}
					else{
						writeChampsNamesHere[y].textContent = "Elite Four " + highScores[y].name;
						writeChampsTimesHere[y].textContent = highScores[y].mstime + "s";
					}
				}

			};

			//erase high scores from HTML, reset enterNameHere classname to blank (in case it showed .warning), hide end of quiz section, hide try again, show start of quiz
			var onTryAgain = function(){

				if( localStorage && JSON.parse( localStorage.getItem( "arrayOfBestScores" ) ) ){
					
					var highScores = JSON.parse( localStorage.getItem( "arrayOfBestScores" ) );
					var champTable = document.getElementById( "elite4Table" );
					var writeChampsNamesHere = champTable.querySelectorAll( ".elite4Name" );
					var writeChampsTimesHere = champTable.querySelectorAll( ".elite4Time" );

					for( var y = 0; y < highScores.length; y++){
						writeChampsNamesHere[y].innerHTML = "";
						writeChampsTimesHere[y].innerHTML = "";
					}
				}
				
				document.querySelector("[for='enterNameHere']").className = ""; 

				$( "#endOfQuiz" ).addClass( "hideMe" );
				
				document.getElementById( "showScore" ).innerHTML = "";
				document.getElementById( "newHighScore" ).innerHTML = "";
				$( "#tryAgainBtn" ).addClass( "displayNone" ); 

				$( "#startOfQuiz" ).removeClass( "displayNone" );
				updateAudioSrc( "sounds/pokeOpening.ogg", "sounds/pokeOpening.mp3");
			};

			//make the timer go tick tock
			var tickTock = function(){

				ms++;

				document.getElementById("timer").innerHTML = ms + "s";
			};

			//pause or play background music
			var onBgmBtn = function(){
				
				if( document.getElementById( "bgmPlayer" ).paused === true ){
					document.getElementById( "bgmPlayer" ).play();
					bgmPaused = false;
				}
				else{
					document.getElementById( "bgmPlayer" ).pause();
					bgmPaused = true;
				}
			};

			//update music file on page change
			var updateAudioSrc = function( ogg, mp3 ){
				document.getElementById( "oggSrc" ).src = ogg;
				document.getElementById( "mp3Src" ).src = mp3;
				document.getElementById( "bgmPlayer" ).load();

				if( bgmPaused === true ){
					document.getElementById( "bgmPlayer" ).pause();
				}
			};

			//controls for pikachu
			var pikaControls = function(){
				
				$( document ).keydown( function( key ){
					
					switch( parseInt( key.which, 10 ) ){
						
						case 87: 
						ensureBoundaries( "pikachu" );
						$( "#pikachu" ).animate( { top:"-=10px" }, 1 );
						break;
						
						case 83:
						ensureBoundaries( "pikachu" );
						$( "#pikachu" ).animate( { top:"+=10px" }, 1 );
						break;
					}
				});
			};

			var useHarden = function(){
				
				$( document ).keydown( function( key ){
					
					if( parseInt( key.which, 10 ) === 68 ){

						if( gameOver === false && powerPoints === 0 ){
							
							key.preventDefault();
							useStruggle();
						}

						else if( gameOver === false && powerPoints	> 0 ){

							key.preventDefault();

							var pikaYPos = getYPosition( "pikachu" );

							$( "#harden" ).removeClass( "displayNone" );
							setPosition( "harden", pikaYPos, "0" );

							powerPoints	= powerPoints	- 1;
							damageDealtByEnemy = Math.floor( damageDealtByEnemy	/ 2 );
							$( "#hud" ).html( "Metapod used Harden! Enemy Dmg reduced.<br> PP: " + powerPoints + "/10" );
							$( "#dmgTaken" ).html( "Enemy Dmg: " + damageDealtByEnemy );

							setTimeout( function(){ $( "#harden" ).addClass( "displayNone" ); }, 500 );
						}
					}
				});
			};

			var useStringShot = function(){

				$( document ).keydown( function( key ){

					if( parseInt( key.which, 10 ) === 32 ){

						key.preventDefault();

						if( gameOver === false && powerPoints === 0 ){
							
							useStruggle();
						}

						else if( gameOver === false && powerPoints	> 0 ){

							if( getXPosition( "stringshot" ) < 355 ){

								var pikaYPos = getYPosition( "pikachu" );
								var inFrontOfPika = getXPosition( "pikachu" )  / 6;

								$( "#stringshot" ).removeClass( "displayNone" );
								$( "#stringshot" ).css( "border-color", "transparent #e4e4e4 transparent transparent" );
								setPosition( "stringshot", pikaYPos, inFrontOfPika );

								stringshotFired = true;

								powerPoints = powerPoints - 1;
								$( "#hud" ).html( "Metapod used Stringshot! Enemy Spd reduced.<br> PP: " + powerPoints + "/10" );
							}
						}
					}
				});
			};

			var moveStringshot = function(){
				
				if( stringshotFired === true ){

					if( getXPosition( "stringshot" ) > getXPosition( "enemy1" ) ){

						$( "#stringshot" ).addClass( "displayNone" );
						stringshotFired = false;
					}

					else{
						
						$("#stringshot").animate( { left:"+=40px" }, 10 );
						checkForHits( "stringshot", "enemy1", enemyHitByStringshot );
					}
				}		
			};

			var enemyHitByStringshot = function(){

				$( "#stringshot" ).css( "border-color", "transparent #ff0000 transparent transparent" );
				enemyMoveSpd = enemyMoveSpd - 2;
				$( "#enemySpeed" ).html( "Enemy Spd: " + enemyMoveSpd );
			};

			var useStruggle = function(){

				$("#pikachu").addClass( "struggle" );

				document.getElementById( "timer"  ).style.color = "#ff0000";
				ms = ms + 3000;
				$( "#hud" ).html( "Metapod has no PP! Metapod used Struggle and hurt itself!");

				setTimeout( function(){ 
					$( "#pikachu" ).removeClass( "struggle" ); 
					document.getElementById( "timer"  ).style.color = "#ffffff"; 
				}, 500 );
			};

			//animate the enemy chasing pikachu
			var chasePika = function( elementId ){
				var pikaPos = parseInt( getYPosition( "pikachu" ), 10 );
				var enemyPos = parseInt( getYPosition( "enemy1"), 10 );
				var pxToMove = getRandomNumber( enemyMoveSpd );

				ensureBoundaries( "enemy1", 0, true );

				if( pikaPos < enemyPos ){
					$( "#" + elementId ).animate( { top:"-=" + pxToMove + "px" }, 1 );
				}

				else if( pikaPos > enemyPos ){
					$( "#" + elementId ).animate( { top:"+=" + pxToMove + "px" }, 1 );
				}

				else{
					if( pxToMove % 2 === 0 ){
						$( "#" + elementId ).animate( { top:"-=" + pxToMove + "px" }, 1 );
					}
					else{
						$( "#" + elementId ).animate( { top:"+=" + pxToMove + "px" }, 1 );
					}
				}

			};

			var shootFireBall = function( elementId ){

				if( gameOver === true ){
					$( "#fireball" ).addClass( "displayNone" );
					return;
				}
				
				if( getXPosition( "fireball" ) < getXPosition( "pikachu" ) ){

					var enemyYPos = getYPosition( elementId );
					var inFrontOfEnemy = getXPosition( elementId ) * 7 / 10;

					$( "#fireball" ).removeClass( "displayNone" );
					setPosition( "fireball", enemyYPos, inFrontOfEnemy );
				}

				else{

					$("#fireball").animate( { left:"-=40px" }, 10 );
				}	
			};

			var timeDamage = function(){

				document.getElementById("timer").style.color = "#ff0000";
				setTimeout( function(){ document.getElementById("timer").style.color = "#f0f0f0"; }, 300 );
				ms = ms + damageDealtByEnemy;
			};


			var getRandomNumber = function( maxSize ){
				
				return parseInt( Math.random() * maxSize );
			};		

			var ensureBoundaries = function( elementId , xPos , setFromRight ){
				
				var curPos = getYPosition( elementId );
				var docuH = $( document ).height();
				var ceilingBound = docuH / 10;
				var baseBound = docuH * 7 / 10;

				if( xPos === undefined ){
					xPos = 0;
				}

				if( curPos < ceilingBound ){
					
					if( setFromRight === true ){
						setPosition( elementId, ceilingBound, xPos, true );
					}

					else{
						setPosition( elementId, ceilingBound, xPos );
					}			
				}

				else if( curPos > baseBound ){

					if( setFromRight === true ){
						setPosition( elementId, baseBound, xPos, true );
					}

					else{
						setPosition( elementId, baseBound, xPos );
					}
				}

				else{
					return;
				}
			};

			var getYPosition = function( elementId ){
				
				return $( "#" + elementId ).offset().top;
			};

			var getXPosition = function( elementId ){
				
				return $( "#" + elementId ).offset().left;
			};

			var checkForHits = function( elementId1, elementId2, functionToCallOnHit ){

				var ele1 = document.getElementById( elementId1 );
				var ele1X = getXPosition( elementId1 );
				var ele1Y = getYPosition( elementId1 );
				var ele1W = ele1.offsetWidth;
				var ele1H = ele1.offsetHeight;

				var ele2 = document.getElementById( elementId2 );
				var ele2X = getXPosition( elementId2 );
				var ele2Y = getYPosition( elementId2 );
				var ele2W = ele2.offsetWidth;
				var ele2H = ele2.offsetHeight;
				

				if( ele1X < ele2X + ele2W &&
					ele1X + ele1W > ele2X &&
					ele1Y < ele2Y + ele2H &&
					ele1H + ele1Y > ele2Y ){

					functionToCallOnHit();
			}
		};

		var mainGameLoop = function(){

			if( new Date().getTime() - lastRun > gameLoopSpd ){

				checkForHits( "pikachu", "fireball", timeDamage );
				chasePika( "enemy1" );
				shootFireBall("enemy1" );
				moveStringshot();
				lastRun = new Date().getTime();	
			}

			setTimeout(mainGameLoop, 2);
		};

		mainGameLoop();

		//mobile touch events

		(function(){
			
			var myPika = document.getElementById( "pikachu" );

			var pikaHamManager = new Hammer( myPika );

			pikaHamManager.on( "panup", function( e ){
				ensureBoundaries( "pikachu" );
				$( "#pikachu" ).animate( { top:"-=5px" }, 1 );
			});

			pikaHamManager.on( "pandown", function( e ){
				ensureBoundaries( "pikachu" );
				$( "#pikachu" ).animate( { top:"+=5px" }, 1 );
			});

			pikaHamManager.on( "tap", function( e ){
				if( gameOver === false && powerPoints === 0 ){

					useStruggle();
				}

				else if( gameOver === false && powerPoints	> 0 ){

					if( getXPosition( "stringshot" ) < 355 ){

						var pikaYPos = getYPosition( "pikachu" );
						var inFrontOfPika = getXPosition( "pikachu" )  / 6;

						$( "#stringshot" ).removeClass( "displayNone" );
						$( "#stringshot" ).css( "border-color", "transparent #e4e4e4 transparent transparent" );
						setPosition( "stringshot", pikaYPos, inFrontOfPika );

						stringshotFired = true;

						powerPoints = powerPoints - 1;
						$( "#hud" ).html( "Metapod used Stringshot! Enemy Spd reduced.<br> PP: " + powerPoints + "/10" );
					}
				}
			});

			pikaHamManager.on( "press", function( e ){
				if( gameOver === false && powerPoints === 0 ){

					useStruggle();
				}

				else if( gameOver === false && powerPoints	> 0 ){

					var pikaYPos = getYPosition( "pikachu" );

					$( "#harden" ).removeClass( "displayNone" );
					setPosition( "harden", pikaYPos, "0" );

					powerPoints	= powerPoints	- 1;
					damageDealtByEnemy = Math.floor( damageDealtByEnemy	/ 2 );
					$( "#hud" ).html( "Metapod used Harden! Enemy Dmg reduced.<br> PP: " + powerPoints + "/10" );
					$( "#dmgTaken" ).html( "Enemy Dmg: " + damageDealtByEnemy );

					setTimeout( function(){ $( "#harden" ).addClass( "displayNone" ); }, 500 );
				}
			});

		})();



		window.addEventListener( "load", useStringShot );
		window.addEventListener( "load", useHarden );
		window.addEventListener( "load", pikaControls );
		document.getElementById( "startQuizBtn" ).addEventListener( "click", showBtns );
		document.getElementById( "bgmBtn" ).addEventListener( "click", onBgmBtn );
		document.getElementById( "enterNameBtn" ).addEventListener( "click", onEnterNameBtn );
		document.myForm.nextBtn.addEventListener( "click", onNextBtn );
		document.myForm.backBtn.addEventListener( "click", onBack );
		document.myForm.tryAgainBtn.addEventListener( "click", onTryAgain );
		document.body.addEventListener('touchmove', function(event) {
			event.preventDefault();
		}, false); 
