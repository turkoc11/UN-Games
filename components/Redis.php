<?php
namespace app\components;

use yii\redis\Cache;
/**
 * Class Redis
 */
class Redis extends Cache
{

    /**
     * @inheritdoc
     */
    public function keys($key)
    {
        return $this->redis->executeCommand('KEYS',  [$key] );
    }
}