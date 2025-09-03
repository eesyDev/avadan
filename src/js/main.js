jQuery(function($){
  const $wrap = $('.map__wrapper');
  const svg   = $wrap.find('svg')[0];

  // Собираем ключи из карточек в порядке показа
  const keys = $('.map__card').map(function(){ return $(this).data('key'); }).get();

  console.log(keys)
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

  $(document).ready(function() {
    // Открытие модального окна
    $('.openModal').click(function() {
        $('#modalOverlay').addClass('active');
        $('body').css('overflow', 'hidden'); // блокируем скролл
    });

    // Закрытие модального окна
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
    centerPadding: '0',
    slidesToShow: 5,   // показываем 5 слайдов
    infinite: true,
    arrows: true,
    dots: true
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
  $('.invite__slider').slick({
    centerMode: true,
    centerPadding: '0',
    slidesToShow: 1,  
    infinite: true,
    // dots: true,
    arrows: true,
  });

  $('.team-slider').slick({
    centerMode: true,
    centerPadding: '0',
    slidesToShow: 2,  
    infinite: true,
    // dots: true,
    arrows: true,
  });

  $('.team-reviews-slider').slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    prevArrow: '<button class="slick-prev team-prev">❮</button>',
    nextArrow: '<button class="slick-next team-next">❯</button>',
});


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
            // autoplay: {
            //     delay: 5000,
            //     disableOnInteraction: false,
            // },
            
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
});

// const gallerySwiper = new Swiper('.gallery__slider', {
//   centeredSlides: true,
//   slidesPerView: 3, // показываем 5 слайдов (1 активный + по 2 с каждой стороны)
//   spaceBetween: -150,
//   loop: true,

//   navigation: {
//     nextEl: '.gallery__slider .swiper-button-next',
//     prevEl: '.gallery__slider .swiper-button-prev',
//   },
  
//   breakpoints: {
//     320: {
//       slidesPerView: 1.5,
//       // spaceBetween: 10
//     },
//     768: {
//       slidesPerView: 3,
//       // spaceBetween: 15
//     },
//     1024: {
//       slidesPerView: 5,
//       // spaceBetween: 20
//     }
//   },
  

// });


