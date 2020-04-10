<?php

$endereco = json_decode($dados['endereco'], !0);

$read = new \Conn\Read();
$read->exeRead("coordenadas_profissional", "WHERE profissional = :p", "p={$dados['id']}");
if(!$read->getResult() && !empty($endereco[0]['latitude']) && !empty($endereco[0]['longitude'])) {
    $create = new \Conn\Create();
    $create->exeCreate("coordenadas_profissional", [
        "profissional" => $dados['id'],
        "latitude" => $endereco[0]['latitude'],
        "longitude" => $endereco[0]['longitude'],
        "data_de_atualizacao" => date("Y-m-d H:i:s")
    ]);
}