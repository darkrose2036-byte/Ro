<?php
header("Content-Type: application/json; charset=UTF-8");

// Connect to the PENNY database
$host     = "localhost";
$user     = "root";
$pass     = "";
$dbname   = "penny";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

$result = $conn->query("SELECT id, cat_name, age, breed FROM cat ORDER BY id");

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $conn->error]);
    $conn->close();
    exit;
}

$cats = [];
while ($row = $result->fetch_assoc()) {
    $cats[] = [
        "id"       => (int) $row["id"],
        "cat_name" => $row["cat_name"],
        "age"      => (int) $row["age"],
        "breed"    => $row["breed"]
    ];
}

$conn->close();

echo json_encode([
    "success" => true,
    "cats"    => $cats
]);
?>