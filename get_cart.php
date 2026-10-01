<?php
session_start();
require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    sendJSON(["success" => true, "items" => []]);
}

$userId = $_SESSION["user_id"];

$stmt = $conn->prepare("
    SELECT 
        c.cart_id,
        c.sticker_id,
        c.quantity,
        s.name,
        s.price,
        s.emoji
    FROM cart c
    INNER JOIN stickers s ON c.sticker_id = s.id
    WHERE c.user_id = ?
    ORDER BY c.added_at DESC
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = [
        "cart_id"    => (int) $row["cart_id"],
        "sticker_id" => (int) $row["sticker_id"],
        "quantity"   => (int) $row["quantity"],
        "name"       => $row["name"],
        "price"      => (float) $row["price"],
        "emoji"      => $row["emoji"]
    ];
}

$stmt->close();
$conn->close();

sendJSON(["success" => true, "items" => $items]);
?>