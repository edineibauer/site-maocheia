<?php

$sql = new \Conn\SqlCommand();
$read = new \Conn\Read();

$data['data'] = [];

/**
 * Lê os clientes que entraram em contato com o profissional
 */
$sql->exeCommand("SELECT *, 1 as isProfissional, h.id as id FROM " . PRE . "historico as h JOIN " . PRE . "clientes as c ON c.id = h.cliente WHERE h.profissional = {$_SESSION['userlogin']['setorData']['id']} && h.cliente != {$_SESSION['userlogin']['setorData']['id']} ORDER BY h.data DESC LIMIT 50");
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        $item['perfil_profissional'] = (!empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0)[0] : []);
        $read->exeRead("atendimento", "WHERE cliente = :c AND autorpub = :p", "c={$item['cliente']}&p={$_SESSION['userlogin']['id']}");
        $item['avaliou'] = $read->getResult() ? !0 : !1;
        $data['data'][] = $item;
    }
}

/**
 * Lê os profissionais com o qual entrei em contato
 */
$sql->exeCommand("SELECT *, 0 as isProfissional, h.id as id FROM " . PRE . "historico as h JOIN " . PRE . "clientes as c ON c.id = h.profissional WHERE h.cliente = {$_SESSION['userlogin']['setorData']['id']} && h.profissional != {$_SESSION['userlogin']['setorData']['id']} ORDER BY h.data DESC LIMIT 50");
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        $item['perfil_profissional'] = (!empty($item['perfil_profissional']) ? json_decode($item['perfil_profissional'], !0)[0] : []);
        $read->exeRead("avaliacao", "WHERE cliente = :c AND profissional = :p", "c={$item['cliente']}&p={$item['profissional']}");
        $item['avaliou'] = $read->getResult() ? !0 : !1;
        $data['data'][] = $item;
    }
}