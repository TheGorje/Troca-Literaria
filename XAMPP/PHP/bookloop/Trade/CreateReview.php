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

    // Endpoint para criar uma avaliação
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($data['user_id']) && isset($data['feedbacks']) && isset($data['score'])) {
            $user_id = intval($data['user_id']);
            $score = intval($data['score']);
            $feedbacks = $data['feedbacks'];

            // Prepara a consulta SQL para inserir os feedbacks
            $stmt = $conn->prepare("INSERT INTO user_feedbacks (user_id, feedback_id) VALUES (?, ?)");
            $stmt->bind_param('ss', $user_id, $feedback_id);

            // Insere os feedbacks associados ao usuário
            foreach ($feedbacks as $feedback_id) {
                $feedback_id = intval($feedback_id);
                if (!$stmt->execute()) {
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Erro ao associar os feedbacks ao usuário: " . $stmt->error));
                    exit;
                }
            }
            if ($score > 0) {
                // Prepara a consulta SQL para inserir o score
                $stmt_score = $conn->prepare("INSERT INTO user_score (user_id, score) VALUES (?, ?)");
                $stmt_score->bind_param('ss', $user_id, $score);

                if ($stmt_score->execute()) {
                    http_response_code(201);
                    echo json_encode(array("success" => true, "user_id" => $user_id));
                } else {
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Erro ao inserir o score: " . $stmt_score->error));
                }
            }

        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Campos user_id, feedbacks e score são obrigatórios"));
        }
    }


    // Fecha a conexão com o banco de dados
    $conn->close();
?>