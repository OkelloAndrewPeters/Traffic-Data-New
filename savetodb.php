<?php
require_once("class.db.php");
// required headers do not remove
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$data_object = file_get_contents("php://input");
if(!empty($data_object)){
http_response_code(200);
$object = json_decode($data_object);

$imagedata = $object->IMAGE_DATA;
$locationid = $object->LOCATION_ID;

if(!empty($imagedata) && !empty($locationid)){

if(locationExist($locationid)){
    updateOldLocation($imagedata, $locationid);
}else{
    addNewLocation($imagedata, $locationid);
}
}else{
http_response_code(404);
echo json_encode(array("message" => "Incomplete request", "status" =>"failed"));
}
}else{
http_response_code(404);
echo json_encode(array("message" => "Incomplete request", "status" =>"failed"));
}



function addNewLocation($imagedata, $locationid){
    $db = new DB();
    $connection = $db->dbConnection();
    $stmt = $connection->prepare("INSERT INTO traffic_data_images SET
    IMG_DATA = :uimgdata,
    location_id = :ulocationid,
    TDI_DATETIME = NOW()");
    $stmt->bindParam(":uimgdata", $imagedata);
    $stmt->bindParam(":ulocationid", $locationid);
    if($stmt->execute()){
    echo json_encode(array("message" => "Data saved successfully", "status" =>"success"));
    }    
}

function updateOldLocation($imagedata, $locationid){
    $db = new DB();
    $connection = $db->dbConnection();
    $stmt = $connection->prepare("UPDATE traffic_data_images SET
    IMG_DATA = :uimgdata,
    TDI_DATETIME = NOW() WHERE location_id = :ulocationid");
    $stmt->bindParam(":uimgdata", $imagedata);
    $stmt->bindParam(":ulocationid", $locationid);
    if($stmt->execute()){
    echo json_encode(array("message" => "Data Updated successfully", "status" =>"success"));
    } 
}


function locationExist($locationid){
    $db = new DB();
    $connection = $db->dbConnection();
    $stmt = $connection->prepare("SELECT * FROM traffic_data_images WHERE location_id = :ulocationid");
    $stmt->bindParam(":ulocationid", $locationid);
    $stmt->execute();
   if($stmt->rowCount() > 0){
   return true;
   }else{
   return false;
   }
}

?>