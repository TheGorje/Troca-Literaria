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

    // Verifica a conexão com o banco de dados
    if ($conn->connect_error) {
        die("Falha na conexão com o banco de dados: " . $conn->connect_error);
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // Endpoint para alterar o status de uma troca
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtém os dados da troca do corpo da requisição
        $trade_id = $data['trade_id'];
        $new_status = $data['new_status'];

        // Prepara a consulta SQL para atualizar o status da troca na tabela trades
        $stmt = $conn->prepare("UPDATE trades SET status = ? WHERE id = ?");
        $stmt->bind_param('ss', $new_status, $trade_id);

        // Executa a consulta
        if ($stmt->execute()) {
            echo "Status da troca atualizado com sucesso.";

            // Verifica se o novo status é 'completed'
            if ($new_status === 'completed') {
                // Consulta para obter o book_id da tabela trade
                $stmt_book_id = $conn->prepare("SELECT book_id FROM trades WHERE id = ?");
                $stmt_book_id->bind_param('s', $trade_id);
                $stmt_book_id->execute();
                $result_book_id = $stmt_book_id->get_result();

                if ($result_book_id && $result_book_id->num_rows > 0) {
                    $book_id_data = $result_book_id->fetch_assoc();
                    $book_id = $book_id_data['book_id'];

                    // Prepara a consulta SQL para atualizar o campo isActive na tabela books
                    $stmt_update_book = $conn->prepare("UPDATE books SET isActive = 0 WHERE id = ?");
                    $stmt_update_book->bind_param('s', $book_id);

                    // Executa a consulta
                    if ($stmt_update_book->execute()) {
                        echo "Livro marcado como inativo com sucesso.";
                    } else {
                        echo "Erro ao marcar o livro como inativo: " . $stmt_update_book->error;
                    }
                } else {
                    echo "Erro ao obter o book_id: " . $stmt_book_id->error;
                }
            }
        } else {
            echo "Erro ao atualizar o status da troca: " . $stmt->error;
        }
    }

    // Fecha a conexão com o banco de dados
    $conn->close();
?>