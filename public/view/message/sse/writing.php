<?php

if(file_exists(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id'])) {
    foreach (\Helpers\Helper::listFolder(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id']) as $item)
        $data['data']['writing'][str_replace(".txt", "", $item)] = file_get_contents(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id'] . "/" . $item);
}

$read = new \Conn\Read();
$read->exeRead("messages_user");
if($read->getResult()) {
    $day = date("Y-m-d");
    foreach ($read->getResult() as $item) {
        if(file_exists(PATH_HOME . "_cdn/userActivity/{$item['usuario']}/{$day}.json")) {
            $last = json_decode(file_get_contents(PATH_HOME . "_cdn/userActivity/{$item['usuario']}/{$day}.json"), !0);
            $last = $last[count($last) - 1];
            $idLast = ((int) explode(":", $last)[2]);
            $idLast = $idLast < 11 ? 0 : ((int)$idLast/10);
            $data['data']['status'][$item['usuario']] = (date('H:i:s', strtotime("{$last} + 1 minute")) > date("H:i:s") ? "<div class='{$idLast}' style='color: seagreen'>online</div>" : date('H:i', strtotime($last)));
        }
    }
}