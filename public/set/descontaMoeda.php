<?php

$profissional = filter_input(INPUT_POST, 'profissional', FILTER_VALIDATE_INT);
if (!empty($_SESSION['userlogin']) && $profissional !== $_SESSION['userlogin']['setorData']['id']) {
    $canal = filter_input(INPUT_POST, 'canal', FILTER_DEFAULT);

    $up = new \Conn\Update();
    $up->exeUpdate("clientes", ["moedas" => ($_SESSION['userlogin']['setorData']['moedas'] - 1)], "WHERE id =:id", "id={$_SESSION['userlogin']['setorData']['id']}");

    $read = new \Conn\Read();
    $read->exeRead("historico", "WHERE cliente = :c && profissional = :p", "c={$_SESSION['userlogin']['setorData']['id']}&p={$profissional}");
    if (!$read->getResult()) {

        /**
         * Cria histórico caso este cliente e este profissional ainda não tenham histórico
         */
        $create = new \Conn\Create();
        $create->exeCreate("historico", ["cliente" => $_SESSION['userlogin']['setorData']['id'], "profissional" => $profissional, "data" => date("Y-m-d H:i:s"), "canal" => $canal]);
    } else {

        /**
         * Atualiza histórico
         */
        $up->exeUpdate("historico", ["data" => date("Y-m-d H:i:s"), "canal" => $canal], "WHERE cliente = :c && profissional = :p", "c={$_SESSION['userlogin']['setorData']['id']}&p={$profissional}");
    }
}