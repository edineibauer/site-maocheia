<?php

$up = new \Conn\Update();
$read = new \Conn\Read();

$updates = [];
$cliente = ["nome" => "anonimo"];

if (!empty($dados['cliente'])) {
    $read->exeRead("clientes", "WHERE id = :cid", "cid={$dados['cliente']}");
    if ($read->getResult()) {
        if($dados['autorpub'] !== $read->getResult()[0]['usuarios_id'] && $_SESSION['userlogin']['setor'] !== "administrador" && $_SESSION['userlogin']['setor'] !== "admin")
            unset($dados['cliente']);
        else
            $cliente = $read->getResult()[0];
    }
}

if (empty($dados['cliente'])) {
    $read->exeRead("clientes", "WHERE usuarios_id = :ui", "ui={$dados['autorpub']}");
    if ($read->getResult()) {
        $cliente = $read->getResult()[0];
        $updates["cliente"] = $cliente['id'];
    }
} elseif(!isset($cliente['id'])) {
    $read->exeRead("clientes", "WHERE id = :cid", "cid={$dados['cliente']}");
    if ($read->getResult())
        $cliente = $read->getResult()[0];
}

if (empty($dados['nome_do_cliente']))
    $updates["nome_do_cliente"] = $cliente['nome'];

if (empty($dados['imagem_do_cliente']))
    $updates["imagem_do_cliente"] = (!empty($cliente['imagem']) ? json_decode($cliente['imagem'], !0)[0]['urls']['thumb'] : HOME . VENDOR . "site-maocheia/public/assets/svg/account.svg");

if(!empty($updates))
    $up->exeUpdate("avaliacao", $updates, "WHERE id =:id", "id={$dados['id']}");