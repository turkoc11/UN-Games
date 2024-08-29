<?php

return [
    'adminEmail' => 'admin@assaysaas.com',
    'adminName' => 'UN GAMES',
    'sourceLanguage' => 'uk-UA',
    'cache'      => 0,
    'user.passwordResetTokenExpire' => 86400,
    'allowedIps' => [
        '127.0.0.1',
    ],
    'statuses'   => [
      
        1  => "Active",
        9  => "Disabled",
        
    ],
    'positions'   => [
        1  => 1,
        2  => 2,
        3  => 3,
        4  => 4,
        5  => 5,
        6  => 6,
        7  => 7,
        8  => 8,
        9  => 9,
    ],
    'types'   => [
      
        1  => "Product",
        2  => "Service",
        
    ],
    'stripe' => [
        'publicKey' => "pk_test_51Ploc5BXDmYtXMwttNzTHLRqLaoUd085xv2RYpP8a5ijuDOQat907zdvaoy416qvuFZZkCsX1WodTnhL95W1eKEo00YMHWXCxZ",
        'privateKey' => "sk_test_51Ploc5BXDmYtXMwtyTU4w8xaErOll0oPB6pefnMPVfMuNnREmIDWoD7IaeFxnfI9QH041OsjfiYkYmN3kCif2GL000UUPMVHRJ",
    ],
    'newsTypes'   => [

        1  => "Long",
        2  => "Short",

    ],
    'menu'   => [
      
        1  => "show in main",
        2  => "show in servicess",
        9  => "disabled in menu",
        
    ],
    'main'   => [
      
        1  => "Да",
        2  => "Нет",
        
    ],
    'feedback_statuses' => [
      
        1  => "Client",
        2  => "Supplier",
        
    ],
    'menugroups'   => [
        0  => "Header",
        1  => "Footer",
    ],

    'static_pages' => [
        'privacy-policy' => 'privacy-policy',
        'what-is-the-common' => 'what-is-the-common',
        'terms-and-condition' => 'terms-and-condition',
    ],
    'statuses-badge'   => [
        0  => 'label-inverse',
        1  => 'label-success',
        2  => 'label-info',
        9  => 'label-warning',
        10 => 'label-danger',
    ],
    'gender'   => [
        0 => "Empty",
        1  => "Woman",
        2  => "Man",
        3  => "Another",
    ],
    'yesno'   => [
        0  => "No",
        1  => "Yes",
    ],
    'dynamic_template' => [
        '_empty'  => "Default",
        '_contacts'  => "Contacts",
    ],
    'main_template' => [
        'get_in_touch'  => "Get in touch",
        'truly_transparent'  => "Truly Transparent",
        'what_we_do'    => 'What we do',
        'who_we_are'    => 'Who we are',
    ],

    'about_template' => [
        'who_we_are'  => "Who we are",
        'how_we_approach'  => "How we approach",
        'section_centered'    => 'Section centered',
        'in_addition'    => 'In addition',
        'section_centered_with_bg' => 'Section_centered_with_bg'
    ],

    'dubai_template' => [
        'dubai_is'  => "Dubai is",
        'introduction'  => "Introduction",
        'services'    => 'services',
    ],

    'post_template' => [
        '0'  => "Default",
        '1'  => "Video",
        '2'  => "Gallery",
        '3'  => "Image",
    ],
    'adv_place' => [
        '1'  => "More block",
        '2'  => "Right sidebar",
        '3'  => "Footer",
        '4'  => "Front page top-right",
        '5'  => "Mobile pop-up",
    ],
    'adv_type' => [
        '0'  => "Banner",
        '1'  => "Google",
    ],
    'columns' => [
        '0'  => "1",
        '1'  => "2",
    ],


];
