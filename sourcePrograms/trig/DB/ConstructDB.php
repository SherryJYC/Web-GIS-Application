<?php

class MyDB extends SQLite3{
	function __construct(){
        $this->open('HK_Trig.sqlite');
	}
}
 
	$db = new MyDB();
	$db->exec('DROP TABLE IF EXISTS HKTRIG');
	$db->exec('create table HKTrig (id char(10), name char(20), northing double, easting double, height double)');
	InsertData($db);
 
	function InsertData(&$pdo){
    	global $conn;
    	$fh = fopen('prj_05_HKTrigList1992.txt','r');
    	$i = 0;
    	while ($line = fgets($fh)) {           
        	$array = explode(",", $line);
            if (ord(substr($array[4],0,-1)) == 13){
            	$array[4] = 0;
        	}

        	$value = $array[0] . "," . $array[1] . "," . $array[2] . "," . $array[3] . "," . $array[4];
        	
        	$query2 = "insert into HKTrig values (" . $value . ");";
         	$pdo-> exec($query2);
    	}
    	fclose($fh);
	}
	$result = $db->query('SELECT * FROM HKTrig');
?>