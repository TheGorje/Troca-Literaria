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

    // Obtém os dados do login do corpo da requisição
    $data = json_decode(file_get_contents('php://input'), true);

    // Endpoint para criar o livro
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($data["email"]) && strlen($data["email"]) >= 1 && isset($data["password"]) && strlen($data["password"]) >= 1) {
            $email = $conn->real_escape_string($data["email"]);
            $password = $conn->real_escape_string($data["password"]);
    
            // Consulta SQL para verificar as credenciais do usuário
            $sql = "SELECT id, username, token, photo FROM users WHERE email = '$email' AND password = '$password'";
            $result = $conn->query($sql);

            $checkEmail= "SELECT username FROM users WHERE email = '$email'";
            $result_Email = $conn->query($checkEmail);

            if ($result_Email->num_rows <= 0) {
                http_response_code(404);
                echo json_encode(array("error" => "Email não encontrado"));
            } 
            elseif ( $result->num_rows <= 0 ) {
                http_response_code(405);
                echo json_encode(array("error" => "Senha incorreta"));
            }
            elseif ( $result->num_rows >= 1 ) {
                // Se as credenciais estiverem corretas, retorna os dados do usuário como uma resposta JSON
                $userData = $result->fetch_assoc();
                header('Content-Type: application/json');
                echo json_encode($userData);
            }
        } else {
            // Retorna um erro caso os campos de email e senha não estejam definidos
            http_response_code(400);
            echo json_encode(array("error" => "Campos de email e senha são obrigatórios"));
        }
    }
    // Fecha a conexão com o banco de dados
    $conn->close();
?>
