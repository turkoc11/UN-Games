<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_132034_auth_ruleDataInsert extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%auth_rule}}',
            ["name", "data", "created_at", "updated_at"],
            [
                [
                    'name'       => 'super_admin',
                    'data'       => null,
                    'created_at' => 1556626611,
                    'updated_at' => 1556626611,
                ],
                [
                    'name'       => 'user',
                    'data'       => null,
                    'created_at' => 1556626611,
                    'updated_at' => 1556626611,
                ],
                [
                    'name'       => 'donator',
                    'data'       => null,
                    'created_at' => 1556626611,
                    'updated_at' => 1556626611,
                ],
                
            ]
        );
    }

    public function safeDown()
    {
        $this->truncateTable('{{%auth_rule}} CASCADE');
    }
}
