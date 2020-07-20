<?php

$user = filter_input(INPUT_POST, 'user', FILTER_VALIDATE_INT);

$up = new \Conn\Update();
$up->exeUpdate("messages_user", ["silenciado" => 1], "WHERE usuario = :user AND ownerpub = :me", "user={$user}&me={$_SESSION['userlogin']['id']}");