<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once("class.db.php");
$db = new DB();
$connection = $db->dbConnection();

if(!empty($_GET["location_id"])){
$locationid = trim($_GET["location_id"]);
$stmt = $connection->prepare("SELECT * FROM traffic_data_images WHERE location_id = :ulocid");
$stmt->bindParam(":ulocid", $locationid);
$stmt->execute();

if($stmt->rowCount() > 0){
$row = $stmt->fetch(PDO::FETCH_ASSOC);
extract($row);
$response = array(
"TDI_ID" => $TDI_ID,
"IMG_DATA" => $IMG_DATA,
"TDI_DATETIME" => $TDI_DATETIME,
"message" => "",
"status" => "success"
);
http_response_code(200);
echo json_encode($response);
}else{
     $response = array(
          "message" => "Location data not available",
          "status" => "failed"
          );
          http_response_code(200);
          echo json_encode($response);
}
}else{
     //bad request
     http_response_code(400);
     echo json_encode(array(
     "message" => "Incomplete data",
     "status" =>"failed"));  
}
?>