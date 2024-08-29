# Start Build

[TOC]

#### About

- php >= 7.2.0
- Redis
- Postgresql
- Composer

#### Start 
Developer User in migrations

`@app/migrations/m999999_999999_default_user.php`

Change password hash in code for your user

`'password_hash'       => Yii::$app->security->generatePasswordHash('123123123')`

Install Composer 

`composer install`

Create new database for project and add DB configs into `db.php` and start yii2 migrations

`php yii migrate`

#### Create default config files

Create `common-local.php`

    <?php
    $db = require __DIR__ . '/db.php';
    
    $config = [
        'components' => $db,
    ];
    
    return $config;

    
Create `console-local.php`

    <?php
    $db = require __DIR__ . '/db.php';
    
    $config = [
        'components' => $db,
    ];
    
    return $config;

    
Create `db.php`

    <?php
    
    return [
    
            'class' => 'yii\db\Connection',
            'dsn' => 'pgsql:host=localhost;dbname=',
            'username' => 'postgres',
            'password' => '',
            'charset' => 'utf8',
        // Schema cache options (for production environment)
        //'enableSchemaCache' => true,
        //'schemaCacheDuration' => 60,
        //'schemaCache' => 'cache',
    ];


Create `params-local.php`

    <?php
    
    return [];
    
    


