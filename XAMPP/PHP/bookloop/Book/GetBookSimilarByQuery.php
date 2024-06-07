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

    if (isset($_GET['title']) && isset($_GET['num_items']) && isset($_GET['book_id'])) {
        // Obtém o valor do parâmetro 'title' da URL
        $title = $_GET['title'];
    
        $num_items = intval($_GET['num_items']);

        $book_id = intval($_GET['book_id']);

        // Consulta SQL para buscar livros com títulos parecidos
        $sql = "SELECT * FROM books 
        WHERE isActive = 1 
        AND id != ? 
        AND title LIKE ? LIMIT ?";
        $stmt = $conn->prepare($sql);
        $title = "%" . $title . "%";
        $stmt->bind_param("sss", $book_id, $title, $num_items);
        $stmt->execute();
        $result = $stmt->get_result();
    
        // Verifica se há resultados e retorna os dados como JSON
        if ($result->num_rows > 0) {
            $books = array();
            while ($row = $result->fetch_assoc()) {
                $books[] = $row;
            }
            echo json_encode($books);
        } else {
            echo json_encode(array());
        }
    } else {
        // http_response_code(404);
        // Se o parâmetro necessário não for fornecido na URL, exibe uma mensagem de erro
        echo null;
    }


    // Fechar conexão
    $conn->close();
?>
