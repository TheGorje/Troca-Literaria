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

        // Obtenha o book_id, user_id, token e outros dados do livro
        $book_id = $data['book_id'];
        $user_id = $data['user_id'];
        $token = $data['token'];
        $imageUrls = json_encode($data['image_urls']); // Convertendo o array em uma string JSON

        // Primeiro, valide o usuário
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND token = ?");
        $stmt->bind_param('ss', $user_id, $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // O usuário é válido, agora atualize o livro
            $stmt = $conn->prepare("UPDATE books SET
            isActive = ?,
            title = ?,
            author = ?,
            year = ?,
            pags = ?,
            type = ?,
            lang = ?,
            book_condition = ?,
            description = ?,
            user_description = ?,
            user_id = ?,
            image_urls = ?
            WHERE id = ?"
            );
            $stmt->bind_param('sssssssssssss',
            $data["isActive"],
            $data["title"],
            $data["author"],
            $data["year"],
            $data["pags"],
            $data["type"],
            $data["lang"],
            $data["book_condition"],
            $data["description"],
            $data["user_description"],
            $data["user_id"],
            $imageUrls,
            $book_id);

            if ($stmt->execute()) {

                // Remova todos os gêneros associados ao livro
                $stmt = $conn->prepare("DELETE FROM book_genres WHERE book_id = ?");
                $stmt->bind_param('s', $book_id);
                $stmt->execute();

                // Insira os novos gêneros associados ao livro
                $stmt = $conn->prepare("INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)");
                $stmt->bind_param('ss', $book_id, $genre_id);
                foreach ($data['genres'] as $genre_id) {
                    if (!$stmt->execute()) {
                        echo "Erro ao associar os gêneros ao livro: " . $stmt->error;
                        exit;
                    }
                }
                http_response_code(200);
                echo json_encode(array("success" => true, "book_id" => $book_id));
            }
            else {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Erro ao associar os gêneros ao livro: " . $stmt->error));
            }
        } else {
            echo "Usuário inválido";
        }
    }

    // Fecha a conexão com o banco de dados
    $conn->close();
?>