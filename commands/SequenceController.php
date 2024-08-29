<?php

namespace app\commands;

use app\components\ConsoleController;
use app\components\Sequence;

class SequenceController extends ConsoleController
{
    public function actionUp()
    {
        Sequence::up();
    }

    public function actionDown()
    {
        Sequence::down();
    }

    public function actionRefresh()
    {
        Sequence::refresh();
    }

}
