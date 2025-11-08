<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Koneksi database
$servername = "localhost";
$username = "root";
$password = "";
$database = "db_crud"; // ganti sesuai nama database kamu

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Koneksi gagal: " . $conn->connect_error]);
    exit;
}

// Baca input JSON dari frontend
$input = json_decode(file_get_contents("php://input"), true);
$action = $input["action"] ?? "";

// CRUD logic
switch ($action) {
    case "get":
        $result = $conn->query("SELECT * FROM fakeapi ORDER BY id_data DESC");
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["success" => true, "data" => $data]);
        break;

    case "create":
        $email = $conn->real_escape_string($input["email"] ?? "");
        $username = $conn->real_escape_string($input["username"] ?? "");
        $password = $conn->real_escape_string($input["password"] ?? "");

        if (empty($email) || empty($username) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Data belum lengkap"]);
            break;
        }

        $sql = "INSERT INTO fakeapi (email, username, password) VALUES ('$email', '$username', '$password')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "User berhasil ditambahkan"]);
        } else {
            echo json_encode(["success" => false, "message" => "Gagal menambah user: " . $conn->error]);
        }
        break;

    case "update":
        $id = intval($input["id_data"] ?? 0);
        $email = $conn->real_escape_string($input["email"] ?? "");
        $username = $conn->real_escape_string($input["username"] ?? "");
        $password = $conn->real_escape_string($input["password"] ?? "");

        if ($id <= 0) {
            echo json_encode(["success" => false, "message" => "ID tidak valid"]);
            break;
        }

        $sql = "UPDATE fakeapi SET email='$email', username='$username', password='$password' WHERE id_data=$id";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "User berhasil diupdate"]);
        } else {
            echo json_encode(["success" => false, "message" => "Gagal mengupdate user: " . $conn->error]);
        }
        break;

    case "delete":
        $id = intval($input["id_data"] ?? 0);
        if ($id <= 0) {
            echo json_encode(["success" => false, "message" => "ID tidak valid"]);
            break;
        }

        $sql = "DELETE FROM fakeapi WHERE id_data=$id";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "User berhasil dihapus"]);
        } else {
            echo json_encode(["success" => false, "message" => "Gagal menghapus user: " . $conn->error]);
        }
        break;

    // 🟢 LOGIN USER
    case "login":
        $username = $conn->real_escape_string($input["username"] ?? "");
        $password = $conn->real_escape_string($input["password"] ?? "");

        $sql = "SELECT * FROM fakeapi WHERE username='$username' AND password='$password'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Buat token random (32 karakter)
            $token = bin2hex(random_bytes(16));
            echo json_encode([
                "success" => true,
                "message" => "Login berhasil",
                "token" => $token
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Username atau password salah"
            ]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Action tidak valid"]);
        break;
}

$conn->close();
?>
