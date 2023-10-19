init().then(() => {
  document.body.classList.remove('load');
});

async function init() {
  initScrollSection();
  initIntroBg();
  initStickyHeader();
  initSectionTitles();
  initStack();
  initImageView();
  initTabs();
  initMobileNav();
  initContacts();
  initAnchorLinks();
}

function initScrollSection() {
  const wrapper = document.querySelector('.wrapper');
  const scroll = document.querySelector('.scroll');
  const cards = document.querySelectorAll('.card');

  let contentWidth = 0;
  for (let card of cards) {
    contentWidth += Number.parseInt(window.getComputedStyle(card).width);
  }

  const height = window.innerWidth > 800 ? 3500 : 2000;

  wrapper.style.height = height + 'px';

  let cardStyle = window.getComputedStyle(cards[0]);
  let cardWidth = Number.parseInt(cardStyle.width);
  let cardHeight = Number.parseInt(cardStyle.height);

  const lastScroll = sessionStorage.getItem('lastscroll');
  const isBottom = localStorage.getItem('bottom');
  if (lastScroll) {
    scrollTo(0, lastScroll);
  }
  if (isBottom) {
    scroll.classList.add('bottom');
  }

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('lastscroll', scrollY)
    if (scroll.classList.contains('bottom')) {
      localStorage.setItem('bottom', true)
    } else {
      localStorage.removeItem('bottom');
    }
  });

  let scrollBg = document.querySelector('.scroll__bg');
  const startMargin = 30 * Math.random();
  const gap = 80;
  let scrollValue = 0;

  scrollBg.style.marginTop = startMargin + 'rem';

  document.addEventListener('scroll', () => {
    requestAnimationFrame(onScrollHandler);
  });

  scroll.addEventListener('scroll', () => {
    scroll.scrollTo({
      top: 0,
      left: scrollValue,
    })
  });

  function onScrollHandler() {
    const scrollHeight = contentWidth - cardWidth;
    const wrapperTop = wrapper.getBoundingClientRect().top;
    let percent = wrapperTop / (height - cardHeight);
    if (percent > 0) percent = 0;
    if (percent < -1) percent = -1;
    scrollValue = percent * scrollHeight * -1;
    scroll.scrollTo({
      top: 0,
      left: scrollValue,
    });

    if (wrapper.getBoundingClientRect().top <= 0 && wrapper.getBoundingClientRect().bottom > cardHeight) {
      scroll.classList.add('fixed');
      scroll.classList.add('bottom');
    } else {
      if (wrapper.getBoundingClientRect().top > -20) {
        scroll.classList.remove('bottom');
      }
      scroll.classList.remove('fixed');
    }
    scrollBg.style.marginTop = startMargin - gap * percent + 'rem';
  }
}

function initIntroBg() {
  const introBg = document.querySelector('.intro__bg');
  const lines = document.querySelectorAll('.intro__bg > div');

  let START_MARGIN = window.innerWidth * 0.3;
  let GAP = window.innerWidth * 0.7;

  lines[0].style.marginLeft = -START_MARGIN + 'px';
  lines[1].style.marginLeft = START_MARGIN + 'px'; 

  addElementTopScrollHandler(introBg, ScrollFunc)

  function ScrollFunc(percent) {
    lines[0].style.marginLeft = -START_MARGIN + GAP * percent + 'px';
    lines[1].style.marginLeft = START_MARGIN - GAP * percent + 'px';
  }
}

function initStickyHeader() {
  const header = document.querySelector('.header');

  const sticky = header.offsetTop;

  function onScroll() {
    if (window.scrollY > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  window.addEventListener('scroll', onScroll);
}

function initMobileNav() {
  const burger = document.querySelector('.burger');
  const mobile = document.querySelector('.mobile');

  burger.addEventListener('click', () => {
    if (mobile.classList.contains('top') || mobile.classList.contains('bottom')) {
      mobile.classList.remove('open');
      burger.classList.remove('open');
      setTimeout(() => {
        mobile.classList.remove('top');
        mobile.classList.remove('bottom');
      }, 300);
      return;
    }

    const burgerCenter = burger.getBoundingClientRect().top + scrollY + burger.clientHeight / 2;
    const burgerOffset = burger.getBoundingClientRect().bottom - burger.clientHeight / 2;
    if (Math.abs(burgerCenter - burgerOffset) >= mobile.clientHeight) {
      mobile.classList.add('bottom')
    } else {
      mobile.classList.add('top');
    }
    mobile.classList.add('open');
    burger.classList.add('open');
  });
}

function initSectionTitles() {
  const sectionTitles = document.querySelectorAll('.section__title');
  sectionTitles.forEach((title) => {
    const marginStart = parseInt(window.getComputedStyle(title).marginLeft);
    addElementMiddleScrollHandler(title, (percent) => {
      title.style.marginLeft = marginStart * (1 - percent) + 'px';
      title.style.opacity = percent;
    });
  });
}

function initStack() {
  const stack = document.querySelector('.stack__items');
  addElementMiddleScrollHandler(stack, (percent) => {
    stack.style.opacity = percent;
    stack.style.gap = `2rem ${4 * (1 - percent) + 2}rem`;
  }, 0.6);
}

function initImageView() {
  const OPEN_CLASS = 'open_image';
  const closeBtn = document.querySelector('.image_view__close');
  const imgView = document.querySelector('.image_view > img');
  const viewBg = document.querySelector('.image_view');

  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('image')) {
      const image = e.target;
      imgView.src = image.src;
      imgView.alt = image.alt;
      viewBg.classList.remove('hidden');
      document.body.classList.add(OPEN_CLASS);
    }
  });

  const closeView = () => {
    document.body.classList.remove(OPEN_CLASS);
    setTimeout(() => {
      viewBg.classList.add('hidden');
    }, 500);
  };

  viewBg.addEventListener('click', closeView);
  closeBtn.addEventListener('click', closeView);
}

function initTabs() {
  const headersWrapper = document.querySelector('.about__headers');
  const headers = document.querySelectorAll('.about__header');
  const contents = document.querySelectorAll('.about__content');

  const marginStart = parseInt(window.getComputedStyle(headersWrapper).marginLeft);
  addElementMiddleScrollHandler(headersWrapper, (percent) => {
    headersWrapper.style.marginLeft = marginStart * (1 - percent) + 'px';
    headersWrapper.style.opacity = percent;
  }, 0.7);

  const contentTexts = [];

  contents.forEach((cont) => {
    contentTexts.push(cont.textContent);
  });
  
  contents.forEach((cont, key) => {
    const text = cont.textContent;

    addElementMiddleScrollHandler(cont, (percent) => {
      if (!cont.classList.contains('hidden')) {
        cont.textContent = text.substring(0, Math.round(text.length * percent));
      }
    }, 0.7);
  });

  const unActivateHeaders = () => {
    headers.forEach((header) => {
      header.classList.remove('active');
    })
  };

  const enableContentById = (id) => {
    contents.forEach((cont) => {
      cont.classList.add('hidden');
    });
    contents.forEach((cont, key) => {
      if (key == id) {
        cont.classList.remove('hidden');
        const percent = getElementCurrentMiddlePercent(cont);
        cont.textContent = contentTexts[id].substring(0, Math.round(contentTexts[id].length * percent));
      }
    });
  };

  headersWrapper.addEventListener('click', (e) => {
    const elem = e.target;
    if (elem.classList.contains('about__header')) {
      unActivateHeaders();
      const id = parseInt(elem.dataset.id);
      elem.classList.add('active');
      enableContentById(id);
    }
  });
}

function initContacts() {
  const contactItems = document.querySelectorAll('.contacts__item');
  const contactText = document.querySelector('.contacts__text');
  const coef = window.innerWidth / window.innerHeight < 1.78 ? 0.95 : 0.8;

  contactItems.forEach((item) => {
    const startMargin = parseInt(window.getComputedStyle(item).marginLeft);
    addElementMiddleScrollHandler(item, (percent) => {
      item.style.marginLeft = startMargin * (1 - percent) + 'px';
      item.style.opacity = percent;
    }, 0.95);
  });

  const startTextMargin = parseInt(window.getComputedStyle(contactText).marginTop);
  addElementMiddleScrollHandler(contactText, (percent) => {
    contactText.style.marginTop = startTextMargin * (1 - percent) + 'px';
    contactText.style.opacity = percent;
  }, coef)

  const contactsBg = document.querySelector('.contacts__bg');
  const lines = document.querySelectorAll('.contacts__bg > div');

  let START_MARGIN = window.innerWidth * 0.5;
  let GAP = window.innerWidth * 0.3;

  lines[0].style.marginLeft = -START_MARGIN + 'px';
  lines[1].style.marginLeft = START_MARGIN + 'px'; 

  addElementMiddleScrollHandler(contactsBg, ScrollFunc, 0.8)

  function ScrollFunc(percent) {
    lines[0].style.marginLeft = -START_MARGIN + GAP * percent + 'px';
    lines[1].style.marginLeft = START_MARGIN - GAP * percent + 'px';
  }
}

function initAnchorLinks() {
  let headerHeight = window.getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  headerHeight = parseInt(headerHeight);

  const links = document.querySelectorAll('.anchor');
  links.forEach((link) => {
    const anchor = document.querySelector(link.getAttribute('href'));
    if (anchor) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: anchor.offsetTop - headerHeight,
          behavior: 'smooth',
        })
      });
    }
  });
}

function addElementTopScrollHandler(elem, callback) {
  let percent = 0;
  let elemHeight = elem.clientHeight;

  const onScrollHandler = () => {
    const elemTop = elem.getBoundingClientRect().top;
    const value = elemHeight + elemTop;
    percent = 1 - value / elemHeight;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    callback(percent);
  }

  document.addEventListener('scroll', onScrollHandler);
}

function addElementMiddleScrollHandler(elem, callback, heightCoef = 0.75) {
  let DisplayHeight = window.innerHeight * heightCoef;
  const offsetTop = elem.getBoundingClientRect().top + window.scrollY;
  const elemCenter = offsetTop + elem.clientHeight / 2;
  const underCenterHeight = elemCenter - (window.innerHeight * (1 - heightCoef));
  const maxBottomOffset = elemCenter - underCenterHeight; 

  document.addEventListener('scroll', () => {
    const displayCenter = window.scrollY + DisplayHeight;
    const bottomElemOffset = displayCenter - underCenterHeight;
    let percent = bottomElemOffset / maxBottomOffset;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    callback(percent);
  });
}

function getElementCurrentMiddlePercent(elem, heightCoef = 0.75) {
  const DisplayHeight = window.innerHeight * heightCoef;
  const offsetTop = elem.getBoundingClientRect().top + window.scrollY;
  const elemCenter = offsetTop + elem.clientHeight / 2;
  const underCenterHeight = elemCenter - (window.innerHeight * (1 - heightCoef));
  const maxBottomOffset = elemCenter - underCenterHeight; 
  const displayCenter = window.scrollY + DisplayHeight;
  const bottomElemOffset = displayCenter - underCenterHeight;
  let percent = bottomElemOffset / maxBottomOffset;
  if (percent < 0) percent = 0;
  if (percent > 1) percent = 1;
  return percent;
}
