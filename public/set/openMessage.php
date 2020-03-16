<?php

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

$read = new \Conn\Read();
$read->exeRead("mensagens", "WHERE id = :id", "id={$id}");
if ($read->getResult()) {
    $mensagem = $read->getResult()[0];

    if ($mensagem['aceitou'] == 1) {
        $data = [
            "response" => 2,
            "data" => "",
            "error" => "Já esta liberado, recarregue a página"
        ];
    } else {

        if ($mensagem['profissional'] == $_SESSION['userlogin']['setorData']['id']) {

            $read->exeRead("profissional", "WHERE id = :pid && ativo = 1", "pid={$_SESSION['userlogin']['setorData']['id']}");
            if ($read->getResult()) {
                $prof = $read->getResult()[0];
                if (!empty($prof['moedas']) && is_numeric($prof['moedas']) && $prof['moedas'] > 1) {
                    $up = new \Conn\Update();
                    $up->exeUpdate("profissional", ["moedas" => ($prof['moedas'] - 1)], "WHERE id = :id", "id={$_SESSION['userlogin']['setorData']['id']}");
                    $up->exeUpdate("mensagens", ["aceitou" => 1], "WHERE id = :id", "id={$id}");
                    $data['data'] = 1;
                } else {
                    $data = [
                        "response" => 3,
                        "data" => HOME . "comprar_moedas",
                        "error" => ""
                    ];
                }
            } else {
                $data = [
                    "response" => 2,
                    "data" => "",
                    "error" => "Profissional não encontrado, faça login antes"
                ];
            }

        } else {
            $data = [
                "response" => 2,
                "data" => "",
                "error" => "Você só pode solicitar liberação de conversas do seu perfil"
            ];
        }
    }

} else {
    $data = [
        "response" => 2,
        "data" => "",
        "error" => "Id de mensagem não encontrado"
    ];
}