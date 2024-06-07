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

    // Verificar a conexão
    if ($conn->connect_error) {
        die("Falha na conexão com o banco de dados: " . $conn->connect_error);
    }

    if (isset($_GET['num_items']) && isset($_GET['book_id'])) {
        $num_items = intval($_GET['num_items']);
        $book_id = intval($_GET['book_id']);
    
        // Consulta para obter os gêneros do livro de referência
        $sql_genres = "SELECT genre_id FROM book_genres WHERE book_id = ?";
        $stmt_genres = $conn->prepare($sql_genres);
        $stmt_genres->bind_param("s", $book_id);
        $stmt_genres->execute();
        $result_genres = $stmt_genres->get_result();
    
        $genres = array();
        while ($row_genre = $result_genres->fetch_assoc()) {
            $genres[] = $row_genre['genre_id'];
        }
    
        // Consulta para encontrar outros livros com gêneros semelhantes
        $sql_similar_books = "SELECT b.* FROM books b
                              INNER JOIN book_genres bg ON b.id = bg.book_id
                              WHERE bg.genre_id IN (" . implode(",", $genres) . ")
                              AND b.id != ?
                              GROUP BY b.id
                              ORDER BY COUNT(DISTINCT bg.genre_id) DESC
                              LIMIT ?";
        $stmt_similar_books = $conn->prepare($sql_similar_books);
        $stmt_similar_books->bind_param("ii", $book_id, $num_items);
        $stmt_similar_books->execute();
        $result_similar_books = $stmt_similar_books->get_result();
    
        // Retornar os dados como JSON
        $similar_books = array();
        while ($row_similar_book = $result_similar_books->fetch_assoc()) {
            $similar_books[] = $row_similar_book;
        }
        echo json_encode($similar_books);
    } else {
        // echo http_response_code(404);
        echo null;
    }


    // Fechar conexão
    $conn->close();
?>
