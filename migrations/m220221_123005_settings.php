<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123005_settings extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%settings}}',
            [
                'id'            => $this->primaryKey(),
                'title'         => $this->string(255)->null()->defaultValue(''),
                'logo'          => $this->string(255)->null()->defaultValue(''),
                'copy'          => $this->string(255)->null()->defaultValue(''),
                'description'   => $this->string(2000)->null()->defaultValue(''),
                'keywords'      => $this->string(2000)->null()->defaultValue(''),
                'maintenance'   => $this->smallInteger(16)->null()->defaultValue(1),
                'cache'         => $this->smallInteger(16)->null()->defaultValue('0'),
                'ips'           => $this->text()->null()->defaultValue(''),
                'head_scripts'  => $this->text()->null()->defaultValue(''),
                'body_scripts'  => $this->text()->null()->defaultValue(''),
                'end_scripts'   => $this->text()->null()->defaultValue(''),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_by'    => $this->integer(32)->null()->defaultValue('0'),
                'social'        => $this->text(),
                'slogan'        => $this->string(255),
                'logo_txt'      => $this->string(255),
                'underpage_txt' => $this->text(),
                'email'         => $this->string(255),
                'phones'        => $this->string(255),
                'max_discount'  => $this->float(24),
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%settings}}');
    }
}
