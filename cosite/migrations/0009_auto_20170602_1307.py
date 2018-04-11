# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-06-02 05:07
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cosite', '0008_auto_20170602_1257'),
    ]

    operations = [
        migrations.AlterField(
            model_name='multitest',
            name='add_time',
            field=models.IntegerField(default='-1', help_text='添加时间', null=True),
        ),
        migrations.AlterField(
            model_name='multitest',
            name='frame_size',
            field=models.IntegerField(default='-1', help_text='帧大小', null=True),
        ),
        migrations.AlterField(
            model_name='multitest',
            name='session_num',
            field=models.IntegerField(default='-1', help_text='Session连接数', null=True),
        ),
        migrations.AlterField(
            model_name='testcasestate',
            name='add_time',
            field=models.DateTimeField(default=datetime.datetime(2017, 6, 2, 13, 7, 35, 659589), help_text='添加时间'),
        ),
    ]