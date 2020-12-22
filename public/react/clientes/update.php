<?php

if(empty($dadosOld['perfil_profissional']) && !empty($dados['perfil_profissional'])) {
    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("UPDATE " . PRE . "clientes SET moedas=10 WHERE id = {$dados['id']}");
}