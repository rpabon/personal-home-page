<?php

include("DB.php");

$request_method = strtolower($_SERVER['REQUEST_METHOD']);

switch ($request_method) {
    case 'get':
                $videoId = $_GET['video_id'];
		$sth = mysql_query("SELECT * FROM boxes WHERE videoId='$videoId'") or die(mysql_error());  
		$rows = array();
		while($r = mysql_fetch_assoc($sth)) {
			$rows[] = $r;
		}
        echo json_encode($rows);
	break;
	
	case 'post':
	
		$box = json_decode(file_get_contents('php://input'));
		$videoId 	= $box->{'videoId'};
		$frame 	 	= $box->{'frame'};
		$x1 	  	= $box->{'x1'};
		$x2 	  	= $box->{'x2'};
		$y1 	  	= $box->{'y1'};
		$y2 	  	= $box->{'y2'};
		$los 	  	= $box->{'los'};
		$trackingId	= $box->{'trackingId'};
				
		mysql_query("INSERT INTO boxes(id, videoId, frame, x1, x2, y1, y2, los, trackingId) 
					 VALUES('', '$videoId', '$frame', '$x1', '$x2', '$y1', '$y2', '$los', '$trackingId') ") or die(mysql_error());
					 
		$id = mysql_insert_id();
		
		$response = array();
		$response['id'] 		= $id;
		$response['videoId']	= $videoId;
		$response['frame'] 		= $frame;
		$response['x1'] 		= $x1;
		$response['x2'] 		= $x2;
		$response['y1'] 		= $y1;
		$response['y2'] 		= $y2;
		$response['los'] 		= $los;
		$response['trackingId']	= $trackingId;
		
		echo json_encode($response);

	break;
	
	case 'put':
	
		$box = json_decode(file_get_contents('php://input'));
		$id			= $box->{'id'};
		$videoId 	= $box->{'videoId'};
		$frame 	 	= $box->{'frame'};
		$x1 	  	= $box->{'x1'};
		$x2 	  	= $box->{'x2'};
		$y1 	  	= $box->{'y1'};
		$y2 	  	= $box->{'y2'};
		$los 	  	= $box->{'los'};
		$trackingId	= $box->{'trackingId'};
				
		mysql_query("UPDATE boxes SET videoId='$videoId', frame='$frame', x1='$x1', x2='$x2', y1='$y1', y2='$y2', los='$los', trackingId='$trackingId'
					  WHERE id='$id'") or die(mysql_error());
					 
		$id = mysql_insert_id();
		
		$response = array();
		$response['id'] 		= $id;
		$response['videoId']	= $videoId;
		$response['frame'] 		= $frame;
		$response['x1'] 		= $x1;
		$response['x2'] 		= $x2;
		$response['y1'] 		= $y1;
		$response['y2'] 		= $y2;
		$response['los'] 		= $los;
		$response['trackingId'] = $trackingId;
		
		echo json_encode($response);

	break;
	
	case 'delete':
	
		$id = $_GET['id'];
		mysql_query("DELETE FROM boxes WHERE id='$id'") or die(mysql_error());
					 
	break;
}
?>