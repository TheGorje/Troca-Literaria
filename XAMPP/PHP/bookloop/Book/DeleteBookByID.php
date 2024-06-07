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

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data["book_id"]) && isset($data["user_id"]) && isset($data["token"])) {
        // Obtém o valor dos parâmetros 'book_id', 'user_id' e 'token' da solicitação POST
        $book_id = intval( $data["book_id"] );
        $user_id = intval( $data["user_id"] );
        $token = $data["token"];

        // Consulta SQL para verificar se o usuário com o ID e token fornecidos existe
        $sql = "SELECT id FROM users WHERE id = ? AND token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $user_id, $token);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            // Se o usuário é válido, deleta o livro das tabelas 'book_genres', 'trades' e 'books'
            $stmt = $conn->prepare("DELETE FROM book_genres WHERE book_id = ?");
            $stmt->bind_param('s', $book_id);
            $stmt->execute();
    
            $stmt = $conn->prepare("DELETE FROM trades WHERE book_id = ?");
            $stmt->bind_param('s', $book_id);
            $stmt->execute();
    
            $stmt = $conn->prepare("DELETE FROM books WHERE id = ?");
            $stmt->bind_param('s', $book_id);
            $stmt->execute();
    
            echo json_encode(array("success" => true, "message" => "Livro deletado com sucesso!" . json_encode($user)));
        } else {
            // Se o usuário não é válido, retorna uma mensagem de erro
            echo json_encode(array("success" => false, "message" => "Erro: Usuário inválido."));
        }
    }
    else {
        // Se os parâmetros 'book_id', 'user_id' ou 'token' não forem fornecidos na solicitação POST, exibe uma mensagem de erro
        echo "Parâmetros 'book_id', 'user_id' ou 'token' não foram fornecidos na solicitação.";
    }


    // Fecha a conexão com o banco de dados
    $conn->close();
?>
