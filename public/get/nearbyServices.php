<?php

$latitude = (float) $link->getVariaveis()[2];
$longitude = (float) $link->getVariaveis()[1];
$dist = (float) $link->getVariaveis()[0];

$data['data'] = [];
$sql = new \Conn\SqlCommand();
$sql->exeCommand("SELECT CP.latitude, CP.longitude, P.*, (6371 * acos(cos(radians({$latitude})) * cos(radians(latitude)) * cos(radians({$longitude}) - radians(longitude)) + sin(radians({$latitude})) * sin(radians(latitude)))) AS distancia FROM " . PRE . "coordenadas_profissional as CP INNER JOIN " . PRE . "clientes as P ON CP.cliente = P.id WHERE P.perfil_profissional IS NOT NULL HAVING distancia <= " . $dist);
if($sql->getResult()) {
    foreach ($sql->getResult() as $item) {
        if(\Helpers\Check::json($item['perfil_profissional'])) {
            $item['perfil_profissional'] = json_decode($item['perfil_profissional'], !0)[0];
            $data['data'][] = $item;
        }
    }
}