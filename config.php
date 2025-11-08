<?php
session_start(); // wajib, biar session aktif

$conn = new mysqli("localhost", "root", "", "db_crud");
if ($conn->connect_error) {
    die(json_encode(["error" => "Koneksi gagal: " . $conn->connect_error]));
}
?>
