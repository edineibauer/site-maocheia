<?php

$data['data'] = [];
if (!empty($_SESSION['userlogin']) && !empty($_SESSION['services']['nearbyServices'])) {
    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("SELECT * FROM " . PRE . "coordenadas_profissional WHERE cliente IN (" . implode(',', $_SESSION['services']['nearbyServices']) . ")");
    if ($sql->getResult()) {
        foreach ($sql->getResult() as $item) {
            if ($item['data_de_atualizacao'] > $_SESSION['services']['nearbyServicesDate'][$item['cliente']]) {
                $data['data'][] = $item;
                $_SESSION['services']['nearbyServicesDate'][$item['cliente']] = $item['data_de_atualizacao'];
            }
        }
    }
}