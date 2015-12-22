$(function(){
	
	// setTimeout(function(){
	// 	$("#new_request").slideDown('slow', function(){
	// 		$(".order-message-after").slideDown('slow');
	// 	});
		$("#new_request").addClass('animated fadeInDown');
		$(".order-message-after").addClass('animated fadeInDown')
	// }, 500);
	
	// メッセージの受け取り画面
	$("#page-order-message .dash-btn").click(function() {
	    $("#page-order-message").hide();
	    	$("#page-order-main").show();

	});
	
	// 製作する衣装の確認画面
	$("#page-order-main .dash-btn").click(function() {
	   $("#page-order").fadeOut('fast', function() {
	       $("#page-mishin").fadeIn('fast');
			startTutorial();
	   });
	});
	console.log($.cookie('position'));
	if($.cookie('position') == 'btn3'){
		$("#page-order-message").hide();
		$("#page-order").hide();
		$("#page-mishin").show();
	}
	
	
	// プレゼン用の終了ボタン
	$("#finish-button").click(function() {
		drawEnd();
	});

	
	// キャンバスサイズをウインドウの大きさにする
	var canvasWidth = window.innerWidth,
		canvasHeight = window.innerHeight;
	
	// canvasの初期化
	function canvasInit(canvasId){
		var canvasEl = document.getElementById(canvasId);
		canvasEl.style.width = window.innerWidth + 'px';
		canvasEl.style.height = window.innerHeight + 'px';
		canvasEl.width = window.innerWidth;
		canvasEl.height = window.innerHeight;
		return canvasEl.getContext("2d");
	}
	
	var ctx = canvasInit("canvas"); // メインのキャンバス
	var ctxp = canvasInit("canvas-pointer"); // 先頭の糸の動きを描画
	var ctxt = canvasInit("canvas-tutorial"); // チュートリアルを描画
	
	var rangeImagePath = "https://preview.c9users.io/naokigt/mishin-3d/img/ginger_cookie_3.png";
    drawingImage(rangeImagePath);

	// 初期の糸の位置
	var pointer = {
		x: 112,
		y: 83
	 };
	
	var pointerGoal = {
		circleX: 133,
		circleY: 50,
		circleRadius: 7
	}
	
	var drawInterval;
	
    
	var beta,
		gamma;
	var MAX_SLOPE = 26;  // 最大傾斜
		
	// ジャイロセンサーの値が変化
	window.addEventListener("deviceorientation", function deviceorientationHandler(event) {
		beta = event.beta;
		gamma = event.gamma;
		
		// 最大傾斜にする
		if(beta >= MAX_SLOPE){
			beta = MAX_SLOPE;
		}else if(beta <= -MAX_SLOPE){
			beta = -MAX_SLOPE;
		}
		if(gamma >= MAX_SLOPE){
			gamma = MAX_SLOPE;
		}else if(gamma <= -MAX_SLOPE){
			gamma = -MAX_SLOPE;
		}
		checkStartBtn();
	});
	
	
	// ミシン開始ボタンは水平の状態した押せない
	function checkStartBtn(){
		var LIMIT_SLOPE = 10;
		if(beta >= -LIMIT_SLOPE && beta <= LIMIT_SLOPE &&
		   gamma >= -LIMIT_SLOPE && gamma <= LIMIT_SLOPE){
			// 水平の時
			$("#tutorial-wrapper .dash-btn").prop('disabled', false).removeClass('dash-btn-disabled');

		}else{
			// 水平じゃない時
			$("#tutorial-wrapper .dash-btn").prop('disabled', true).addClass('dash-btn-disabled');
		}
	}
	$('#draw-start').click(function(){
		if( ! $(this).hasClass('dash-btn-disabled')){
			endTutorial();
		}
	});

	// チュートリアルの描画
	function startTutorial(){
		var img = new Image();
	 	img.onload = function() {
		 	var imageWidth = window.innerWidth;
		 	var imageHeight = (img.height * (imageWidth / img.width));
		  	ctxt.drawImage(img, imageWidth*0.05, imageHeight*0.05, imageWidth*0.9, imageHeight*0.9);
	 	}
	 	img.src = "img/ginger_cookie_tutorial.png";
	}
	// チュートリアルを終わる
	function endTutorial(){
		$("#tutorial-wrapper").fadeOut('fast')
		drawStart();
	}

	
	// 画像の描画
	function drawingImage(path){
		var img = new Image();
	 	img.onload = function() {
		 	var imageWidth = window.innerWidth;
		 	var imageHeight = (img.height * (imageWidth / img.width));
		  	ctx.drawImage(img, imageWidth*0.05, imageHeight*0.05, imageWidth*0.9, imageHeight*0.9);

		  	(function(){
		  	// ゴール範囲の描画
		  		ctx.strokeStyle = "#ff4455";
		  		ctx.fillStyle = "#ff4455";
		  		ctx.lineWidth = 3;
		  		ctx.shadowBlur = 5;
		  		ctx.shadowColor = "rgba(50, 50, 50, 0.2)";
			  	ctx.beginPath();
				ctx.arc(pointerGoal.circleX, pointerGoal.circleY, pointerGoal.circleRadius, 0, Math.PI*2, true);
			    //現在のパスを輪郭表示する
			    ctx.stroke();
			    ctx.fill();
		  	})();
		    
	 	}
	 	img.src = path;
	}

	// 糸の描画
	function drawingPointer(){
	    $('#beta-value').text(pointer.x);
	    $('#gamma-value').text(pointer.y);
		beta = Math.floor(beta / 3 * 2);
		gamma = Math.floor(gamma / 3 * 2);
		
		
		var lineLengthX = Math.floor(gamma / 3);
		var lineLengthY = Math.floor(beta / 3);

	    pointer.x += gamma;
	    pointer.y += beta;
	    
	    if(pointer.x > canvasWidth){
	    	pointer.x = canvasWidth;
	    }else if(pointer.x < 0){
	    	pointer.x = 0;
	    }
	    if(pointer.y > canvasHeight){
	    	pointer.y = canvasHeight;
	    }else if(pointer.y < 0){
	    	pointer.y = 0;
	    }
	    
		drawingLeadPointer();
		checkGoalPoint();
		
		// 範囲内だけ描ける
	    if( ! isInRange(pointer.x, pointer.y)){
	    	return;
	    }

	    ctx.strokeStyle = "#0000ff"; //線のカラー設定
        ctx.lineWidth = 4; //線の太さ
        ctx.lineCap = "round";
        ctx.beginPath(); //パスの描画を始める
        ctx.moveTo(pointer.x, pointer.y); //線の開始位置 (xの座標値 , yの座標値)
        ctx.lineTo(pointer.x + lineLengthX, pointer.y + lineLengthY); //線の終了位置 (xの座標値, yの座標値)
        ctx.stroke(); //線の終了
	}
	
	// 糸の先頭を表す点を描画
	function drawingLeadPointer(){
		ctxp.clearRect(0, 0, canvasWidth, canvasHeight);
		
	    ctxp.fillStyle = "#9999ff"; //線のカラー設定
        // ctxp.lineWidth = 4; //線の太さ
        ctxp.lineCap = "round";
		ctxp.beginPath();
		// 第三引数 => 半径
		ctxp.arc(pointer.x, pointer.y, 3, 0, Math.PI*2, true);
		ctxp.fill();

		 //(140,80)を中心点とする、半径50の円弧を、開始角度90度、終了角度180度で、半時計回りに作成する
	    // ctxp.arc(pointer.x, pointer.y ,10 ,0, 0);
	    //現在のパスを輪郭表示する
	    
	    // ctxp.stroke();
	    // ctxp.fill();
	}
	
	// 範囲内だとtrue
	function isInRange(x, y){
		var imageData = ctx.getImageData(x, y, 1, 1);
    	var colorRBGA = Array.prototype.slice.apply(imageData.data);
	    // $('#r-value').text(colorRBGA[0]);
	    // $('#g-value').text(colorRBGA[1]);
	    // $('#b-value').text(colorRBGA[2]);
	    // $('#a-value').text(colorRBGA[3]);
	    
	    // 範囲外の色を指定
	    if(colorRBGA[3] == 0 || colorRBGA[0] <= 90){
	    	pointer.x -= gamma;
	    	pointer.y -= beta;
	    	return false;
	    }else{
	    	return true;
	    }
	}
	
	// スタートボタンが押された時に開始する
	function drawStart(){
		drawInterval = setInterval(drawingPointer, 180);  // 糸の描画を始める
		startTimer();
	}
	
	// 糸がゴールに来たら終了する
	function drawEnd(){
		clearInterval(drawInterval);
		finishTimer();
		$("#page-mishin").fadeOut('slow', function() {
			// $("#page-finish").fadeIn('fast');
			// $("#finish-time").text("今回の製作時間は"+finishTime+"秒です");
		});
	}
	
	// ゴールの判定
	function checkGoalPoint(){
		if(pointerGoal.xStart < pointer.x && pointer.x < pointerGoal.xEnd && 
			pointerGoal.yStart < pointer.y && pointer.y < pointerGoal.yEnd){
			drawEnd();	
		}
		if( (pointerGoal.circleX-pointer.x)*(pointerGoal.circleX-pointer.x) +
			(pointerGoal.circleY-pointer.y)*(pointerGoal.circleY-pointer.y) <= pointerGoal.circleRadius*pointerGoal.circleRadius){
			drawEnd();
		}
	}
	
	
});

// 時間計測
var timer1,
	startTime,
	finishTime = 0,
	status;
	

function startTimer(){
    startTime = new Date();
    timer1 = setInterval("getTime()",500);
}
function getTime(){
    var currentTime = new Date();
    status = Math.floor((currentTime - startTime) / 1000);
    $('#time-value').text(status);
    console.log(status);
}
function finishTimer(){
	finishTime = status;
	clearInterval(timer1);
		// alert('終わり');
	$.cookie('finishTime', finishTime);
	window.location.href = "end.html";
}