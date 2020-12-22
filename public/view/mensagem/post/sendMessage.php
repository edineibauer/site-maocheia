<?php

$data['data'] = 1;

$mensagem = trim(filter_input(INPUT_POST, 'mensagem', FILTER_DEFAULT));
$usuario = filter_input(INPUT_POST, 'user', FILTER_VALIDATE_INT);
$isFile = filter_input(INPUT_POST, 'isFile', FILTER_VALIDATE_BOOLEAN);

$read = new \Conn\Read(!0);
$up = new \Conn\Update();

$read->exeRead("messages_user", "WHERE ownerpub = :u AND usuario = :uu", "u={$usuario}&uu={$_SESSION['userlogin']['id']}");
if ($read->getResult() && $read->getResult()[0]['bloqueado'] == 0) {
    $m = $read->getResult()[0];

    /**
     * Obtém as mensagens para adicionar mais essa
     */
    $read->exeRead("messages", "WHERE id = :id", "id={$m['mensagens']}");
    if ($read->getResult()) {
        $allMessages = json_decode($read->getResult()[0]['mensagens'], !0);
        $allMessages[] = [
            "usuario" => $usuario,
            "mensagem" => $mensagem,
            "data" => date("Y-m-d H:i:s"),
            "lido" => 0
        ];
        $up->exeUpdate("messages", ["mensagens" => json_encode($allMessages)], "WHERE id = :id", "id={$m['mensagens']}");
    }

    /**
     * Update new message not readed
     */
    $mensagem = $isFile ? "<i class='material-icons float-left pr-2' style='font-size: 16px;padding: 1px'>description</i>arquivo" : $mensagem;
    $up->exeUpdate("messages_user", ["nao_lidas" => "+1", "recebido" => 1, "data_ultima_mensagem" => date("Y-m-d H:i:s"), "ultima_mensagem" => $mensagem], "WHERE ownerpub = {$usuario} AND usuario = {$_SESSION['userlogin']['id']}");
    $up->exeUpdate("messages_user", ["recebido" => 0, "data_ultima_mensagem" => date("Y-m-d H:i:s"), "ultima_mensagem" => $mensagem], "WHERE ownerpub = {$_SESSION['userlogin']['id']} AND usuario = {$usuario}");

} elseif(!$read->getResult()) {

    /**
     * Create new chat
     */
    $create = new \Conn\Create();
    $create->exeCreate("messages", ["mensagens" => json_encode([[
        "usuario" => $usuario,
        "mensagem" => $mensagem,
        "data" => date("Y-m-d H:i:s"),
        "lido" => 0
    ]])]);

    if($create->getResult()) {
        $id = $create->getResult();
        $create->exeCreate("messages_user", ["ownerpub" => $_SESSION['userlogin']['id'], "usuario" => $usuario, "nao_lidas" => 0, "bloqueado" => 0, "silenciado" => 0, "ultima_mensagem" => $mensagem, "mensagens" => $id, "recebido" => 1, "data_ultima_mensagem" => date("Y-m-d H:i:s")]);
        $create->exeCreate("messages_user", ["ownerpub" => $usuario, "usuario" => $_SESSION['userlogin']['id'], "nao_lidas" => 1, "bloqueado" => 0, "silenciado" => 0, "ultima_mensagem" => $mensagem, "mensagens" => $id, "recebido" => 0, "data_ultima_mensagem" => date("Y-m-d H:i:s")]);
    }

} else {

    /**
     * Usuário bloqueou
     */
    $data['data'] = 2;
}