"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function () {
  var faqSection = document.querySelector('.section-faq');
  var nav = document.querySelector('.nav');
  var textPage = document.querySelector('.main_text-page');

  if (faqSection) {
    new Accordion('.accordion-container', {
      onOpen: function onOpen(currentElement) {
        currentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }

  if (nav) {
    var navAcc = new Accordion('.nav-accordion', {
      duration: 400,
      elementClass: 'nav-ac',
      triggerClass: 'nav-ac-trigger',
      panelClass: 'nav-ac-panel'
    });
  }

  if (textPage) {
    if (document.querySelector('.sidebar__item--accordion')) {
      var sidebarAcc = new Accordion('.sidebar-accordion', {
        elementClass: 'sidebar-ac',
        triggerClass: 'sidebar-ac-trigger',
        panelClass: 'sidebar-ac-panel'
      }); // let index = null;

      var accLink = document.querySelectorAll('.sidebar__item--accordion .sidebar__anchor');

      _toConsumableArray(accLink).map(function (link, idx) {
        link.addEventListener('click', function () {
          // index = idx;
          sidebarAcc.toggle(idx);
        });
      });

      var links = document.querySelectorAll('.sidebar__anchor');

      _toConsumableArray(links).map(function (link) {
        link.addEventListener('click', function () {
          if (!link.parentElement.classList.contains('sidebar__item--accordion')) {
            // sidebarAcc.close(index);
            sidebarAcc.closeAll();
          }
        });
      });
    }

    if (document.querySelector('.qa')) {
      var qaAcc = new Accordion('.qa', {
        elementClass: 'qa-block',
        triggerClass: 'qa-block__title',
        panelClass: 'qa-block__text',
        onOpen: function onOpen(currentElement) {
          var id = currentElement.id;
          var yOffset = document.querySelector('.header').offsetHeight + 30;
          var element = document.getElementById(id);
          var y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      });
      var accSubLink = document.querySelectorAll('.sidebar__sub-anchor');

      _toConsumableArray(accSubLink).map(function (link, idx) {
        link.addEventListener('click', function () {
          qaAcc.open(idx);
        });
      });
    }
  }
})();
"use strict";

$(function () {
  function anchorAnimate(offsetVal) {
    $('html,body').animate({
      scrollTop: offsetVal
    }, 800);
  }

  $('.anchor').click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('go-top-button')) {
      anchorAnimate(0);
    }

    var aid = $(this).attr('href');

    if (typeof aid !== 'undefined' && aid !== false) {
      anchorAnimate($(aid).offset().top);
    }
  });
});
"use strict";

(function () {
  var faqSection = document.querySelector('.section-faq');

  if (faqSection) {
    (function () {
      var showMoreBtn = faqSection.querySelector('.faq__button span');
      var faqs = faqSection.querySelectorAll('.faq .faq-item');

      if (faqs.length <= 5) {
        showMoreBtn.style.display = 'none';
      }

      showMoreBtn.addEventListener('click', expandFaqs);

      function expandFaqs() {
        faqs.forEach(function (faq) {
          faq.style.display = 'grid';
        });
        showMoreBtn.style.display = 'none';
      }
    })();
  }
})();
"use strict";

(function () {
  var getInTouchSection = document.querySelector('.section-get-in-touch');

  if (getInTouchSection) {
    // const form = getInTouchSection.querySelector('.form');
    // const span = document.createElement('span');
    // span.classList.add('error-accept', 'form-span');
    // span.textContent = 'This field is required!';
    // function validateForm(e) {
    //   $('.form-checkbox-in').append(span);
    //   if (!form.accept.checked) {
    //     e.preventDefault();
    //     span.style.visibility = 'visible';
    //     return false;
    //   } else {
    //     span.style.visibility = 'hidden';
    //     return true;
    //   }
    // }
    // form.addEventListener('submit', validateForm);
    var formFields = getInTouchSection.querySelectorAll('.form-field');
    formFields.forEach(function (field) {
      field.addEventListener('click', function () {
        [].forEach.call(formFields, function (el) {
          el.classList.remove('is-focus');
        });
        field.classList.add('is-focus');
      });
    });
    ScrollTrigger.saveStyles('.section-get-in-touch *');
    var tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: '.section-get-in-touch',
        start: 'top bottom-=30%'
      }
    });
    tl.from('.section-get-in-touch .section-title', fadeUp());
    tl.from('.section-get-in-touch .section-heading__line', {
      x: '-105%'
    }, '-=.3');
    tl.from('.section-get-in-touch .form-field .form-field__line', {
      x: '-105%',
      duration: 0.7,
      stagger: 0.1
    }, '-=.3');
    tl.from('.section-get-in-touch .form-field label', {
      autoAlpha: 0,
      stagger: 0.1
    }, '-=.5');
    tl.fromTo(['.section-get-in-touch .form-field input', '.section-get-in-touch .form-field textarea'], {
      yPercent: 105
    }, {
      yPercent: 0,
      stagger: 0.1
    }, '-=.5');
    tl.from('.section-get-in-touch .form-checkbox', {
      autoAlpha: 0
    }, '-=.2');
    tl.from('.section-get-in-touch .form-submit button', {
      yPercent: 105
    }, '-=.3');
  }
})();
"use strict";

// HEADER SHOW/HIDE ON SCROLL
(function () {
  var header = document.querySelector('.header');
  var lastScrollTop = 0;
  window.addEventListener('scroll', function () {
    var scrollpos = window.scrollY;

    if (scrollpos > lastScrollTop && scrollpos >= header.offsetHeight) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollTop = scrollpos;
  });
})();
"use strict";

(function () {
  var scrollPosition = 0; // Lock Scroll

  function lockScroll(target) {
    scrollPosition = window.pageYOffset;
    target.style.overflow = 'hidden';
    target.style.position = 'fixed';
    target.style.top = "-".concat(scrollPosition, "px");
    target.style.width = '100%';
  } // Unlock Scroll


  function unlockScroll(target) {
    target.style.removeProperty('overflow');
    target.style.removeProperty('position');
    target.style.removeProperty('top');
    target.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
  }

  var burger = document.querySelector('.header-burger');
  var nav = document.querySelector('.nav');
  var navOverlay = nav.querySelector('.nav__overlay');
  var header = document.querySelector('.header');

  function showMenu() {
    nav.classList.add('active');
    header.classList.add('active');
    lockScroll(document.body);
  }

  function hideMenu() {
    nav.classList.remove('active');
    header.classList.remove('active');
    unlockScroll(document.body);
  }

  burger.addEventListener('click', function () {
    if (nav.classList.contains('active')) {
      hideMenu();
    } else {
      showMenu();
    }
  });
  navOverlay.addEventListener('click', hideMenu);
})();
"use strict";

(function () {
  var bannerSection = document.querySelector('.section-banner');

  if (bannerSection) {
    ScrollTrigger.saveStyles('.section-banner *');
    var tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: bannerSection,
        start: 'top bottom-=30%'
      }
    });
    tl.to('.section-banner .section-title', {
      autoAlpha: 1,
      x: 0,
      delay: 0.2
    });
    tl.from('.section-banner .section-title span', {
      y: '120%'
    }, '-=.1');
    tl.from('.section-banner .breadcrumbs', fadeUp(), '-=.1');
  }
})();
"use strict";

(function () {
  var faqSection = document.querySelector('.section-faq');

  if (faqSection) {
    (function () {
      ScrollTrigger.saveStyles('.section-faq *');
      var faqItems = faqSection.querySelectorAll('.faq-item');
      faqItems.forEach(function (faq) {
        var faqLineTop = faq.querySelector('.faq-item__line--top');
        var faqLineBottom = faq.querySelector('.faq-item__line--bottom');
        var faqNum = faq.querySelector('.faq-item__num');
        var faqQ = faq.querySelector('.faq-item__q');
        var tl = gsap.timeline({
          defaults: timelineDefaults,
          scrollTrigger: {
            trigger: faq,
            start: 'top bottom-=30%'
          }
        });
        tl.to(faqLineTop, {
          width: '100%'
        });
        tl.from(faqNum, fadeUp(), '-=.3');
        tl.from(faqQ, fadeUp(), '-=.2');
        tl.to(faqLineBottom, {
          width: '100%'
        }, '-=.3');
      });
    })();
  }
})();
"use strict";

(function () {
  var imgTextSections = document.querySelectorAll('.section-img-text');
  imgTextSections.forEach(function (section) {
    if (section) {
      var sectionAllElements = section.querySelectorAll('*');
      var sectionTitle = section.querySelector('.section-title');
      var sectionImg = section.querySelector('.img-text__img img');
      var sectionText = section.querySelectorAll('.img-text__text p');
      ScrollTrigger.saveStyles(sectionAllElements);
      var tl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=30%'
        }
      });
      tl.to(sectionImg, {
        scaleX: 1,
        scaleY: 1,
        delay: 0.1
      });
      tl.from(sectionTitle, {
        x: '-100%',
        duration: 0.8
      }, '-=.5');
      tl.from(sectionText, {
        y: 10,
        autoAlpha: 0,
        stagger: 0.2
      });
    }
  });
})();
"use strict";

(function () {
  var makeRemarkableSection = document.querySelector('.section-make-remarkable');

  if (makeRemarkableSection) {
    splitText('.section-make-remarkable .block-text *');
    splitText('.section-make-remarkable .block-link *');
    ScrollTrigger.saveStyles('.section-make-remarkable *');
    var tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: makeRemarkableSection,
        start: 'top bottom-=30%'
      }
    });
    tl.fromTo(['.block-text span, .block-link span'], {
      visibility: 'hidden'
    }, {
      visibility: 'visible',
      stagger: 0.02,
      delay: 0.1
    });
  }
})();
"use strict";

(function () {
  var offersSection = document.querySelector('.section-offers');

  if (offersSection) {
    var offers = offersSection.querySelector('.offers');
    var offerItems = offersSection.querySelectorAll('.offers__item'); // if offer items less than 2

    offerItems.length <= 2 ? offers.classList.add('offers--fill') : '';

    (function () {
      var textLimit = 160;
      offerItems.forEach(function (offer) {
        var offerText = offer.querySelector('.offer__text p');

        if (offerText.textContent.length > textLimit) {
          offerText.textContent = "".concat(offerText.textContent.substring(0, textLimit));
        }
      });
    })();

    (function () {
      ScrollTrigger.saveStyles('.section-offers *');
      var tl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
          trigger: offersSection,
          start: 'top bottom-=30%'
        }
      });
      tl.from('.section-heading .section-title', fadeUp());
      tl.from('.section-heading p', fadeUp(), '-=.4');
      offerItems.forEach(function (offer) {
        var offerIcon = offer.querySelector('.offer__img');
        var offerTitle = offer.querySelector('.offer__title');
        var offerText = offer.querySelector('.offer__text');
        var tl = gsap.timeline({
          defaults: timelineDefaults,
          scrollTrigger: {
            trigger: offer,
            start: "top bottom-=30%"
          }
        });
        tl.to(offerIcon, {
          y: 0,
          autoAlpha: 1,
          delay: 0.2
        });
        tl.to(offerTitle, {
          y: 0,
          autoAlpha: 1
        }, '-=.4');
        tl.to(offerText, {
          y: 0,
          autoAlpha: 1
        }, '-=.3');
      });
    })();
  }
})();
"use strict";

(function () {
  var structuringSections = document.querySelectorAll('.section-structuring');
  structuringSections.forEach(function (section) {
    if (section) {
      var sectionAllElements = section.querySelectorAll('*');
      var sectionTitle = section.querySelector('.section-title');
      var blockTexts = section.querySelectorAll('.block-text p');
      var blockImg = section.querySelector('.block-img img');
      var blockCards = section.querySelectorAll('.block-cards__cards .card');
      var blockCardsNotice = section.querySelectorAll('.block-cards__notice');
      ScrollTrigger.saveStyles(sectionAllElements);
      var tl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=30%'
        }
      });
      tl.from(sectionTitle, {
        x: '-100%'
      });
      tl.from(blockTexts, {
        y: 10,
        autoAlpha: 0,
        stagger: 0.2
      });

      if (blockImg) {
        tl.from(blockImg, {
          width: 0,
          duration: 0.7
        }, '-=.3');
        tl.from(blockImg, {
          scaleX: 1.15,
          scaleY: 1.15,
          duration: 0.7
        }, '-=.3');
      }

      if (blockCards) {
        tl.from(blockCards, {
          y: 20,
          autoAlpha: 0,
          stagger: 0.1
        }, '-=.4');
      }

      if (blockCardsNotice) {
        tl.from(blockCardsNotice, fadeUp(), '-=.3');
      }
    }
  });
})();
"use strict";

(function () {
  var textOnCenterSections = document.querySelectorAll('.section-text-on-center');
  textOnCenterSections.forEach(function (section) {
    var sectionAllElements = section.querySelectorAll('*');
    ScrollTrigger.saveStyles(sectionAllElements);

    if (section.classList.contains('section-text-on-center--bg')) {
      var sectionBg = section.querySelector('.block-bg');
      var sectionText = section.querySelector('.block p');
      sectionBg.style.backgroundPosition = "50% ".concat(innerHeight / 4, "px");
      gsap.to(sectionBg, {
        backgroundPosition: "50% ".concat(-innerHeight / 4),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          scrub: true
        }
      });
      gsap.from(sectionText, {
        y: 20,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=30%'
        }
      });
    }

    if (section && !section.classList.contains('section-text-on-center--bg')) {
      var _sectionText = section.querySelectorAll('.block p span');

      var tl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=30%'
        }
      });
      tl.from(_sectionText, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        delay: 0.1
      });
    }
  });
})();
"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var lazyVideos = [].slice.call(document.querySelectorAll('video.lazy'));

  if ('IntersectionObserver' in window) {
    var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];

            if (typeof videoSource.tagName === 'string' && videoSource.tagName === 'SOURCE') {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove('lazy');
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });
    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
"use strict";