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

    // Verifica se o parâmetro 'genre' foi passado na URL
    if (isset($_GET['genre'])) {
        // Obtém o valor do parâmetro 'genre' da URL
        $genre_id = $_GET['genre'];

        // Consulta SQL para buscar os IDs dos livros associados ao gênero fornecido
        $sql = "SELECT book_id FROM book_genres WHERE genre_id = '$genre_id'";
        $result = $conn->query($sql);

        // Verifica se a consulta foi bem-sucedida
        if ($result) {
            // Inicializa um array para armazenar os detalhes dos livros
            $genre_books = array();

            // Itera sobre os resultados da consulta
            while ($row = $result->fetch_assoc()) {
                // Obtém o ID do livro
                $book_id = $row['book_id'];

                // Consulta SQL para buscar os detalhes do livro com base no ID
                $book_sql = "SELECT * FROM books WHERE id = '$book_id'";
                $book_result = $conn->query($book_sql);

                // Verifica se a consulta foi bem-sucedida
                if ($book_result && $book_result->num_rows >= 1) {
                    // Obtém os detalhes do livro
                    $book_details = $book_result->fetch_assoc();

                    // Adiciona os detalhes do livro ao array
                    $genre_books[] = $book_details;
                }
            }

            // Retorna os detalhes dos livros associados ao gênero como JSON
            echo json_encode($genre_books);
        } else {
            // Se a consulta falhar, exibe uma mensagem de erro
            echo "Erro ao buscar os livros do gênero $genre_id: " . $conn->error;
        }
    } else {
        // Se o parâmetro 'genre' não for fornecido na URL, exibe uma mensagem de erro
        echo "Parâmetro 'genre' não foi fornecido na URL";
    }
    // Fechar conexão
    $conn->close();
?>
