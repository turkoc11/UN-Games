<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_131941_settingsDataInsert extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%settings}}',
            ["id", "title", "logo", "copy", "description", "keywords", "maintenance", "cache", "ips", "head_scripts", "body_scripts", "end_scripts", "updated_at", "updated_by", "social", "slogan", "logo_txt", "underpage_txt", "email", "phones", "max_discount"],
            [
                [
                    'id'            => 1,
                    'title'         => 'Equisteel',
                    'logo'          => '/images/stisla-fill.svg',
                    'copy'          => '© Copyright 2021, Всі права захищені та охороняються законом.',
                    'description'   => 'Equisteel',
                    'keywords'      => 'Equisteel',
                    'maintenance'   => 0,
                    'cache'         => 1,
                    'ips'           => '127.0.0.1',
                    'head_scripts'  => null,
                    'body_scripts'  => '<script></script>',
                    'end_scripts'   => null,
                    'updated_at'    => 1597149895,
                    'updated_by'    => 1,
                    'social'        => '',
                    'slogan'        => 'qwe',
                    'logo_txt'      => 'qwe',
                    'underpage_txt' => 'qwe',
                    'email'         => null,
                    'phones'        => null,
                    'max_discount'  => null,
                ],
            ]
        );
    }

    public function safeDown()
    {
        $this->truncateTable('{{%settings}} CASCADE');
    }
}
