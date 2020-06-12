<?php

$sql = new \Conn\SqlCommand();

$data['data'] = [];
$sql->exeCommand("SELECT *, 1 as isProfissional FROM " . PRE . "historico as h JOIN " . PRE . "clientes as c ON c.id = h.cliente WHERE h.profissional = {$_SESSION['userlogin']['setorData']['id']} && h.cliente != {$_SESSION['userlogin']['setorData']['id']}");
$data['data'] = $sql->getResult();

$sql->exeCommand("SELECT *, 0 as isProfissional FROM " . PRE . "historico as h JOIN " . PRE . "clientes as c ON c.id = h.profissional WHERE h.cliente = {$_SESSION['userlogin']['setorData']['id']} && h.profissional != {$_SESSION['userlogin']['setorData']['id']}");
$data['data'] = array_merge($sql->getResult(), $data['data']);