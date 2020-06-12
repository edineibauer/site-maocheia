<?php

$sql = new \Conn\SqlCommand();
$read = new \Conn\Read();

$data['data'] = [];

/**
 * Lê os clientes que entraram em contato com o profissional
 */
$sql->exeCommand("SELECT *, 1 as isProfissional FROM " . PRE . "historico as h JOIN " . PRE . "clientes as c ON c.id = h.cliente WHERE h.profissional = {$_SESSION['userlogin']['setorData']['id']} && h.cliente != {$_SESSION['userlogin']['setorData']['id']}");
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        $read->exeRead("atendimento", "WHERE cliente = :c AND autorpub = :p", "c={$item['cliente']}&p={$_SESSION['userlogin']['id']}");
        $item['avaliou'] = $read->getResult() ? !0 : !1;
        $data['data'][] = $item;
    }
}

/**
 * Lê os profissionais com o qual entrei em contato
 */
$sql->exeCommand("SELECT *, 0 as isProfissional FROM " . PRE . "historico as h JOIN " . PRE . "clientes as c ON c.id = h.profissional WHERE h.cliente = {$_SESSION['userlogin']['setorData']['id']} && h.profissional != {$_SESSION['userlogin']['setorData']['id']}");
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        $read->exeRead("avaliacao", "WHERE cliente = :c AND profissional = :p", "c={$item['cliente']}&p={$item['profissional']}");
        $item['avaliou'] = $read->getResult() ? !0 : !1;
        $data['data'][] = $item;
    }
}