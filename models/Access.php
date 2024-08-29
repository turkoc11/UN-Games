<?php

namespace app\models;

use Yii;
use yii\base\InvalidRouteException;
use yii\base\Model;

/**
 * Access is the model behind the user access validation.
 */
class Access extends Model
{

    /**
     * Check user access to special route
     * @param bool|string $route Controller action|controller/action ids
     *
     * @return bool|\yii\web\Response
     * @throws InvalidRouteException
     */
    public static function checkAccess($route = false)
    {        
//        echo '<pre>'; var_dump(\Yii::$app->user->identity); die();
        if(\Yii::$app->user->isGuest) self::redirect('/login');
        if(\Yii::$app->user->identity->status != 1) return false;
        $uroles = \Yii::$app->user->identity->assignments;

        Yii::$app->controller->uroles = $uroles;

        if(in_array('super_admin', $uroles)) {
            return true;
        } else {

            self::redirect('/');
        }
       
        $exception = \Yii::t('app_model', 'Invalid route configuration');

        $module = \Yii::$app->controller->module->id;
        $controller = \Yii::$app->controller->id;
        $action = \Yii::$app->controller->action;

        if($route){
            $action = $route;
            if(stripos($route, '/')) {
                $route = explode('/', $route);
                if (sizeof($route) < 2) throw new InvalidRouteException($exception);
                $controller = $route[0];
                $action = $route[1];
            }
        }

        $permissions = \Yii::$app->user->identity->permissions;
        $route = $module.'/'.$controller.'/'.$action;

        if(!in_array($route, $permissions)) return false;

        return true;

    }

    public static function checkRoleAccess($route = false)
    {
        //TODO move below to config

//        if(\Yii::$app->user->isGuest) self::redirect('home');
//        if(\Yii::$app->user->identity->status != 1) return false;

        if(Access::can(['super_admin', 'developer'])) return true;

        $uroles = Yii::$app->controller->uroles;
        if(in_array('staff_in', $uroles) || in_array('staff_ext', $uroles) || in_array('doctor', $uroles) || in_array('user', $uroles)) return true;

        $exception = \Yii::t('app_model', 'Invalid route configuration');

        $module = \Yii::$app->controller->module->id;
        $controller = \Yii::$app->controller->id;
        $action = \Yii::$app->controller->action;

        if($route){
            $action = $route;
            if(stripos($route, '/')) {
                $route = explode('/', $route);
                if (sizeof($route) < 2) throw new InvalidRouteException($exception);
                $controller = $route[0];
                $action = $route[1];
            }
        }

        $permissions = \Yii::$app->user->identity->permissions;
        $route = $module.'/'.$controller.'/'.$action;

        if(!in_array($route, $permissions)) return false;

        return true;

    }

    public static function checkPublicAccess($route = false)
    {
        // var_dump(Yii::$app->user);
        // die();
//        if(\Yii::$app->user->isGuest) self::redirect('home');
//        if(\Yii::$app->user->identity->status != 1) return false;

        if(Access::can(['super_admin', 'developer'])) return true;

        $exception = \Yii::t('app_model', 'Invalid route configuration');

        $module = \Yii::$app->controller->module->id;
        $controller = \Yii::$app->controller->id;
        $action = \Yii::$app->controller->action;

        if($route){
            $action = $route;
            if(stripos($route, '/')) {
                $route = explode('/', $route);
                if (sizeof($route) < 2) throw new InvalidRouteException($exception);
                $controller = $route[0];
                $action = $route[1];
            }
        }

        $uroles = \Yii::$app->user->identity->assignments;
        Yii::$app->controller->uroles = $uroles;

        if(in_array('staff_in', $uroles) || in_array('staff_ext', $uroles) || in_array('doctor', $uroles)) return true;

        /*
        $permissions = \Yii::$app->user->identity->permissions;
        $route = $module.'/'.$controller.'/'.$action;
        if(!in_array($route, $permissions)) return false;
        */



        return true;

    }

    /**
     *
     * Check user assignment
     * @param string|array $role
     *
     * @return bool|\yii\web\Response
     */
    public static function can($role) {
//        var_dump(Yii::$app->user->identity); die();
//        if(\Yii::$app->user->isGuest) self::redirect('home');
//        if(\Yii::$app->user->identity->status != 1) return false;

//        $assignments = \Yii::$app->user->identity->assignments;
////        var_dump($assignments); die();
//        if(is_array($role)) {
//            if(empty(array_intersect($role, $assignments))) return false;
//        } else {
//            if(!in_array($role, $assignments)) return false;
//        }

        return true;
    }

    /**
     * Custom redirect, because redirect of framework is fucking kidding me
     * @param string $url
     * return REDIRECT!!!
     */
    public static function redirect($url)
    {
        if (!headers_sent()) {
            header('Location: ' . $url);
            exit();
        }
    }

}
