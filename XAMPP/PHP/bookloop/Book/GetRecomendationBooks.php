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

    if (isset($_GET['num_items'])) {
        // Obtém o número de itens a serem retornados
        $num_items = intval($_GET['num_items']);

        // Consulta SQL para calcular a média dos scores de cada usuário
        $sql = "SELECT us.user_id, AVG(us.score) as avg_score
            FROM user_score us
            GROUP BY us.user_id
            ORDER BY avg_score DESC
            LIMIT ?"; // Pega os 10 usuários com maiores médias de score (ajustável conforme a necessidade)
    
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $num_items);
        $stmt->execute();
        $result = $stmt->get_result();
    
        // Verifica se há resultados
        if ($result->num_rows > 0) {
            $user_ids = array();
            while ($row = $result->fetch_assoc()) {
                $user_ids[] = $row['user_id'];
            }
            
            // Prepara uma consulta SQL para buscar livros aleatórios dos usuários com as melhores médias
            $placeholders = implode(',', array_fill(0, count($user_ids), '?'));
            $sql_books = "SELECT * FROM books WHERE isActive = 1 AND user_id IN ($placeholders) ORDER BY RAND() LIMIT ?";
            $stmt_books = $conn->prepare($sql_books);
    
            // Liga os parâmetros do user_id
            $types = str_repeat('i', count($user_ids)) . 'i';
            $params = array_merge($user_ids, array($num_items));
            $stmt_books->bind_param($types, ...$params);
            $stmt_books->execute();
            $result_books = $stmt_books->get_result();
    
            // Verifica se há resultados e retorna os dados como JSON
            if ($result_books->num_rows > 0) {
                $books = array();
                while ($row = $result_books->fetch_assoc()) {
                    $books[] = $row;
                }
                echo json_encode($books);
            } else {
                echo json_encode(array());
            }
        } else {
            echo json_encode(array());
        }
    } else {
        // Se os parâmetros necessários não forem fornecidos na URL, exibe uma mensagem de erro
        echo json_encode(array("error" => "Parâmetro 'num_items' não foi fornecido"));
    }


    // Fechar conexão
    $conn->close();
?>
