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

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && strlen($data["email"]) >= 1) {
        // Gerar um token de 32 caracteres
        $token = bin2hex(random_bytes(16));

        // Calcular a data de expiração (1 hora a partir de agora)
        $expire = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Recuperar o nome de usuário
        $stmt = $conn->prepare("SELECT username FROM users WHERE email = ?");
        $stmt->bind_param('s', $data["email"]); // bind_param evita injeção de codigo malicioso 0-0
        $stmt->execute();
        $result = $stmt->get_result();
        $username = $result->fetch_assoc()["username"];

        // Atualizar o usuário com o token e a data de expiração
        $stmt = $conn->prepare("UPDATE users SET forgot_token = ?, forgot_expire = ? WHERE email = ?");
        $stmt->bind_param('sss', $token, $expire, $data["email"]);
        $stmt->execute();

        // Envie um e-mail para o usuário
        $to = $data["email"];
        $subject = "Recuperação de senha";

        $message = "Olá $username,
        Houve uma solicitação para alterar sua senha!

        Se você não fez esta solicitação, ignore este e-mail.

        Caso contrário, use o seguinte código de verificação para prosseguir: $token";
        $headers = "From: trocaliteraria@oficial.com";

        mail($to, $subject, $message, $headers);
    }
    // Fecha a conexão com o banco de dados
    $conn->close();
?>