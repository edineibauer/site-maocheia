<?php

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$indices = filter_input(INPUT_POST, 'indices', FILTER_VALIDATE_INT, FILTER_REQUIRE_ARRAY);
$user = filter_input(INPUT_POST, 'usuario', FILTER_VALIDATE_INT);

if(!empty($indices) && is_array($indices)) {
    $read = new \Conn\Read();
    $read->exeRead("messages", "WHERE id = :id", "id={$id}");
    if ($read->getResult()) {
        $allMessages = json_decode($read->getResult()[0]['mensagens'], !0);

        foreach ($indices as $index) {
            if(is_numeric($index))
                $allMessages[$index]['lido'] = 1;
        }

        $up = new \Conn\Update();
        $up->exeUpdate("messages", ["mensagens" => json_encode($allMessages)], "WHERE id = :id", "id={$id}");
        $up->exeUpdate("messages_user", ["nao_lidas" => 0], "WHERE ownerpub = :o AND usuario = :u AND nao_lidas > 0", "o={$_SESSION['userlogin']['id']}&u={$user}");
    }
}