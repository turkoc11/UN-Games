<?php
$user = $this->params['headerContent']['user'];
$transactions = $this->params['headerContent']['transactions'];
if(isset(\Yii::$app->user->identity->assignments)) {
    $uroles = \Yii::$app->user->identity->assignments;
} else {
    $uroles = [];
}
$roles = '';
if(!empty($uroles)) {
    foreach ($uroles as $urole) {
        $roles .= " ".$urole;
    }
}


?>
<main class="main">
    <h3 class="profile-big-text"><?php echo Yii::t('app', 'С возвращением!')?></h3>
    <div class="profile-container">
        <div class="rank-field">
            <span><?php echo Yii::t('app', 'Ваш ранг:')?></span> <span class="dynamic-field"><?php echo $roles?></span>
        </div>

        <div class="balance-field">
            <span><?php echo Yii::t('app', 'Ваш баланс составляет: ')?> </span> <span class="dynamic-field"><?php echo $user->balance ?></span>
        </div>

        <div class="donation-field">
            <h3 class="donation-big-text"><?php echo Yii::t('app', 'История транзакций: ')?></h3>
            <?php if(!empty($transactions)) {?>
            <table class="donation-table">
                <tr>
                    <th><?php echo Yii::t('app', 'Дата')?></th>
                    <th><?php echo Yii::t('app', 'Сумма')?></th>
                </tr>
                <?php foreach ($transactions as $transaction) {?>
                <tr>
                    <td><?php echo date('d.m.Y',$transaction->created_at) ?></td>
                    <td><?php echo $transaction->amount ?></td>
                </tr>
                <?php }?>
            </table>
            <?php }?>
        </div>
    </div>
</main>