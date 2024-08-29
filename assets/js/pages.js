if (document.querySelector('main').classList.contains('main_about')) {
  const ourValuesSection = document.querySelector('.section-our-values');

  // Our values
  (function () {
    const showMoreBtn = ourValuesSection.querySelector('.styled-btn button');

    showMoreBtn.addEventListener('click', expandValues);

    function expandValues() {
      const values = ourValuesSection.querySelectorAll('.values .value');
      values.forEach((value) => {
        value.style.display = 'flex';
      });

      showMoreBtn.style.display = 'none';
      ourValuesSection.classList.add('expand');
    }
  })();

  // Our values - start

  const lottiePlayers = document.querySelectorAll('lottie-player');
  lottiePlayers.forEach((player) => {
    player.freeze();
  });

  (function () {
    splitText('.section-our-values .value__name');

    ScrollTrigger.saveStyles('.section-our-values *');

    let sectionTitle = ourValuesSection.querySelector('.section-title');
    let values = ourValuesSection.querySelectorAll('.value');

    let tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: ourValuesSection,
        start: 'top bottom-=30%',
      },
    });

    tl.from(sectionTitle, fadeUp());

    values.forEach((value) => {
      let valueName = value.querySelectorAll('.value__name span');
      let valueImageCover = value.querySelector('.value__img .cover');
      let valueImagePlayer = value.querySelector('.value__img .player');

      let tl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
          trigger: value,
          start: 'top bottom-=17%',
        },
      });

      tl.fromTo(
        valueName,
        { visibility: 'hidden' },
        { visibility: 'visible', stagger: 0.03, delay: 0.1 }
      );

      tl.to(
        valueImageCover,
        {
          x: '100%',
          duration: 0.7,
          onStart() {
            valueImagePlayer.seek('40%');
            valueImagePlayer.setSpeed(1.4);

            let cls = valueImagePlayer.classList;

            switch (true) {
              case cls.contains('player--competency'):
              case cls.contains('player--partnership-oriented'):
                valueImagePlayer.seek('40%');
                break;
              case cls.contains('player--confidentiality'):
              case cls.contains('player--attention'):
                valueImagePlayer.seek('20%');
                break;
              case cls.contains('player--honesty'):
                valueImagePlayer.seek('30%');
                break;
            }
          },
          onComplete() {
            valueImagePlayer.pause();
            valueImagePlayer.addEventListener('loop', () => {
              valueImagePlayer.pause();
            });

            valueImagePlayer.addEventListener('mouseenter', () => {
              valueImagePlayer.play();
              valueImagePlayer.setLooping(true);
            });
            valueImagePlayer.addEventListener('mouseleave', () => {
              valueImagePlayer.setLooping(false);
            });
          },
        },
        '-=.3'
      );
      // tl.from(valueImage, { scaleX: 1.15, scaleY: 1.15 });
    });
  })();
  // Our values - end
}

if (document.querySelector('main').classList.contains('main_contact-page')) {
  let tl = gsap.timeline({
    defaults: timelineDefaults,
    scrollTrigger: {
      trigger: '.main_contact-page',
    },
  });

  tl.to('.section-title', {
    autoAlpha: 1,
    x: 0,
    delay: 0.2,
  });
  tl.from('.section-title__line', { x: '-105%' }, '-=.1');
  tl.from('.section-title span', { y: '120%' }, '-=.2');
  tl.from('.breadcrumbs', fadeUp(), '-=.1');
  tl.from('.contact__img img', { x: '-105%' }, '-=.5');
  tl.from('.info__text', fadeUp(), '-=.2');
  tl.from('.detail__line', { x: '-105%' }, '-=.3');
  tl.from('.detail__row:not(:last-child) .detail__col', fadeUp(), '-=.3');
  tl.from('.detail__row:last-child', fadeUp(), '-=.4');
}

if (document.querySelector('main').classList.contains('main_home')) {
  const heroTitle = document.querySelector('.hero-text__title p');
  heroTitle.textContent = heroTitle.textContent.replace('/', '\n');

  // Reload page if screen width bigger than 992px (animation issue)
  function reloadPage() {
    let interval = null;

    // Store the window width
    let windowWidth = window.innerWidth;

    // Resize Event
    window.addEventListener('resize', function () {
      // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
      if (window.innerWidth != windowWidth) {
        // Update the window width for next time
        windowWidth = window.innerWidth;

        if (window.matchMedia('(min-width: 581px)').matches) {
          // 1281
          interval = setTimeout(() => {
            location.reload();
          }, 350);
        } else {
          clearInterval(interval);
        }
      }

      // Otherwise do nothing
    });
  }
  reloadPage();

  // section what we do
  (function () {
    if (window.innerWidth > 1281) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      let cards = gsap.utils.toArray('.card');
      let navs = document.querySelectorAll('.block-nav ul a');

      const scrubValue = 0.4;

      let section = document.querySelector('.section-what-we-do');

      ScrollTrigger.create({
        trigger: section,
        start: 'top+=5% top',
        end: () => (section.offsetWidth * navs.length) / 1.15,
        pin: true,
        anticipatePin: 1,
        scrub: scrubValue,
        invalidateOnRefresh: true,
        onLeave() {
          navs[navs.length - 1].classList.add('last');
        },
        onEnterBack() {
          navs[navs.length - 1].classList.remove('last');
        },
      });

      let blockCardsOffsetTop = section
        .querySelector('.section-body')
        .getBoundingClientRect();
      blockCardsOffsetTop = blockCardsOffsetTop.top + window.pageYOffset;

      cards.forEach((card, i) => {
        card.setAttribute('id', 'card-' + i);

        function prevAll(element) {
          var result = [];

          while ((element = element.previousElementSibling))
            result.push(element);
          return result;
        }
        let totalWidthToMove;

        function getTotalWidthToMove() {
          totalWidthToMove = 0;

          prevAll(card).forEach((cardBefore, i) => {
            let style =
              cardBefore.currentStyle || window.getComputedStyle(cardBefore);
            let marginRight = parseInt(style.marginRight);

            totalWidthToMove += cardBefore.offsetWidth - marginRight;
          });

          return totalWidthToMove;
        }
        gsap.to(card, {
          x: () => {
            return -getTotalWidthToMove();
          },
          duration: 0.05,
          ease: 'none',
          backgroundColor: '#080708',

          onUpdate() {
            const offsetStart = Math.round(
              card.offsetWidth * (i - 1) + 1 + blockCardsOffsetTop
            );

            const offsetEnd = Math.round(
              card.offsetWidth * i + blockCardsOffsetTop
            );

            const y = Math.round(window.scrollY);

            if (offsetStart + 700 < y && offsetEnd > y) {
              if (navs[i - 1]) {
                navs[i - 1].classList.remove('active');
                card.classList.remove('active');
              }

              card.classList.add('active');
              navs[i].classList.add('active');
            } else {
              navs[i].classList.remove('active');
            }
          },

          scrollTrigger: {
            trigger: '.section-what-we-do',
            start: 'top top',
            scrub: scrubValue,
            invalidateOnRefresh: true,
            end: () => '+=' + getTotalWidthToMove(),
          },
        });
      });

      /* Main navigation */
      navs.forEach((nav, i) => {
        nav.setAttribute('href', '#card-' + i);
        nav.addEventListener('click', function (e) {
          e.preventDefault();

          const targetElem = document.querySelector(
            e.target.getAttribute('href')
          );

          const sectionOffset =
            section.parentElement.offsetTop + targetElem.offsetLeft; // 10 being the margin - probably better to get it like it was done above

          gsap.to(window, {
            scrollTo: {
              y: sectionOffset - 1,
              autoKill: false,
            },
            duration: 1,
          });
        });
      });
    }
  })();

  // Hero - start
  (function () {
    ScrollTrigger.saveStyles('.section-hero *');

    let tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: '.section-hero',
        start: 'top bottom',
      },
    });

    tl.fromTo(
      '.section-hero .hero-text__title p span',
      { yPercent: 105 },
      { yPercent: 0, delay: 0.4, stagger: 0.2 }
    );

    tl.from('.section-hero .hero-text__small', fadeUp(), '-=.1');
  })();
  // Hero - end

  // Who we are - start
  (function () {
    ScrollTrigger.saveStyles('.section-who *');

    let tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: '.section-who',
        start: 'top bottom-=30%',
      },
    });

    tl.from('.section-who .section-title', fadeUp());
    tl.from(
      '.section-who .info-text p',
      { y: 20, autoAlpha: 0, stagger: 0.1 },
      '-=.2'
    );
    tl.from('.section-who .styled-btn', fadeUp(), '-=.2');
  })();
  // Who we are - end

  // What we do - start
  (function () {
    ScrollTrigger.saveStyles('.section-what-we-do *');

    let tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: '.section-what-we-do',
        start: 'top bottom-=30%',
      },
    });

    tl.from('.section-what-we-do .section-title', fadeUp());

    ScrollTrigger.matchMedia({
      '(min-width: 1281px), (max-height: 700px)': function () {
        tl.from('.section-what-we-do .block-nav ul li', {
          x: -10,
          autoAlpha: 0,
          stagger: 0.1,
        });
      },
      '(max-width: 1280px)': function () {
        let cards = gsap.utils.toArray('.card');
        cards.forEach((card) => {
          const cardText = card.querySelector('.card__text');
          const cardButton = card.querySelector('.card__button');
          const cardImg = card.querySelector('.card__img');
          let tl = gsap.timeline({
            defaults: timelineDefaults,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=30%',
            },
          });
          tl.from(card, fadeUp(30));
          tl.fromTo(
            cardImg,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, delay: 0.1 },
            '-=.3'
          );
          tl.fromTo(
            cardText,
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, delay: 0.1 },
            '-=.4'
          );
          tl.fromTo(
            cardButton,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0 },
            '-=.3'
          );
        });
      },
    });
  })();
  // What we do - end

  // Truly Transparent - start
  (function () {
    ScrollTrigger.saveStyles('.section-truly-transparent *');

    let tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: '.section-truly-transparent',
        start: 'top bottom-=30%',
      },
    });

    tl.from('.section-truly-transparent .section-title', fadeUp());

    tl.from(
      '.section-truly-transparent .info-text p',
      { autoAlpha: 0, stagger: 0.1 },
      '-=.2'
    );

    tl.from('.section-truly-transparent .styled-btn', { autoAlpha: 0 }, '-=.2');

    tl.from(
      '.section-truly-transparent .info-img img',
      {
        width: 0,
        duration: 0.7,
      },
      '-=.3'
    );

    tl.from(
      '.section-truly-transparent .info-img img',
      {
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 0.7,
      },
      '-=.3'
    );
  })();
  // Truly Transparent - end
}

if (document.querySelector('main').classList.contains('main_text-page')) {
  let scrollspyLinks = document.querySelectorAll('.scrollspy-link');
  let scrollspyBlocks = document.querySelectorAll('.content .scrollspy-block');
  scrollspyLinks.forEach((link, i) => {
    link.setAttribute('data-scroll', `scrollspy-target-${i}`);
    link.setAttribute('href', `#scrollspy-target-${i}`);
  });

  scrollspyBlocks.forEach((block, i) => {
    block.setAttribute('id', `scrollspy-target-${i}`);
  });

  (function () {
    let tl = gsap.timeline({
      defaults: timelineDefaults,
      scrollTrigger: {
        trigger: '.main_text-page',
      },
    });

    tl.from('.section-title span', {
      y: '120%',
      delay: 0.2,
    });
    tl.from('.breadcrumbs', fadeUp(), '-=.1');
    tl.from(
      '.sidebar__item',
      {
        x: -10,
        autoAlpha: 0,
        stagger: 0.1,
      },
      '-=.1'
    );
  })();
}

if (document.querySelector('main').classList.contains('main_why-dubai')) {

  // Our services - start
  (function () {
    const blockCards = document.querySelector('.block-cards__cards');
    if(blockCards.children.length % 2 !== 0) {
      blockCards.classList.add('cards-odd')
    } else {
      blockCards.classList.add('cards-even')
    }
  })();
  // Our services - end

}

function fadeUp(y = 20) {
  return {
    y: y,
    autoAlpha: 0,
  };
}

function timelineDefaults(duration = 0.7, ease = 'power1') {
  return {
    duration: duration,
    ease: ease,
  };
}

$(function () {
  var link = $('.scrollspy-link');

  let anchorOffset = null;
  if (window.innerWidth <= 768) {
    anchorOffset = 15;
  } else {
    anchorOffset = 30;
  }

  // Move to specific section when click on menu link
  link.on('click', function (e) {
    var target = $($(this).attr('href'));
    $('html, body').animate(
      {
        scrollTop: target.offset().top - anchorOffset,
      },
      600
    );
    // $(this).addClass('active');
    e.preventDefault();
  });

  // Run the scrNav when scroll
  $(window).on('scroll', function () {
    scrNav();
  });

  // scrNav function
  // Change active dot according to the active section in the window
  function scrNav() {
    var sTop = $(window).scrollTop();
    $('.scrollspy-block').each(function () {
      var id = $(this).attr('id'),
        offset = $(this).offset().top - $('.header').height() - 15,
        height = $(this).height();
      if (sTop >= offset && sTop < offset + height) {
        link.removeClass('active');
        $('.scrollspy-nav')
          .find('[data-scroll="' + id + '"]')
          .addClass('active');
      }
    });
  }
  scrNav();
});

function splitText(selector) {
  $(selector).html(function (i, html) {
    var chars = $.trim(html).split('');
    return '<span>' + chars.join('</span><span>') + '</span>';
  });
}
