<?php

use yii\helpers\Html;

/**
 * @var $content string
 */

$this->beginContent('@app/modules/admin/layouts/main.php');

$cont = Yii::$app->controller->id;
$mod = Yii::$app->controller->module->id;
$act = Yii::$app->controller->action->id;

?>

<!-- sidebar -->
<div class="navbar-default sidebar" role="navigation">
    <div class="sidebar-nav slimscrollsidebar">

        <div class="sidebar-head">
            <h3><span class="fa-fw open-close"><i class="ti-close ti-menu"></i></span>
                <span class="hide-menu"><?= Yii::t('app_admin', 'Navigation') ?></span>
            </h3></div>
        <div class="user-profile"></div>
        <ul class="nav" id="side-menu">

           

            <p style="font-size: 14px;padding: 0px 35px 0px 15px;background: #eee;color:#000;"><?= Yii::t('app_admin', 'Dynamic data') ?></p>



            <li class="<?= $cont == 'dynamic' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-file-text fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Static pages') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('dynamic/index')) { ?>
                        <li class="<?= $cont == 'dynamic' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'dynamic/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('dynamic/create')) { ?>
                        <li class="<?= $cont == 'dynamic' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'dynamic/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>


            <li class="<?= $cont == 'contacts' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Contacts') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('contacts/index')) { ?>
                        <li class="<?= $cont == 'contacts' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'contacts/index' ]
                            ) ?>
                        </li>
                    <?php } ?>

                </ul>
            </li>


            <li class="<?= $cont == 'feedback' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-user fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Feedback') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('feedback/index')) { ?>
                        <li class="<?= $cont == 'feedback' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'feedback/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>
            <p style="font-size: 14px;padding: 0px 35px 0px 15px;background: #eee;color:#000;"><?= Yii::t('app_admin', 'News') ?></p>


            <li class="<?= $cont == 'news' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'News') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('news/index')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'news/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('news/create')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'news/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>

            <p style="font-size: 14px;padding: 0px 35px 0px 15px;background: #eee;color:#000;"><?= Yii::t('app_admin', 'Prize') ?></p>


            <li class="<?= $cont == 'prize' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Prize') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('prize/index')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'prize/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('prize/create')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'prize/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>

            <li class="<?= $cont == 'user-prize' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'User Prize') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('user-prize/index')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'user-prize/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('user-prize/create')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'user-prize/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>


            <p style="font-size: 14px;padding: 0px 35px 0px 15px;background: #eee;color:#000;"><?= Yii::t('app_admin', 'Game Page') ?></p>


            <li class="<?= $cont == 'values' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Game pages') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('values/index')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'values/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('values/create')) { ?>
                        <li class="<?= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'values/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>
<!---->
<!--            <li class="--><?php //= $cont == 'sections' ? 'active' : '' ?><!--">-->
<!--                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>-->
<!--                    <span class="hide-menu">--><?php //= Yii::t('app_admin', 'Sections') ?><!--<span class="fa arrow"></span></span>-->
<!--                </a>-->
<!--                <ul class="nav nav-second-level">-->
<!--                    --><?php //if (\app\models\Access::checkAccess('sections/index')) { ?>
<!--                        <li class="--><?php //= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?><!--">-->
<!--                            --><?php //= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
//                                [ 'sections/index' ]
//                            ) ?>
<!--                        </li>-->
<!--                    --><?php //} ?>
<!--                    --><?php //if (\app\models\Access::checkAccess('sections/create')) { ?>
<!--                        <li class="--><?php //= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?><!--">-->
<!--                            --><?php //= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
//                                [ 'sections/create' ]
//                            ) ?>
<!--                        </li>-->
<!--                    --><?php //} ?>
<!--                </ul>-->
<!--            </li>-->
<!---->
<!--            <p style="font-size: 14px;padding: 0px 35px 0px 15px;background: #eee;color:#000;">--><?php //= Yii::t('app_admin', 'Why Dubai') ?><!--</p>-->
<!---->
<!---->
<!--            <li class="--><?// //= $cont == 'sections' ? 'active' : '' ?><!--">-->
<!---->
<!--            <li class="--><?php //= $cont == 'dubai-sections' ? 'active' : '' ?><!--">-->
<!--                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>-->
<!--                    <span class="hide-menu">--><?php //= Yii::t('app_admin', 'Why Dubai sections') ?><!--<span class="fa arrow"></span></span>-->
<!--                </a>-->
<!--                <ul class="nav nav-second-level">-->
<!--                    --><?php //if (\app\models\Access::checkAccess('dubai-sections/index')) { ?>
<!--                        <li class="--><?php //= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?><!--">-->
<!--                            --><?php //= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
//                                [ 'dubai-sections/index' ]
//                            ) ?>
<!--                        </li>-->
<!--                    --><?php //} ?>
<!--                    --><?php //if (\app\models\Access::checkAccess('dubai-sections/create')) { ?>
<!--                        <li class="--><?php //= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?><!--">-->
<!--                            --><?php //= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
//                                [ 'dubai-sections/create' ]
//                            ) ?>
<!--                        </li>-->
<!--                    --><?php //} ?>
<!--                </ul>-->
<!--            </li>-->
<!---->
<!--            <li class="--><?php //= $cont == 'dubai-values' ? 'active' : '' ?><!--">-->
<!--                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>-->
<!--                    <span class="hide-menu">--><?php //= Yii::t('app_admin', 'Dubai values') ?><!--<span class="fa arrow"></span></span>-->
<!--                </a>-->
<!--                <ul class="nav nav-second-level">-->
<!--                    --><?php //if (\app\models\Access::checkAccess('dubai-values/index')) { ?>
<!--                        <li class="--><?php //= $cont == 'works' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?><!--">-->
<!--                            --><?php //= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
//                                [ 'dubai-values/index' ]
//                            ) ?>
<!--                        </li>-->
<!--                    --><?php //} ?>
<!--                    --><?php //if (\app\models\Access::checkAccess('dubai-values/create')) { ?>
<!--                        <li class="--><?php //= $cont == 'works' && in_array($act, [ 'create' ]) ? 'active' : '' ?><!--">-->
<!--                            --><?php //= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
//                                [ 'dubai-values/create' ]
//                            ) ?>
<!--                        </li>-->
<!--                    --><?php //} ?>
<!--                </ul>-->
<!--            </li>-->



            <?php /*
            <li class="<?= $cont == 'posts' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-file-text fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Posts') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('posts/index')) { ?>
                        <li class="<?= $cont == 'posts' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'posts/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('posts/create')) { ?>
                        <li class="<?= $cont == 'posts' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'posts/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>

            <li class="<?= $cont == 'poll' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Poll') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('poll/index')) { ?>
                        <li class="<?= $cont == 'poll' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'poll/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('poll/create')) { ?>
                        <li class="<?= $cont == 'poll' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'poll/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>
            <li class="<?= $cont == 'tags' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Tags') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('tags/index')) { ?>
                        <li class="<?= $cont == 'tags' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'tags/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('tags/create')) { ?>
                        <li class="<?= $cont == 'tags' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'tags/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>

            <li class="<?= $cont == 'advertising' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Advertising') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('advertising/index')) { ?>
                        <li class="<?= $cont == 'advertising' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'advertising/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>
*/ ?>



<!--            <li class="devider"></li>-->

            <p style="font-size: 14px;padding: 0px 35px 0px 15px;background: #eee;color:#000;"><?= Yii::t('app_admin', 'System') ?></p>


            <li class="<?= $cont == 'lang' || $cont == 'source-message' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-language fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Localization') ?><span
                                class="fa arrow"></span></span> </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('lang/index')) { ?>
                        <li class="<?= $cont == 'lang' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Languages') . '</span>',
                                [ 'lang/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('lang/create')) { ?>
                        <li class="<?= $cont == 'lang' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create language') . '</span>',
                                [ 'lang/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <ul class="nav nav-second-level">
                        <?php if (\app\models\Access::checkAccess('source-message/index')) { ?>
                            <li class="<?= $cont == 'source-message' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                                <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Translations') . '</span>',
                                    [ 'source-message/index' ]
                                ) ?>
                            </li>
                        <?php } ?>
                        <?php if (\app\models\Access::checkAccess('source-message/create')) { ?>
                            <li class="<?= $cont == 'source-message' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                                <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create translation') . '</span>',
                                    [ 'source-message/create' ]
                                ) ?>
                            </li>
                        <?php } ?>
                    </ul>
                </ul>
            </li>


            <li class="<?= $cont == 'users' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-users fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Users') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('users/index')) { ?>
                        <li class="<?= $cont == 'users' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                                [ 'users/index' ]
                            ) ?>
                        </li>
                    <?php } ?>

                    <?php if (\app\models\Access::checkAccess('users/index')) { ?>
                        <li class="<?= $cont == 'users' && in_array($act, [ 'index', 'create', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
                                [ 'users/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                   
                </ul>
            </li>


            <li class="<?= $cont == 'settings' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-android fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Global defaults') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('settings/update')) { ?>
                        <li class="<?= $cont == 'settings' && in_array($act, [ 'update' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Settings') . '</span>',
                                [ 'settings/update' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>

            <li class="<?= $cont == 'log' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Logs') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('log/index')) { ?>
                        <li class="<?= $cont == 'log' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Logs list') . '</span>',
                                [ 'log/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    
                </ul>
            </li>

            <li class="<?= $cont == 'transactions' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-list fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Transactions') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('transactions/index')) { ?>
                        <li class="<?= $cont == 'log' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Transactions list') . '</span>',
                                [ 'transactions/index' ]
                            ) ?>
                        </li>
                    <?php } ?>

                </ul>
            </li>

            <li>
                &nbsp;
            </li>

<?php  /*

            <li class="<?= $cont == 'auth' || $cont == 'permission' ? 'active' : '' ?>">
                <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-tasks fa-fw" data-icon="v"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Access') ?><span class="fa arrow"></span></span>
                </a>
                <ul class="nav nav-second-level">
                    <?php if (\app\models\Access::checkAccess('auth/index')) { ?>
                        <li class="<?= $cont == 'auth' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Roles') . '</span>',
                                [ 'auth/index' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::checkAccess('auth/create')) { ?>
                        <li class="<?= $cont == 'auth' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create role') . '</span>',
                                [ 'auth/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                    <?php if (\app\models\Access::can('developer')) { ?>
                        <li class="<?= $cont == 'permission' && in_array($act, [ 'index', 'update', 'view' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Permissions') . '</span>',
                                [ 'permission/index' ]
                            ) ?>
                        </li>
                        <li class="<?= $cont == 'permission' && in_array($act, [ 'create' ]) ? 'active' : '' ?>">
                            <?= Html::a('<span class="hide-menu">' . Yii::t('app_admin', 'Create permission') . '</span>',
                                [ 'permission/create' ]
                            ) ?>
                        </li>
                    <?php } ?>
                </ul>
            </li>

            <li class="devider"></li>
            <li>
                <a href="javascript:void(0)" class="waves-effect">
                    <i class="fa fa-question text-danger fa-fw"></i>
                    <span class="hide-menu"><?= Yii::t('app_admin', 'Need help?') ?></span>
                </a>
            </li>
*/?>
        </ul>

    </div>
</div>
<!-- /.sidebar -->

<!-- Content Wrapper. Contains page content -->
<div id="page-wrapper">
    <?= $content ?>
    <footer class="footer text-center">
        <?= date('Y') ?> <?= Yii::t('app_admin', '&copy; Admin') ?>
    </footer>
</div>
<!-- /.content-wrapper -->

<?php $this->endContent(); ?>
