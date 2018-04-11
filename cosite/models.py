from django.db import models
from datetime import datetime

#model对数据层的封装
class DetectedParams(models.Model):
    label = models.IntegerField(help_text='异常检测标签(-1,0,1)', default=0)
    ave_anneal_soak_t = models.FloatField(help_text='连退均热温度平均值')
    ave_anneal_rapid_cool_outlet_t = models.FloatField(help_text='连退快冷出口温度平均值')
    ave_anneal_slow_cool_outlet_t = models.FloatField(help_text='连退缓冷出口温度平均值')
    pc = models.FloatField(help_text='C%')
    pmn = models.FloatField(help_text='Mn%')
    pp = models.FloatField(help_text='P%')
    ps = models.FloatField(help_text='S%')
    finishing_inlet_t = models.FloatField(help_text='精轧入口温度')
    finishing_outlet_t = models.FloatField(help_text='精轧出口温度')
    coiling_t = models.FloatField(help_text='卷取温度')
    add_time = models.DateTimeField(help_text='添加时间', auto_now_add=True)

    def __str__(self):
        return self.add_time.__str__()




class PPPoESessionTest(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    session_num = models.IntegerField(help_text='Session连接数', default='-1')
    connect_rate = models.FloatField(help_text="上线速率", default='-1')
    add_time = models.IntegerField(help_text='添加时间', default='-1')


class UserTransTest(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    frame_size = models.IntegerField(help_text="帧大小", default='-1')
    min_latency = models.FloatField(help_text="最小时延", default='-1')
    max_latency = models.FloatField(help_text="最大时延", default='-1')
    avg_latency = models.FloatField(help_text="平均时延", default='-1')
    rx_rate = models.FloatField(help_text="接收速率", default='-1')
    add_time = models.IntegerField(help_text='添加时间', default='-1')


class MultiTest(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    frame_size = models.IntegerField(help_text="帧大小", default='-1', null=True)
    # min_latency = models.FloatField(help_text="最小时延", default='-1', null=True)
    # max_latency = models.FloatField(help_text="最大时延", default='-1', null=True)
    # avg_latency = models.FloatField(help_text="平均时延", default='-1', null=True)
    # tx_rate = models.FloatField(help_text="发送速率", default='-1', null=True)
    # rx_rate = models.FloatField(help_text="接收速率", default='-1', null=True)
    # connect_rate = models.FloatField(help_text="上线速率", default='-1', null=True)
    min_latency = models.CharField(help_text="最小时延", default='-1', max_length=100, null=True)
    max_latency = models.CharField(help_text="最大时延", default='-1', max_length=100, null=True)
    avg_latency = models.CharField(help_text="平均时延", default='-1', max_length=100, null=True)
    tx_rate = models.CharField(help_text="发送速率", default='-1', max_length=100, null=True)
    rx_rate = models.CharField(help_text="接收速率", default='-1', max_length=100, null=True)
    connect_rate = models.CharField(help_text="上线速率", default='-1', max_length=100, null=True)

    session_num = models.IntegerField(help_text='Session连接数', default='-1', null=True)
    add_time = models.IntegerField(help_text='添加时间', default='-1', null=True)


class Log(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    log = models.CharField(help_text='日志', default='NULL', max_length=10240000)
    add_time = models.IntegerField(help_text='添加时间', default='-1')


class FinalResult(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    final_result = models.CharField(help_text='是否通过', default='NULL', max_length=10)
    add_time = models.IntegerField(help_text='添加时间', default='-1')


class CPUMemory(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    cpu = models.FloatField(help_text='CPU利用率', default='-1', null=True)
    memory = models.FloatField(help_text='Memory利用率', default='-1', null=True)
    add_time = models.IntegerField(help_text='添加时间', default='-1', null=True)


class TestCaseState(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    task_id = models.UUIDField(help_text='测试用例ID')
    set_flow = models.CharField(help_text='测试流量', max_length=100, default='-1')
    set_session = models.IntegerField(help_text='测试Session数', default='-1')
    set_vender = models.CharField(help_text='厂商名', max_length=100, default='-1')
    set_vnf_type = models.CharField(help_text='网元类型', max_length=100, default='-1')
    set_version = models.CharField(help_text='版本号', max_length=100, default='-1')
    set_timer = models.IntegerField(help_text='测试次数', default=-1)
    type_name = models.CharField(help_text='测试用例类型', default='-1', max_length=100)
    add_time = models.DateTimeField(help_text='添加时间', default=datetime.now, blank=True)
    current_state = models.BooleanField(help_text='当前状态', default=False)
    set_online_rate = models.CharField(help_text='上线速率', default='-1', max_length=100)
    set_platform = models.CharField(help_text='云平台名称',default='-1',max_length=100)
    set_platform_v = models.CharField(help_text='云平台版本',default='-1',max_length=100)

    def __str__(self):
        return self.add_time.__str__()






