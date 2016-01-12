$(function(){
	var sendData = {
		gender : $.cookie('sex'),
		name : $.cookie('userName'),
		posision : $.cookie('posision'),
		costume_head : $.cookie('costumeHead'),
		costume_up : $.cookie('costumeUp'),
		costume_under : $.cookie('costumeUnder'),
		maker : $.cookie('selectedMaker'),
		review : $.cookie('review'),
		finish_time : $.cookie('finishTime')
	}
	
	$.ajax({
		type: "GET",
		url: "http://cosplay-tailors.www2.jp/php/public/api/add_makes.json",
		dataType: 'json',
		data: sendData
	})
	.done(function(msg){
		console.log(msg);
	});
});