<?php

include("DB.php");

$request_method = strtolower($_SERVER['REQUEST_METHOD']);

switch ($request_method) {
    case 'get':
                $videoId = $_GET['video_id'];
		$sth = mysql_query("SELECT * FROM box_sequences WHERE videoId='$videoId'") or die(mysql_error());  
		$rows = array();
		while($r = mysql_fetch_assoc($sth)) {
			$rows[] = $r;
		}
        echo json_encode($rows);;
	break;
	
	case 'post':
		
		$box_sequence = json_decode(file_get_contents('php://input'));
		$videoId 	  = $box_sequence->{'videoId'};
		$start 	 	  = $box_sequence->{'start'};
		$duration 	  = $box_sequence->{'duration'};
		$priority 	  = $box_sequence->{'priority'};
		$clusterId 	  = $box_sequence->{'clusterId'};
		$thumbnailUrl = $box_sequence->{'thumbnailUrl'};
				
		mysql_query("INSERT INTO box_sequences(id, videoId, start, duration, priority, clusterId, thumbnailUrl) 
					 VALUES('', '$videoId', '$start', '$duration', '$priority', '$clusterId', '$thumbnailUrl') ") or die(mysql_error());
					 
		$id = mysql_insert_id();
		
		$response = array();
		$response['id'] 		  = $id;
		$response['videoId'] 	  = $videoId;
		$response['start'] 		  = $start;
		$response['duration'] 	  = $duration;
		$response['priority'] 	  = $priority;
		$response['clusterId'] 	  = $clusterId;
		$response['thumbnailUrl'] = $thumbnailUrl;
		
		echo json_encode($response);

	break;
	
	case 'put':
		
		$box_sequence = json_decode(file_get_contents('php://input'));
		$id			  = $box_sequence->{'id'};
		$videoId 	  = $box_sequence->{'videoId'};
		$start 	 	  = $box_sequence->{'start'};
		$duration 	  = $box_sequence->{'duration'};
		$priority 	  = $box_sequence->{'priority'};
		$clusterId 	  = $box_sequence->{'clusterId'};
		$thumbnailUrl = $box_sequence->{'thumbnailUrl'};
				
		mysql_query("UPDATE box_sequences SET videoId='$videoId', start='$start', duration='$duration', priority='$priority', clusterId='$clusterId',  thumbnailUrl='$thumbnailUrl'
					  WHERE id='$id'") or die(mysql_error());
					 
		
		$response = array();
		$response['id'] 		  = $id;
		$response['videoId'] 	  = $videoId;
		$response['start'] 		  = $start;
		$response['duration'] 	  = $duration;
		$response['priority'] 	  = $priority;
		$response['clusterId'] 	  = $clusterId;
		$response['thumbnailUrl'] = $thumbnailUrl;
		
		echo json_encode($response);

	break;

	case 'delete':
	
		$id = $_GET['id'];
		mysql_query("DELETE FROM box_sequences WHERE id='$id'") or die(mysql_error());
					 
	break;

}
?>