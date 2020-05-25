<?php

$up = new \Conn\Update();
$up->exeUpdate("clientes", ["moedas" => ($_SESSION['userlogin']['setorData']['moedas'] - 1)], "WHERE id =:id", "id={$_SESSION['userlogin']['setorData']['id']}");