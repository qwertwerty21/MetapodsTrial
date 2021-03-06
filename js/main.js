			/*jslint white: true */
			var allQuestions = [
			{
				question: "What's the matter?",
				choices: ["He is tall.", "Drink warm water", "I hurt my arm.", "Get some rest."],
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
				correctAnswer: 2
			},
			{
				question: "Where is the bakery?",
				choices: ["I live in Jinju.", "Good. Let's go!", "I live on a boat.", "Go straight."],
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
				question: "How's the weather?",
				choices: ["I like food.", "I don't like snow.", "It's snowing.", "Today is Monday."],
				correctAnswer: 2
			},
			{
				question: "How are you?",
				choices: ["I'm happy.", "I'm big.", "I'm Hayun.", "He is sad."],
				correctAnswer: 0
			},
			{
				question: "Wow! You are ______ skiing!",
				choices: ["like it", "good at", "can good", "will go"],
				correctAnswer: 1
			},
			{
				question: "Do you have a pen?",
				choices: ["He can dance.", "I like reading.", "No, I do.", "Yes, I do."],
				correctAnswer: 3
			},
			{
				question: "________, where is the park?",
				choices: ["Go straight", "Happy Birthday", "Goodbye", "Excuse me"],
				correctAnswer: 3
			},
			{
				question: "Do you like school?",
				choices: ["No, I don't.", "I can't skate.", "Let's go!", "I am from America."],
				correctAnswer: 0
			}
			];

			var metaQuotes = [ 
			
			"I don't like dying, broh.",
			"Last name: Ever. First name: Greatest. Middle name: Metapod.", 
			"Shoot for the moon. For even if you miss, you'll be among the stars~",
			"I've got a squishy interior, dude...",
			"...Call me maybe?",
			"Do you even lift, brah?",
			"Got 'em, brah!",
			"YOLO!",
			"Ripper, man!",
			"Gnarly, dude!",
			"Sweet, man!",
			"Totes, brah.",
			"...Do you wanna build a snowman?"

			];

			var questionCount;
			var correctAnsCount;
			var curQuestion = allQuestions[questionCount];
			var userAnsArray = [];
			var actualAnsArray = [];
			var metaHealth;
			var bgmPaused = false;
			var gameLoopSpd;
			var damageDealtByEnemy;
			var stringshotFired;
			var enemyMoveSpd;
			var powerPoints;
			var currentlyDead;
			var metaDeathCount;
			var invincible;
			var lastRun = 0;
			var gameOver;
			if( localStorage ){
				
				var arrayOfPrevBestScores = JSON.parse( localStorage.getItem( "arrayOfBestScores" )) || [
				{"name":"Sunny","corAnsw":15,"deaths":1},
				{"name":"Lance","corAnsw":15,"deaths":5},
				{"name":"Agatha","corAnsw":15,"deaths":10},
				{"name":"Bruno","corAnsw":15,"deaths":15},
				{"name":"Lorelei","corAnsw":15,"deaths":20}
				];
			}

			//change start screen metapod quotes randomly every 5 secs
			$( document ).ready( function(){
				setInterval( function(){
					if( gameOver !== false ){
						var newMetaQuote = getRandomNumber( metaQuotes.length );
						$( "#metaStartQuote" ).html( metaQuotes[ newMetaQuote ] );  
					}
				}, 5000 );
			});
			
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

				$( "#mainMetapod" ).removeClass( "displayNone" );
				setPosition( "mainMetapod", "200" );
				$( "#enemy1" ).removeClass( "displayNone" );
				setPosition( "enemy1", "350", "0", true );

				loadNextQuestion();
			};

			//set position of element according to x and y 
			var setPosition = function( elementId, yPos, xPos, setFromRight ){
				
				elementId = "#" + elementId;

				if( yPos === undefined ){
					yPos = 0;
				}

				else if( xPos === undefined ){
					xPos = 0;
				}

				if( setFromRight === true ){
					$( elementId ).css( { right: xPos + "px" } );
				}

				else{
					$( elementId ).css( { left: xPos + "px" } );
				}

				$( elementId ).css( { top: yPos + "px" } );
				
			};

			var setBaseScores = function(){
				
				gameOver = false;
				questionCount = 0;
				correctAnsCount = 0;
				userAnsArray = [];

				gameLoopSpd = 100;
				
				metaDeathCount = 0;
				currentlyDead = false;
				metaHealth = 100;
				powerPoints	= 10;
				invincible = false;

				damageDealtByEnemy = 105;
				enemyMoveSpd = 40;

				$( "#hud" ).html( "" );

				$( "#metaDeathCounter" ).html( "Metapod Death Count: " + metaDeathCount );
				$( "#metaHP" ).html( "Metapod HP: " + metaHealth );
				$( "#metaPP" ).html( "Metapod PP: " + powerPoints );
				
				$( "#dmgTaken" ).html( "Enemy Dmg: " + damageDealtByEnemy );
				$( "#enemySpeed" ).html( "Enemy Spd: " + enemyMoveSpd );

				if( $( "#mainMetapod" ).hasClass( "justRevived" ) ){
					$( "#mainMetapod" ).removeClass( "justRevived" );
				}

			};

			var showTds = function(){

				var tdArray = $("td");

				tdArray.removeClass('hideMe');
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
				
				$( "#questionHere" ).html( curQuestion.question ); 

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

				var bonusPoints = Math.floor( powerPoints / 2 );

				

				gameOver = true;
				metaDeathCount = metaDeathCount - bonusPoints;

				hideTds();
				updateAudioSrc( "sounds/pokeEnding.ogg", "sounds/pokeEnding.mp3");

				$( "#endOfQuiz" ).removeClass( "hideMe" );
				
				$( "#showScore" ).html( "Correct Answers: " + correctAnsCount + " out of " + questionCount + " questions</br>" + "Bonus from remaining PP: " + bonusPoints + "<br>Your Metapod died " + metaDeathCount + " time(s)!" );

				$( "#stats" ).addClass( "hideMe" );
				$( "#nextBtn" ).addClass( "hideMe" );
				$( "#backBtn" ).addClass( "hideMe" );
				
				$( "#mainMetapod" ).addClass( "displayNone" );
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

				if( $( "#enterNameHere" ).val() !== "" ){
					
					localStorage.setItem( "arrayOfBestScores", JSON.stringify( arrayOfPrevBestScores ) );
					$( "#enterNameSect" ).addClass( "hideMe" );

					if( correctAnsCount === allQuestions.length ){
						
						checkIfUserEnterHallOfFame();
					}

					else{
						$( "#newHighScore" ).html( "You lost to the Elite Four. Try again!" );
						showListOfHighScores();
					}
				}
				
				else{
					$( "[for='enterNameHere']" ).addClass( "warning" );
					$( "#enterNameHere" ).focus();
					return false;
				}
			};

			//compare user score and see if they make it on the high score wall. if so, add user score to localstorage record. call show high scores.
			var checkIfUserEnterHallOfFame = function(){

				var currentUserInfo = {
					"name": $( "#enterNameHere" ).val(),
					"corAnsw": correctAnsCount,
					"deaths": metaDeathCount
				};

				for( var z = 0; z < arrayOfPrevBestScores.length; z++ ){

					if( currentUserInfo.deaths < arrayOfPrevBestScores[z].deaths ){

						arrayOfPrevBestScores.push(currentUserInfo);
						arrayOfPrevBestScores.sort( function(a, b){ return a.deaths - b.deaths; } );
						arrayOfPrevBestScores.pop();
						$( "#newHighScore" ).html( "You've made it into the Hall of Fame!" );
						localStorage.setItem( "arrayOfBestScores", JSON.stringify( arrayOfPrevBestScores ) );
						showListOfHighScores();
						return;
					}

				}
				$( "#newHighScore" ).html( "You lost to the Elite Four. Try again!" );
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
						writeChampsTimesHere[y].textContent = highScores[y].deaths + " Deaths";
					}
					else{
						writeChampsNamesHere[y].textContent = "Elite Four " + highScores[y].name;
						writeChampsTimesHere[y].textContent = highScores[y].deaths + " Deaths";
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
				
				$( "[for='enterNameHere']" ).removeClass(); 

				$( "#endOfQuiz" ).addClass( "hideMe" );
				
				$( "#showScore" ).html( "" );
				$( "#newHighScore" ).html( "" );
				$( "#tryAgainBtn" ).addClass( "displayNone" ); 

				$( "#startOfQuiz" ).removeClass( "displayNone" );
				updateAudioSrc( "sounds/pokeOpening.ogg", "sounds/pokeOpening.mp3");
			};

			//pause or play background music
			var onBgmBtn = function(){

				var bgmPlayer = document.getElementById( "bgmPlayer" );
				
				if( bgmPlayer.paused === true ){
					bgmPlayer.play();
					bgmPaused = false;
				}
				else{
					bgmPlayer.pause();
					bgmPaused = true;
				}
			};

			//update music file on page change
			var updateAudioSrc = function( ogg, mp3 ){
				
				var bgmPlayer = document.getElementById( "bgmPlayer" );

				$( "#oggSrc" ).attr( "src", ogg );
				$( "#mp3Src" ).attr( "src", mp3 );
				bgmPlayer.load();

				if( bgmPaused === true ){
					bgmPlayer.pause();
				}
			};

			//controls for mainMetapod
			var metaControls = function(){
				
				$( document ).keydown( function( key ){
					
					switch( parseInt( key.which, 10 ) ){
						
						case 87: 
						ensureBoundaries( "mainMetapod" );
						$( "#mainMetapod" ).animate( { top:"-=10px" }, 1 );
						break;
						
						case 83:
						ensureBoundaries( "mainMetapod" );
						$( "#mainMetapod" ).animate( { top:"+=10px" }, 1 );
						break;
					}
				});
			};

			//check whether to actually use Harden or to use Struggle
			var useHarden = function(){
				
				$( document ).keydown( function( key ){
					
					if( parseInt( key.which, 10 ) === 68 ){

						if( gameOver === false && powerPoints === 0 && currentlyDead !== true ){
							
							key.preventDefault();
							useStruggle();
						}

						else if( gameOver === false && powerPoints	> 0 && currentlyDead !== true ){

							key.preventDefault();
							actuallyUseHarden();
							
						}
					}
				});
			};

			//actually use Harden
			var actuallyUseHarden = function(){
				var metaYPos = getYPosition( "mainMetapod" );

				$( "#harden" ).removeClass( "displayNone" );
				setPosition( "harden", metaYPos, "0" );

				powerPoints	= powerPoints	- 1;
				damageDealtByEnemy = damageDealtByEnemy	- 10;
				$( "#hud" ).html( "Metapod used Harden! Enemy Dmg reduced." );
				$( "#dmgTaken" ).html( "Enemy Dmg: " + damageDealtByEnemy );
				$( "#metaPP" ).html( "Metapod PP: " + powerPoints );

				setTimeout( function(){ $( "#harden" ).addClass( "displayNone" ); }, 500 );
			};

			//check whether to actually use Stringshot or to use Struggle
			var useStringShot = function(){

				$( document ).keydown( function( key ){

					if( parseInt( key.which, 10 ) === 32 ){

						key.preventDefault();

						if( gameOver === false && powerPoints === 0 && currentlyDead !== true ){
							
							useStruggle();
						}

						else if( gameOver === false && powerPoints	> 0 && currentlyDead !== true ){

							if( getXPosition( "stringshot" ) < 355 ){

								actuallyUseStringShot();
								
							}
						}
					}
				});
			};

			//actually use Stringshot
			var actuallyUseStringShot = function(){
				var metaYPos = getYPosition( "mainMetapod" );
				var inFrontOfMeta = getXPosition( "mainMetapod" )  / 6;

				$( "#stringshot" ).removeClass( "displayNone" );
				$( "#stringshot" ).css( "border-color", "transparent #e4e4e4 transparent transparent" );
				setPosition( "stringshot", metaYPos, inFrontOfMeta );

				stringshotFired = true;

				powerPoints = powerPoints - 1;
				$( "#hud" ).html( "Metapod used Stringshot! Enemy Spd reduced on hit." );
				$( "#metaPP" ).html( "Metapod PP: " + powerPoints );
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

				if( currentlyDead !== true && invincible !== true ){
					$("#mainMetapod").addClass( "struggle" );

					$( "#metaHP"  ).css( "color", "#ff0000" );
					metaHealth = Math.ceil( metaHealth / 2 );
					$( "#hud" ).html( "Metapod has no PP! Metapod used Struggle and hurt itself!");
					$( "#metaHP" ).html( "Metapod HP: " + metaHealth );


					setTimeout( function(){ 
						$( "#mainMetapod" ).removeClass( "struggle" ); 
						$( "#metaHP"  ).css( "color", "#b4e652" );
					}, 500 );
				}
				
			};

			//animate the enemy chasing mainMetapod
			var chaseMeta = function( elementId ){
				var metaPos = parseInt( getYPosition( "mainMetapod" ), 10 );
				var enemyPos = parseInt( getYPosition( "enemy1"), 10 );
				var pxToMove = getRandomNumber( enemyMoveSpd );

				ensureBoundaries( "enemy1", 0, true );

				if( metaPos < enemyPos ){
					$( "#" + elementId ).animate( { top:"-=" + pxToMove + "px" }, 1 );
				}

				else if( metaPos > enemyPos ){
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
				
				if( getXPosition( "fireball" ) < getXPosition( "mainMetapod" ) ){

					var enemyYPos = getYPosition( elementId );
					var inFrontOfEnemy = getXPosition( elementId ) * 7 / 10;

					$( "#fireball" ).removeClass( "displayNone" );
					setPosition( "fireball", enemyYPos, inFrontOfEnemy );
				}

				else{

					$("#fireball").animate( { left:"-=40px" }, 10 );
				}	
			};

			var hpDamage = function(){

				if( invincible !== true ){
					$( "#metaHP"  ).css( "color", "#ff0000" );
					setTimeout( function(){ $( "#metaHP"  ).css( "color", "#b4e652" ); }, 300 );

					metaHealth = metaHealth - damageDealtByEnemy;

					if( metaHealth <= 0 ){
						metaHealth = 0;
					}

					$( "#metaHP" ).html( "Metapod HP: " + metaHealth );
				}
			};


			var getRandomNumber = function( maxSize ){
				
				return parseInt( Math.random() * maxSize );
			};		

			var ensureBoundaries = function( elementId , xPos , setFromRight ){
				
				var curPos = getYPosition( elementId );
				var docuH = $( document ).height();
				var ceilingBound = docuH / 10;
				var baseBound = docuH * 6.5 / 10;

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

		var isMetaDead = function(){

			if( metaHealth <= 0 && currentlyDead !== true ){
				
				currentlyDead = true;
				$( "#mainMetapod" ).addClass( "displayNone" );
				metaDeathCount = metaDeathCount + 1;
				$( "#metaDeathCounter" ).html( "Metapod Death Count: " + metaDeathCount );
				$( "#hud" ).html( "Metapod died! You used a Revive on Metapod...");

				setTimeout( function(){

					if( gameOver === false ){
						currentlyDead = false;
						$( "#mainMetapod" ).removeClass( "displayNone" );
						$( "#mainMetapod" ).addClass( "justRevived" );

						metaHealth = 100;
						$( "#metaHP" ).html( "Metapod HP: " + metaHealth );

						invincible = true;
					}		
				}, 1000 );

				setTimeout( function(){

					if( gameOver === false ){
						$( "#mainMetapod" ).removeClass( "justRevived" );
						invincible = false;
					}	
				}, 3000 );
			}
		};

		var mainGameLoop = function(){

			if( new Date().getTime() - lastRun > gameLoopSpd ){

				checkForHits( "mainMetapod", "fireball", hpDamage );
				isMetaDead();
				chaseMeta( "enemy1" );
				shootFireBall("enemy1" );
				moveStringshot();
				lastRun = new Date().getTime();	
			}

			setTimeout(mainGameLoop, 2);
		};

		mainGameLoop();

		//mobile touch events

		$( document ).ready( function(){
			
			var myMeta = document.getElementById( "mainMetapod" );

			var metaHamManager = new Hammer( myMeta );

			metaHamManager.on( "panleft", function( e ){
				ensureBoundaries( "mainMetapod" );
				$( "#mainMetapod" ).animate( { top:"-=5px" }, 1 );
			});

			metaHamManager.on( "panright", function( e ){
				ensureBoundaries( "mainMetapod" );
				$( "#mainMetapod" ).animate( { top:"+=5px" }, 1 );
			});

			metaHamManager.on( "tap", function( e ){
				if( gameOver === false && powerPoints === 0 && currentlyDead !== true ){

					useStruggle();
				}

				else if( gameOver === false && powerPoints	> 0 && currentlyDead !== true ){

					if( getXPosition( "stringshot" ) < 355 ){

						actuallyUseStringShot();
					}
				}
			});

			metaHamManager.on( "press", function( e ){
				if( gameOver === false && powerPoints === 0 && currentlyDead !== true ){

					useStruggle();
				}

				else if( gameOver === false && powerPoints	> 0 && currentlyDead !== true ){

					actuallyUseHarden();
				}
			});

		});

			$( document ).ready( function(){

				var nextBtnObj = document.getElementById( "nextBtn" );
				var backBtnObj = document.getElementById( "backBtn" );

				var nextBtnHamManager = new Hammer( nextBtnObj );
				var backBtnHamManager = new Hammer( backBtnObj );

				nextBtnHamManager.on( "tap", function( e ){
					onNextBtn();
				});

				backBtnHamManager.on( "tap", function( e ){
					onBack();
				});

			});

			$( document ).ready( function(){

				var btnAObj = document.getElementById( "btnA" );
				var btnBObj = document.getElementById( "btnB" );
				var btnCObj = document.getElementById( "btnC" );
				var btnDObj = document.getElementById( "btnD" );

				var btnALabelObj = document.getElementById( "btnALabel" );
				var btnBLabelObj = document.getElementById( "btnBLabel" );
				var btnCLabelObj = document.getElementById( "btnCLabel" );
				var btnDLabelObj = document.getElementById( "btnDLabel" );

				var btnAObjHamManager = new Hammer( btnAObj );
				var btnBObjHamManager = new Hammer( btnBObj );
				var btnCObjHamManager = new Hammer( btnCObj );
				var btnDObjHamManager = new Hammer( btnDObj );

				var btnALabObjHamMan = new Hammer( btnALabelObj );
				var btnBLabObjHamMan = new Hammer( btnBLabelObj );
				var btnCLabObjHamMan = new Hammer( btnCLabelObj );
				var btnDLabObjHamMan = new Hammer( btnDLabelObj );

				btnAObjHamManager.on( "tap", function( e ){
					btnAObj.checked = true;
				});
				btnBObjHamManager.on( "tap", function( e ){
					btnBObj.checked = true;
				});
				btnCObjHamManager.on( "tap", function( e ){
					btnCObj.checked = true;
				});
				btnDObjHamManager.on( "tap", function( e ){
					btnDObj.checked = true;
				});		

				btnALabObjHamMan.on( "tap", function( e ){
					btnAObj.checked = true;
				});
				btnBLabObjHamMan.on( "tap", function( e ){
					btnBObj.checked = true;
				});
				btnCLabObjHamMan.on( "tap", function( e ){
					btnCObj.checked = true;
				});
				btnDLabObjHamMan.on( "tap", function( e ){
					btnDObj.checked = true;
				});				

			});

			window.addEventListener( "load", useStringShot );
			window.addEventListener( "load", useHarden );
			window.addEventListener( "load", metaControls );
			document.getElementById( "startQuizBtn" ).addEventListener( "click", showBtns );
			document.getElementById( "bgmBtn" ).addEventListener( "click", onBgmBtn );
			document.getElementById( "enterNameBtn" ).addEventListener( "click", onEnterNameBtn );
			document.myForm.tryAgainBtn.addEventListener( "click", onTryAgain );

