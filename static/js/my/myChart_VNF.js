$(document).ready(function() {
        $("#test_list").change(function () {
            var test_list = document.getElementById("test_list");
            var test_option = test_list.value;
            var test_type = test_list.options[test_list.selectedIndex].parentNode.attributes;

            switch(test_type["label"].value)
            {
                      case 'PPPOE并发会话容量测试':
                          var taskType = '1';
                          break;
                      case 'vBRAS用户侧转发性能测试':
                          var taskType = '2';
                          break;
                      case 'vBRAS综合上网业务测试':
                          var taskType = '3';
                          break;
            }

            $.ajax('/api/v1/query-task-cpu', {
                method: 'POST',
                data: JSON.stringify({
                    taskid:test_option,
                    tasktype:taskType,
                }),
            }).done(function (data) {
                var Labels_CPU = [];   // times, x axis
                var Datasets_CPU = []; // dataset
                var Data_CPU = [];
                data.forEach(function (item) {
                    Labels_CPU.push(item['add_time']);
                    Data_CPU.push(item['cpu']);
                });
                Datasets_CPU.push({
                    label: 'cpu',
                    fill: true,
                    backgroundColor: 'rgba(255, 206, 86, 0.4)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    data: Data_CPU,
                });

                line = new Chart(document.getElementById("myChart_line"), {
                    type: 'line',
                    data: {
                        labels: Labels_CPU,
                        datasets: Datasets_CPU,
                    }
                });
            });

             $.ajax('/api/v1/query-cpu-details', {
                method: 'POST',
                data: JSON.stringify({
                    taskid:test_option,
                }),
            }).done(function (data) {
                var CPU_usage = data["avg_cpu"];
                var CPU_SF = data["stability_factor"];
                document.getElementById("CPU_usage").innerHTML = CPU_usage;
                document.getElementById("CPU_SF").innerHTML = CPU_SF;
            });

            $.ajax('/api/v1/query-task-memory', {
                method: 'POST',
                data: JSON.stringify({
                    taskid:test_option,
                    tasktype:taskType,
                }),
            }).done(function (data) {
                var Labels_Memory = [];   // times, x axis
                var Datasets_Memory = []; // dataset
                var Data_Memory = [];
                data.forEach(function (item) {
                    Labels_Memory.push(item['add_time']);
                    Data_Memory.push(item['memory']);
                });
                Datasets_Memory.push({
                    label: 'memory',
                    fill: true,
                    backgroundColor: "rgba(55, 209, 119, 0.45)",
                    borderColor: "rgba(55, 209, 119, 0.45)",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointHoverBackgroundColor: "343d3e",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    data: Data_Memory,
                });

                line = new Chart(document.getElementById("myChart_area"), {
                    type: 'line',
                    data: {
                        labels: Labels_Memory,
                        datasets: Datasets_Memory,
                    }
                });
            });
        });
    });


    $('#btnShow_Data').click(function (){
        //alert('click');
        var timeBegin = $('#timeBegin').val();
        var timeEnd = $('#timeEnd').val();
        // alert(timeBegin);
        // alert(timeEnd);
        //获取下拉列表里的task
         $.ajax('/api/v1/history-task-list',{
             method: 'POST',
             data:
              JSON.stringify({
               timeBegin: timeBegin,
               timeEnd: timeEnd,
              }),
         }).done(function (data) {
             if (data[0]){
                 $('#test_vBRAS_session_list').children().remove();
                 $('#test_vBRAS_frame_list').children().remove();
                 $('#test_vBRAS_multi_list').children().remove();
                 $.each(data, function(index, item){
                     switch(item.type_name)
                  {
                      case 'VNF_1_Concurrent_Session_Capacity':
                          var optgroupTitle = 'test_vBRAS_session_list';
                          break;
                      case 'VNF_2_VBRAS_Client_Forwarding_Performance':
                          var optgroupTitle = 'test_vBRAS_frame_list';
                          break;
                      case 'VNF_3_PPPoE_IPTV_IPoE_VoIP':
                         var optgroupTitle = 'test_vBRAS_multi_list';
                          break;
                  }
                     $('#' + optgroupTitle).append('<option value="' + data[index]['task_id'] +
                         '" label="' + data[index]['add_time'] + '"></option>');
                 });
             }else{
                 alert("当前时间范围内无数据！");
             }

         })
    })

    /**
     *

    $('#btnShow_Data').click(function () {
      var timeBegin = $('#timeBegin').val();
      var timeEnd = $('#timeEnd').val();


//LINE CHART
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

      $.ajax('/api/v1/get-data/', {
        method: 'GET',
        data: {
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          selectedParams: CPU_ID
        }
      }).done(function (data) {
        var curLabels_CPU = [];   // times, x axis
        var curDatasets_CPU = []; // dataset
        data.forEach(function (item) {
          curLabels_CPU.push(item['add_time']);
        });
        var selectedParams_CPU = CPU_ID;
        selectedParams_CPU.forEach(function (id, i) {
          var curData_CPU = [];
          data.forEach(function (item) {
            curData_CPU.push(item[id]);
          });
          curDatasets_CPU.push({
            label: CPU_Label[i],
            fill: true,
            backgroundColor: 'rgba(255, 206, 86, 0.4)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointRadius: 4,
            data: curData_CPU
          })
        });
        if(myChart_line) {
          myChart_line.destroy();
        }
        myChart_line = new Chart(ctx_line, {
          type: 'line',
          data: {
            labels: curLabels_CPU,
            datasets: curDatasets_CPU
          }
        });
      }).fail(function (xhr) {
        alert('HTTP ' + xhr.status + ' ' + xhr.statusText + '\n' + xhr.responseText.slice(0, 100));
      })

//AREA CHART
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

      $.ajax('/api/v1/get-data/', {
        method: 'GET',
        data: {
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          selectedParams: Memory_ID
        }
      }).done(function (data) {
        var curLabels_Memory = [];   // times, x axis
        var curDatasets_Memory = []; // dataset
        data.forEach(function (item) {
          curLabels_Memory.push(item['add_time']);
        });
        var selectedParams_Memory = Memory_ID;
        selectedParams_Memory.forEach(function (id, i) {
          var curData_Memory = [];
          data.forEach(function (item) {
            curData_Memory.push(item[id]);
          });
          curDatasets_Memory.push({
            label: Memory_Label[i],
            fill: true,
            backgroundColor: 'rgba(55, 209, 119, 0.4)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointRadius: 4,
            data: curData_Memory
          })
        });
        if(myChart_area) {
          myChart_area.destroy();
        }
        myChart_area = new Chart(ctx_area, {
          type: 'line',
          data: {
            labels: curLabels_Memory,
            datasets: curDatasets_Memory,
          }
        });
      }).fail(function (xhr) {
        alert('HTTP ' + xhr.status + ' ' + xhr.statusText + '\n' + xhr.responseText.slice(0, 100));
      })

//BAR CHART
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

      $.ajax('/api/v1/get-data/', {
        method: 'GET',
        data: {
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          selectedParams: Stability_ID
        }
      }).done(function (data) {
        var curLabels_Stability = [];   // times, x axis
        var curDatasets_Stability = []; // dataset
        data.forEach(function (item) {
          curLabels_Stability.push(item['add_time']);
        });
        var selectedParams_Stability = Stability_ID;
        selectedParams_Stability.forEach(function (id, i) {
          var curData_Stability = [];
          data.forEach(function (item) {
            curData_Stability.push(item[id]);
          });
          curDatasets_Stability.push({
            label: Stability_Label[i],
            fill: true,
            backgroundColor: myFillColors[i],
            borderColor: myBorderColors[i],
            pointBackgroundColor: myBorderColors[i],
            pointBorderColor: '#fff',
            pointRadius: 4,
            data: curData_Stability
          })
        });
        if(myChart_bar) {
          myChart_bar.destroy();
        }
        myChart_area = new Chart(ctx_bar, {
          type: 'bar',
          data: {
            labels: curLabels_Stability,
            datasets: curDatasets_Stability,
          }
        });
      }).fail(function (xhr) {
        alert('HTTP ' + xhr.status + ' ' + xhr.statusText + '\n' + xhr.responseText.slice(0, 100));
      })

    });
    */