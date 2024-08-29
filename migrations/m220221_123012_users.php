<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123012_users extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%users}}',
            [
                'id'                    => $this->primaryKey(),
                'email'                 => $this->string(255)->null()->defaultValue('')->comment('Email'),
                'first_name'            => $this->string(255)->null()->defaultValue('')->comment('Name'),
                'last_name'             => $this->string(255)->null()->defaultValue('')->comment('Last Name'),
                'image'                 => $this->string(255)->null()->defaultValue('')->comment('Photo'),
                'auth_key'              => $this->string(255)->null()->defaultValue('')->comment('Auth Key'),
                'email_confirm_token'   => $this->string(255)->null()->defaultValue('')->comment('Email Confirm Token'),
                'password_hash'         => $this->string(255)->null()->defaultValue('')->comment('Password Hash'),
                'password_reset_token'  => $this->string(255)->null()->defaultValue('')->comment('Password Reset Token'),
                'phone'                 => $this->string(255)->null()->defaultValue('')->comment('phone'),
                'email_verified'        => $this->smallInteger(16)->null()->defaultValue('0')->comment('Is Email Verified'),
                'status'                => $this->smallInteger(16)->null()->defaultValue('0')->comment('Status'),
                'level'                 => $this->smallInteger(16)->null()->defaultValue('0')->comment('Level'),
                'city_id'               => $this->integer(32)->null()->defaultValue('0')->comment('City'),
                'country_id'            => $this->integer(32)->null()->defaultValue('0')->comment('Country'),
                'gender'                => $this->integer(32)->null()->defaultValue('0')->comment('Gender'),
                'created_at'            => $this->integer(32)->null()->defaultValue('0')->comment('Created At'),
                'updated_at'            => $this->integer(32)->null()->defaultValue('0')->comment('Updated At'),
                'created_by'            => $this->integer(32)->null()->defaultValue('0')->comment('Created By'),
                'updated_by'            => $this->integer(32)->null()->defaultValue('0')->comment('Updated By'),
                'dateofbirth'           => $this->date(),
                'personal_code'         => $this->string(255),
                'hidden_user'           => $this->boolean()->null()->defaultValue(false),
                'is_premium'             => $this->boolean()->null()->defaultValue(false),
                'full_name'             => $this->string(255),
                'notes'                 => $this->text(),
                'doctor_discount_limit' => $this->float(24)->null()->defaultValue("25"),
                'telegram_id'           => $this->string(255),
                'age'                   => $this->integer(32),               
                'nick_name'             => $this->string(255),
                'sms_code'              => $this->string(255),
            ]
        );

        $this->createIndex('personal_code', '{{%users}}', ['personal_code'], true);
    }

    public function safeDown()
    {
        $this->dropIndex('personal_code', '{{%users}}');
        $this->dropTable('{{%users}}');
    }
}
