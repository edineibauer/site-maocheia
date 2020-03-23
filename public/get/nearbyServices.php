<?php

$latitude = (float) $link->getVariaveis()[2];
$longitude = (float) $link->getVariaveis()[1];
$dist = (float) $link->getVariaveis()[0];

$data['data'] = [];
$sql = new \Conn\SqlCommand();
$sql->exeCommand("SELECT CP.latitude, CP.longitude, P.*, (6371 * acos(cos(radians({$latitude})) * cos(radians(latitude)) * cos(radians({$longitude}) - radians(longitude)) + sin(radians({$latitude})) * sin(radians(latitude)))) AS distancia FROM " . PRE . "coordenadas_profissional as CP INNER JOIN " . PRE . "profissional as P ON CP.profissional = P.id HAVING distancia <= " . $dist);
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        $item['imagem_de_perfil'] = !empty($item['imagem_de_perfil']) ? json_decode($item['imagem_de_perfil'], !0) : "";
        $item['imagem_de_fundo'] = !empty($item['imagem_de_fundo']) ? json_decode($item['imagem_de_fundo'], !0) : "";
        $item['endereco'] = !empty($item['endereco']) ? json_decode($item['endereco'], !0) : "";
        $data['data'][] = $item;
    }
}