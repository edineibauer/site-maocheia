<?php

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$data['data'] = 1;

if (!empty($_SESSION['userlogin']['setorData']) && !empty($_SESSION['userlogin']['setorData']['moedas']) && is_numeric($_SESSION['userlogin']['setorData']['moedas']) && $_SESSION['userlogin']['setorData']['moedas'] > 1) {
    $up = new \Conn\Update();

    /**
     * Desconta moeda
     */
    $up->exeUpdate("clientes", ["moedas" => ($_SESSION['userlogin']['setorData']['moedas'] - 1)], "WHERE id = :id", "id={$_SESSION['userlogin']['setorData']['id']}");

    /**
     * Muda status para aceito
     */
    $up->exeUpdate("messages_user", ["aceito" => 1], "WHERE ownerpub = :me AND usuario = :u", "me={$_SESSION['userlogin']['id']}&u={$id}");

} else {
    $data = [
        "response" => 3,
        "data" => HOME . "comprar_moedas",
        "error" => ""
    ];
}