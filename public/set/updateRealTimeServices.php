<?php

$ids = filter_input(INPUT_POST, 'ids', FILTER_VALIDATE_INT, FILTER_REQUIRE_ARRAY);
$data['data'] = [];

if (!empty($ids)) {
    $sql = new \Conn\SqlCommand();
    $sql->exeCommand("SELECT * FROM " . PRE . "coordenadas_profissional WHERE profissional IN (" . implode(',', $ids) . ")");
    if ($sql->getResult()) {
        foreach ($sql->getResult() as $item)
            $data['data'][$item['id']] = $item;
    }
}