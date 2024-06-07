<?php
    // Conectar ao banco de dados e verificar a conexão (código omitido por brevidade)
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
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
    $token = bin2hex(random_bytes(16)); // Gera um token de 32 caracteres

    // Endpoint para criar o livro
    if ($_SERVER['REQUEST_METHOD'] === 'POST' and ($data["email"] and $data["password"]) ) {
        // Verifica se o usuario já existe na tabela users
        $checkUsername= "SELECT username FROM users WHERE username = '{$data["username"]}'";
        $result_Username = $conn->query($checkUsername);

        // Verifica se o email já existe na tabela users
        $checkEmail = "SELECT email FROM users WHERE email = '{$data["email"]}'";
        $result_Email = $conn->query($checkEmail);

        // Verifica se o número já existe na tabela users
        $checkphone_number= "SELECT phone_number FROM users WHERE phone_number = '{$data["phone_number"]}'";
        $result_phone_number = $conn->query($checkphone_number);

        if ($result_Username->num_rows >= 1) {
            http_response_code(409);
            echo "Erro: Usuario já cadastrado.";
        }
        elseif ($result_Email->num_rows >= 1) {
            http_response_code(410);
            echo "Erro: Email já cadastrado.";
        }
        elseif ($result_phone_number->num_rows >= 1) {
            http_response_code(411);
            echo "Erro: Telefone já cadastrado.";
        }
        else { // cria o usuario
            // Insere o usuario na tabela users
            $sql = "INSERT INTO users
            (token, email, username, password, phone_number)
            VALUES
            ('{$token}', '{$data["email"]}', '{$data["username"]}', '{$data["password"]}', '{$data["phone_number"]}')";

            if ($conn->query($sql) === TRUE) {
                // Obtém o ID do usuário recém-criado
                $userId = $conn->insert_id;

                // Consulta SQL para buscar os detalhes do usuário pelo ID
                $sql = "SELECT id, token, username, photo FROM users WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $userId);
                $stmt->execute();
                $result = $stmt->get_result();
                $userData = $result->fetch_assoc();

                // Retorna os detalhes do usuário como JSON
                echo json_encode($userData);
            } else {
                echo "Erro ao criar cadastro: " . $conn->error;
            }

        }
    }
    // Fecha a conexão com o banco de dados
    $conn->close();
    ?>