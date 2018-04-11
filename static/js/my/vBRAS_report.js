/**
 * Created by MaiBenBen on 2017/6/21.
 */
/**
 * Created by Zhang Kai on 2017/6/14.
 */
$(document).ready(function() {
        $("#test_vBRAS_multi_sn").change(function () {
     var test_list = document.getElementById("test_vBRAS_multi_sn");
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
             $.ajax('/api/v1/report', {
                method: 'POST',
                data: JSON.stringify({
                    taskid:test_option,
                    tasktype:taskType,
                }),
            }).done(function (data) {
                if(taskType== '1') {
                    alert(data['max_session']);
                    var max_session = data['max_session'];
                    var max_session_std = data['max_session_std'];
                    document.getElementById("max_session").innerHTML = max_session;
                    document.getElementById("max_session_std").innerHTML = max_session_std;
                    if (max_session >=  max_session_std){
                        document.getElementById("max_session_result").innerHTML="Pass";
                    }else{
                        document.getElementById("max_session_result").innerHTML="Fail";
                    }

                    var avg_con = data['avg_con'];
                    var avg_con_std = data['avg_con_std'];
                    document.getElementById("avg_con_std").innerHTML=avg_con_std;
                    document.getElementById("avg_con").innerHTML=avg_con;
                    if (avg_con >=  avg_con_std){
                        document.getElementById("avg_result").innerHTML="Pass";
                    }else{
                        document.getElementById("avg_result").innerHTML="Fail";
                    }

                    var min_con = data['min_con'];
                    var min_con_std = data['min_con_std'];
                    document.getElementById("min_con_std").innerHTML=min_con_std;
                    document.getElementById("min_con").innerHTML=min_con;
                    if (min_con >=  min_con_std){
                        document.getElementById("min_result").innerHTML="Pass";
                    }else{
                        document.getElementById("min_result").innerHTML="Fail";
                    }

                    var max_memory = data['max_memory'];
                    var max_memory_std = data['max_memory_std'];
                    document.getElementById("max_memory_std").innerHTML=max_memory_std;
                    document.getElementById("max_memory").innerHTML=max_memory;
                    if (max_memory >=  max_memory_std){
                        document.getElementById("max_memory_result").innerHTML="Pass";
                    }else{
                        document.getElementById("max_memory_result").innerHTML="Fail";
                    }
                }
                if(taskType== '2') {

                     var rx_64_std = data['rx_64_std'];
                     var rx_64 = data['rx_64'];
                     document.getElementById("rx_64_std").innerHTML = rx_64_std;
                     document.getElementById("rx_64").innerHTML = rx_64;
                    if (rx_64 >=  rx_64_std){
                        document.getElementById("rx_64_rlt").innerHTML="Pass";
                    }else{
                        document.getElementById("rx_64_rlt").innerHTML="Fail";
                    }

                     var rx_128_std = data['rx_128_std'];
                     var rx_128 = data['rx_128'];
                     document.getElementById("rx_128_std").innerHTML = rx_128_std;
                     document.getElementById("rx_128").innerHTML = rx_128;
                     if (rx_128 >=  rx_128_std){
                        document.getElementById("rx_128_rlt").innerHTML="Pass";
                    }else{
                        document.getElementById("rx_128_rlt").innerHTML="Fail";
                    }

                     var rx_256_std = data['rx_256_std'];
                     var rx_256 = data['rx_256'];
                     document.getElementById("rx_256_std").innerHTML=rx_256_std;
                     document.getElementById("rx_256").innerHTML=rx_256;
                     if (rx_256 >=  rx_256_std){
                        document.getElementById("rx_256_rlt").innerHTML="Pass";
                    }else{
                        document.getElementById("rx_256_rlt").innerHTML="Fail";
                    }

                     var rx_512_std = data['rx_512_std'];
                     var rx_512= data['rx_512'];
                     document.getElementById("rx_512_std").innerHTML=rx_512_std;
                     document.getElementById("rx_512").innerHTML=rx_512;
                     if (rx_512 >=  rx_512_std){
                        document.getElementById("rx_512_rlt").innerHTML="Pass";
                     }else{
                         document.getElementById("rx_512_rlt").innerHTML="Fail";
                     }

                     var rx_1024_std = data['rx_1024_std'];
                     var rx_1024 = data['rx_1024'];
                     document.getElementById("rx_1024_std").innerHTML=rx_1024_std;
                     document.getElementById("rx_1024").innerHTML=rx_1024;
                     if (rx_1024 >=  rx_1024_std){
                        document.getElementById("rx_1024_rlt").innerHTML="Pass";
                     }else{
                         document.getElementById("rx_1024_rlt").innerHTML="Fail";
                     }

                     var rx_1280_std = data['rx_1280_std'];
                     var rx_1280 = data['rx_1280'];
                     document.getElementById("rx_1280_std").innerHTML=rx_1280_std;
                     document.getElementById("rx_1280").innerHTML=rx_1280;
                     if (rx_1280 >=  rx_1280_std){
                        document.getElementById("rx_1280_rlt").innerHTML="Pass";
                     }else{
                         document.getElementById("rx_1280_rlt").innerHTML="Fail";
                     }

                     var rx_1518_std = data['rx_1518_std'];
                     var rx_1518 = data['rx_1518'];
                     document.getElementById("rx_1518_std").innerHTML=rx_1518_std;
                     document.getElementById("rx_1518").innerHTML=rx_1518;
                     if (rx_1518 >=  rx_1518_std){
                        document.getElementById("rx_1518_rlt").innerHTML="Pass";
                     }else{
                         document.getElementById("rx_1518_rlt").innerHTML="Fail";
                     }

                }
            })
        });
    });

    $('#btnShow_Data').click(function (){
      //  alert('click');
        var timeBegin = $('#timeBegin').val();
        var timeEnd = $('#timeEnd').val();
        alert(timeBegin);
        alert(timeEnd);
        //获取下拉列表里的测试任务ID列表
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