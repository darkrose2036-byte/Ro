<?php
// ======================================
// DATABASE SETTINGS
// ======================================
$host = "localhost";
$username = "root";
$password = "";
$database = "penny";

// ======================================
// CREATE CONNECTION
// ======================================
$conn = new mysqli($host, $username, $password, $database);

// ======================================
// CHECK CONNECTION
// ======================================
if ($conn->connect_error) {
    http_response_code(500);
    die("Database connection failed");
}

// ======================================
// SUPPORT EMOJIS + UTF-8
// ======================================
$conn->set_charset("utf8mb4");
?>