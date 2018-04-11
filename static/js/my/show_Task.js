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

  $('#test_vBRAS_session_bg').click(function() {
      alert(12345671);

      var session_pt = $('#test_vBRAS_session_pt').val();
      var session_sn = $('#test_vBRAS_session_sn').val();
      var cloudstress = $('#test_vBRAS_session_cs').val();

      // document.getElementById("task_name").innerHTML = 'PPPoE并发会话容量'
      // document.getElementById("task_explain1").innerHTML = 'vBars接入性能测试'
      // document.getElementById("task_explain2").innerHTML = '测试单台vBRAS整机最大可以支持PPPoE用户并发上线数量'

      alert(session_pt +'and'+  session_sn);

      $.ajax('/api/v1/vnf1-uuid/',{
          type:'POST',
          data:
              JSON.stringify({
                  begin: 1,
                  set_flow: session_pt,
                  set_session: session_sn,
                  set_version:'version1.2',
                  set_vnf_type:'vnf111',
                  set_vender:'厂商2',
                  set_timer:1,
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
                              file: 'VNF_1_Concurrent_Session_Capacity.fftc',
                          }]
                      },
                      taskId: id,
                      device: {},
                      parameter: [{
                          PPPoEClientNum: session_sn,
                          porttype: session_pt,
                          taskId: id,
                          cloudstress: cloudstress,
                      }],
                      //csrfmiddlewaretoken: $('input[type=hidden]').val()
                  }),
          }).done(function(data){
              alert(data.log);
              //window.location.reload();
          })
      });
  });

  $('#test_vBRAS_frame_bg').click(function() {

      var frame_pt = $('#test_vBRAS_frame_pt').val();
      var frame_sn = $('#test_vBRAS_frame_sn').val();
      var cloudstress = $('#test_vBRAS_frame_cs').val();

      alert(frame_pt +' and '+  frame_sn);
      $.ajax('/api/v1/vnf2-uuid/',{
          type:'POST',
          data:
              JSON.stringify({
                  begin: 1,
                  set_flow: frame_pt,
                  set_session: frame_sn,
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
                      device: {},
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
      });
  });

  $('#test_vBRAS_multi_bg').click(function() {
      var multi_pt = $('#test_vBRAS_multi_pt').val();
      var multi_sn = $('#test_vBRAS_multi_sn').val();
      var cloudstress = $('#test_vBRAS_multi_cs').val();

      alert(multi_pt +' and '+  multi_sn);
      $.ajax('/api/v1/vnf3-uuid/',{
          type:'POST',
          data:
              JSON.stringify({
                  begin: 1,
                  set_flow: multi_pt,
                  set_session: multi_sn,
                  set_version:'version1.2',
                  set_vnf_type:'vnf1111',
                  set_vender:'vender1',
                  set_timer:1,
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
                      device: {},
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
      });
  });

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
      });
  });
