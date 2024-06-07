<?php
    // Conectar ao banco de dados e verificar a conexão (código omitido por brevidade)
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
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


    if (isset($_GET['user_id'])) {
        // Obtém o valor do parâmetro 'user_id' da URL
        $user_id = $_GET['user_id'];
    
        // Prepara a consulta SQL para buscar os livros do usuário na tabela 'books'
        $stmt = $conn->prepare("SELECT * FROM books WHERE user_id = ? ORDER BY isActive DESC");
        $stmt->bind_param('s', $user_id);
    
        // Executa a consulta
        $stmt->execute();
    
        // Obtém o resultado
        $result = $stmt->get_result();
    
        // Verifica se a consulta foi bem-sucedida
        if ($result && $result->num_rows > 0) {
            // Inicializa um array para armazenar os livros do usuário
            $user_books = array();
    
            // Obtém os livros do usuário
            while ($book = $result->fetch_assoc()) {
                $user_books[] = $book;
            }
    
            // Retorna os livros do usuário como JSON
            echo json_encode($user_books);
        } else {
            // Se a consulta falhar ou não retornar nenhum resultado, exibe uma mensagem de erro
            http_response_code(404);
            echo "Erro: Nenhum livro encontrado para este usuário";
        }
    } else {
        // Se o parâmetro 'user_id' não for fornecido na URL, exibe uma mensagem de erro
        echo "Parâmetro 'user_id' não foi fornecido na URL";
    }

    // Fechar conexão
    $conn->close();
?>
