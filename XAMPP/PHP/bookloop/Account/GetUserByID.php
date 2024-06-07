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

    $data = json_decode(file_get_contents('php://input'), true);

    if ($data["user_id"]) {
        // Obtém o valor do parâmetro 'user_id' da URL
        $user_id = intval($data['user_id']);

        // Verifica se o parâmetro 'isUser' é verdadeiro
        if ($data['isUser'] && $data['isUser'] == 'true') {
            // Verifica se o token é igual ao do usuário pelo ID na tabela de usuários
            $stmt = $conn->prepare("SELECT 
                email, photo, username, phone_number, created_at
                FROM users WHERE id = ? AND token = ?");
            $stmt->bind_param('ss', $user_id, $data['token']);
        } else {
            // Retorna apenas valores específicos
            $stmt = $conn->prepare("SELECT photo, username, phone_number, created_at FROM users WHERE id = ?");
            $stmt->bind_param('s', $user_id);
        }

        // Executa a consulta
        $stmt->execute();

        // Obtém o resultado
        $result = $stmt->get_result();

        // Verifica se a consulta foi bem-sucedida
        if ($result && $result->num_rows > 0) {
            // Inicializa um array para armazenar os detalhes do usuário
            $user_details = $result->fetch_assoc();
    
            // Consulta para obter a média de score do usuário
            $stmt_score = $conn->prepare("SELECT AVG(score) AS average_score FROM user_score WHERE user_id = ?");
            $stmt_score->bind_param('s', $user_id);
            $stmt_score->execute();
            $result_score = $stmt_score->get_result();
            if ($result_score && $result_score->num_rows > 0) {
                $score_data = $result_score->fetch_assoc();
                $user_details['average_score'] = floatval($score_data['average_score']);
            } else {
                $user_details['average_score'] = null;
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
            $stmt_feedbacks->bind_param('s', $user_id);
            $stmt_feedbacks->execute();
            $result_feedbacks = $stmt_feedbacks->get_result();
            if ($result_feedbacks && $result_feedbacks->num_rows > 0) {
                $feedbacks = array();
                while ($row = $result_feedbacks->fetch_assoc()) {
                    $feedbacks[] = array(
                        'name' => $row['name'],
                        'count' => intval($row['count'])
                    );
                }
                $user_details['feedbacks'] = $feedbacks;
            } else {
                $user_details['feedbacks'] = array();
            }

            // Consulta para obter o número de trocas completadas do usuário
            $stmt_completed_trades = $conn->prepare("
                SELECT COUNT(*) AS completed_trades
                FROM trades
                WHERE (advertiser_id = ? OR interested_id = ?)
                AND status = 'completed'
            ");
            $stmt_completed_trades->bind_param('ss', $user_id, $user_id);
            $stmt_completed_trades->execute();
            $result_completed_trades = $stmt_completed_trades->get_result();

            if ($result_completed_trades && $result_completed_trades->num_rows > 0) {
                $trade_data = $result_completed_trades->fetch_assoc();
                $user_details['completed_trades'] = intval($trade_data['completed_trades']);
            } else {
                $user_details['completed_trades'] = 0;
            }

            // Consulta para obter o número de trocas pendentes do usuário
            $stmt_pending_trades = $conn->prepare("
                SELECT COUNT(*) AS pending_trades
                FROM trades
                WHERE (advertiser_id = ? OR interested_id = ?)
                AND status IN ('pending', 'pending_confirmation')
            ");
            $stmt_pending_trades->bind_param('ss', $user_id, $user_id);
            $stmt_pending_trades->execute();
            $result_pending_trades = $stmt_pending_trades->get_result();

            if ($result_pending_trades && $result_pending_trades->num_rows > 0) {
                $pending_trade_data = $result_pending_trades->fetch_assoc();
                $user_details['pending_trades'] = intval($pending_trade_data['pending_trades']);
            } else {
                $user_details['pending_trades'] = 0;
            }

            // Retorna os detalhes do usuário como JSON
            echo json_encode($user_details);
        }
        else {
            // Se a consulta falhar ou não retornar nenhum resultado, exibe uma mensagem de erro
            http_response_code(404);
            echo json_encode(array("error" => "Usuário não encontrado"));
        }
    }


    // Fechar conexão
    $conn->close();
?>
