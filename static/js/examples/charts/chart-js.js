"use strict";

var line = document.getElementById("line-chart");
var area = document.getElementById("area-chart");
var bar = document.getElementById("bar-chart");
var pie = document.getElementById("pie-chart");
var polar = document.getElementById("polar-chart");
var radar = document.getElementById("radar-chart");

var Session_chart = document.getElementById("Session_chart");

var options ={
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
};

/**
 *
 * @type {{labels: [*], datasets: [*]}}

//LINE CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataLine = {
    labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05"],
    datasets: [
        {
            label: "CPU",
            fill: false,
            backgroundColor: "#FFCE56",
            borderColor: "#FFCE56",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#FFCE56",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [55, 79, 70, 75, 88, 55, 79, 70, 75, 88, 78, 83, 76,0],
            spanGaps: false
        }
    ]
};
var lineChart = new Chart(line, {
    type: 'line',
    data: dataLine
});


//AREA CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataArea = {
    labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00"],
    datasets: [
        {
            label: "Memery",
            fill: true,
            backgroundColor: "rgba(55, 209, 119, 0.45)",
            borderColor: "rgba(55, 209, 119, 0.45)",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "343d3e",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: [12, 13, 11, 6, 9, 12, 13, 11, 6, 9, 7,11,8]
        },
    ],
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
};

var areaChart = new Chart(area, {
    type: 'line',
    data: dataArea,
    options: options

});

  */
//BAR CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataBars = {
    labels: ["64K", "128K", "256K", "512K", "1024K", "1280K", "1518K"],
    datasets: [
        {
            label: "最小时延",
            fill: true,
            backgroundColor: "rgba(179,181,198, 0.75)",
            borderColor: "rgba(179,181,198, 1)",
            data: [10, 11, 8, 4, 8, 11, 9]
        },
        {
            label: "平均时延",
            fill: true,
            backgroundColor: "rgba(75, 192, 192,0.75)",
            borderColor: "rgba(75, 192, 192,1)",
            data: [12, 13, 11, 6, 9, 14, 10]
        },
        {
            label: "最大时延",
            fill: true,
            backgroundColor: "rgba(255, 159, 64, 0.75)",
            borderColor: "rgba(255, 159, 64, 1)",
            data: [14, 15, 12, 9, 11, 15, 13]
        },

    ],
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
};

// var barChar = new Chart(bar, {
//     type: 'bar',
//     data: dataBars,
//     options: options
//
// });

//vBarsCPU利用率
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//cpu仪表盘
var chart1;
var arrow1;
var axis1; 

AmCharts.ready(function () {
// create angular gauge
chart1 = new AmCharts.AmAngularGauge();
chart1.addTitle("CPU利用率");
// create axis
axis1 = new AmCharts.GaugeAxis();
axis1.startValue = 0;
axis1.axisThickness = 1;
axis1.valueInterval = 10;
axis1.endValue = 100;
// color bands
var band1_1 = new AmCharts.GaugeBand();
band1_1.startValue = 0;
band1_1.endValue = 40;
band1_1.color = "#00CC00";

var band2_1 = new AmCharts.GaugeBand();
band2_1.startValue = 40;
band2_1.endValue = 70;
band2_1.color = "#ffac29";

var band3_1 = new AmCharts.GaugeBand();
band3_1.startValue = 70;
band3_1.endValue = 100;
band3_1.color = "#ea3838";
band3_1.innerRadius = "95%";
axis1.bands = [band1_1, band2_1, band3_1];

// bottom text
axis1.bottomTextYOffset = -20;
axis1.setBottomText("0 %");
chart1.addAxis(axis1);

// gauge arrow
arrow1 = new AmCharts.GaugeArrow();
chart1.addArrow(arrow1);
chart1.write("chartdiv0");
});  

// 内存仪表盘
var chart;
var arrow;
var axis; 

AmCharts.ready(function () {
    // create angular gauge
    chart = new AmCharts.AmAngularGauge();
    chart.addTitle("内存利用率");
    // create axis
    axis = new AmCharts.GaugeAxis();
    axis.startValue = 0;
    axis.axisThickness = 1;
    axis.valueInterval = 10;
    axis.endValue = 100;
    // color bands
    var band1 = new AmCharts.GaugeBand();
    band1.startValue = 0;
    band1.endValue = 40;
    band1.color = "#00CC00";

    var band2 = new AmCharts.GaugeBand();
    band2.startValue = 40;
    band2.endValue = 70;
    band2.color = "#ffac29";

    var band3 = new AmCharts.GaugeBand();
    band3.startValue = 70;
    band3.endValue = 100;
    band3.color = "#ea3838";
    band3.innerRadius = "95%";
    axis.bands = [band1, band2, band3];

    // bottom text
    axis.bottomTextYOffset = -20;
    axis.setBottomText("0 %");
    chart.addAxis(axis);

    // gauge arrow
    arrow = new AmCharts.GaugeArrow();
    chart.addArrow(arrow);
    chart.write("chartdiv1");
});





$(function(){
    //整个html页面刷新
    setInterval(refresh,500);
    function refresh(){
             $.ajax('/api/v1/if-exist-current-task/', {
        method: 'POST',
        data:
          JSON.stringify({
                  flag: 1,
                  //csrfmiddlewaretoken: $('input[type=hidden]').val()
              }),
      }).done(function (data) {
          //存在或不存在current-task时不同的表现
         //alert(data.taskid);
         var taskId = data.taskid;
         console.log(taskId)
         switch(data.tasktype)
                  {
                      case 'VNF_1_Concurrent_Session_Capacity':
                          var taskType = '1';
                      //      var casePerformance =  '<div class="timeline-box">'+
                      //       '<div class="timeline-icon bg-primary">'+
                      //           '<i class="fa fa-check"></i>'+
                      //       '</div>'+
                      //       '<div class="timeline-content">'+
                      //            '<h5><b id="session_name"></b></h5>'+
                      //           '<div  id="area_chart11" class="panel-content">'+
                      //               '<iframe class="chartjs-hidden-iframe" tabindex="-1" style="width: 100%; display: block; border: 0px; height: 0px; margin: 0px; position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;"></iframe>'+
                      //              '<canvas id="Session_chart" width="490" height="318" style="display: block; width: 490px; height: 318px;"></canvas>'+
                      //           '</div>'+
                      //       '</div>'+
                      //   '</div>'
                      //
                      // var taskTimeLine = $('#taskTimeLine');
                      // $('#taskTimeLine').append(casePerformance);
                          break;
                      case 'VNF_2_VBRAS_Client_Forwarding_Performance':
                          var taskType = '2';
                          break;
                      case 'VNF_3_PPPoE_IPTV_IPoE_VoIP':
                          var taskType = '3';
                          break;
                  }
         if(data.taskid){
              $.ajax('/api/v1/index-save-cpu-memory', {
                method: 'POST',
                data:
                  JSON.stringify({
                      taskid: taskId,
                      typename:taskType,
                  }),
                });
              $.ajax('/api/v1/get-index-cpu/', {
                method: 'POST',
                data:
                  JSON.stringify({
                      taskid: taskId,
                      flag: 1,
                      //csrfmiddlewaretoken: $('input[type=hidden]').val()
                  }),
              }).done(function (data) {
                  //cpu 仪表盘
                  // set  value
                  data.forEach(function (item) {
                      var value1 = item['cpu'];
                      arrow1.setValue(value1);
                      axis1.setBottomText(value1 + " %");
                  });
              })

             $.ajax('/api/v1/get-index-memory/', {
                method: 'POST',
                data:
                  JSON.stringify({
                      taskid: taskId,
                      flag: 1,
                  }),
              }).done(function (data) {
                  //memory 仪表盘
                  // set  value
                  data.forEach(function (item) {
                      var value = item['memory'];
                      arrow.setValue(value);
                      axis.setBottomText(value + " %");
                 });
                })

             $.ajax('/api/v1/get-index-case-performance',{
                  method: 'POST',
                  data:
                  JSON.stringify({
                      taskid: taskId,
                      tasktype:taskType,
                  }),
              }).done(function (data) {
                  if (taskType == '1'){

                      var cur_rate = [];   // times, x axis
                      var cur_session = []; // dataset
                      var time_line = [];
                      var per_dataset = [];
                      data.forEach(function (item) {
                          // alert(item);
                          // alert(item['add_time']);
                          time_line.push(item['add_time']);
                          cur_rate.push(item['cur_rate']);
                          cur_session.push(item['cur_session']);time_line
                      });
                      // alert(time_line[0]);
                      per_dataset.push(
                          {
                              label:'已完成session数量',
                              fill: false,
                              backgroundColor: "#37d177",
                              borderColor: "#37d177",
                              borderCapStyle: 'butt',
                              borderDash: [],
                              borderDashOffset: 0.0,
                              borderJoinStyle: 'miter',
                              pointBorderColor: "rgba(75,192,192,1)",
                              pointBackgroundColor: "#fff",
                              pointBorderWidth: 1,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: "343d3e",
                              pointHoverBorderColor: "rgba(220,220,220,1)",
                              pointHoverBorderWidth: 2,
                              pointRadius: 1,
                              pointHitRadius: 10,
                              data: cur_session,
                              spanGaps: false
                          },
                          {

                              label: "上线速率",
                              fill: false,
                              backgroundColor: "#FFCE56",
                              borderColor: "#FFCE56",
                              borderCapStyle: 'butt',
                              borderDash: [],
                              borderDashOffset: 0.0,
                              borderJoinStyle: 'miter',
                              pointBorderColor: "rgba(75,192,192,1)",
                              pointBackgroundColor: "#fff",
                              pointBorderWidth: 1,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: "#FFCE56",
                              pointHoverBorderColor: "rgba(220,220,220,1)",
                              pointHoverBorderWidth: 2,
                              pointRadius: 1,
                              pointHitRadius: 10,
                              data: cur_rate,
                              spanGaps: false
                          });
                      // alert(Session_chart);
                      line = new Chart(document.getElementById("Session_chart"), {
                          type: 'line',
                          data: {
                              labels: time_line,
                              datasets: per_dataset,
                          }
                        });
                  }

              })



              $.ajax('/api/v1/index-task-details', {
                method: 'POST',
                data:
                  JSON.stringify({
                      taskid: taskId,
                      tasktype:taskType,
                      flag: 1,
                  }),
              }).done(function (data) {

                  switch(taskType)
                  {
                      case '1':

                          var taskTypeTitle = 'PPPOE并发会话容量测试';
                          var currentData = '<h6>设置session数：'+ data.set_session +'</h6>' +
                                '<h6>已完成session数：'+ data.current_session +'</h6>' 
                                // '<h6>已完成：<span class="code">'+ data.current_session/data.set_session*100 +'%</span></h6>'
                          var progressData = Math.round(data.current_session/data.set_session*100) + "%"
                          $("#progressWidth").attr("width", progressData);
                          $("#progressData").html("当前测试进度：" + progressData);
                          break;
                      case '2':
                          var taskTypeTitle = 'vBRAS用户侧转发性能测试';
                          var currentData = '<h6>68字节 平均时延 <span class="code" id="FS_68">' + data.frame_size_68 + 'μs</span></h6>' +
                                '<h6>128字节 平均时延 <span class="code" id="FS_128">' + data.frame_size_128 + 'μs</span></h6>' +
                                '<h6>256字节 平均时延 <span class="code" id="FS_256">' + data.frame_size_256 + 'μs</span></h6>' +
                                '<h6>512字节 平均时延 <span class="code" id="FS_512">' + data.frame_size_512 + 'μs</span></h6>' +
                                '<h6>1024字节 平均时延 <span class="code" id="FS_1024">' + data.frame_size_1024 + 'μs</span></h6>' +
                                '<h6>1280字节 平均时延 <span class="code" id="FS_1280">' + data.frame_size_1280 + 'μs</span></h6>' +
                                '<h6>1518字节 平均时延 <span class="code" id="FS_1518">' + data.frame_size_1518 + 'μs</span></h6>'

                          break;
                      case '3':
                          var taskTypeTitle = 'vBRAS综合上网业务测试';
                          var currentData = '<h6>测试业务：宽带上网（PPPoE）+ IPTV（PPPoE）+ ITMS（IPoE）+ VoIP（IPoE）</h6>'
                          break;
                  }
                  document.getElementById("taskTypeTitle").innerHTML = taskTypeTitle;
                  document.getElementById("currentData").innerHTML = currentData;
                  document.getElementById("begin_time").innerHTML = data.begin_time;

                  // var currentTask = '<div class="timeline-box">' +
                  //           '<div class="timeline-icon bg-primary">' +
                  //               '<i class="fa fa-tasks"></i>' +
                  //           '</div>' +
                  //           '<div class="timeline-content">' +
                  //               '<h4 class="tl-title">正在运行的测试用例</h4>' +
                  //               '<p class="text-bold">' + taskTypeTitle + '</p>' +
                  //               '<h6>测试session数：'+ data.set_session +'</h6>' +
                  //               currentData + taskDetail +
                  //           '</div>' +
                  //           '<div class="timeline-footer">' +
                  //               '<span>开始时间：' + data.begin_time + '</span>' +
                  //           '</div>' +
                  //       '</div>'


                  // var casePerformance =  '<div class="timeline-box">'+
                  //           '<div class="timeline-icon bg-primary">'+
                  //               '<i class="fa fa-check"></i>'+
                  //           '</div>'+
                  //           '<div class="timeline-content">'+
                  //                '<h5><b id="session_name"></b></h5>'+
                  //               '<div  id="area_chart11" class="panel-content">'+
                  //                   '<iframe class="chartjs-hidden-iframe" tabindex="-1" style="width: 100%; display: block; border: 0px; height: 0px; margin: 0px; position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;"></iframe>'+
                  //                  '<canvas id="Session_chart" width="490" height="318" style="display: block; width: 490px; height: 318px;"></canvas>'+
                  //               '</div>'+
                  //           '</div>'+
                  //       '</div>'

                  // var taskTimeLine = $('#taskTimeLine');
                  // taskTimeLine.children()[1].remove();
                  //
                  // $('#taskTimeLine').append(currentTask);
                  // $('#taskTimeLine').append(casePerformance);

              })

         }else{
             alert("没有正在运行的测试用例！")
         }
     });
    }
});
