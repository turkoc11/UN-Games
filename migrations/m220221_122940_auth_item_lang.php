<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122940_auth_item_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%auth_item_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'description'   => $this->text(),
                'area'          => $this->string(64),
                'section'       => $this->string(64),
                'language'      => $this->string(255)->comment('Language'),
                'original_name' => $this->string(64)->null()->defaultValue('')->comment('Original Name'),
            ]
        );

    }

    public function safeDown()
    {
        $this->dropTable('{{%auth_item_lang}}');
    }
}
