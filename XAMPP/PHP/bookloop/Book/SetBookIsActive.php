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

    $data = json_decode(file_get_contents('php://input'), true);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtenha o user_id, token, book_id e isActive
        $user_id = $data['user_id'];
        $token = $data['token'];
        $book_id = $data['book_id'];
        $isActive = $data['isActive'];

        // Primeiro, valide o usuário
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND token = ?");
        $stmt->bind_param('ss', $user_id, $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // O usuário é válido, agora atualize o valor de isActive para o livro
            $stmt = $conn->prepare("UPDATE books SET isActive = ? WHERE id = ?");
            $stmt->bind_param('is', $isActive, $book_id);
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Anuncio ativo nova"));
            } else {
                echo json_encode(array("success" => false, "message" => "Erro ao atualizar o valor de isActive"));
            }
        } else {
            echo json_encode(array("erro" => true, "message" => "Usuário inválido"));
        }
    }


    // Fecha a conexão com o banco de dados
    $conn->close();
?>