<?php
$list=$_POST['liOption'];
if(empty($list)){
	 echo "Did not select any option!";
}else{
     print_r($list);
}
?>