<?php
    // Conectar ao banco de dados e verificar a conexão (código omitido por brevidade)
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
    date_default_timezone_set('America/Sao_Paulo'); // sincroniza os horarios

    if ($_SERVER['REQUEST_METHOD'] === 'POST' and ($data["code"]) and ($data["email"])) {
        // Recuperar o token e a data de expiração do usuário
        $stmt = $conn->prepare("SELECT forgot_token, forgot_expire FROM users WHERE email = ?");
        $stmt->bind_param('s', $data["email"]); // bind_param evita injeção de codigo malicioso 0-0
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Verificar se o token corresponde e se não expirou
        if ($data["code"] == $user["forgot_token"] && strtotime($user["forgot_expire"]) > time()) {
            echo json_encode(array("success" => true, "message" => "Token confirmado"));
        }
        else if (strtotime($user["forgot_expire"]) <= time()) {
            http_response_code(401); // HTTP 401 (Não Autorizado)
            echo "Token expirado";
        }
        else {
            echo json_encode(array("success" => false, "message" => "Token inválido"));
        }
    }
    // Fecha a conexão com o banco de dados
    $conn->close();
?>