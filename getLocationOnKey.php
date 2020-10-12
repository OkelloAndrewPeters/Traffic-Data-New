<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once("class.db.php");
$db = new DB();
$connection = $db->dbConnection();

if(!empty($_GET["q"])){
$keyword = trim($_GET["q"]);

$response = array();
$stmt = $connection->prepare("SELECT * FROM image_location WHERE display LIKE '%$keyword%' LIMIT 0,1");
$stmt->execute();
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
extract($row);
$location_item = array(
"location_id" => $location_id,
"display" => $display,
"image_link" => $image_link,
"status" =>"success"
);
array_push($response, $location_item);
}
http_response_code(200);
echo json_encode($response);
}else{
    //bad request
    http_response_code(400);
    echo json_encode(array(
    "status" =>"failed")); 
}
?>