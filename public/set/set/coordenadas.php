<?php

$lat = filter_input(INPUT_POST, 'lat', FILTER_DEFAULT);
$lng = filter_input(INPUT_POST, 'lng', FILTER_DEFAULT);

if(!empty($_SESSION['userlogin']['setorData']['id']) && !empty($lat) && !empty($lng)) {
    $read = new \Conn\Read();
    $read->exeRead("coordenadas_profissional", "WHERE cliente = :c", "c={$_SESSION['userlogin']['setorData']['id']}");
    if ($read->getResult()) {
        $up = new \Conn\Update();
        $up->exeUpdate("coordenadas_profissional", ["latitude" => $lat, "longitude" => $lng], "WHERE cliente = :c", "c={$_SESSION['userlogin']['setorData']['id']}");
    } else {
        $create = new \Conn\Create();
        $create->exeCreate("coordenadas_profissional", ["latitude" => $lat, "longitude" => $lng, "cliente" => $_SESSION['userlogin']['setorData']['id']]);
    }
}