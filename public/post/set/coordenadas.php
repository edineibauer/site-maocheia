<?php

$lat = filter_input(INPUT_POST, 'lat', FILTER_DEFAULT);
$lng = filter_input(INPUT_POST, 'lng', FILTER_DEFAULT);

if(!empty($_SESSION['userlogin']['setorData']['id']) && !empty($lat) && !empty($lng)) {
    $up = new \Conn\Update();
    $up->exeUpdate("clientes", ["latitude" => $lat, "longitude" => $lng, "data_da_localizacao" => date("Y-m-d H:i:s")], "WHERE id = :c", "c={$_SESSION['userlogin']['setorData']['id']}");
}