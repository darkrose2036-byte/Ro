<?php
header("Content-Type: application/json; charset=UTF-8");
require "db.php";

$sql = "SELECT id, cat_name, age, breed FROM cat ORDER BY id";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Could not load cats"]);
    $conn->close();
    exit;
}

$cats = [];
while ($row = $result->fetch_assoc()) {
    $cats[] = $row;
}

echo json_encode($cats, JSON_UNESCAPED_UNICODE);
$conn->close();
?>