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

    // Verifica se o parâmetro 'book_id' foi passado na URL
    if (isset($_GET['book_id'])) {
        // Obtém o valor do parâmetro 'book_id' da URL
        $book_id = $_GET['book_id'];
    
        // Consulta SQL para buscar os detalhes do livro pelo ID
        $sql = "SELECT books.*, GROUP_CONCAT(genres.id) as genres
                FROM books
                LEFT JOIN book_genres ON books.id = book_genres.book_id
                LEFT JOIN genres ON book_genres.genre_id = genres.id
                WHERE books.id = ?
                GROUP BY books.id";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $book_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $book = $result->fetch_assoc();

        // Converte a string de gêneros em um array
        $book['genres'] = explode(',', $book['genres']);

        // Converte as strings do array para inteiros
        $book['genres'] = array_map('intval', $book['genres']);


        // Retorna os detalhes do livro como JSON
        echo json_encode($book);
    } else {
        // Se o parâmetro 'book_id' não for fornecido na URL, exibe uma mensagem de erro
        echo "Parâmetro 'book_id' não foi fornecido na URL";
    }
    
    // Fechar conexão
    $conn->close();
    ?>
    
