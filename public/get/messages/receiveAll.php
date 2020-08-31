<?php

$up = new \Conn\Update();
$up->exeUpdate("messages_user", ["recebido" => 1], "WHERE ownerpub = :id AND recebido = 0", "id={$_SESSION['userlogin']['id']}");