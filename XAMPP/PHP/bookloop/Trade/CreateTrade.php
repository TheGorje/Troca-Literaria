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

    // Endpoint para criar a troca
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtém os dados da troca do corpo da requisição
        $advertiser_id = intval($data['advertiser_id']);
        $interested_id = intval($data['interested_id']);
        $book_id = intval($data['book_id']);

        // Verifica se já existe uma troca pendente ou em confirmação
        $stmt = $conn->prepare("SELECT * FROM trades 
        WHERE advertiser_id = ?
        AND interested_id = ?
        AND book_id = ? 
        AND (status = 'pending' OR status = 'pending_confirmation')");

        $stmt->bind_param('sss', $advertiser_id, $interested_id, $book_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo "Já existe uma troca pendente ou em confirmação.";
            exit;
        }

        // Prepara a consulta SQL para inserir a troca na tabela trades
        $stmt = $conn->prepare("INSERT INTO trades (book_id, advertiser_id, interested_id, status, created_at)
                            VALUES (?, ?, ?, 'pending', NOW())");
        $stmt->bind_param('sss', $book_id, $advertiser_id, $interested_id);

        // Executa a consulta
        if ($stmt->execute()) {
            echo "Troca criada com sucesso.";
        } else {
            echo "Erro ao criar a troca: " . $stmt->error;
            echo http_response_code(404);
        }
    }

    // Fecha a conexão com o banco de dados
    $conn->close();
?>