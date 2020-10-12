<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once("class.db.php");
$db = new DB();
$connection = $db->dbConnection();
$response = array();
$stmt = $connection->prepare("SELECT * FROM image_location");
$stmt->execute();
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
extract($row);
$location_item = array(
"location_id" => $location_id,
"display" => $display,
"image_link" => $image_link
);
array_push($response, $location_item);
}
http_response_code(200);
echo json_encode($response);
?>