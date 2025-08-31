jQuery(function($){
  const $wrap = $('.map__wrapper');
  const svg   = $wrap.find('svg')[0];

  // Собираем ключи из карточек в порядке показа
  const keys = $('.map__card').map(function(){ return $(this).data('key'); }).get();

  console.log(keys)
  let autoIdx = 0, autoTimer = null, isPaused = false;

  // Позиционируем карточки возле соответствующих пинов
  function positionCards(){
    if($wrap && $wrap[0]) {  const wrapRect = $wrap[0].getBoundingClientRect();}
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


   

  $('.gallery-slider').slick({
    centerMode: true,
    centerPadding: '0',
    slidesToShow: 5,   // показываем 5 слайдов
    infinite: true,
    arrows: true,
    dots: true
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


