/** 
 *@file 任务列表页面修改 tab切换选择测试类型 弹窗进行网元配置
 *@author yufeng（Feng_yu@bupt.edu.cn）
 *
*/

//tab切换 进行测试任务选择
//初始化 任务一显示 其他隐藏
$("#tab-content1").css({"background":"#fff", "color":"#000"});
$(".tab-content2").hide();
$(".tab-content3").hide();
$(".tab-change").click(function(e) {
	var tabChange = $(".tab-change").children();
  //修改tab背景字体颜色
	for (var i = 0; i < tabChange.length; i++) {
		if(tabChange[i] == e.target){
			tabChange[i].style.background = "#fff";
			tabChange[i].style.color = "#000";
		}
		else {
			tabChange[i].style.background = "#6cf";
			tabChange[i].style.color = "#fff";
		}
	}
  //显示测试任务配置
	switch (e.target.id) {
		case ("tab-content1"):
			$(".tab-content1").fadeIn(1000);
			$(".tab-content2").fadeOut();
			$(".tab-content3").fadeOut();
			break;
		case ("tab-content2"):
			$(".tab-content1").fadeOut();
			$(".tab-content2").fadeIn(1000);
			$(".tab-content3").fadeOut();
			break;
		case ("tab-content3"):
			$(".tab-content1").fadeOut();
			$(".tab-content2").fadeOut();
			$(".tab-content3").fadeIn(1000);
			break;
	}
})

/**
*完成厂商选择，级联版本选择
*完成网元配置，slot与port级联
*此处还没有完成向itest的数据发送---解决方案：在show_Task2.js中修改发送数据内容即可
*/
//选择厂商版本
//自定义的Json数据，用于构成级联菜单，可替换为后台数据
var venderVersion = {
  zhongXing: ["ZX1.1", "ZX1.2", "ZX1.3"],
  huaWei: ["HW1.1", "HW1.2", "HW1.3"],
  nokia: ["nokia1.1", "nokia1.2", "nokia1.3"],
  cisco: ["cisco1.1", "cisco1.2", "cisco1.3"],
  ericsson: ["ericsson1.1", "ericsson1.2", "ericsson1.3"],
  certus: ["certus1.1", "certus1.2", "certus1.3"],
  h3c: ["h3c1.1", "h3c1.2", "h3c1.3"]
}
//级联菜单实现
$("#choose-vendor").change(function() {
var venderName = $("#choose-vendor").val();
switch(venderName) {
  case ("zhongXing"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.zhongXing.length; i++) {
      var versionContent = document.createElement("option");
      // console.log(versionContent);
      $(versionContent).html(venderVersion.zhongXing[i]);
      $("#choose-version").append(versionContent);
    }
    break;

  case ("huaWei"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.huaWei.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(venderVersion.huaWei[i]);
       $("#choose-version").append(versionContent);
    }
    break;

  case ("nokia"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.nokia.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(venderVersion.nokia[i]);
       $("#choose-version").append(versionContent);
    }
    break;

    case ("cisco"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.cisco.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(venderVersion.cisco[i]);
       $("#choose-version").append(versionContent);
    }
    break;

    case ("ericsson"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.ericsson.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(venderVersion.ericsson[i]);
       $("#choose-version").append(versionContent);
    }
    break;

    case ("certus"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.certus.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(venderVersion.certus[i]);
      $("#choose-version").append(versionContent);
    }
    break;

    case ("h3c"):
    $("#choose-version").children().remove();
    for (var i = 0; i < venderVersion.h3c.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(venderVersion.h3c[i]);
       $("#choose-version").append(versionContent);
    }
    break;

  default:
    alert("请选择厂商");
    break;    
}
})

//网元配置弹窗
var netNodeNum = 1;//默认网元一
$("#node-config1").css({"background":"#fff", "color":"#000"});
$(".node-config2").hide();
$(".node-config3").hide();
$(".net-node-type").click(function(e) {
  var nodeChange = $(".net-node-type").children();
  for (var i = 0; i < nodeChange.length; i++) {
    if(nodeChange[i] == e.target){
      nodeChange[i].style.background = "#fff";
      nodeChange[i].style.color = "#000";
    }
    else {
      nodeChange[i].style.background = "#6cf";
      nodeChange[i].style.color = "#fff";
    }
  }
  switch (e.target.id) {
    case ("node-config1"):
      $(".node-config1").fadeIn(1000);
      $(".node-config2").fadeOut();
      $(".node-config3").fadeOut();
      netNodeNum = 1;
      break;
    case ("node-config2"):
      $(".node-config1").fadeOut();
      $(".node-config2").fadeIn(1000);
      $(".node-config3").fadeOut();
      netNodeNum = 2;
      break;
    case ("node-config3"):
      $(".node-config1").fadeOut();
      $(".node-config2").fadeOut();
      $(".node-config3").fadeIn(1000);
      netNodeNum = 3;
      break;
  }
})

var platformData = {
  zhongXing: ["ZX1.1", "ZX1.2", "ZX1.3"],
  huaWei: ["HW2.1", "HW2.2", "HW2.3"],
  h3c: ["HS3.1", "HS3.2", "HS3.3"],
  VMware: ["VMw3.1", "VMw3.2", "VMw3.3"]
}
//云平台与平台版本级联
$("#choose-cloudPlatform").change(function() {
var platformName = $("#choose-cloudPlatform").val();
switch(platformName) {
  case ("zhongXing"):
    $("#choose-platformVers").children().remove();
    for (var i = 0; i < platformData.zhongXing.length; i++) {
      var versionContent = document.createElement("option");
      // console.log(versionContent);
      $(versionContent).html(platformData.zhongXing[i]);
      $("#choose-platformVers").append(versionContent);
    }
    break;

  case ("huaWei"):
    $("#choose-platformVers").children().remove();
    for (var i = 0; i < platformData.huaWei.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(platformData.huaWei[i]);
       $("#choose-platformVers").append(versionContent);
    }
    break;

  case ("h3c"):
    $("#choose-platformVers").children().remove();
    for (var i = 0; i < platformData.h3c.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(platformData.h3c[i]);
       $("#choose-platformVers").append(versionContent);
    }
    break;

    case ("VMware"):
    $("#choose-platformVers").children().remove();
    for (var i = 0; i < platformData.VMware.length; i++) {
      var versionContent = document.createElement("option");
      $(versionContent).html(platformData.VMware[i]);
       $("#choose-platformVers").append(versionContent);
    }
    break;

  default:
    alert("请选择厂商");
    break;    
}
})


/**
window.onload=function()
        {
            document.getElementById("nav_task").setAttribute("class","has-child-item open-item active-item");
            document.getElementById("nav_tasklist").setAttribute("class","active-item");
            $(nav_dashboard).removeClass("active-item");
            alert(111);

            $.ajax('/api/v1/if-exist-current-task/', {
                method: 'POST',
                data:
                    JSON.stringify({
                        flag: 1
                    }),
            }).done(function (data) {
                if (data.taskid) {
                    alert('No current task');
                }else{
                var taskId = data.taskid;
                switch (data.tasktype) {
                    case 'VNF_1_Concurrent_Session_Capacity':
                        var taskType = '1';
                        break;
                    case 'VNF_2_VBRAS_Client_Forwarding_Performance':
                        var taskType = '2';
                        break;
                    case 'VNF_3_PPPoE_IPTV_IPoE_VoIP':
                        var taskType = '3';
                        break;
                }
                if (data.taskid) {
                    $.ajax('/api/v1/index-task-details', {
                        method: 'POST',
                        data: JSON.stringify({
                            taskid: taskId,
                            tasktype: taskType,
                            flag: 1,
                        }),
                    }).done(function (data) {
                        var currentData = '<table>' +
                            '<tr>' +
                            '<td style="width: 150px">' +
                            '<h6>测试session数： </h6>' +
                            '<h6>已完成session数： </h6>' +
                            '<h6>已完成：</h6></td>' +
                            '<td style="width: 750px">' +
                            '<h6>' + data.set_session + '</h6>' +
                            '<h6>' + data.current_session + '</h6>' +
                            '<h6>' + data.current_session / data.set_session * 100 + '%</h6></td>' +
                            '<td><button type="button" class="btn btn-wide btn-danger" data-toggle="modal" data-target="#error-modal">终止</button></td>'
                        '</tr></table>'
                        switch (taskType) {
                            case '1':
                                var taskTypeTitle = 'PPPOE并发会话容量测试';
                                var taskDetail = '';
                                break;
                            case '2':
                                var taskTypeTitle = 'vBRAS用户侧转发性能测试';
                                var taskDetail = '<table style="width: 800px; height:100px;text-align: center; margin: 20px;">' +
                                    '<tr style="border-bottom:1px solid #ccc;"><th>帧</th>' +
                                    '<td>64字节</td><td>128字节</td><td>256字节</td><td>512字节</td><td>1024字节</td><td>1280字节</td><td>1518字节<td></tr>' +
                                    '<tr style="border-bottom:1px solid #ccc;"><th>平均时延</th>' +
                                    '<td>' + data.frame_size_64 + 'μs</td>' +
                                    '<td>' + data.frame_size_128 + 'μs</td>' +
                                    '<td>' + data.frame_size_256 + 'μs</td>' +
                                    '<td>' + data.frame_size_512 + 'μs</td>' +
                                    '<td>' + data.frame_size_1024 + 'μs</td>' +
                                    '<td>' + data.frame_size_1280 + 'μs</td>' +
                                    '<td>' + data.frame_size_1518 + 'μs</td>' +
                                    '</tr>' +
                                    '</table>'
                                break;
                            case '3':
                                var taskTypeTitle = 'vBRAS综合上网业务测试';
                                var taskDetail = '<h6>测试业务：宽带上网（PPPoE）+ IPTV（PPPoE）+ ITMS（IPoE）+ VoIP（IPoE）</h6>'
                                break;
                        }

                        var currentTask = '<div class="panel-header">' +
                            '<h3 class="panel-title">测试用例<span class="code">正在进行</span></h3>' +
                            '<h3 class="panel-subtitle">测试类型：' + taskTypeTitle + '</h3>' +
                            '</div>' +
                            '<div class="panel-content">' + currentData + taskDetail + '</div>'

                        var beginTime = '<div class="panel-footer">开始时间：' + data.begin_time + '</div>'

                        var currentTaskPanel = $('#currentTaskPanel');
                        currentTaskPanel.children().remove();

                        $('#currentTaskPanel').append(currentTask);
                        $('#currentTaskPanel').append(beginTime);

                    })
                }
            }
            })
        }

*/
/**
*任务配置数据 发送到itest
*
*/


var vendor_name;//厂商名
var version_num;//厂商对应版本
var ipAddr;//ip地址
var portType = [];//port接口
var cloudPlatform;// 云平台厂家
var platformVers;//对应平台版本
var slotType;//插槽类型
var Sp = [];//传递给itest的Slot/port组合
$("#confirm_netnode").click(function() {
  vendor_name = $('#choose-vendor').val();
  version_num = $('#choose-version').val();
  cloudPlatform = $('#choose-cloudPlatform').val();
  platformVers = $('#choose-platformVers').val();

  ipAddr = $('#ip_addr').val();
  slotType = $('#choose-slot').val();
  var choosePort = $('#choose-port').find('input');
  for (var i = 0; i < choosePort.length; i++) {
    if(choosePort[i].checked) {
      portType.push(choosePort[i].value);
    }
  }

  var configData = confirm("请确认：" + "\n" + "厂商：" + vendor_name + "\n"
                        + "版本：" + version_num + "\n" + "网元:" + netNodeNum + "\n"
                  + "IP：" + ipAddr + "\n"  + "Slot：" + slotType + "\n" + "Port：" + portType
                  + "\n" + "云平台：" + cloudPlatform + "\n" +"平台版本：" + platformVers) 
  if (configData && vendor_name && cloudPlatform) {
      alert("配置完成！")
  }
  else {alert("请完善配置!")}

// 构造 Sp1 Sp2 ... 发给itest的JSON 数据
for (var i = 0; i < portType.length; i++) {
  var tempObj = {};
  spTemp = "Spt" + (i + 1);
  tempObj[spTemp] = slotType + "/" + portType[i];
  Sp.push(tempObj);
}
});



  $('#test_vBRAS_session_bg').click(function() {
      alert(111);
      
      var session_pt = $('#test_vBRAS_session_pt').val();
      var session_sn = $('#test_vBRAS_session_sn').val();
      var session_sv = $('#test_vBRAS_session_sv').val();
      var cloudstress = $("input[name='cloudstress1']:checked").val();
      // document.getElementById("task_name").innerHTML = 'PPPoE并发会话容量'
      // document.getElementById("task_explain1").innerHTML = 'vBars接入性能测试'
      // document.getElementById("task_explain2").innerHTML = '测试单台vBRAS整机最大可以支持PPPoE用户并发上线数量'

      var sessionData = confirm("请确认：" + "\n"+ "流量：" + session_pt + "G" + "\n" 
      			  				+ "最大并发会话容量：" + session_sn + "\n" + "新建会话速率" + session_sv + "\n"
                      + "Cloudstress：" + cloudstress);
if (sessionData) {
	$('#test_vBRAS_session_pt').val("");
	$('#test_vBRAS_session_sn').val("");
  $('#test_vBRAS_session_sv').val("");
	$("input[name='cloudstress1']:checked").each(function() {  
        $(this).prop( "checked",false);  
    });

      $.ajax('/api/v1/vnf1-uuid/',{
          type:'POST',
          data:
              JSON.stringify({
                  begin: 1,
                  set_flow: session_pt,
                  set_session: session_sn,
                  set_vender: vendor_name,
                  set_version: version_num,
                  set_vnf_type:netNodeNum,
                  set_timer: 1,
                  set_online_rate:session_sv,
                  set_cloudPlatform: cloudPlatform,
                  set_platformVer: platformVers,
                  //current_test_type:'VNF_1_Concurrent_Session_Capacity',
                  csrfmiddlewaretoken: $('input[type=hidden]').val()//传递默认值，之前的但我没找到这个节点
              }),
      }).done(function (data) {
          // alert(data.stepId);

          alert("接收到data");
          id = data.taskId;
          alert(id);
          $.ajax('http://172.16.110.245:5000/TaskExec/bkg',{
              type:'POST',
              data:
                  JSON.stringify({
                      scripttype: 'itest',
                      serverIp: '172.16.110.250:8000',
                      testcase: {
                          script: [{
                              type: 'itest',
                              id: 1,
                              file: 'VNF_1_Concurrent_Session_Capacity.fftc',
                          }]
                      },
                      taskId: id,
                      device: {
                           TESTER:[{"ip": ipAddr,
                               "type": netNodeNum,
                               "id": id,
                               "reservePorts":Sp,
                               "needPort": portType.length
                             }]
                      },
                      parameter: [{
                          PPPoEClientNum: session_sn,
                          porttype: session_pt,
                          taskId: id,
                          cloudstress: cloudstress,
                      }],
                      //csrfmiddlewaretoken: $('input[type=hidden]').val()

                  }),
          }).done(function(data){
              alert('itest OK');
              alert(data.log);
              //window.location.reload();
          })
           Sp = [];
           portType = [];
      });
  }});



  $('#test_vBRAS_frame_bg').click(function() {

      var frame_pt = $('#test_vBRAS_frame_pt').val();
      var frame_sn = $('#test_vBRAS_frame_sn').val();
      var cloudstress2 = $("input[name='cloudstress2']:checked").val();

      var frameData = confirm("请确认：" + "\n"+ "流量：" + frame_pt + "G" + "\n" 
      			  				+ "会话数：" + frame_sn + "\n" + "Cloudstress：" + cloudstress2);
if (frameData) {
	$('#test_vBRAS_frame_pt').val("");
    $('#test_vBRAS_frame_sn').val("");
    $("input[name='cloudstress2']:checked").each(function() {  
        $(this).prop( "checked",false);  
    });
      $.ajax('/api/v1/vnf2-uuid/',{
          type:'POST',
          data:
              JSON.stringify({
                  begin: 1,
                  set_flow: frame_pt,
                  set_session: frame_sn,
                  set_vender: vendor_name,
                  set_version: version_num,
                  set_vnf_type:netNodeNum,
                  set_timer: 1,
                  set_cloudPlatform: cloudPlatform,
                  set_platformVer: platformVers,                  set_vendor: vendor_name,
                  //current_test_type:'VNF_1_Concurrent_Session_Capacity',
                  csrfmiddlewaretoken: $('input[type=hidden]').val()
              }),
      }).done(function (data) {
          // alert(data.stepId);

          alert("接收到data");
          id = data.taskId;
          alert(id);
          $.ajax('http://172.16.110.245:5000/TaskExec/bkg',{
              type:'POST',
              data:
                  JSON.stringify({
                      scripttype: 'itest',
                      serverIp: '172.16.110.250:8000',
                      testcase: {
                          script: [{
                              type: 'itest',
                              id: 1,
                              file: 'VNF_2_VBRAS_Client_Forwarding_Performance.fftc',
                          }]
                      },
                      taskId: id,
                      device: {
                          TESTER:[{"ip": ipAddr,
                               "type": netNodeNum,
                               "id": id,
                               "reservePorts":Sp,
                               "needPort": portType.length
                             }]
                      },
                      parameter: [{
                          PPPoEClientNum: frame_sn,
                          porttype: frame_pt,
                          taskId: id,
                          cloudstress: cloudstress,
                      }],
                      //csrfmiddlewaretoken: $('input[type=hidden]').val()

                  }),
          }).done(function(data){
              alert(data.log);
              //window.location.reload();
          })
           Sp = [];
      });
  }});

  $('#test_vBRAS_multi_bg').click(function() {
      var multi_pt = $('#test_vBRAS_multi_pt').val();
      var multi_sn = $('#test_vBRAS_multi_sn').val();
      var cloudstress3 = $("input[name='cloudstress3']:checked").val();

      var multiData = confirm("请确认：" + "\n"+ "流量：" + multi_pt + "G" + "\n" 
      			  				+ "会话数：" + multi_sn + "\n" + "Cloudstress：" + cloudstress3);
if (multiData) {
	$('#test_vBRAS_multi_pt').val("");
    $('#test_vBRAS_multi_sn').val("");
    $("input[name='cloudstress3']:checked").each(function() {  
        $(this).prop( "checked",false);  
    });
      $.ajax('/api/v1/vnf3-uuid/',{
          type:'POST',
          data:
              JSON.stringify({
                  begin: 1,
                  set_flow: multi_pt,
                  set_session: multi_sn,
                  set_vender: vendor_name,
                  set_version: version_num,
                  set_vnf_type:netNodeNum,
                  set_timer: 1,
                  set_cloudPlatform: cloudPlatform,
                  set_platformVer: platformVers,
                  csrfmiddlewaretoken: $('input[type=hidden]').val()
              }),
      }).done(function (data) {
          // alert(data.stepId);
          alert("接收到data");
          id = data.taskId;
          alert(id);
          $.ajax('http://172.16.110.245:5000/TaskExec/bkg',{
              type:'POST',
              data:
                  JSON.stringify({
                      scripttype: 'itest',
                      serverIp: '172.16.110.250:8000',
                      testcase: {
                          script: [{
                              type: 'itest',
                              id: 1,
                              file: 'VNF_3_PPPoE_IPTV_IPoE_VoIP.fftc',
                          }]
                      },
                      taskId: id,
                      device: {
                           TESTER:[{"ip": ipAddr,
                               "type": netNodeNum,
                               "id": id,
                               "reservePorts":Sp,
                               "needPort": portType.length
                             }]
                      },
                      parameter: [{
                          PPPoEClientNum: multi_sn,
                          porttype: multi_pt,
                          taskId: id,
                          cloudstress: cloudstress,
                      }],

                      csrfmiddlewaretoken: $('input[type=hidden]').val()
                  }),
          }).done(function(data){
              alert(data.log);
              window.location.reload();
          })
          Sp = [];
      });
  }});

  $('#current_task_abort').click(function() {

      alert('abort');
      $.ajax('/api/v1/stop-task/',{
          type:'POST',
          data:
              JSON.stringify({
                  stop: 1,
              }),
      }).done(function(data){
          alert(data.current_state);
          alert(data.task_id);
          flag_id = data.task_id;
          $.ajax('http://172.16.110.245:5000/TaskExecStatus/bkg',{
          type:'POST',
          data:
              JSON.stringify({
                  action: 'abort',
                  taskId: flag_id,
              }),
        }).done(function () {
              //window.location.reload();
          })
         Sp = [];
      });
  });
