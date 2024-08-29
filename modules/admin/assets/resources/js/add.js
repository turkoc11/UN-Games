$(function () {
    // var select = $('.select2');
    // var alertTrigger = $('.confirm-alert');
    // var datepicker = $('.datepicker');
    // var fileParent = $('.profile-file');
    // var fileField = fileParent.find('input[type="file"]');

    // initSelect2(select);
    // initDatepicker(datepicker);

    // alertTrigger.click(function(){
    //     callSweatAlert();
    // });

    // fileField.change(function() {
    //     setFilePreview(this,fileParent);
    // });

});

function initSelect2(field) {
    if (field.length) {
        field.select2({
            placeholder: $(this).attr('data-placeholder')
        });
    }
}

function initDatepicker(field) {
    if (field.length) {
        field.datepicker({
            autoclose: true
        });
    }
}

function callSweatAlert() {
    swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        swal("Successful!", "", "success");
    });
}

function setFilePreview(input, thumb) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            thumb.css('background', 'url(' + e.target.result + ') no-repeat center');
            thumb.css('background-size', 'cover');
        };

        reader.readAsDataURL(input.files[0]);
    }
}
