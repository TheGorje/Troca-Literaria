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
        // Obtenha o user_id e o token
        $user_id = $data['user_id'];
        $token = $data['token'];
    
        // Primeiro, obtenha todos os IDs de livros do usuário
        $stmt = $conn->prepare("SELECT id FROM books WHERE user_id = ?");
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $book_ids = $result->fetch_all(MYSQLI_ASSOC);
    
        // Para cada livro, delete os gêneros associados, as trocas e o livro
        foreach ($book_ids as $book_id) {
            $stmt = $conn->prepare("DELETE FROM book_genres WHERE book_id = ?");
            $stmt->bind_param('s', $book_id['id']);
            $stmt->execute();
    
            $stmt = $conn->prepare("DELETE FROM trades WHERE book_id = ?");
            $stmt->bind_param('s', $book_id['id']);
            $stmt->execute();
    
            $stmt = $conn->prepare("DELETE FROM books WHERE id = ?");
            $stmt->bind_param('s', $book_id['id']);
            $stmt->execute();
        }
    
        // Delete os scores e feedbacks do usuário
        $stmt = $conn->prepare("DELETE FROM user_score WHERE user_id = ?");
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
    
        $stmt = $conn->prepare("DELETE FROM user_feedbacks WHERE user_id = ?");
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
    
        // Finalmente, delete o usuário
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND token = ?");
        $stmt->bind_param('ss', $user_id, $token);
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Usuário e livros deletados com sucesso"));
        } else {
            echo json_encode(array("error" => true, "message" => "Erro ao deletar o usuário e os livros"));
        }
    }
    // Fecha a conexão com o banco de dados
    $conn->close();
?>
