jQuery(function($){
  const $wrap = $('.map__wrapper');
  const svg   = $wrap.find('svg')[0];
  const viewportWidth = window.innerWidth;

  if (viewportWidth >= 768) {


      const keys = $('.map__card').map(function(){ return $(this).data('key'); }).get();

      let autoIdx = 0, autoTimer = null, isPaused = false;

      // Позиционируем карточки возле соответствующих пинов
      function positionCards(){
        if($wrap && $wrap[0]) {  const wrapRect = $wrap[0].getBoundingClientRect();
        $('.map__card').each(function(){
          const key = $(this).data('key');
          const node = svg.querySelector('.pin[data-key="'+key+'"]');
          if(!node) return;
          const bb = node.getBoundingClientRect();
          const x = bb.left + bb.width/2 - wrapRect.left;
          const y = bb.top  - wrapRect.top;
          // позиция сверху и немного левее центра пина
          $(this).css({ left: x+'px', top: y+'px' });
        });
      }
      }

      function clearActive(){
        $('.map__card').removeClass('is-visible');
        $(svg).find('.region, .pin').removeClass('is-active');
      }

      function showByKey(key){
        clearActive();
        $('.map__card[data-key="'+key+'"]').addClass('is-visible');
        const $region = $(svg).find('.region[data-key="'+key+'"]');
        const $pin    = $(svg).find('.pin[data-key="'+key+'"]');
        $region.addClass('is-active');
        $pin.addClass('is-active');
      }

      function startAutoplay(){
        stopAutoplay();
        autoTimer = setInterval(function(){
          if(isPaused || keys.length === 0) return;
          showByKey(keys[autoIdx]);
          autoIdx = (autoIdx + 1) % keys.length;
        }, 1800); // скорость "вспышек"
      }
    


      function stopAutoplay(){
        if(autoTimer){ clearInterval(autoTimer); autoTimer = null; }
      }

      // Наведение по региону или пину: показываем нужную карточку и паузим автоплей
      $(svg).on('mouseenter touchstart', '.region, .pin', function(){
        isPaused = true;
        const key = $(this).data('key');
        if(key) showByKey(key);
      });


      // Ушли курсором со svg — продолжаем автопоказ
      $(svg).on('mouseleave touchend', function(){
        isPaused = false;
      });

      // Клик по пину/региону — фиксируем карточку до следующего ухода мыши
      $(svg).on('click', '.region, .pin', function(){
        const key = $(this).data('key');
        if(key){
          stopAutoplay();
          showByKey(key);
        }
      });

      // Восстановить автоплей при уходе мыши с обёртки
      $wrap.on('mouseleave', function(){
        isPaused = false;
        startAutoplay();
      });

      // Дебаунс-resize для корректной привязки позиций
      let rAF;
      function onResize(){ 
        cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(positionCards);
      }
      $(window).on('load resize', onResize);

      // Инициализация
      positionCards();
      showByKey(keys[0]);  // начальный показ первой карточки
      startAutoplay();
  }
  if (viewportWidth < 768) {
    try {
      const mapSwiper = new Swiper('.map-slider', {
          slidesPerView: 1.5,
          spaceBetween: 10,
          loop: true,
          autoplay: {
              delay: 4000,
              disableOnInteraction: true,
          },
          
          breakpoints: {
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15
            },
          },
      })
    } catch(err) {
      console.log(err)
    }
  }

  $(document).ready(function() {
    function initMobileAccordion() {
        if ($(window).width() <= 991) {
            // Открываем первый таб по умолчанию
            $('.tour__tab').first().find('.tour__tab-heading').addClass('active');
            $('.tour__tab').first().find('.tour__tab-info').addClass('active');
            
            $('.tour__tab-heading').on('click', function() {
                const $heading = $(this);
                console.log('click')
                const $info = $heading.siblings('.tour__tab-info');
                const isActive = $heading.hasClass('active');
                
                $('.tour__tab-heading').removeClass('active');
                $('.tour__tab-info').removeClass('active');
                
                if (!isActive) {
                    $heading.addClass('active');
                    $info.addClass('active');
                }
            });
        } else {
            // Убираем мобильные классы
            $('.tour__tab-heading').removeClass('active');
            $('.tour__tab-info').removeClass('active');
        }
    }
    
    initMobileAccordion();
    
    $(window).on('resize', function() {
        initMobileAccordion();
    });
});

  $(document).ready(function() {
    // Открытие модального окна
    $('.openModal').click(function() {
        $('#modalOverlay').addClass('active');
        $('body').css('overflow', 'hidden'); // блокируем скролл
    });

    function closeModal() {
        $('#modalOverlay').removeClass('active');
        $('body').css('overflow', 'auto'); // возвращаем скролл
    }

    // Закрытие по крестику
    $('#closeModal').click(closeModal);

    // Закрытие по клику на оверлей
    $('#modalOverlay').click(function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Закрытие по Escape
    $(document).keyup(function(e) {
        if (e.keyCode === 27 && $('#modalOverlay').hasClass('active')) {
            closeModal();
        }
    });

    // Маска для телефона (простая)
    $('input[name="phone"]').on('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '+7 ($1) $2-$3');
            }
        }
        this.value = value;
    });
});
   

  $('.gallery-slider').slick({
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    focusOnSelect: true,
    arrows: true,
    dots: true,
    prevArrow: '<button type="button" class="slick-prev gallery-prev"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"/></svg></button>',
    nextArrow: '<button type="button" class="slick-next gallery-next"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2"/></svg></button>',
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});

  $('.director-slider').slick({
    centerMode: true,
    centerPadding: '0',
    slidesToShow: 1,  
    infinite: true,
    autoplay: true,
    arrows: false,
    dots: true
  });
<<<<<<< HEAD
=======

  try {
    const inviteSlider = new Swiper('.invite__slider-wrapper', {
      centeredSlides: true,
      slidesPerView: 1,
      loop: true,

      navigation: {
        nextEl: '.gallery__slider .swiper-button-next',
        prevEl: '.gallery__slider .swiper-button-prev',
      }
    });
  } catch(err) {

  }
>>>>>>> 1d6fa57 (17:01 3.9.25)

  try {
    const inviteSlider = new Swiper('.invite__slider-wrapper', {
      centeredSlides: true,
      slidesPerView: 1,
      loop: true,

      navigation: {
        nextEl: '.invite__slider-wrapper .swiper-button-next',
        prevEl: '.invite__slider-wrapper .swiper-button-prev',
      }
    });
  } catch(err) {
    console.log(err)
  }

  try {
    const teamSwiper = new Swiper('.team-slider', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,

      navigation: {
        nextEl: '.team__wrapper .swiper-button-next-team',
        prevEl: '.team__wrapper .swiper-button-prev-team',
      },
      
      breakpoints: {
        991: {
          slidesPerView: 2,
        },
      },
  })
  } catch(err) {
    console.log(err)
  }

  try{
    const teamCardSwiper = document.querySelectorAll('.team-reviews-slider');
    teamCardSwiper.forEach(function(slider, index) {
      new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 10,
        // loop: true,

        navigation: {
          nextEl: slider.querySelector('.swiper-button-next.reviews'),
          prevEl: slider.querySelector('.swiper-button-prev.reviews'),
        },
    })
  })
  } catch(err) {
    console.log(err)
  }


  $(document).ready(function() {
      // Обработчик клика по заголовкам секций
      $('.filter-header').on('click', function() {
          $(this).parent().toggleClass('collapsed');
      });

      // Добавляем обработчики для чекбоксов
      $('input[type="checkbox"]').on('change', function() {
          console.log(`${this.id}: ${this.checked}`);
      });
  });

   // Переключение аккордеона
   $('.faq-question').click(function() {
    const $item = $(this).closest('.faq-item');
    const $answer = $item.find('.faq-answer');
    
    if ($item.hasClass('active')) {
        // Закрываем активный элемент
        $answer.slideUp(300);
        $item.removeClass('active');
    } else {
        // Закрываем все остальные элементы
        $('.faq-item.active .faq-answer').slideUp(300);
        $('.faq-item.active').removeClass('active');
        
        // Открываем выбранный элемент
        $answer.slideDown(300);
        $item.addClass('active');
    }
    });

    // Кнопка закрытия
    $('.close-button').click(function() {
        $(this).closest('.faq-container').fadeOut(300);
    });

    // Плавная анимация при загрузке
    $('.faq-item').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        }).delay(index * 100).animate({
            'opacity': '1',
            'transform': 'translateY(0)'
        }, 500);
    });


    try {
    const routeSliders = document.querySelectorAll('.route-slider');
    
    routeSliders.forEach(function(slider, index) {
        new Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            // Навигация привязывается к текущему слайдеру
            navigation: {
                nextEl: slider.querySelector('.swiper-button-next'),
                prevEl: slider.querySelector('.swiper-button-prev'),
            },
            
            // pagination: {
            //     el: slider.querySelector('.swiper-pagination'),
            //     clickable: true,
            // },
            
            // breakpoints: {
            //     768: {
            //         slidesPerView: 2,
            //     },
            //     1024: {
            //         slidesPerView: 3,
            //     }
            // }
        });
    });
    } catch(err) {
      console.log(err)
    }

    var burger = $('.burger');
      var  slideMenu = $('.header__menu-nav');

    burger.click(function() {
        burger.toggleClass('open');
        slideMenu.toggleClass('active');
        $('body').toggleClass('no-scroll');
    });
});
