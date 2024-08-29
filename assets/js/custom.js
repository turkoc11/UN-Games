/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *
 */

"use strict";


$(function () {

    var alertTrigger = $('.confirm-alert');

    alertTrigger.click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var button = $(this);
        callSweatAlert(button);
        return false;
    });

    $(window).on('pjax:success', function (event, data, status, xhr, options) {
        var alertTrigger = $('.confirm-alert');
        alertTrigger.click(function (e) {
            var button = $(this);
            callSweatAlert(button);
            return false;
        });

    });
    if ($('.datemask').length) {
        var cleaveD = new Cleave('.datemask', {
            date: true,
            datePattern: ['d', 'm', 'Y']
        });
    }

    if ($('.phone-number').length) {
        var cleavePN = new Cleave('.phone-number', {
            phone: true,
            phoneRegionCode: 'us'
        });
    }

});


/*


var cleaveC = new Cleave('.currency', {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand'
});
var cleavePC = new Cleave('.purchase-code', {
    delimiter: '-',
    blocks: [4, 4, 4, 4],
    uppercase: true
});
var cleaveI = new Cleave('.invoice-input', {
    prefix: 'INV',
    delimiter: '-',
    blocks: [10],
    uppercase: true
});

*/


/*
var cc_last_type;
var cleaveCC = new Cleave('.creditcard', {
    creditCard: true,
    onCreditCardTypeChanged: function(type) {
        if(type !== 'unknown') {
            if(type == 'amex') {
                type = 'americanexpress';
            }else if(type == 'mastercard') {
                type = 'mastercard';
            }else if(type == 'visa') {
                type = 'visa';
            }else if(type == 'diners') {
                type = 'dinersclub';
            }else if(type == 'discover') {
                type = 'discover';
            }else if(type == 'jcb') {
                type = 'jcb';
            }
            $(".creditcard").removeClass(cc_last_type);
            $(".creditcard").addClass(type);
            cc_last_type = type;
        }
    }
});

$(".pwstrength").pwstrength();

$('.daterange-cus').daterangepicker({
    locale: {format: 'YYYY-MM-DD'},
    drops: 'down',
    opens: 'right'
});
$('.daterange-btn').daterangepicker({
    ranges: {
        'Today'       : [moment(), moment()],
        'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month'  : [moment().startOf('month'), moment().endOf('month')],
        'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(29, 'days'),
    endDate  : moment()
}, function (start, end) {
    $('.daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
});

$(".colorpickerinput").colorpicker({
    format: 'hex',
    component: '.input-group-append',
});
$(".inputtags").tagsinput('items');



function callSweatAlert(button) {
    var data = $(button).data();

    swal({
        title: data.question_text,
        text: data.full_text,
        icon: 'warning',
        buttons: true,
        dangerMode: true
    })
        .then((willDelete) => {
            if (willDelete) {
                setTimeout(function () {
                    $.post($(button).attr('href'));
                }, 500);
                swal(data.success_text, {
                    icon: 'success'
                });
            } else {
                swal(data.ok_text);
            }
        });

}
*/
