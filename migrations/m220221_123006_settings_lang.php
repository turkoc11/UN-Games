<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123006_settings_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%settings_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'title'         => $this->string(255)->comment('Title'),
                'copy'          => $this->string(255)->null()->defaultValue(''),
                'description'   => $this->string(2000)->null()->defaultValue(''),
                'keywords'      => $this->string(2000)->null()->defaultValue(''),
                'language'      => $this->string(255)->comment('Language'),
                'original_id'   => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),
                'slogan'        => $this->string(255),
                'logo_txt'      => $this->string(255),
                'underpage_txt' => $this->text(),
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%settings_lang}}');
    }
}
