<?php

$data['data'] = [];
if (!empty($_SESSION['userlogin']) && !empty($_SESSION['userlogin']['setorData']['latitude']) && !empty($_SESSION['userlogin']['setorData']['longitude'])) {

    /**
     * Obtém os serviços próximo a minha localização
     */
    $latitude = $_SESSION['userlogin']['setorData']['latitude'];
    $longitude = $_SESSION['userlogin']['setorData']['longitude'];
    $dist = !empty($_SESSION['userlogin']['setorData']['distancia_maxima']) ? $_SESSION['userlogin']['setorData']['distancia_maxima'] : 150;

    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("SELECT *, (6371 * acos(cos(radians({$latitude})) * cos(radians(latitude)) * cos(radians({$longitude}) - radians(longitude)) + sin(radians({$latitude})) * sin(radians(latitude)))) AS distancia FROM " . PRE . "clientes WHERE perfil_profissional IS NOT NULL AND ativo = 1 HAVING distancia <= " . $dist);
    if ($sql->getResult()) {
        foreach ($sql->getResult() as $item) {
            if (\Helpers\Check::json($item['perfil_profissional'])) {
                $item['perfil_profissional'] = json_decode($item['perfil_profissional'], !0)[0];
                $item['online'] = !1;

                /**
                 * Busca por última vez online
                 */
                if(file_exists(PATH_HOME . "_cdn/userActivity/" . $item['usuarios_id'])) {

                    /**
                     * Encontra último de registro
                     */
                    $lastDay = "";
                    foreach (\Helpers\Helper::listFolder(PATH_HOME . "_cdn/userActivity/" . $item['usuarios_id']) as $activity) {
                        $dia = str_replace(".json", "", $activity);
                        if($lastDay === "" || $dia > $lastDay)
                            $lastDay = $dia;
                    }

                    /**
                     * Se tiver um último dia encontrado, então busca última hora registrada
                     */
                    if($lastDay !== "") {
                        $a = json_decode(file_get_contents(PATH_HOME . "_cdn/userActivity/" . $item['usuarios_id'] . "/" . $lastDay . ".json"), !0);
                        $item['online'] = (strtotime($a[count($a) -1]) + 10) > strtotime(date("H:i:s"));
                    }
                }

                $data['data'][] = $item;
            }
        }
    }
}