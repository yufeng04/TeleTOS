<?php
/**
 * Created by PhpStorm.
 * User: JiXu
 * Date: 2016-08-17
 * Time: 14:11
 */
if($_POST['name']&&$_POST['content']){
    $data=array(
        'name'=>$_POST['name'],
        'content'=>$_POST['content']
    );
    echo json_encode(array('status'=>"SUCCESS"));
}
