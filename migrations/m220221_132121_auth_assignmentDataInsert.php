<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_132121_auth_assignmentDataInsert extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%auth_assignment}}',
            ["item_name", "user_id", "created_at", "updated_at", "created_by", "updated_by"],
            [
//                [
//                    'item_name'  => 'premium_user',
//                    'user_id'    => '120778',
//                    'created_at' => 1556626614,
//                    'updated_at' => 1556626614,
//                    'created_by' => 0,
//                    'updated_by' => 0,
//                ],
                [
                    'item_name'  => 'super_admin',
                    'user_id'    => '1',
                    'created_at' => 1560070494,
                    'updated_at' => 0,
                    'created_by' => 0,
                    'updated_by' => 0,
                ],               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->truncateTable('{{%auth_assignment}} CASCADE');
    }
}
