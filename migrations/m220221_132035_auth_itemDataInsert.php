<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_132035_auth_itemDataInsert extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%auth_item}}',
            ["name", "type", "level", "description", "area", "section", "data", "rule_name", "created_at", "updated_at", "created_by", "updated_by"],
            [
//                [
//                    'name'        => 'developer',
//                    'type'        => 1,
//                    'level'       => 1,
//                    'description' => 'Developer',
//                    'area'        => null,
//                    'section'     => null,
//                    'data'        => null,
//                    'rule_name'   => 'developer',
//                    'created_at'  => 1556626611,
//                    'updated_at'  => 1556626611,
//                    'created_by'  => 0,
//                    'updated_by'  => 0,
//                ],
                [
                    'name'        => 'donator',
                    'type'        => 1,
                    'level'       => 3,
                    'description' => 'Donator',
                    'area'        => null,
                    'section'     => null,
                    'data'        => null,
                    'rule_name'   => 'donator',
                    'created_at'  => 1556626611,
                    'updated_at'  => 1556626611,
                    'created_by'  => 0,
                    'updated_by'  => 0,
                ],
                [
                    'name'        => 'super_admin',
                    'type'        => 1,
                    'level'       => 2,
                    'description' => 'Super administrator',
                    'area'        => null,
                    'section'     => null,
                    'data'        => null,
                    'rule_name'   => 'super_admin',
                    'created_at'  => 1556626611,
                    'updated_at'  => 1556626611,
                    'created_by'  => 0,
                    'updated_by'  => 0,
                ],
                [
                    'name'        => 'user',
                    'type'        => 1,
                    'level'       => 4,
                    'description' => 'User',
                    'area'        => null,
                    'section'     => null,
                    'data'        => null,
                    'rule_name'   => 'user',
                    'created_at'  => 1556626611,
                    'updated_at'  => 1556626611,
                    'created_by'  => 0,
                    'updated_by'  => 0,
                ],
                
            ]
        );
    }

    public function safeDown()
    {
        $this->truncateTable('{{%auth_item}} CASCADE');
    }
}
