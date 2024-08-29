$(function () {

    var select = $('.select2');
    var datepicker = $('.datepicker');
    var alertTrigger = $('.confirm-alert');
    var file_input = $('.file_input');
    var redactor_text_area = $('.redactor_text_area');
    var fileParent = $('.profile-file');
    var fileField = fileParent.find('input[type="file"]');
    var iCheckboxes = $('.checkboxes input[type="checkbox"]');
    var sidebarSections = $('#side-menu .nav.nav-second-level');

    hideEmptySections(sidebarSections);
    initSelect2(select);
    initDatepicker(datepicker);
    initFile(file_input);
    initRedactor(redactor_text_area);
    initIcheck(iCheckboxes);
    initTree();

    alertTrigger.click(function (e) {
        var button = $(this);
        callSweatAlert(button);
        return false;
    });
    fileField.change(function () {
        setFilePreview(this, fileParent);
    });

    $(window).on('pjax:success', function (event, data, status, xhr, options) {

        var select = $('.select2');
        var datepicker = $('.datepicker');
        var alertTrigger = $('.confirm-alert');

        initSelect2(select);
        initDatepicker(datepicker);
        alertTrigger.click(function (e) {
            var button = $(this);
            callSweatAlert(button);
            return false;
        });

    });

});

function initSelect2(field) {
    if (field.length && !$(field).siblings('.select2-container').length) {
        $(field).each(function () {
            let select = $(this);
            let options = select.data();
            if (select.hasClass('select2-ajax')) {
                options.ajax =
                {
                    url: select.data('url'),
                    data: function (params) {

                        if (select.data('relation')) {
                            var relations = select.data('relation');
                            if (relations.split(' ').length > 1) {
                                relations = relations.split(' ');
                                params['relation'] = {};
                                $.each(relations, function (key, value) {
                                    var field = value.split('-')[1];
                                    var relation = $('.' + value);
                                    if (relation.length) params.relation[field] = relation.val();
                                });
                                params.relation = JSON.stringify(params.relation, null, 2);
                            } else {
                                let relation = $('.' + select.data('relation'));
                                if (relation.length) params.relation = relation.val();
                            }
                        }

                        params.q = params.term;
                        return params;
                    }
                };
            }
            options.width = select.data('width') ? select.data('width') : '100%';
            options.dropdownPosition = 'below';
            options.theme = 'default ' + select.data('style');
            select.select2(options);
            $(this).focus(function () {
                $(this).select2('open');
            });
            options = null;
        });
    }
}



function initFile(field) {
    if (field.length) {
        var options = $(field).data();
        field.fileinput(options);
    }
}

function initRedactor(field) {
    if (field.length) {
        var options = $(field).data();
        tinymce.init(options);
    }
}

function initDatepicker(field) {
    if (field.length) {
        var options = $(field).data();
        field.datepicker(options);
    }
}

function initIcheck(iCheckboxes) {
    $.each(iCheckboxes, function () {
        $(this).iCheck({
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal',
            increaseArea: '20%' // optional
        });
    })
}

function initTree() {
    $("ul.tree").checkTree();
    $(".action").find("input:checked").siblings('.checkbox').trigger('click');
    $(".action label").click(function () {
        $(this).siblings('.checkbox').trigger('click');
        $(this).siblings('input[type="checkbox"]').trigger('click');
    });
}

function callSweatAlert(button) {
    var data = $(button).data();
    swal({
        title: data.question_text,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: data.confirm_text,
        cancelButtonText: data.cancel_text,
        closeOnConfirm: false
    }, function () {
        swal(data.success_text, "", "success");
        setTimeout(function () {
            $.post($(button).attr('href'));
        }, 500);
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

function hideEmptySections(sidebarSections) {
    $.each(sidebarSections, function () {
        var section = $(this);
        if ($(section).find('li').length == 0) {
            $(section).parents('li').remove();
        }
    });
}
