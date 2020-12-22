<?php

$u = filter_input(INPUT_POST, 'urgencia', FILTER_VALIDATE_INT);
$p = filter_input(INPUT_POST, 'problema', FILTER_DEFAULT);
$read = new \Conn\Read();
$create = new \Conn\Create();

switch ($u) {
    case 1:
        $u = "urgente";
        break;
    case 2:
        $u = "o quanto antes";
        break;
    case 3:
        $u = "para hoje";
        break;
    case 4:
        $u = "para esta semana";
        break;
    case 5:
        $u = "sem pressa";
        break;
}

/**
 * Cria histórico
 */
$create->exeCreate("historico", ["problema" => $p, "urgencia" => $u, "data" => date("Y-m-d H:i:s"), "atendido" => 0]);

$read->exeRead("problemas", "WHERE nome = '{$p}'");
if($read->getResult()) {
    $up = new \Conn\Update();
    $up->exeUpdate("problemas", ["buscas" => "+1"], "WHERE id = :id", "id={$read->getResult()[0]['id']}");
} else {
    $create->exeCreate("problemas", ["nome" => $p]);
}

$read->setSelect("usuarios_id");
$read->exeRead("clientes", "WHERE perfil_profissional IS NOT NULL AND ativo = 1");
$usuarios = ($read->getResult() ? array_map(function($i) { return $i['usuarios_id'];}, $read->getResult()) : []);

\Notification\Notification::push($p, $_SESSION['userlogin']['nome'] . " esta buscando um profissional! [{$u}]", $usuarios);