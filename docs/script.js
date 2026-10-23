(function () {
  "use strict";

  /* ---------- 顶部导航滚动态 ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });

  // 点击导航链接后收起菜单
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  /* ---------- 滚动显现 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero 倒计时演示 ---------- */
  var demoH = document.getElementById("demo-h");
  var demoM = document.getElementById("demo-m");
  var demoS = document.getElementById("demo-s");
  var demoMode = document.getElementById("demo-mode");
  var demoSet = document.getElementById("demo-set");

  var DEMO_DURATION = 3600; // 1 小时，演示用
  var endAt = Date.now() + DEMO_DURATION * 1000;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function format(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return { h: pad(h), m: pad(m), s: pad(s) };
  }

  function render(sec) {
    var t = format(sec);
    demoH.textContent = t.h;
    demoM.textContent = t.m;
    demoS.textContent = t.s;
  }

  function tick() {
    var left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    if (left <= 0) {
      // 演示循环：归零后重新开始
      endAt = Date.now() + DEMO_DURATION * 1000;
      left = DEMO_DURATION;
    }
    render(left);
    demoSet.textContent = "Set · +" + format(left).h + ":" + format(left).m + ":" + format(left).s;
  }

  demoMode.textContent = "Mode · 目标时间";
  tick();
  setInterval(tick, 250);
})();
