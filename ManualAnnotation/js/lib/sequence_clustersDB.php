<?php

include("DB.php");

$request_method = strtolower($_SERVER['REQUEST_METHOD']);

switch ($request_method) {
    case 'get':
                $videoId = $_GET['video_id'];
		$sth = mysql_query("SELECT * FROM sequence_clusters WHERE videoId='$videoId'") or die(mysql_error());  
		$rows = array();
		while($r = mysql_fetch_assoc($sth)) {
			$rows[] = $r;
		}
        echo json_encode($rows);
        break;
		
	case 'post':
		
		$sequence_cluster = json_decode(file_get_contents('php://input'));
		$videoId 	  	  = $sequence_cluster->{'videoId'};
		$name 	 	  	  = $sequence_cluster->{'name'};
		$personId 	  	  = $sequence_cluster->{'personId'};
		$priority 	  	  = $sequence_cluster->{'priority'};
				
		mysql_query("INSERT INTO sequence_clusters(id, videoId, name, personId, priority) 
					 VALUES('', '$videoId', '$name', '$personId', '$priority') ") or die(mysql_error());
					 
		$id = mysql_insert_id();
		
		$response = array();
		$response['id'] 		  = $id;
		$response['videoId'] 	  = $videoId;
		$response['name'] 		  = $name;
		$response['personId'] 	  = $personId;
		$response['priority'] 	  = $priority;
	
		echo json_encode($response);

	break;
	
	case 'put':
		
		$sequence_cluster = json_decode(file_get_contents('php://input'));
		$id			  = $sequence_cluster->{'id'};
		$videoId 	  = $sequence_cluster->{'videoId'};
		$name 	 	  = $sequence_cluster->{'name'};
		$personId	  = $sequence_cluster->{'personId'};
		$priority 	  = $sequence_cluster->{'priority'};
				
		mysql_query("UPDATE sequence_clusters SET videoId='$videoId', name='$name', personId='$personId', priority='$priority'
					  WHERE id='$id'") or die(mysql_error());
					 
		
		$response = array();
		$response['id'] 		  = $id;
		$response['videoId'] 	  = $videoId;
		$response['name'] 		  = $name;
		$response['personId'] 	  = $personId;
		$response['priority'] 	  = $priority;
		
		echo json_encode($response);

	break;
}
?>