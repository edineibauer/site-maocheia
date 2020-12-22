<?php

$data['data'] = [];
if(file_exists(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id'])) {
    foreach (\Helpers\Helper::listFolder(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id']) as $item) {
        $data['data'][str_replace(".txt", "", $item)] = 1;
        unlink(PATH_HOME . "_cdn/chat/" . $_SESSION['userlogin']['id'] . "/{$item}");
    }
}