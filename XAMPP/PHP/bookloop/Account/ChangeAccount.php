<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    // Conectar ao banco de dados
    $servername = "localhost";
    $username = "root";
    $password = ""; // Insira sua senha do MySQL aqui
    $dbname = "bookloop"; // Insira o nome do seu banco de dados aqui

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica a conexão com o banco de dados
    if ($conn->connect_error) {
        die("Falha na conexão com o banco de dados: " . $conn->connect_error);
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // EMAIL
        if (isset($data["email"]) && strlen($data["email"]) >= 1) {
            // Verificar se o email já existe
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND id != ?");
            $stmt->bind_param('ss', $data["email"], $data["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                echo json_encode(array("success" => false, "message" => "Email já está em uso"));
                exit();
            }
            // Atualizar o email do usuário
            $stmt = $conn->prepare("UPDATE users SET email = ? WHERE id = ? AND token = ?");
            $stmt->bind_param('sss', $data["email"], $data["id"], $data["token"]);
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Email atualizado com sucesso"));
            } else {
                echo json_encode(array("error" => false, "message" => "Erro ao atualizar o email"));
            }
        }

        // Senha
        if (isset($data["password"]) && strlen($data["password"]) >= 1) {
            // Atualizar a senha do usuário
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ? AND token = ?");
            $stmt->bind_param('sss', $data["password"], $data["id"], $data["token"]);
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Senha atualizado com sucesso"));
            } else {
                echo json_encode(array("error" => false, "message" => "Erro ao atualizar a Senha"));
            }
        }

        // Foto de perfil
        if (isset($data["photo"]) && strlen($data["photo"]) >= 1) {
            // Atualizar a foto do usuário
            $stmt = $conn->prepare("UPDATE users SET photo = ? WHERE id = ? AND token = ?");
            $stmt->bind_param('sss', $data["photo"], $data["id"], $data["token"]);
            $stmt->execute();
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Foto atualizado com sucesso"));
            } else {
                echo json_encode(array("error" => false, "message" => "Erro ao atualizar a foto"));
            }
        }

        // Nome de usuario
        if (isset($data["username"]) && strlen($data["username"]) >= 1) {
            // Verificar se o nome de usuário já existe
            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND id != ?");
            $stmt->bind_param('ss', $data["username"], $data["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                echo json_encode(array("success" => false, "message" => "Nome de usuário já está em uso"));
                exit();
            }
            // Atualizar o nome de usuário
            $stmt = $conn->prepare("UPDATE users SET username = ? WHERE id = ? AND token = ?");
            $stmt->bind_param('sss', $data["username"], $data["id"], $data["token"]);
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Nome de usuário atualizado com sucesso"));
            } else {
                echo json_encode(array("error" => false, "message" => "Erro ao atualizar o nome de usuário"));
            }
        }

        // Numero de telefone
        if (isset($data["phone_number"]) && strlen($data["phone_number"]) >= 1) {
            // Verificar se o número de telefone já existe
            $stmt = $conn->prepare("SELECT * FROM users WHERE phone_number = ? AND id != ?");
            $stmt->bind_param('ss', $data["phone_number"], $data["id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                echo json_encode(array("success" => false, "message" => "Número de telefone já vinculado a outra conta"));
                exit();
            }
            // Atualizar o número de telefone do usuário
            $stmt = $conn->prepare("UPDATE users SET phone_number = ? WHERE id = ? AND token = ?");
            $stmt->bind_param('sss', $data["phone_number"], $data["id"], $data["token"]);
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Número de telefone atualizado com sucesso"));
            } else {
                echo json_encode(array("error" => false, "message" => "Erro ao atualizar o número de telefone"));
            }
        }
    }

    // Fecha a conexão com o banco de dados
    $conn->close();
?>
