<?php
header("Content-Type: application/json; charset=UTF-8");
session_start();
require "db.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "❌ Invalid login data."], JSON_UNESCAPED_UNICODE);
    exit;
}

$email    = isset($data["email"])    ? trim($data["email"]) : "";
$password = isset($data["password"]) ? $data["password"]    : "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "❌ Please enter email and password."], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "❌ Incorrect email or password."], JSON_UNESCAPED_UNICODE);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["password_hash"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "❌ Incorrect email or password."], JSON_UNESCAPED_UNICODE);
    $stmt->close();
    $conn->close();
    exit;
}

session_regenerate_id(true);
$_SESSION["user_id"]    = $user["id"];
$_SESSION["user_name"]  = $user["name"];
$_SESSION["user_email"] = $user["email"];

echo json_encode(["success" => true, "message" => "✅ Login successful."], JSON_UNESCAPED_UNICODE);
$stmt->close();
$conn->close();
?>