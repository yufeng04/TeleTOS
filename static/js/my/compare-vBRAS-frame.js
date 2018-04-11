$(".report-style2").hide();
$(".report-table").hide();
$(".type-report").hide();
$("#report-style1").css({"background":"#fff","color":"#000"});
$(".report-tab-change").click(function(e) {
	switch (e.target.id) {
		case ("report-style1"):
			$(".report-style1").fadeIn(1000);
			$(".report-style2").fadeOut();
			$("#report-style1").css({"background":"#fff","color":"#000"});
			$("#report-style2").css({"background":"#6cf","color":"#fff"});
			$(".report-table").fadeOut();
			$(".type-report").fadeOut();
			// 避免页面上有两个表格
			// if ($(".vendor-report-table").css("display") == "block") {
			// 	$(".vendor-report-table").fadeOut();
			// }
			break;
		case ("report-style2"):
			$(".report-style2").fadeIn(1000);
			$(".report-style1").fadeOut();
			$("#report-style2").css({"background":"#fff","color":"#000"});
			$("#report-style1").css({"background":"#6cf","color":"#fff"});
			$(".report-table").fadeOut();
			$(".type-report").fadeOut();
			//避免页面上有两个表格
			// if ($(".version-report-table").css("display") == "block") {
			// 	$(".version-report-table").fadeOut();
			// }
			break;
	}
})

// var versionData = {
// 		avgCapacity : [1,2,3],
// 		avgVelocity : [1,2,3],
// 		minVelocity : [1,2,3],
// 		maxMemory : [1,2,3],
// 		trans_64 : [4,5,6],
// 		trans_128 : [4,5,6],
// 		trans_256 : [4,5,6],
// 		trans_512 : [4,5,6],
// 		trans_1024 : [4,5,6],
// 		trans_1280 : [4,5,6],
// 		trans_1518 : [4,5,6],
// 		maxSessionCapacity : [7,8,9],
// 		newSessionVelocity : [7,8,9],
// 		needMaxMemory : [7,8,9]
// 	}


//相应配置模块的确认键按下 需要根据配置项动态生成表格
//此处还需添加一些判断 配置项不能为空 对比报告只显示一类 
//用户在生成第二次对比报告的时候，前一次的的报告应该清除 这里应该写在选择对比报告类型处
$("#version-report-btn").click(function() {
	// 避免重复添加数据，确定键按下时先清空表格之前添加的列，再添加新列
// 通过判断表头的列数 大于二时表明之前有添加列，将多余的列先清除
    var theadCol = $("#table-type-version").children();
    var tbodyRow = $("#version-tbody").children();
    console.log(theadCol);
    if (theadCol.length > 2) {
    	for (var i = 2; i < theadCol.length; i++) {
    		$(theadCol[i]).remove();
    	}
    	for (var k = 0; k < tbodyRow.length; k++) {
    		var tdCol = $(tbodyRow[k]).find("td");
    		for (var j=0; j < tdCol.length; j++){
    			$(tdCol[j]).remove();
			}
		}
    }

	// 设置表格id 便于表格数据输出
	$("#vendor-report-table").find("table")[0].setAttribute("id", "");
	$("#version-report-table").find("table")[0].setAttribute("id", "mytableExcel");

    var versionReport = document.getElementById("version-report-btn").parentNode;
    var verConfig = versionReport.getElementsByTagName("select");
    console.log(verConfig[0].value);
    for (var i = 0; i < verConfig.length; i++) {
    	if(verConfig[i].children[0].selected) {
    		alert("请完善配置信息!");
    		return;
    	}
    	else {
    		// 请求时需发送的信息
    		var vendor = verConfig[0].value;
    		var netNode = verConfig[1].value;

    		// 更换表格标题
    		var index = verConfig[0].selectedIndex;//获取当前选择项的索引

    		$("#vendor-name").html(verConfig[0].options[index].innerHTML);
 
    // 此处 $.AJAX 发送数据，并执行下方代码
    $.ajax('/api/v1/contrast-report', {
                method: 'POST',
                data: JSON.stringify({
                    venders: [vendor],
                    vnf_type: netNode,
                    version_flags: [1,2,3]
                }),
            }).done(function (data) { 
   console.log(data);
    for(var key in data) {
    	// 更新表头
		switch(key){
			case '1' :
				var newkey = '最新版本';
				break;
			case '2':
				var newkey = '次新版本';
				break;
			case '3':
				var newkey = '第三版本';
				break;

		}
        var versionTh = document.createElement("th");
        $(versionTh).html(newkey);
        $("#table-type-version").append(versionTh);
        // 添加对应内容
    var versionTable = $("#version-tbody").children();
    for (var i = 0; i < versionTable.length; i++) {
    	var versionTableTd = document.createElement("td");
    	$(versionTableTd).html(data[key][i]);
    	$(versionTable[i]).append(versionTableTd);
    }
    }
	$("#version-report-table").fadeIn(1000);
	$(".type-report").fadeIn(1000);
})
break;
}
}
})
// // vendor json数据 确定接口后 更换为 后台data
// var vendorData = {
// 	vendor: [
// 	{testData: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
// 	{testData: [2,3,4,7,8,9,1,2,3,10,14,12,13,1]}
//  ]
// }
$("#vendor-report-btn").click(function() {
	// 避免重复添加数据，确定键按下时先清空表格之前添加的列，再添加新列
// 通过判断表头的列数 大于二时表明之前有添加列，将多余的列先清除
    var theadCol = $("#table-type-vendor").children();
    var tbodyRow = $("#vendor-tbody").children();
    if (theadCol.length > 2) {
    	for (var i = 2; i < theadCol.length; i++) {
    		theadCol[i].remove();
    	}
    	for (var k = 0; k < tbodyRow.length; k++) {
    		var tdCol = $(tbodyRow[k]).find("td")
			console.log(tdCol);
    		for (var j=0; j < tdCol.length; j++){
    			$(tdCol[j]).remove();
			}
		}
    }

    // s设置表格id 便于导出表格数据
	$("#version-report-table").find("table")[0].setAttribute("id", "");
	$("#vendor-report-table").find("table")[0].setAttribute("id", "mytableExcel");

	var vendorChoose = $("#vendor-choose").find("input");
    //发送到后台 vendorName netNode
	var vendorName = [];
	var tableHead = [];
	var netNode = $("#netNode-choose input[name='netType']:checked").val();
	for (var i = 0; i < vendorChoose.length; i++) {
		if(vendorChoose[i].checked) {
			vendorName.push(vendorChoose[i].value);
			tableHead.push($(vendorChoose[i]).next().html());
		}
	}
	// console.log(vendorChoose);
	// console.log(vendorName);
	//此处发送ajax请求 更新标题 表头 创建表格 添加数据
	//更新标题
	$("#multi-vendor-name").html(tableHead.join("-"));
	$.ajax('/api/v1/contrast-report', {
                method: 'POST',
                data: JSON.stringify({
                    venders: vendorName,
                    vnf_type: netNode,
                    version_flags: [1]
                }),
            }).done(function (data) {
            	console.log(data);
	//更新表头 创建表格 添加数据
	for (var i = 0; i < vendorName.length; i++) {
		var tHead = document.createElement("th");
		$(tHead).html(tableHead[i]);
		$("#table-type-vendor").append(tHead);
		var vendorTable = $("#vendor-tbody").children()
		for (var k = 0; k < vendorTable.length; k++) {
			var tbodyTd = document.createElement("td");
			// 添加数据 之后json 应更换为 后台 data
			for(var key in data) {
			if (key == vendorName[i]) {
					$(tbodyTd).html(data[key][k]);
					$(vendorTable[k]).append(tbodyTd);
		}
		}
		}
	}

	$("#vendor-report-table").fadeIn(1000);
	$(".type-report").fadeIn(1000);
	})
})