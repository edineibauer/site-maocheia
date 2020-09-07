<?php

if (!empty($_SESSION['userlogin']) && !empty($variaveis[0]) && !empty($variaveis[1])) {

    $latitude = (float)$variaveis[0];
    $longitude = (float)$variaveis[1];
    $dist = (float)$variaveis[2] ?? 200;

    $_SESSION['services']['nearbyServices'] = [];
    $_SESSION['services']['nearbyServicesDate'] = [];
    $data['data'] = [];
    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("SELECT *, (6371 * acos(cos(radians({$latitude})) * cos(radians(latitude)) * cos(radians({$longitude}) - radians(longitude)) + sin(radians({$latitude})) * sin(radians(latitude)))) AS distancia FROM " . PRE . "clientes WHERE perfil_profissional IS NOT NULL HAVING distancia <= " . $dist);
    if ($sql->getResult()) {
        foreach ($sql->getResult() as $item) {
            if (\Helpers\Check::json($item['perfil_profissional'])) {
                $item['perfil_profissional'] = json_decode($item['perfil_profissional'], !0)[0];
                $data['data'][] = $item;
            }
        }

        foreach ($data['data'] as $datum) {
            $_SESSION['services']['nearbyServices'][] = $datum['id'];
            $_SESSION['services']['nearbyServicesDate'][$datum['id']] = $datum['data_de_atualizacao'];
        }
    }
}