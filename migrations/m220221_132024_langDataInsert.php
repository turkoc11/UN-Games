<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_132024_langDataInsert extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%lang}}',
            ["id", "flag", "url", "local", "name", "default", "created_at", "updated_at", "created_by", "updated_by", "code"],
            [
                [
                    'id'         => 1,
                    'flag'       => '/images/flags/EN.png',
                    'url'        => 'en',
                    'local'      => 'en-EN',
                    'name'       => 'EN',
                    'default'    => 1,
                    'created_at' => 1556626611,
                    'updated_at' => 0,
                    'created_by' => 0,
                    'updated_by' => 0,
                    'code'       => 'en',
                ],
                [
                    'id'         => 4,
                    'flag'       => '/images/flags/RU.png',
                    'url'        => 'ru',
                    'local'      => 'ru-RU',
                    'name'       => 'RU',
                    'default'    => 0,
                    'created_at' => 1556626611,
                    'updated_at' => 0,
                    'created_by' => 0,
                    'updated_by' => 0,
                    'code'       => 'ru',
                ],
//                [
//                    'id'         => 5,
//                    'flag'       => '/images/flags/UA.png',
//                    'url'        => 'uk',
//                    'local'      => 'uk-UA',
//                    'name'       => 'UA',
//                    'default'    => 1,
//                    'created_at' => 1556619970,
//                    'updated_at' => 1556620064,
//                    'created_by' => 1,
//                    'updated_by' => 1,
//                    'code'       => 'uk',
//                ],
            ]
        );
    }

    public function safeDown()
    {
        $this->truncateTable('{{%lang}} CASCADE');
    }
}
