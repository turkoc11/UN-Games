<?php

namespace app\modules\admin\controllers;

use mihaildev\elfinder\PathController;


class ElfinderController extends PathController
{

    public $root = [
                'path' => 'files/u2',
                'name' => 'Files'
            ];
    public $access = ['@'];
}
