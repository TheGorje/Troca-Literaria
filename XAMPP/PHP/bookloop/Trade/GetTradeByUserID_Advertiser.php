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

    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['advertiser_id'])) {
        // Obtém o valor do parâmetro 'advertiser_id' da solicitação POST
        $advertiser_id = intval($data['advertiser_id']);

        // Consulta SQL para buscar os detalhes da troca pelo ID do anunciante
        $sql = "SELECT * FROM trades WHERE advertiser_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $advertiser_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Array para armazenar todas as trocas
        $trades = array();

        // Percorre todas as linhas do conjunto de resultados
        while ($trade = $result->fetch_assoc()) {
            // Consulta SQL para buscar os detalhes do livro pelo ID
            $sql = "SELECT title, image_urls, id FROM books WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $trade['book_id']);
            $stmt->execute();
            $resultBook = $stmt->get_result();
            $book = $resultBook->fetch_assoc();

            // Consulta SQL para buscar os detalhes do usuario pelo ID
            $sql = "SELECT id, photo, username, phone_number FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $trade['interested_id']);
            $stmt->execute();
            $resultUser = $stmt->get_result();
            $user = $resultUser->fetch_assoc();

            // Adiciona o objeto 'book' e 'interested' ao objeto 'trade'
            $trade['book'] = $book;
            $trade['otherUser'] = $user;

            // Adiciona a troca ao array de trocas
            $trades[] = $trade;
        }

        // Retorna os detalhes de todas as trocas como JSON
        echo json_encode($trades);
    } else {
        // Se o parâmetro 'book_id' não for fornecido na solicitação POST, exibe uma mensagem de erro
        echo "Parâmetro 'book_id' não foi fornecido na solicitação";
    }

    // Fechar conexão
    $conn->close();
    ?>
