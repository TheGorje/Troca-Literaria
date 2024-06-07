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

    if (isset($_GET['user_id']) && isset($_GET['num_items'])) {
        // Obtém o valor do parâmetro 'user_id' da URL
        $user_id = $_GET['user_id'];
    
        // Obtém o número de itens a serem retornados
        $num_items = intval($_GET['num_items']);
    
        // Consulta SQL para buscar os livros associados a este usuário
        $sql = "SELECT * FROM books WHERE user_id = ? AND isActive = 1 ORDER BY RAND() LIMIT ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $user_id, $num_items);
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
            echo "0 resultados";
        }
    } else {
        // Se os parâmetros necessários não forem fornecidos na URL, exibe uma mensagem de erro
        echo "Parâmetros 'user_id' ou 'num_items' não foram fornecidos na URL";
    }


    // Fechar conexão
    $conn->close();
?>
