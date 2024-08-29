<?php

namespace app\modules\user\services;

use Yii;

class RbacService
{

    /**
     * RbacService constructor.
     */
    public function __construct()
    {
    }

    /**
     * Назначить пользователю роль
     * @param $userId
     * @param $roleName
     */
    public function assign($userId, $roleName)
    {
        $auth = Yii::$app->authManager;
        $role = $auth->getRole($roleName);
        $auth->assign($role, $userId);
    }

    public function delete($userId, $roleName)
    {
        $auth = Yii::$app->authManager;
        $role = $auth->getRole($roleName);
        $auth->revoke($role, $userId);
    }
}
