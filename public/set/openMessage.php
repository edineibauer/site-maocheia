<?php

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

$read = new \Conn\Read();
$read->exeRead("clientes", "WHERE id = :pid && ativo = 1", "pid={$_SESSION['userlogin']['setorData']['id']}");
if ($read->getResult()) {
    $prof = $read->getResult()[0];
    if (!empty($prof['moedas']) && is_numeric($prof['moedas']) && $prof['moedas'] > 1) {
        $up = new \Conn\Update();
        $_SESSION['userlogin']['setorData']['moedas'] = ($prof['moedas'] - 1);

        $up->exeUpdate("clientes", ["moedas" => $_SESSION['userlogin']['setorData']['moedas']], "WHERE id = :id", "id={$_SESSION['userlogin']['setorData']['id']}");
//        $up->exeUpdate("messages_user", ["aceito" => 1], "WHERE usuario = :u", "u={$id}");

        $f = fopen(PATH_HOME . "_cdn/userPerfil/" . $_SESSION['userlogin']['id'] . ".json", "w+");
        fwrite($f, json_encode($_SESSION['userlogin']));
        fclose($f);

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