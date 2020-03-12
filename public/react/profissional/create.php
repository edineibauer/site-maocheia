<?php

$endereco = json_decode($dados['endereco'], !0);
if(!empty($endereco[0]['latitude']) && !empty($endereco[0]['longitude'])) {
    $create = new \Conn\Create();
    $create->exeCreate("coordenadas_profissional", [
        "profissional" => $dados['id'],
        "latitude" => $endereco[0]['latitude'],
        "longitude" => $endereco[0]['longitude'],
    ]);
}