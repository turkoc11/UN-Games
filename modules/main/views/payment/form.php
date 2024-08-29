<?php
//var_dump($model); die;
//use Yii;
$paymentIntent = $model->paymentIntents->create(
    [
        'amount' => $sum,
        'currency' => 'usd',
        'automatic_payment_methods' => ['enabled' => true],
        'description'   => $product
//        'locale' => 'en'
    ]
)
?>

<body>
    <main>
        <h1>
            Stripe Samle
        </h1>
        <form id="payment-form" lang="en">
            <div id="payment-element">

            </div>
            <button>Pay</button>
            <div id="error-messages"></div>
        </form>
    </main>
<script  src="https://js.stripe.com/v3"></script>
<script>
    const stripe = Stripe('<?=Yii::$app->params['stripe']['publicKey']?>', {})
    const elements = stripe.elements({
        clientSecret: '<?=$paymentIntent->client_secret ?>'
        // locale: 'en'
    })
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')
    const form = document.getElementById('payment-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams:{
                return_url: 'http://ungames.company/payment/create'
            }
        })

        if(error) {
            const messages = document.getElementById('error-messages')
            messages.innerText = error.message;
        }
    })
</script>
</body>
