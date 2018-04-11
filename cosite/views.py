from django.shortcuts import render, HttpResponseRedirect, HttpResponse
import json
import pickle
import csv
import os
import uuid
import time
import datetime
import pytz
# import numpy
import math
import collections
from django.db.models import Max
# from sklearn.svm import SVC
# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.gaussian_process import GaussianProcessClassifier
# from sklearn.gaussian_process.kernels import RBF
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.neural_network import MLPClassifier
# from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
# from sklearn.naive_bayes import GaussianNB
# from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis

from cosite.models import DetectedParams, PPPoESessionTest, UserTransTest, MultiTest, Log, FinalResult, CPUMemory, TestCaseState
from influxdb import InfluxDBClient

# view，是核心，负责接收请求、获取数据、返回结果
# 每个视图总是以httprequest对象作为它的第一个参数
# 捕获值永远都是字符串（string）类型，而不会是整数（integer）类型
# 捕获值总是Unicode objects
# #####################################禹峰8.2#################################################
def compare_report_frame(req):
    return render(req, 'cosite/compare_vBRAS_frame.html')

def show_tasklist2(req):
    return render(req, 'cosite/show_Task2.html')
#############################################################################################
def index(req):
    if req.path == '/':
        return HttpResponseRedirect('/co/')
    return render(req, 'cosite/index.html')


def data_query(req):
    return render(req, 'cosite/show_Task.html')


def data_show(req):
    return render(req, 'cosite/show_VNF.html')


def user_profile(req):
    return render(req, 'cosite/user_profile.html')


def pages_sign_in(req):
    return render(req, 'cosite/pages_sign-in.html')


def pages_forgot_password(req):
    return render(req, 'cosite/pages_forgot-password.html')


def pages_lock_screen(req):
    return render(req, 'cosite/pages_lock-screen.html')


def report_frame(req):
    return render(req, 'cosite/report_vBRAS_frame.html')


# def api4get_data(req):
#     if req.method == 'GET':
#         needed_params = req.GET.getlist('selectedParams[]')
#         items = DetectedParams.objects \
#             .only('add_time', *needed_params) \
#             .filter(add_time__gt=req.GET.get('timeBegin'),
#                     add_time__lt=req.GET.get('timeEnd')).all()
#
#         # test add model to MultiTest table --> success execute!!!
#         # mt = MultiTest()
#         # mt.task_id = uuid.uuid1()
#         # mt.cpu = 0.99
#         # mt.memory = 0.88
#         # mt.add_time = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
#         # mt.save()
#
#         result = []
#         for item in items:
#             rst = {}
#             for param in needed_params:
#                 rst[param] = getattr(item, param)
#             rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
#             result.append(rst)
#         return HttpResponse(json.dumps(result), content_type='text/json')
#     return HttpResponse('Permission denied!', status=403)

# 初始化支持向量机
# classifiers = {"Nearest Neighbors": KNeighborsClassifier(3),
#                "Linear SVM": SVC(kernel="linear", C=0.025),
#                "RBF SVM": SVC(gamma=2, C=1),
#                "Gaussian Process": GaussianProcessClassifier(1.0 * RBF(1.0), warm_start=True),
#                "Decision Tree": DecisionTreeClassifier(max_depth=5),
#                "Random Forest": RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1),
#                "Neural Net": MLPClassifier(alpha=1),
#                "AdaBoost": AdaBoostClassifier(),
#                "Naive Bayes": GaussianNB(),
#                "QDA": QuadraticDiscriminantAnalysis()}
# property_params = ['ave_anneal_soak_t',
#                    'ave_anneal_rapid_cool_outlet_t',
#                    'ave_anneal_slow_cool_outlet_t',
#                    'pc', 'pmn', 'pp', 'ps',
#                    'finishing_inlet_t', 'finishing_outlet_t', 'coiling_t']
# property_max_min = {'ave_anneal_soak_t': [854.9, 797.6],
#                     'ave_anneal_rapid_cool_outlet_t': [455.7, 398.6],
#                     'ave_anneal_slow_cool_outlet_t': [665.4, 614.9],
#                     'pc': [0.0025, 0.0011],
#                     'pmn': [0.16, 0.1],
#                     'pp': [0.014, 0.007],
#                     'ps': [0.0139, 0.0024],
#                     'finishing_inlet_t': [1076.4, 1014.1],
#                     'finishing_outlet_t': [927.2, 912.5],
#                     'coiling_t': [753.4, 654.5]}
# origin_data = pickle.load(open('data.pkl', 'rb'))


# def api4get_exception(req):
#     if req.method == 'GET':
#         needed_params = req.GET.getlist('selectedParams[]')
#         items = DetectedParams.objects.filter(add_time__gt=req.GET.get('timeBegin'),
#                                               add_time__lt=req.GET.get('timeEnd')).all()[:50]
#         # unpredicted_items = []
#         # for item in items:
#         #     if item.label == 0:
#         #         unpredicted_items.append(item)
#         test_data = []
#         # for item in unpredicted_items:
#         for item in items
#             data = []
#             for param in property_params:
#                 data.append(getattr(item, param))
#             test_data.append(data)
#
#         clf = classifiers[req.GET.get('algorithm')]
#         clf.fit(origin_data['train_data'], origin_data['target_data'])
#         test_result = clf.predict(test_data) if len(test_data) > 0 else []
#         # test_result = [result.item() for result in test_result]
#
#         # for i in range(len(unpredicted_items)):
#         #     if test_result[i] != unpredicted_items[i].label:
#         #         unpredicted_items[i].label = test_result[i]
#         #         unpredicted_items[i].save()
#         # for i in range(len(items)):
#         #     if test_result[i] != items[i].label:
#         #         items[i].label = test_result[i]
#         #         items[i].save()
#
#         result = []
#         for i in range(len(items)):
#             rst = {}
#             for param in needed_params:
#                 rst[param] = getattr(items[i], param)
#             rst['add_time'] = items[i].add_time.strftime('%Y-%m-%d %H:%M:%S')
#             rst['label'] = test_result[i].item()
#             result.append(rst)
#         return HttpResponse(json.dumps([result, property_max_min]), content_type='text/json')
#     return HttpResponse('Permission denied!', status=403)
#
#
# def api4get_correlation(req):
#     if req.method == 'GET':
#         needed_params = req.GET.getlist('selectedParams[]')
#         items = DetectedParams.objects \
#             .only('add_time', *needed_params) \
#             .filter(add_time__gt=req.GET.get('timeBegin'),
#                     add_time__lt=req.GET.get('timeEnd')).all()
#         data = []
#         for i in range(len(needed_params)):
#             data.append([])
#             for item in items:
#                 data[i].append(getattr(item, needed_params[i]))
#
#         cnf = gra(data[0], data[1:])
#         result = {needed_params[0]: 1}
#         for i in range(1, len(needed_params)):
#             result[needed_params[i]] = cnf[i]
#         return HttpResponse(json.dumps(result), content_type='text/json')
#     return HttpResponse('Permission denied!', status=403)
#
#
# def gra(ref, origin_des):
#     ref_0 = ref[0]
#     des = [[cell for cell in row] for row in origin_des]
#     ref = list(map(lambda x: x / ref_0, ref))
#     for i in range(len(des)):
#         for j in range(len(des[0])):
#
#             des[i][j] = abs(origin_des[i][j] / origin_des[i][0] - ref[j])
#     des_max = max(list(map(max, des)))
#     result = []
#     for row in des:
#         des_sum = 0
#         for cell in row:
#             des_sum += (0.5 * des_max) / (cell + 0.5 * des_max)
#         result.append(des_sum / len(des[0]))
#     result.insert(0, 1)
#     return result


# test
def api4_test(req):
    if req.method == 'POST':
        temp = req.POST
        print(temp)
        d = json.loads(req.body.decode('utf-8'))
        scripttype = d.get('scripttype')
        serverIp = d.get('serverIp')
        testcase = d.get('testcase')
        #testcasenum=testcase['script'][0]['file']
        taskId = d.get('taskId')
        device = d.get('device')
        parameter = d.get('parameter')
        #clientnum=parameter['PPPoEClientNum']
        #porttype=parameter['porttype']

        # 获取ip地址
        # print('========')
        # x_forwarded_for = req.META.get('HTTP_X_FORWARDED_FOR')
        # if x_forwarded_for:
        #     ip = x_forwarded_for.split(',')[-1].strip()
        # else:
        #     ip = req.META.get('REMOTE_ADDR')
        #
        # print(x_forwarded_for)
        # print(ip)
        # print('========')

        print(scripttype)
        print(serverIp)
        print(testcase)
        #print(testcasenum)
        print(taskId)
        print(device)
        print(parameter)
        #print(clientnum)
        #print(porttype)

        data = {'stepId': 1, 'log': 'Fail', 'execteIndex': '1', 'testcaseId': '114', 'reslt': 1, 'taskId': '243d8bd5-15fa-48b1-b9c8-d19a2f7b7338','testresult':''}

        # 从数据库取数据开始
        # dp = DetectedParams.objects.first()
        # data={'id': dp.id, 'label': dp.label}
        # 取数据结束

        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


def api4_test2(req):
    if req.method == 'GET':
        temp = req.GET
        print(temp)

        b = json.loads(req.GET.get('b'))
        c = b['d']['e']
        print(b)
        print(c)

        d = json.loads(req.GET.get('testcase'))
        d['script'][0]['id']

        return HttpResponse('success')
        # return HttpResponse('ok')
    return HttpResponse('Permission denied!', status=403)


# VNF_1_Concurrent_Session_Capacity
# 获取到前台发送的指令，主要是为生成uuid后返回给前台
# def api4_vnf1_uuid(req):
#    if req.method == 'POST':
#
#       d = json.loads(req.body.decode('utf-8'))#获取请求内容
#        beginflag = d.get('begin')
#        if beginflag == 1:
#            taskid = uuid.uuid1()
#             #uuid1()——基于时间戳
#             #由MAC地址、当前时间戳、随机数生成。可以保证全球范围内的唯一性
#             #但MAC的使用同时带来安全性问题，局域网中可以使用IP来代替MAC。
#            taskid = str(taskid)
#
#        obj = TestCaseState()
#        obj.task_id = taskid
#        obj.set_session = d.get('set_session')
#        obj.set_flow = d.get('set_flow')
#        obj.current_state = True
#        #mt.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
#        #obj.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
#        obj.type_name = 'VNF_1_Concurrent_Session_Capacity'
#        obj.save()#存储到数据库
#        data = {'taskId': taskid}
#       return HttpResponse(json.dumps(data), content_type='application/json')
#  return HttpResponse('Permission denied!', status=403)



# VNF_1_Concurrent_Session_Capacity
# 接受iTest返回的结果，并将结果存入数据库
def api4_vnf1_itest(req):
    if req.method == 'POST':
        # temp = req.POST
        # print(temp)
        d = json.loads(req.body.decode('utf-8'))
        obj = PPPoESessionTest()
        #m = PPPoESessionTest().object.all()
        #print(m[0].title)
        obj.task_id = d.get('taskId')
        print("##################################",d.get('taskId'))
        result = d.get('testresult')
        obj.session_num = result['session_num']
        obj.add_time = result['add_time']
        obj.connect_rate = result['connect_rate']

        if PPPoESessionTest.objects.all().last():
            if PPPoESessionTest.objects.all().last().add_time != result['add_time']:
                obj.save()
        else:
            obj.save()

        # print('-----')
        # print("set_session::::" + str(TestCaseState.objects.get(task_id=d.get('taskId')).set_session))
        # print("current_session::::" + str(result['session_num']))
        # print('-----')

        # set_session = TestCaseState.objects.get(task_id=d.get('taskId')).set_session
        # cur_session = int(result['session_num'])
        #
        # if set_session == cur_session:
        #     print('same!!!')
        #     cur_obj = TestCaseState.objects.get(current_state=True)
        #
        #     if cur_obj:
        #         cur_obj.current_state = False
        #         cur_obj.save()
        #         print('save change to false already!!!!!!')

        data = {'log': 'test'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)

# VNF_2_VBRAS_Client_Forwarding_Performance
# 接受iTest返回的结果，并将结果存入数据库
def api4_vnf2_itest(req):
    if req.method == 'POST':
        # temp = req.POST
        # print(temp)
        d = json.loads(req.body.decode('utf-8'))

        obj = UserTransTest()
        obj.task_id = d.get('taskId')
        result = d.get('testresult')
        obj.frame_size = result['frame_size']
        obj.min_latency = result['min_latency']
        obj.max_latency = result['max_latency']
        obj.avg_latency = result['avg_latency']
        obj.add_time = result['add_time']
        obj.rx_rate = result['rx_rate']
        # print(UserTransTest.objects.all()[-1]['add_time'])
        if UserTransTest.objects.all().last():
            if UserTransTest.objects.all().last().add_time != result['add_time']:
                obj.save()
        else:
            obj.save()

        data = {'log': 'test'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)
# VNF_3_PPPoE_IPTV_IPoE_VoIP
# 获取到前台发送的指令，主要是为生成uuid后返回给前台
# def api4_vnf3_uuid(req):
#     if req.method == 'POST':
#         # temp = req.POST
#         # print(temp)
#
#         d = json.loads(req.body.decode('utf-8'))
#         beginflag = d.get('begin')
#         if beginflag == 1:
#             taskid = uuid.uuid1()
#             taskid = str(taskid)
#
#         obj = TestCaseState()
#         obj.task_id = taskid
#         obj.set_session = d.get('set_session')
#         obj.set_flow = d.get('set_flow')
#         obj.current_state = True
#
#         # obj.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
#         obj.type_name = 'VNF_3_PPPoE_IPTV_IPoE_VoIP'
#         obj.save()
#
#         # pst = MultiTest()
#         # pst.task_id = taskid
#         # pst.save()
#         # 删除测试条目
#         # PPPoESessionTest.objects.filter(task_id='6d306a8a-402f-11e7-a90f-ac728980a78b').delete()
#         data = {'taskId': taskid}
#         return HttpResponse(json.dumps(data), content_type='application/json')
#     return HttpResponse('Permission denied!', status=403)


# VNF_3_PPPoE_IPTV_IPoE_VoIP
# 接受iTest返回的结果，并将结果存入数据库
def api4_vnf3_itest(req):
    if req.method == 'POST':
        # temp = req.POST
        # print(temp)
        d = json.loads(req.body.decode('utf-8'))
        #编码：把一个Python对象编码转换成Json字符串   json.dumps()
        #解码：把Json格式字符串解码转换成Python对象   json.loads()
        obj = MultiTest()#在views里

        obj.task_id = d.get('taskId')
        result = d.get('testresult')

        obj.min_latency = result['min_latency']
        obj.max_latency = result['max_latency']
        obj.avg_latency = result['avg_latency']
        obj.frame_size = result['frame_size']
        obj.tx_rate = result['tx_rate']
        obj.rx_rate = result['rx_rate']
        obj.session_num = result['session_num']
        obj.connect_rate = result['connect_rate']
        obj.add_time = result['add_time']
        if MultiTest.objects.all().last():
            if MultiTest.objects.all().last().add_time != result['add_time']:
                obj.save()
        else:
            obj.save()

        data = {'log': 'test'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)
# 接收log并保存至数据库
def api4_log(req):
    if req.method == 'POST':
        # temp = req.POST
        # print(temp)
        d = json.loads(req.body.decode('utf-8'))

        obj = Log()
        obj.task_id = d.get('taskId')
        obj.log = d.get('log')
        obj.add_time = d.get('add_time')

        obj.save()

        data = {'log': 'test'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 接收log并保存至数据库
def api4_final_result(req):
    if req.method == 'POST':
        # temp = req.POST
        # print(temp)
        d = json.loads(req.body.decode('utf-8'))

        obj = FinalResult()
        obj.task_id = d.get('taskId')
        obj.final_result = d.get('final_result')
        obj.add_time = d.get('add_time')

        obj.save()

        cur_obj = TestCaseState.objects.get(current_state=True)

        if cur_obj:
            cur_obj.current_state = False
            cur_obj.save()

        data = {'log': 'test'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 停止测试
def api4_stop_task(req):
    if req.method == 'POST':
        # temp = req.POST
        # print(temp)
        d = json.loads(req.body.decode('utf-8'))
        print(d)
        # task_id = d.get('taskID')
        stop_flag = d.get('stop')

        if stop_flag == 1:
            current_task = TestCaseState.objects.get(current_state=True)
            current_task.current_state = False
            current_task.save()
            data = {'current_state': current_task.current_state, 'task_id': str(current_task.task_id)}
        else:
            data = {'current_state': None, 'task_id': None}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 判断是否存在正在运行的测试用例
def api4_if_exist_current_task(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)

        obj = TestCaseState.objects.get(current_state=True)
        # 查询符合条件的这条数据,如果是多条和没有的时候会报错,尽量结合
        if obj:
            data = {'taskid': str(obj.task_id), 'tasktype': obj.type_name}
        else:
            data = {'taskid': 0}

        # data = {'taskid': '0e4bd490-4676-11e7-af39-ac728980a78b', 'tasktype': 'VNF_1_Concurrent_Session_Capacity'}
        # data = {'taskid': '0e4bd490-4676-11e7-af39-ac728980a78b',
        #           'tasktype': 'VNF_2_VBRAS_Client_Forwarding_Performance'}
        # data = {'taskid': '0e4bd490-4676-11e7-af39-ac728980a78b', 'tasktype': 'VNF_3_PPPoE_IPTV_IPoE_VoIP'}

        return HttpResponse(json.dumps(data), content_type='application/json')
        # return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# index页面获取到CPU和memory的最新值，并保存，无返回
def api4_save_cpu_memory(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)
        task_id = d.get('taskid')
        type_name = d.get('typename')
        print('typename::::' + type_name)

        client = InfluxDBClient('172.16.110.251', 8086, 'root', '', 'metrics')
        print("execute InfluxDB successfully!!")
        result_mea = client.query('show measurements;')
        # print("InfluxDB rst::" + result_mea)

        print("Result:{0}".format(result_mea))
        # 显示measurements中的libvirt_domain_metrics的最新的一条数据,返回ResultSet
        # result = client.query(
        #     'select "cpu_time_pct","mem_rss","mem_actual","time" from "libvirt_domain_metrics"')
        result = client.query('select "cpu_time_pct","mem_rss","mem_actual","time" from "libvirt_domain_metrics" where time>now() - 60s limit 1')
        # 返回list
        result_point = list(result.get_points(measurement='libvirt_domain_metrics'))

        # print("show result_point::" + result_point)
        # print(result_point.length)
        print("show length of result_point::" + str(len(result_point)))

        print(result_point[0])  # 输出一个dict结构的字段
        print('======输出CPU利用率======')
        cpu_value = result_point[0]['cpu_time_pct']
        print(cpu_value)
        print('======输出Memory利用率======')
        mem_rss = result_point[0]['mem_rss']
        mem_actual = result_point[0]['mem_actual']
        mem_value = mem_rss/mem_actual
        if mem_value > 1:
            mem_value = 1
        print(mem_value)
        print('======输出时间戳======')
        time_value = result_point[0]['time']
        print(time_value)

        flag = 0
        if type_name == '1':
            if PPPoESessionTest.objects.filter(task_id=task_id).first():
                flag = 1
        elif type_name == '2':
            if UserTransTest.objects.filter(task_id=task_id).first():
                flag = 1
        elif type_name == '3':
            if MultiTest.objects.filter(task_id=task_id).first():
                flag = 1

        if flag == 1:
            # 获取到的最新一条记录存入数据库
            new_obj = CPUMemory()
            new_obj.task_id = task_id
            new_obj.cpu = cpu_value
            new_obj.memory = mem_value
            # new_obj.add_time = time_value
            time_temp = utc_to_local(time_value.split('.')[0] + 'Z') + int(time_value.split('.')[0].split(':')[2])
            new_obj.add_time = time_temp
            new_obj.save()

        data = {}

        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# index页面第一个图结果返回，vBRAS CPU利用率【已提供测试数据】
def api4_get_index_cpu(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)
        flag = d.get('flag')
        taskid = d.get('taskid')

        # 测试数据
        # if flag == 1:
        #     data = [{'add_time': '10:00', 'cpu': 0.3},
        #             {'add_time': '10:05', 'cpu': 2},
        #             {'add_time': '10:10', 'cpu': 3}]

        # 待测试代码
        data = []
        if flag == 1:
            items = CPUMemory.objects.filter(task_id=taskid).all()
            for item in items:
                rst = {}
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # rst['add_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))
                rst['cpu'] = round(item.cpu,2)#此处去memory值小数点后两位
                data.append(rst)

        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# index页面第一个图结果返回，vBRAS Memory利用率【已提供测试数据】
def api4_get_index_memory(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        print(d)
        flag = d.get('flag')
        task_id = d.get('taskid')

        # 测试数据
        # if flag == 1:
        #     data = [{'add_time': '10:00', 'memory': 0.5},
        #             {'add_time': '10:05', 'memory': 3},
        #             {'add_time': '10:10', 'memory': 5}]

        # 待测试代码
        data = []
        if flag == 1:
            items = CPUMemory.objects.filter(task_id=task_id).all()
            for item in items:
                rst = {}
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # rst['add_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))
                rst['memory'] = round(item.memory,2)#此处去memory值小数点后两位
                data.append(rst)

        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# index页面右侧的测试用例运行详情【已提供测试数据】
def api4_index_task_details(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)

        taskid = d.get('taskid')
        tasktype = d.get('tasktype')

        # time_flag = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
        # time_array = time.strptime(time_flag, "%Y-%m-%d %H:%M:%S")
        # time_stamp = int(time.mktime(time_array))
        # print(time_stamp)
        # time_stamp += 28800
        #
        # rst['add_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time_stamp))
        #
        # begin_time = TestCaseState.objects.get(task_id=taskid).add_time.strftime('%Y-%m-%d %H:%M:%S')

        item = TestCaseState.objects.get(task_id=taskid)
        time_flag = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
        time_array = time.strptime(time_flag, "%Y-%m-%d %H:%M:%S")
        time_stamp = int(time.mktime(time_array))
        print(time_stamp)
        time_stamp += 28800

        begin_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time_stamp))

        # current_session = PPPoESessionTest.objects.filter(task_id=taskid).last().session_num
        set_session = TestCaseState.objects.get(task_id=taskid).set_session

        if tasktype == '1':
            # 待测代码
            print("页面右侧的测试用例运行详情",taskid)
            current_session = PPPoESessionTest.objects.filter(task_id=taskid).last().session_num
            # 终止测试用例
            if set_session == current_session:
                print('same!!!')
                cur_obj = TestCaseState.objects.get(current_state=True)

                if cur_obj:
                    cur_obj.current_state = False
                    cur_obj.save()
                    print('save change to false already!!!!!!')

            data = {'set_session': set_session, 'current_session': current_session, 'begin_time': begin_time}
            # 测试数据
            # data = {'set_session': 10000, 'current_session': 8000, 'begin_time': '2017-06-06 10:00'}

        elif tasktype == '2':
            # 待测代码
            obj = UserTransTest.objects.filter(task_id=taskid)

            obj_68 = obj.filter(frame_size=68).last()
            if obj_68:
                frame_size_68 = obj_68.avg_latency
            else:
                frame_size_68 = 0

            obj_128 = obj.filter(frame_size=128).last()
            if obj_128:
                frame_size_128 = obj_128.avg_latency
            else:
                frame_size_128 = 0

            obj_256 = obj.filter(frame_size=256).last()
            if obj_256:
                frame_size_256 = obj_256.avg_latency
            else:
                frame_size_256 = 0

            obj_512 = obj.filter(frame_size=512).last()
            if obj_512:
                frame_size_512 = obj_512.avg_latency
            else:
                frame_size_512 = 0

            obj_1024 = obj.filter(frame_size=1024).last()
            if obj_1024:
                frame_size_1024 = obj_1024.avg_latency
            else:
                frame_size_1024 = 0

            obj_1280 = obj.filter(frame_size=1280).last()
            if obj_1280:
                frame_size_1280 = obj_1280.avg_latency
            else:
                frame_size_1280 = 0

            obj_1518 = obj.filter(frame_size=1518).last()
            if obj_1518:
                frame_size_1518 = obj_1518.avg_latency
            else:
                frame_size_1518 = 0

            data = {'set_session': set_session, 'current_session': 0,
                    'frame_size_68': frame_size_68, 'frame_size_128': frame_size_128,
                    'frame_size_256': frame_size_256, 'frame_size_512': frame_size_512,
                    'frame_size_1024': frame_size_1024, 'frame_size_1280': frame_size_1280,
                    'frame_size_1518': frame_size_1518, 'begin_time': begin_time}

            # 测试数据
            # data = {'set_session': 10000, 'current_session': 7000,
            #         'frame_size_64': 100, 'frame_size_128': 80, 'frame_size_256': 30,
            #         'frame_size_512': 23, 'frame_size_1024': 55,
            #         'frame_size_1280': 45,
            #         'frame_size_1518': 33, 'begin_time': '2017-06-07 10:10'}

        elif tasktype == '3':
            # 待测代码
            current_session = PPPoESessionTest.objects.filter(task_id=taskid).last().session_num
            data = {'set_session': set_session, 'current_session': current_session, 'begin_time': begin_time}

            # 测试数据
            # data = {'set_session': 20000, 'current_session': 12000, 'begin_time': '2017-06-07 10:15'}
        else:
            data = []

        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 下拉菜单中展示所有的task列表【已提供测试数据】
def api4_history_task_list(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        print(d)

        # 测试数据
        # result = [{'add_time': '2017-05-01 10:00', 'task_id': '0e4bd490-4676-11e7-af39-ac728980a78b',
        #            'type_name': 'VNF_1_Concurrent_Session_Capacity'},
        #           {'add_time': '2017-05-02 11:00', 'task_id': '5db8b1c2-4677-11e7-b6f4-ac728980a78b',
        #            'type_name': 'VNF_2_VBRAS_Client_Forwarding_Performance'},
        #           {'add_time': '2017-06-01 12:00', 'task_id': '35f56f30-467d-11e7-98d3-ac728980a78b',
        #            'type_name': 'VNF_3_PPPoE_IPTV_IPoE_VoIP'},
        #           {'add_time': '2017-06-02 13:00', 'task_id': '6baffc5c-467f-11e7-8145-ac728980a78b',
        #            'type_name': 'VNF_1_Concurrent_Session_Capacity'},
        #           {'add_time': '2017-05-11 14:00', 'task_id': 'c46fb2f4-4695-11e7-b1ac-ac728980a78b',
        #            'type_name': 'VNF_2_VBRAS_Client_Forwarding_Performance'},
        #           {'add_time': '2017-05-25 15:00', 'task_id': '23ed47e2-4744-11e7-92c3-ac728980a78b',
        #            'type_name': 'VNF_3_PPPoE_IPTV_IPoE_VoIP'}
        #           ]

        # 待测代码
        start_time = d.get('timeBegin')
        end_time = d.get('timeEnd')
        print(start_time)
        print('=====')
        print(end_time)

        items = TestCaseState.objects.only('add_time', 'type_name') \
            .filter(add_time__gt=start_time, add_time__lt=end_time).all()

        result = []
        for item in items:
            rst = {}
            rst['task_id'] = str(item.task_id)
            # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
            time_flag = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
            time_array = time.strptime(time_flag, "%Y-%m-%d %H:%M:%S")
            time_stamp = int(time.mktime(time_array))
            print(time_stamp)
            time_stamp += 28800

            rst['add_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time_stamp))
            rst['type_name'] = item.type_name
            result.append(rst)

        return HttpResponse(json.dumps(result), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 选择某一项task后，返回cpu性能资源比【已提供测试数据】
def api4_query_task_cpu(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)

        result = []
        taskid = d.get('taskid')
        task_type = d.get('tasktype')

        if task_type == '1':
            # 待测代码
            items = PPPoESessionTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # 上线速率
                current_session = item.session_num
                set_session = TestCaseState.objects.get(task_id=taskid).set_session
                # cpu利用率
                obj = CPUMemory.objects.filter(add_time__gt=item.add_time).first()
                cpu = obj.cpu
                # 性能资源比
                cpu_res_rate = (current_session/set_session)/cpu
                rst['cpu'] = cpu_res_rate
                result.append(rst)

            # 测试数据
            # result = [{'cpu': 0.15, 'add_time': '2017-06-01 10:00:13'},
            #           {'cpu': 0.21, 'add_time': '2017-06-01 10:00:16'},
            #           {'cpu': 0.33, 'add_time': '2017-06-01 10:00:19'},
            #           {'cpu': 0.32, 'add_time': '2017-06-01 10:00:22'},
            #           {'cpu': 0.45, 'add_time': '2017-06-01 10:00:25'},
            #           {'cpu': 0.57, 'add_time': '2017-06-01 10:00:28'},
            #           {'cpu': 0.66, 'add_time': '2017-06-01 10:00:31'},
            #           {'cpu': 0.89, 'add_time': '2017-06-01 10:00:35'},
            #           {'cpu': 0.90, 'add_time': '2017-06-01 10:00:38'},
            #           {'cpu': 0.93, 'add_time': '2017-06-01 10:00:41'}]

        elif task_type == '2':
            # 待测代码
            items = UserTransTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # 转发速率
                rx_rate = item.rx_rate
                # cpu利用率
                obj = CPUMemory.objects.filter(add_time__gt=item.add_time).first()
                cpu = obj.cpu
                # 性能资源比
                cpu_res_rate = rx_rate/cpu
                rst['cpu'] = cpu_res_rate
                result.append(rst)

            # 测试数据
            # result = [{'cpu': 0.15, 'add_time': '2017-06-02 12:00:13'},
            #           {'cpu': 0.21, 'add_time': '2017-06-02 12:00:16'},
            #           {'cpu': 0.33, 'add_time': '2017-06-02 12:00:19'},
            #           {'cpu': 0.32, 'add_time': '2017-06-02 12:00:22'},
            #           {'cpu': 0.45, 'add_time': '2017-06-02 12:00:25'},
            #           {'cpu': 0.57, 'add_time': '2017-06-02 12:00:28'},
            #           {'cpu': 0.66, 'add_time': '2017-06-02 12:00:31'},
            #           {'cpu': 0.89, 'add_time': '2017-06-02 12:00:35'},
            #           {'cpu': 0.90, 'add_time': '2017-06-02 12:00:38'},
            #           {'cpu': 0.93, 'add_time': '2017-06-02 12:00:41'}]

        elif task_type == '3':
            # 待测代码
            items = MultiTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # 转发速率
                rx_rate = item.rx_rate
                # 上线速率
                current_session = item.session_num
                set_session = TestCaseState.objects.get(task_id=taskid).set_session
                # cpu利用率
                obj = CPUMemory.objects.filter(add_time__gt=item.add_time).first()
                cpu = obj.cpu
                # 性能资源比
                cpu_res_rate = (rx_rate+current_session/set_session)/cpu
                rst['cpu'] = cpu_res_rate
                result.append(rst)

            # 测试数据
            # result = [{'cpu': 0.15, 'add_time': '2017-06-03 13:00:13'},
            #           {'cpu': 0.21, 'add_time': '2017-06-03 13:00:16'},
            #           {'cpu': 0.33, 'add_time': '2017-06-03 13:00:19'},
            #           {'cpu': 0.32, 'add_time': '2017-06-03 13:00:22'},
            #           {'cpu': 0.45, 'add_time': '2017-06-03 13:00:25'},
            #           {'cpu': 0.57, 'add_time': '2017-06-03 13:00:28'},
            #           {'cpu': 0.66, 'add_time': '2017-06-03 13:00:31'},
            #           {'cpu': 0.89, 'add_time': '2017-06-03 13:00:35'},
            #           {'cpu': 0.90, 'add_time': '2017-06-03 13:00:38'},
            #           {'cpu': 0.93, 'add_time': '2017-06-03 13:00:41'}]
        else:
            result = {}

        return HttpResponse(json.dumps(result), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 选择某一项task后，返回memory性能资源比【已提供测试数据】
def api4_query_task_memory(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        print(d)

        result = []
        taskid = d.get('taskid')
        task_type = d.get('tasktype')

        if task_type == '1':
            # 待测代码
            items = PPPoESessionTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
                # rst['add_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # 上线速率
                current_session = item.session_num
                set_session = TestCaseState.objects.get(task_id=taskid).set_session
                # memory利用率
                obj = CPUMemory.objects.filter(add_time__gt=item.add_time).first()
                memory = obj.memory

                # 性能资源比
                memory_res_rate = (current_session / set_session) / memory
                rst['memory'] = memory_res_rate
                result.append(rst)

            # 测试数据
            # result = [{'memory': 0.15, 'add_time': '2017-06-01 10:00:13'},
            #           {'memory': 0.21, 'add_time': '2017-06-01 10:00:16'},
            #           {'memory': 0.33, 'add_time': '2017-06-01 10:00:19'},
            #           {'memory': 0.32, 'add_time': '2017-06-01 10:00:22'},
            #           {'memory': 0.45, 'add_time': '2017-06-01 10:00:25'},
            #           {'memory': 0.57, 'add_time': '2017-06-01 10:00:28'},
            #           {'memory': 0.66, 'add_time': '2017-06-01 10:00:31'},
            #           {'memory': 0.89, 'add_time': '2017-06-01 10:00:35'},
            #           {'memory': 0.90, 'add_time': '2017-06-01 10:00:38'},
            #           {'memory': 0.93, 'add_time': '2017-06-01 10:00:41'}]

        elif task_type == '2':
            # 待测代码
            items = UserTransTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # 转发速率
                rx_rate = item.rx_rate
                # cpu利用率
                obj = CPUMemory.objects.filter(add_time__gt=item.add_time).first()
                memory = obj.memory
                # 性能资源比
                memory_res_rate = rx_rate / memory
                rst['memory'] = memory_res_rate
                result.append(rst)

            # 测试数据
            # result = [{'memory': 0.15, 'add_time': '2017-06-02 12:00:13'},
            #           {'memory': 0.21, 'add_time': '2017-06-02 12:00:16'},
            #           {'memory': 0.33, 'add_time': '2017-06-02 12:00:19'},
            #           {'memory': 0.32, 'add_time': '2017-06-02 12:00:22'},
            #           {'memory': 0.45, 'add_time': '2017-06-02 12:00:25'},
            #           {'memory': 0.57, 'add_time': '2017-06-02 12:00:28'},
            #           {'memory': 0.66, 'add_time': '2017-06-02 12:00:31'},
            #           {'memory': 0.89, 'add_time': '2017-06-02 12:00:35'},
            #           {'memory': 0.90, 'add_time': '2017-06-02 12:00:38'},
            #           {'memory': 0.93, 'add_time': '2017-06-02 12:00:41'}]

        elif task_type == '3':
            # 待测代码
            items = MultiTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                # rst['add_time'] = item.add_time.strftime('%Y-%m-%d %H:%M:%S')
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # 转发速率
                rx_rate = item.rx_rate
                # 上线速率
                current_session = item.session_num
                set_session = TestCaseState.objects.get(task_id=taskid).set_session
                # cpu利用率
                obj = CPUMemory.objects.filter(add_time__gt=item.add_time).first()
                memory = obj.memory
                # 性能资源比
                memory_res_rate = (rx_rate + current_session / set_session) / memory
                rst['memory'] = memory_res_rate
                result.append(rst)

            # 测试数据
            # result = [{'memory': 0.15, 'add_time': '2017-06-03 13:00:13'},
            #           {'memory': 0.21, 'add_time': '2017-06-03 13:00:16'},
            #           {'memory': 0.33, 'add_time': '2017-06-03 13:00:19'},
            #           {'memory': 0.32, 'add_time': '2017-06-03 13:00:22'},
            #           {'memory': 0.45, 'add_time': '2017-06-03 13:00:25'},
            #           {'memory': 0.57, 'add_time': '2017-06-03 13:00:28'},
            #           {'memory': 0.66, 'add_time': '2017-06-03 13:00:31'},
            #           {'memory': 0.89, 'add_time': '2017-06-03 13:00:35'},
            #           {'memory': 0.90, 'add_time': '2017-06-03 13:00:38'},
            #           {'memory': 0.93, 'add_time': '2017-06-03 13:00:41'}]
        else:
            result = {}

        return HttpResponse(json.dumps(result), content_type='application/json')
        # return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# 选择某一项task后，返回资源利用率稳定性，由于公式未知，未进行编写【无法提供测试数据】
def api4_query_task_stability(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        print(d)

        result = []
        taskid = d.get('taskid')
        task_type = d.get('tasktype')

        return HttpResponse(json.dumps(result), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)

# 性能页面cpu详情
def api4_query_cpu_details(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)

        taskid = d.get('taskid')
        items = CPUMemory.objects.filter(task_id=taskid)

        count = 0
        sum = 0
        for item in items:
            count += 1
            sum += item.cpu
        avg_cpu = sum/count

        sum1 = 0
        for item in items:
            sum1 += math.pow((item.cpu - avg_cpu), 2)

        stability_factor = math.sqrt(sum1/count)
        data = {'avg_cpu': avg_cpu, 'stability_factor': stability_factor}

        # data = {'avg_cpu': 50, 'stability_factor': 0.8}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# index.html 测试用例性能
def api4_get_index_case_performance(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        print(d)

        result = []
        taskid = d.get('taskid')
        task_type = d.get('tasktype')
        if task_type == '1':
            items = PPPoESessionTest.objects.filter(task_id=taskid)
            for item in items:
                rst = {}
                time_value = str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))).split(' ')
                rst['add_time'] = time_value[1]
                # rst['add_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item.add_time))
                rst['cur_session'] = item.session_num
                rst['cur_rate'] = item.connect_rate

                result.append(rst)
        else:
            result = []

        # 测试数据
        # result = [{'cur_session': 1000, 'cur_rate': 100, 'add_time': '2017-06-03 13:00:13'},
        #           {'cur_session': 2000, 'cur_rate': 200, 'add_time': '2017-06-03 13:00:16'},
        #           {'cur_session': 3500, 'cur_rate': 190, 'add_time': '2017-06-03 13:00:19'},
        #           {'cur_session': 4800, 'cur_rate': 150, 'add_time': '2017-06-03 13:00:22'},
        #           {'cur_session': 6200, 'cur_rate': 400, 'add_time': '2017-06-03 13:00:25'},
        #           {'cur_session': 8800, 'cur_rate': 105, 'add_time': '2017-06-03 13:00:28'},
        #           {'cur_session': 10000, 'cur_rate': 10, 'add_time': '2017-06-03 13:00:31'}]

        return HttpResponse(json.dumps(result), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)


# UTCS时间转换为时间戳 2016-07-31T16:00:00Z
def utc_to_local(utc_time_str, utc_format='%Y-%m-%dT%H:%M:%SZ'):
    local_tz = pytz.timezone('Asia/Chongqing')
    local_format = "%Y-%m-%d %H:%M"
    utc_dt = datetime.datetime.strptime(utc_time_str, utc_format)
    local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
    time_str = local_dt.strftime(local_format)


    return int(time.mktime(time.strptime(time_str, local_format)))


# 本地时间转换为UTC
def local_to_utc(local_ts, utc_format='%Y-%m-%dT%H:%MZ'):
    local_tz = pytz.timezone('Asia/Chongqing')
    local_format = "%Y-%m-%d %H:%M"
    time_str = time.strftime(local_format, time.localtime(local_ts))
    dt = datetime.datetime.strptime(time_str, local_format)
    local_dt = local_tz.localize(dt, is_dst=None)
    utc_dt = local_dt.astimezone(pytz.utc)
    return utc_dt.strftime(utc_format)
############20170803最新更新----添加及修改功能#########################################
#新添加功能：对比同一厂商不同版本或者不同厂商之间之间性能，得出决策报告
#前端发出请求后，根据“厂商”关键字从数据库查询到uuid，进而筛选出最新两个版本，返回最新两个版本的测试类型以及对应的测试结果，返回给前端生成决策报告进而生成同一厂商最新两个版本的测试结果的对比报告（vnf1表示第一种测试类型）。


# 按厂商/版本查询时,一次性返回所有测试信息，格式如下：
#{厂商一/版本一: [pppoe最大会话容量, pppoe新建平均会话速率, pppoe新建最小会话速率, pppoe需要的最大内存, 64字节转发性能, 128字节转发性能, 256
#                   字节转发性能, 512字节转发性能, 1024字节转发性能, 1280字节转发性能, 1518字节转发性能, 综合上网最大会话容量, 综合上网新建会话速率,
#                   综合上网需要的最大内存], 厂商二/版本二: [2, 3, 4, 7, 8, 9, 1, 2, 3, 10, 14, 12, 13, 1]}
def api4_contrast_report(req):
    if req.method =='POST':
        d = json.loads(req.body.decode('utf-8'))
        venders = d.get('venders')
        vnf_type = d.get('vnf_type')
        version_flags = d.get('version_flags')
        venders_lenth = len(venders)
        version_flags_lenth = len(version_flags)
        dict_reports = {}
        for vender in venders:
            for version_flag in version_flags:
                testData = []                                 # 对于一个基本查询信息，储存对应所有测试用例类型的测试结果
                vnf1_info = find_base_info(vender, vnf_type, version_flag, 'vnf1')
                if vnf1_info == None:#如果数据库中没有数据
                    for i in range(4):testData.append('无')
                else:
                    vnf1_result = vnf1_find_test_result(vnf1_info.task_id)
                    #print(vnf1_info.task_id)
                    for k,v in vnf1_result.items():
                        testData.append(v)
                vnf2_info = find_base_info(vender, vnf_type, version_flag, 'vnf2')
                if vnf2_info == None:
                    for i in range(7): testData.append('无')
                else:
                    #print(vnf2_info.task_id)
                    vnf2_result = vnf2_find_test_result(vnf2_info.task_id)
                    for k,v in vnf2_result.items():
                        testData.append(v)
                vnf3_info = find_base_info(vender, vnf_type, version_flag, 'vnf3')
                if vnf3_info == None:
                    for i in range(3): testData.append('无')
                else:
                    #print(vnf3_info.task_id)
                    vnf3_result = vnf3_find_test_result(vnf3_info.task_id)
                    for k,v in vnf3_result.items():
                        testData.append(v)
                if venders_lenth >= version_flags_lenth:              # 请求的厂商不止一个时，为多厂商同网元最新版本查询
                    dict_reports[vender] = testData
                else:                                                # 请求的版本不止一个时，为同厂商同网元不同版本查询
                    dict_reports[version_flag] = testData
                #test_report = {vender:testData,'baseInfo':基本信息}#添加基本信息处

        return HttpResponse(json.dumps(dict_reports), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)
#############################辅助函数######################################################################
#描述：通过厂商找出其对应的最新版本或者次新版本，找出对应的基本信，返回一条记录
#参数：厂商、网元类型、返回版本标志【最新版本（1表示）,次新版本（2表示）】、测试类型
def find_base_info(vender, vnf_type, version_flag,test_type):
    if test_type == 'vnf1':
        items = TestCaseState.objects.filter(set_vender=vender, set_vnf_type=vnf_type,type_name='VNF_1_Concurrent_Session_Capacity').all()
    elif test_type == 'vnf2':
        items = TestCaseState.objects.filter(set_vender=vender, set_vnf_type=vnf_type,type_name='VNF_2_VBRAS_Client_Forwarding_Performance').all()
    elif test_type == 'vnf3':
        print(vender,vnf_type)
        items = TestCaseState.objects.filter(set_vender=vender, set_vnf_type=vnf_type,type_name='VNF_3_PPPoE_IPTV_IPoE_VoIP').all()
    if items == None or items.count() < version_flag:
        return None
    #print("测试分组排序专用",TestCaseState.objects.values('set_version').annotate(Max('id')).order_by['-id'][0])
    item_list = list(items.order_by('-set_version','-id'))            #   筛选掉相同的查询结果，如果与前面记录的版本相同，作为重复项移除
    last_version = 0
    for item in item_list:
        if item.set_version == last_version:
            item_list.remove(item)
        else:
            last_version = item.set_version
    if len(item_list) >= version_flag:
        base_info = item_list[version_flag-1]
        if test_type == 'vnf1':                                 #用于测试
            print('版本号：', base_info.task_id)
            print('版本信息：', base_info.set_version)
        return base_info


#############################辅助函数######################################################################
#描述：通过UUID确定具体某条测试用例，利用从itest获得的结果，经计算后得到最终返回的测试结果，以字典格式返回
#参数：uuid测试用例唯一标志
def vnf1_find_test_result(uuid):
    items = PPPoESessionTest.objects.filter(task_id=uuid)
    dict_result = collections.OrderedDict(
        [('max_session', '无'), ('avg_con', '无'), ('min_con', '无'), ('max_memory', '无')])
    if(items):
        dict_result['max_session'] = items.last().session_num
        dict_result['min_con'] = items.order_by("connect_rate").first().connect_rate
        sum_con = 0
        count = 0
        for item in items:
            count += 1
            sum_con += float(item.connect_rate)
        dict_result['avg_con'] = sum_con / count
    if CPUMemory.objects.filter(task_id=uuid):
        dict_result['max_memory'] = CPUMemory.objects.filter(task_id=uuid).order_by("memory").last().memory
    # dict_result = {'max_session': max_session, 'avg_con': avg_con, 'min_con': min_con, 'max_memory': max_memory,
    #        'max_session_std': 100, 'avg_con_std': 100, 'min_con_std': 100, 'max_memory_std': 100}
    # dict_result = {'max_session': 100, 'avg_con': 100, 'min_con': 100, 'max_memory': 100,
    #         'max_session_std': 100,'avg_con_std': 100, 'min_con_std': 100, 'max_memory_std': 100}  # 用于测试数据
    return(dict_result)

def vnf2_find_test_result(uuid):
    items = UserTransTest.objects.filter(task_id=uuid)
    dict_result = collections.OrderedDict(
        [('rx_64', '无'), ('rx_128', '无'), ('rx_256', '无'), ('rx_512', '无'), ('rx_1024', '无'),
         ('rx_1280', '无'), ('rx_1518', '无')])
    frame_sizes = [64,128,256,512,1024,1280,1518]
    for frame_size in frame_sizes:
        if items.filter(frame_size=frame_size):
            rx = 'rx_'+str(frame_size)
            rx_size= items.filter(frame_size=frame_size).first().rx_rate
            dict_result[rx] = rx_size
    return dict_result

def vnf3_find_test_result(uuid):
    items = MultiTest.objects.filter(task_id=uuid)
    dict_result = collections.OrderedDict(
        [('max_session', '无'), ('avg_con', '无'), ('min_con', '无'), ('max_memory', '无')])
    if(items):
        dict_result['max_session'] = items.last().session_num
        dict_result['min_con'] = items.order_by("connect_rate").first().connect_rate
        sum_con = 0
        count = 0
        for item in items:
            count += 1
            sum_con += float(item.connect_rate)
        dict_result['avg_con'] = sum_con / count
    if CPUMemory.objects.filter(task_id=uuid):
        dict_result['max_memory'] = CPUMemory.objects.filter(task_id=uuid).order_by("memory").last().memory
    # dict_result = {'max_session': max_session, 'avg_con': avg_con, 'min_con': min_con, 'max_memory': max_memory,
    #        'max_session_std': 100, 'avg_con_std': 100, 'min_con_std': 100, 'max_memory_std': 100}
    # dict_result = {'max_session': 100, 'avg_con': 100, 'min_con': 100, 'max_memory': 100,
    #         'max_session_std': 100,'avg_con_std': 100, 'min_con_std': 100, 'max_memory_std': 100}  # 用于测试数据
    return(dict_result)

#20170803修改，在原来的基础上增加了厂商、VNF类型、版本号、测试次数、上线速率等信息。
# 获取到前台送的指令，新建测试用例时，从前端向后端传入测试基本信息，存储到数据库，并生成uuid后返回给前台
def api4_vnf1_uuid(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        beginflag = d.get('begin')
        if beginflag == 1:
            taskid = uuid.uuid1()
            #uuid1()——基于时间戳
            #由MAC地址、当前时间戳、随机数生成。可以保证全球范围内的唯一性，
            #但MAC的使用同时带来安全性问题，局域网中可以使用IP来代替MAC。
            taskid = str(taskid)

        obj = TestCaseState()
        obj.task_id = taskid
        obj.set_session = d.get('set_session')
        obj.set_flow = d.get('set_flow')
        #print(d.get('set_flow'))
        obj.set_version = d.get('set_version')
        #print(d.get('set_version'))
        obj.set_vnf_type = d.get('set_vnf_type')
        obj.set_vender=d.get('set_vender')
        obj.set_timer = d.get('set_timer')
        obj.set_online_rate = d.get('set_online_rate')
        obj.set_platform = d.get('set_cloudPlatform')
        obj.set_platform_v = d.get('set_platformVer')
        obj.current_state = True
        obj.type_name = 'VNF_1_Concurrent_Session_Capacity'
        obj.save()#存储到数据库

        data = {'taskId': taskid}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)
def api4_vnf2_uuid(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        beginflag = d.get('begin')
        if beginflag == 1:
            taskid = uuid.uuid1()
            taskid = str(taskid)

        obj = TestCaseState()
        obj.task_id = taskid
        obj.set_session = d.get('set_session')
        obj.set_flow = d.get('set_flow')
        obj.set_version = d.get('set_version')
        obj.set_vnf_type = d.get('set_vnf_type')
        obj.set_vender=d.get('set_vender')
        obj.set_timer = d.get('set_timer')
        obj.set_platform = d.get('set_cloudPlatform')
        obj.set_platform_v = d.get('set_platformVer')
        obj.current_state = True
        # mt.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        # obj.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        obj.type_name = 'VNF_2_VBRAS_Client_Forwarding_Performance'
        obj.save()
        data = {'taskId': taskid}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)
def api4_vnf3_uuid(req):
    if req.method == 'POST':

        d = json.loads(req.body.decode('utf-8'))
        beginflag = d.get('begin')
        if beginflag == 1:
            taskid = uuid.uuid1()
            taskid = str(taskid)

        obj = TestCaseState()
        obj.task_id = taskid
        obj.set_session = d.get('set_session')
        obj.set_flow = d.get('set_flow')
        obj.set_version = d.get('set_version')
        obj.set_vnf_type = d.get('set_vnf_type')
        obj.set_vender = d.get('set_vender')
        obj.set_timer = d.get('set_timer')
        obj.set_platform = d.get('set_cloudPlatform')
        obj.set_platform_v = d.get('set_platformVer')
        obj.current_state = True
        # mt.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        # obj.add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        obj.type_name = 'VNF_3_PPPoE_IPTV_IPoE_VoIP'

        obj.save()
        data = {'taskId': taskid}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)
# 打开决策对比页面时，向前端传入厂商设备等基本信息以便用户能够从中筛选厂商等
def api4_provide_base_infos(req):
    if req.method == 'POST':
        items = TestCaseState.objects.all()
        base_infos=[]
        for item in items:
            # test_item = PPPoESessionTest()
            # test_item.task_id=item.task_id
            # test_item.save()
            base_info={}
            base_info['vender'] = item.set_vender
            base_info['version'] = item.set_version
            base_info['vnf_type'] = item.set_vnf_type
            base_info['timer'] = item.set_timer
            base_info['flow'] = item.set_flow
            base_infos.append(base_info)
        return HttpResponse(json.dumps(base_infos), content_type='application/json')
    return HttpResponse('Permission Denied!', status=403)

# 导出测试报告，在原来的基础上添加辅助函数实现计算功能
def api4_report(req):
    if req.method == 'POST':
        d = json.loads(req.body.decode('utf-8'))
        print(d)
        print('receive report request!!!')
        # data = {}
        task_id = d.get('taskid')
        task_type = d.get('tasktype')

        if task_type == '1':
            data = vnf1_find_test_result(task_id)
        elif task_type == '2':
            data = vnf2_find_test_result(task_id)
        elif task_type == '3':
            data = vnf3_find_test_result(task_id)
        else:
            data = {}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return HttpResponse('Permission denied!', status=403)