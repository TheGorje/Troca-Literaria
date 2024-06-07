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

    if (isset($_GET['random']) && isset($_GET['num_items'])) {
        // Obtém o valor do parâmetro 'random' da URL
        $random = intval($_GET['random']); // Converte para um número inteiro
    
        // Obtém o número de itens a serem retornados
        $num_items = intval($_GET['num_items']);
    
        // Consulta SQL para buscar gêneros aleatórios
        $sql = "SELECT DISTINCT genre_id FROM book_genres ORDER BY RAND() LIMIT ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $random);
        $stmt->execute();
        $result = $stmt->get_result();
    
        // Verifica se há resultados e retornar os dados como JSON
        if ($result->num_rows > 0) {
            $genres = array();
            while ($row = $result->fetch_assoc()) {
                // Obtém o ID do gênero
                $genre_id = $row['genre_id'];

                // Consulta SQL para buscar os detalhes dos itens associados a este gênero
                $items_sql = "SELECT * FROM books WHERE id IN 
                            (SELECT book_id FROM book_genres WHERE genre_id = ?)
                            AND isActive = 1
                            ORDER BY RAND() LIMIT ?";
                $items_stmt = $conn->prepare($items_sql);
                $items_stmt->bind_param("ii", $genre_id, $num_items);
                $items_stmt->execute();
                $items_result = $items_stmt->get_result();

            // Verifica se há resultados
            if ($items_result->num_rows > 0) {
                $items = array();
                while ($item_row = $items_result->fetch_assoc()) {
                    // Obtém o ID do usuário
                    $user_id = $item_row['user_id'];

                    // Prepara a consulta SQL para buscar os detalhes do usuário
                    $user_sql = "SELECT photo, username FROM users WHERE id = ?";
                    $user_stmt = $conn->prepare($user_sql);
                    $user_stmt->bind_param("i", $user_id);
                    $user_stmt->execute();
                    $user_result = $user_stmt->get_result();

                    // Verifica se há resultados
                    if ($user_result->num_rows > 0) {
                        $user_row = $user_result->fetch_assoc();

                        // Adiciona os detalhes do usuário ao item
                        $item_row['user'] = $user_row;
                    }

                    // Adiciona os detalhes do item ao array de itens
                    $items[] = $item_row;
                }

                // Adiciona os detalhes do gênero e dos itens ao array de gêneros
                $genre_details = array(
                    'genre_id' => $genre_id,
                    'items' => $items
                );
                $genres[] = $genre_details;
            }
        }
        echo json_encode($genres);
    } else {
        echo "0 resultados";
    }
} else {
    // Se os parâmetros necessários não forem fornecidos na URL, exibe uma mensagem de erro
    echo "Parâmetros 'random' ou 'num_items' não foram fornecidos na URL";
}
    

    // Fechar conexão
    $conn->close();
?>
