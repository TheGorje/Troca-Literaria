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

    // Endpoint para criar o livro
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtém os dados do livro do corpo da requisição
        $imageUrls = json_encode($data['image_urls']); // Convertendo o array em uma string JSON

        // Prepara a consulta SQL para inserir o livro na tabela books
        $stmt = $conn->prepare("INSERT INTO books (isActive, title, author, year, pags, type, lang, book_condition, description, user_description, user_id, image_urls, created_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param('ssssssssssss', $data["isActive"], $data["title"], $data["author"], $data["year"], $data["pags"], $data["type"], $data["lang"], $data["book_condition"], $data["description"], $data["user_description"], $data["user_id"], $imageUrls);

        // Executa a consulta
        if ($stmt->execute()) {
            $book_id = $stmt->insert_id; // Obtém o ID do livro recém-criado

            // Prepara a consulta SQL para inserir os gêneros associados ao livro na tabela book_genres
            $stmt = $conn->prepare("INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)");
            $stmt->bind_param('ss', $book_id, $genre_id);

            // Insere os gêneros associados ao livro na tabela book_genres
            foreach ($data['genres'] as $genre_id) {
                if (!$stmt->execute()) {
                    echo "Erro ao associar os gêneros ao livro: " . $stmt->error;
                    exit;
                }
            }

            http_response_code(201);
            echo json_encode(array("success" => true, "book_id" => $book_id));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Erro ao criar o livro: " . $stmt->error));
        }
    }

    // Fecha a conexão com o banco de dados
    $conn->close();
?>