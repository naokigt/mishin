$(function(){

	//初期設定
	var svgElm = $("#drawingCanvas"), //SVG要素を取得
		movetoX = 0, //開始点(横方向)の初期化
		movetoY = 0, //開始点(縦方向)の初期化
		linetoStr = "", //LineToコマンド値の初期化
		strokeColor = "#666666", //描画色の初期化
		drawType = ""; //塗りつぶしの初期化

	/* ドラッグ開始 */
	$("#drawingCanvas").mousedown(function(event){
		strokeColor = "#666666"; //inputの色の設定を取得

		movetoX = parseInt(event.pageX - svgElm.position().left); //SVG上のマウス座標(横方向)の取得
		movetoY = parseInt(event.pageY - svgElm.position().top); //SVG上のマウス座標(縦方向)の取得
		var pathElm = document.createElementNS("http://www.w3.org/2000/svg", "path"); //SVGのpath要素を作成
		svgElm.append(pathElm); //SVGに作成したpathを追加

		//追加したpathの各属性を設定
		svgElm.find("path:last").attr({
			"d": "", //pathデータ
			"fill": "none", //塗りつぶし
			"stroke": strokeColor, //線の色
			"stroke-width": "3", //線の太さ
			"stroke-linecap": "round" //線の端を丸める
		});
		console.log(movetoX);

		var linetoX = [], //描画点の横座標の初期化
			linetoY = [], //描画点の縦座標の初期化
			cntMoveto = 0; //描画点のカウンターを初期化
		linetoStr = 'M ' + movetoX + ' ' + movetoY + ' '; //d要素でpathの開始点を設定

		/* ドラッグ中 */
		$("#drawingCanvas").on("mousemove", function(event){
			event.preventDefault();
			linetoX[cntMoveto] = parseInt(event.pageX - svgElm.position().left); //SVG上のマウス座標(横方向)の取得
			linetoY[cntMoveto] = parseInt(event.pageY - svgElm.position().top); //SVG上のマウス座標(縦方向)の取得
			linetoStr = linetoStr + " L " + linetoX[cntMoveto] + " " + linetoY[cntMoveto]; //動いた後の新たなマウス座標を描画点として追加

			svgElm.find("path:last").attr("d", linetoStr); //pathデータ(d属性)の値を更新
			cntMoveto++; //カウンターをセット
		});

	/* ドラッグ終了 */
	}).mouseup(function(event){
		$("#drawingCanvas").off("mousemove"); //pathの描画を終了
	});

	//CLEARボタンをクリックしたら、SVGを空にする
	$(".clear").click(function(){
		svgElm.html("");
	});


	// // 傾きを取得するコード
	// // DeviceOrientation Event
	// window.addEventListener("deviceorientation", deviceorientationHandler);

	// // ジャイロセンサーの値が変化
	// function deviceorientationHandler(event) {
	//     // X軸(スマホを横にした状態で左右の傾き)
	//     var beta = event.beta;
	//     // Y軸(スマホを横にした状態で縦の傾き)
	//     var gamma = event.gamma;
	//
	//     // Z軸(方角)今回は使わない
	//     var alpha = event.alpha;
	// }


});
