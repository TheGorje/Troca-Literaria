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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtém o valor do parâmetro 'user_query' da URL
    $user_query = $_GET['user_query'];

    // Consulta para obter usuários que correspondem ao nome de usuário pesquisado
    $stmt = $conn->prepare("SELECT id, photo, username, created_at 
                                FROM users
                                WHERE username LIKE ? ORDER BY created_at DESC");

    $user_query = "%" . $user_query . "%";
    $stmt->bind_param('s', $user_query);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Obtém o valor do parâmetro 'user_query' da URL
        $user_query = $_GET['user_query'];
    
        // Consulta para obter usuários que correspondem ao nome de usuário pesquisado
        $stmt = $conn->prepare("SELECT id, photo, username, created_at 
                                FROM users
                                WHERE username LIKE ? ORDER BY created_at DESC");
    
        $user_query = "%" . $user_query . "%";
        $stmt->bind_param('s', $user_query);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result && $result->num_rows > 0) {
            $users = array();
    
            while ($row = $result->fetch_assoc()) {
                // Para cada usuário, faz uma consulta para obter a quantidade de livros que o usuário possui
                $stmt_books = $conn->prepare("SELECT COUNT(*) as book_count,
                                               COUNT(IF(isActive = 1, 1, NULL)) as active_books,
                                               COUNT(IF(isActive = 0, 1, NULL)) as inactive_books 
                                               FROM books WHERE user_id = ?");
                $stmt_books->bind_param('s', $row['id']);
                $stmt_books->execute();
                $book_result = $stmt_books->get_result();
    
                if ($book_result && $book_result->num_rows > 0) {
                    $book_count = $book_result->fetch_assoc();
                    $row['books'] = array(
                        'total' => $book_count['book_count'],
                        'isActive' => $book_count['active_books'],
                        'isInactive' => $book_count['inactive_books']
                    );
                }
    
                // Consulta para obter a média de score do usuário
                $stmt_score = $conn->prepare("SELECT AVG(score) as avg_score 
                                              FROM user_score 
                                              WHERE user_id = ?");
                $stmt_score->bind_param('s', $row['id']);
                $stmt_score->execute();
                $score_result = $stmt_score->get_result();
    
                if ($score_result && $score_result->num_rows > 0) {
                    $score_data = $score_result->fetch_assoc();
                    $row['average_score'] = floatval($score_data['avg_score']);
                } else {
                    $row['average_score'] = null;
                }
    
                // Consulta para obter os feedbacks mais populares do usuário
                $stmt_feedbacks = $conn->prepare("
                    SELECT f.name, COUNT(uf.feedback_id) AS count 
                    FROM user_feedbacks uf
                    JOIN feedbacks f ON uf.feedback_id = f.id
                    WHERE uf.user_id = ?
                    GROUP BY uf.feedback_id
                    ORDER BY count DESC
                    LIMIT 4
                ");
                $stmt_feedbacks->bind_param('s', $row['id']);
                $stmt_feedbacks->execute();
                $result_feedbacks = $stmt_feedbacks->get_result();
                if ($result_feedbacks && $result_feedbacks->num_rows > 0) {
                    $feedbacks = array();
                    while ($feedback_row = $result_feedbacks->fetch_assoc()) {
                        $feedbacks[] = array(
                            'name' => $feedback_row['name'],
                            'count' => intval($feedback_row['count'])
                        );
                    }
                    $row['feedbacks'] = $feedbacks;
                } else {
                    $row['feedbacks'] = array();
                }
    
                // Consulta para obter o número de trocas completadas do usuário
                $stmt_completed_trades = $conn->prepare("SELECT COUNT(*) AS completed_trades
                                                        FROM trades
                                                        WHERE (advertiser_id = ? OR interested_id = ?)
                                                        AND status = 'completed'");
                $stmt_completed_trades->bind_param('ss', $row['id'], $row['id']);
                $stmt_completed_trades->execute();
                $result_completed_trades = $stmt_completed_trades->get_result();
    
                if ($result_completed_trades && $result_completed_trades->num_rows > 0) {
                    $trade_data = $result_completed_trades->fetch_assoc();
                    $row['completed_trades'] = intval($trade_data['completed_trades']);
                } else {
                    $row['completed_trades'] = 0;
                }
    
                // Consulta para obter o número de trocas pendentes do usuário
                $stmt_pending_trades = $conn->prepare("SELECT COUNT(*) AS pending_trades
                                                      FROM trades
                                                      WHERE (advertiser_id = ? OR interested_id = ?)
                                                      AND status IN ('pending', 'pending_confirmation')");
                $stmt_pending_trades->bind_param('ss', $row['id'], $row['id']);
                $stmt_pending_trades->execute();
                $result_pending_trades = $stmt_pending_trades->get_result();
    
                if ($result_pending_trades && $result_pending_trades->num_rows > 0) {
                    $pending_trade_data = $result_pending_trades->fetch_assoc();
                    $row['pending_trades'] = intval($pending_trade_data['pending_trades']);
                } else {
                    $row['pending_trades'] = 0;
                }
    
                $users[] = $row;
            }
    
            echo json_encode($users);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "Usuários não encontrados"));
        }
    }

}


// Fechar conexão
$conn->close();
