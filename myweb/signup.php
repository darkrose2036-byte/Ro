<?php
header("Content-Type: application/json; charset=UTF-8");
require "db.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "❌ Invalid signup data."], JSON_UNESCAPED_UNICODE);
    exit;
}

$name     = isset($data["name"])     ? trim($data["name"])     : "";
$email    = isset($data["email"])    ? trim($data["email"])    : "";
$password = isset($data["password"]) ? $data["password"]       : "";

if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "❌ Please complete all fields."], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "❌ Please enter a valid email."], JSON_UNESCAPED_UNICODE);
    exit;
}


// ======================================
// PASSWORD LENGTH
// ======================================

if (

    strlen($password) < 6

) {

    http_response_code(400);

    echo json_encode(

        [

            "success" => false,

            "message" =>

                "❌ Password must be at least 6 characters."

        ],

        JSON_UNESCAPED_UNICODE

    );

    exit;

}

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$checkResult = $check->get_result();

if ($checkResult->num_rows > 0) {
    http_response_code(409);

    echo json_encode(["success" => false, "message" => "❌ This email is already registered."], JSON_UNESCAPED_UNICODE);

    $check->close();

    $conn->close();

    exit;
}

$check->close();

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $passwordHash);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ Account created successfully."], JSON_UNESCAPED_UNICODE);
} 

else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "❌ Could not create account."], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>