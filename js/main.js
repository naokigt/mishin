
//canvasの読み込み設定
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//マウスを操作する
var mouse = {x:0,y:0,x1:0,y1:0,color:"black"};
var draw = false;

//クリックしたら描画をOKの状態にする
canvas.addEventListener("mousedown",function(e) {
	draw = true;
	mouseXBefore = mouseXAfter;
	mouseYBefore = mouseYAfter;
});

//マウスの座標を取得する
canvas.addEventListener("mousemove",function(e) {
	var rect = e.target.getBoundingClientRect();
	ctx.lineWidth = 3;		// 線の太さ
	ctx.globalAlpha = 1;	// 透明度
	ctx.setLineDash([3, 15]); // 点線の間隔

	mouseXAfter = e.clientX - rect.left;
	mouseYAfter = e.clientY - rect.top;


	//クリック状態なら描画をする
	if(draw === true) {
		ctx.beginPath();
		ctx.moveTo(mouseXBefore,mouseYBefore);
		ctx.lineTo(mouseXAfter,mouseYAfter);
		ctx.lineCap = "round";
		ctx.stroke();
		ctx.strokeStyle = "#666";
		mouseXBefore = mouseXAfter;
		mouseYBefore = mouseYAfter;
	}
});



//クリックを離したら、描画を終了する
canvas.addEventListener("mouseup", function(e){
	draw = false;
});


//消去ボタンを起動する
$('#clear').click(function(e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});



//保存する
function save(){
	var can = canvas.toDataURL("image/png");
	can = can.replace("image/png", "image/octet-stream");
	window.open(can,"save");
}




//スマホ用
var finger=new Array;
for(var i=0;i<10;i++){
	finger[i]={
		x:0,y:0,x1:0,y1:0,
		color:"rgb("
		+Math.floor(Math.random()*16)*15+","
		+Math.floor(Math.random()*16)*15+","
		+Math.floor(Math.random()*16)*15
		+")"
	};
}

//タッチした瞬間座標を取得
canvas.addEventListener("touchstart",function(e){
	e.preventDefault();
	var rect = e.target.getBoundingClientRect();
	ctx.lineWidth = document.getElementById("lineWidth").value;
	ctx.globalAlpha = document.getElementById("alpha").value/100;
	for(var i=0;i<finger.length;i++){
		finger[i].x1 = e.touches[i].clientX-rect.left;
		finger[i].y1 = e.touches[i].clientY-rect.top;
	}
});

//タッチして動き出したら描画
canvas.addEventListener("touchmove",function(e){
	e.preventDefault();
	var rect = e.target.getBoundingClientRect();
	for(var i=0;i<finger.length;i++){
		finger[i].x = e.touches[i].clientX-rect.left;
		finger[i].y = e.touches[i].clientY-rect.top;
		ctx.beginPath();
		ctx.moveTo(finger[i].x1,finger[i].y1);
		ctx.lineTo(finger[i].x,finger[i].y);
		ctx.lineCap="round";
		ctx.stroke();
		finger[i].x1=finger[i].x;
		finger[i].y1=finger[i].y;

	}
});

