<?php

if (!empty($dados) && $dados['usuario'] != $_SESSION['userlogin']['id']) {

    /**
     * Force Start values
     */
    $up = new \Conn\Update();
    $up->exeUpdate("messages_user", ["aceito" => 0, "bloqueado" => 0, "silenciado" => 0, "nao_lidas" => 0, "ultima_mensagem_lido" => 1, "recebido" => 1], "WHERE id = :id", "id={$dados['id']}");

    /**
     * Create chat to user too
     */
    $create = new \Conn\Create();
    $create->exeCreate("messages_user", ["ownerpub" => $dados['usuario'], "usuario" => $_SESSION['userlogin']['id'], "mensagens" => $dados['mensagens'],  "ultima_vez_online" => $dados["ultima_vez_online"],
                    "data_ultima_mensagem" => $dados["data_ultima_mensagem"], "ultima_mensagem" => $dados["ultima_mensagem"], "aceito" => 0, "bloqueado" => 0, "silenciado" => 0, "nao_lidas" => 1, "ultima_mensagem_lido" => 0, "recebido" => 0]);

    /**
     * Check if user need to receive the push (if is offline on app)
     */
    $dia = date("Y-m-d");
    $isUserOffline = !file_exists(PATH_HOME . "_cdn/userActivity/" . $dados['usuario'] . "/{$dia}.json");
    if(!$isUserOffline) {
        $day = json_decode(file_get_contents(PATH_HOME . "_cdn/userActivity/" . $dados['usuario'] . "/{$dia}.json"), !0);
        $isUserOffline = (strtotime($dia . ' ' . $day[count($day) - 1]) < strtotime('now') - 5);
    }

    /**
     * User is not silence and not online
     * so send notification
     */
    if($isUserOffline)
        \Dashboard\Notification::create($_SESSION['userlogin']['nome'], $dados["ultima_mensagem"], $dados['usuario']);
}