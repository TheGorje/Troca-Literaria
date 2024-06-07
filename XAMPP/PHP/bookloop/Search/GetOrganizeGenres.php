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

    // Obtenza os parâmetros de pesquisa da solicitação
    $params = $_GET;

    $query = "SELECT * FROM books WHERE isActive = 1";

    if (!empty($params['query'])) {
        $query .= " AND books.title LIKE '%" . $params['query'] . "%'";
    }
    if (!empty($params['author'])) {
        $query .= " AND books.author LIKE '%" . $params['author'] . "%'";
    }

    if (!empty($params['type'])) {
        $type = $conn->real_escape_string($params['type']);
        $query .= " AND books.type = '$type'";
    }

    if (!empty($params['book_condition'])) {
        $book_condition = $conn->real_escape_string($params['book_condition']);
        $query .= " AND books.book_condition = '$book_condition'";
    }

    if (!empty($params['lang'])) {
        $lang = $conn->real_escape_string($params['lang']);
        $query .= " AND books.lang = '$lang'";
    }

    if (!empty($params['min_pags'])) {
        $query .= " AND books.pags >= " . intval($params['min_pags']);
    }
    if (!empty($params['max_pags'])) {
        $query .= " AND books.pags <= " . intval($params['max_pags']);
    }

    if (!empty($params['year'])) {
        $query .= " AND books.year = " . intval($params['year']);
    }

    if (!empty($params['genres'])) {
        $genreIds = implode(',', $params['genres']);
        $genreQuery = "SELECT book_id FROM book_genres WHERE genre_id IN ($genreIds)";
        $genreResult = $conn->query($genreQuery);
        
        if ($genreResult && $genreResult->num_rows > 0) {
            $bookIds = array();
            while ($row = $genreResult->fetch_assoc()) {
                $bookIds[] = $row['book_id'];
            }

            $bookIds = implode(',', $bookIds);
            $query .= " AND books.id IN ($bookIds)";
        }
        else {
            // Se nenhum dos gêneros especificados existir, retorne nenhum livro
            $query .= " AND 1=0";
        }
    }

    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $books = array();
        $allGenres = array(); // Array para armazenar todos os gêneros

        while ($row = $result->fetch_assoc()) {
            // Cria um novo objeto para o livro
            $book = array();

            // Adiciona os campos do livro ao objeto
            $book['id'] = $row['id'];
            $book['isActive'] = $row['isActive'];
            $book['title'] = $row['title'];
            $book['author'] = $row['author'];
            $book['year'] = $row['year'];
            $book['pags'] = $row['pags'];
            $book['type'] = $row['type'];
            $book['lang'] = $row['lang'];
            $book['book_condition'] = $row['book_condition'];
            $book['description'] = $row['description'];
            $book['user_description'] = $row['user_description'];
            $book['user_id'] = $row['user_id'];
            $book['image_urls'] = $row['image_urls'];
            $book['created_at'] = $row['created_at'];

            // Adiciona o objeto do livro à lista de livros
            $books[] = $book;
            // Agora, faça uma consulta separada para buscar os gêneros deste livro
            $bookId = $row['id'];
            $genreQuery = "SELECT genre_id FROM book_genres WHERE book_id = $bookId";
            $genreResult = $conn->query($genreQuery);

            if ($genreResult && $genreResult->num_rows > 0) {
                while ($row = $genreResult->fetch_assoc()) {
                    $genreId = $row['genre_id'];
                    // Se este gênero ainda não foi adicionado ao array allGenres, adicione-o
                    if (!in_array($genreId, $allGenres)) {
                        $allGenres[] = $genreId;
                    }
                }
            }
        }
        echo json_encode($allGenres);
    } else {
        echo json_encode(404);
    }

    // Fechar conexão
    $conn->close();
?>
