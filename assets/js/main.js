/* =====================================================================
   つくみ / TSUKUMI — ページの仕組み
   コンテンツは content.js で管理しています。通常このファイルを編集する必要はありません。
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- コンテンツの読み込み（content/*.json） ---------- */
  var FILES = ["site", "photography", "articles", "lyrics", "writing", "profile"];
  var base = document.body.getAttribute("data-base") || "";
  Promise.all(FILES.map(function (f) {
    return fetch(base + "content/" + f + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(f);
      return r.json();
    });
  })).then(function (d) {
    window.SITE = d[0];
    window.PHOTOGRAPHY = d[1];
    window.ARTICLES = d[2].items || [];
    window.LYRICS = d[3].items || [];
    window.WRITING = d[4].items || [];
    window.PROFILE = d[5];
    start();
  }).catch(function () {
    document.getElementById("main").innerHTML =
      '<p style="padding:64px 24px;line-height:2">コンテンツを読み込めませんでした。<br>' +
      "パソコンで確認する場合は、ファイルを直接開かずにローカルサーバーで開いてください（README参照）。</p>";
    document.body.style.opacity = 1;
  });

  function start() {
  var S = window.SITE;
  var page = document.body.getAttribute("data-page");
  var main = document.getElementById("main");

  /* ---------- 小さな道具 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function ext(url, inner, cls) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer"' + (cls ? ' class="' + cls + '"' : "") + ">" + inner + "</a>";
  }
  var ARROW = '<span class="arrow" aria-hidden="true"><svg viewBox="0 0 34 12" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 6h32M27 1l5 5-5 5"/></svg></span>';
  var ARROW_PREV = ARROW.replace('class="arrow"', 'class="arrow arrow--prev"');
  var ARROW_EXT = '<span class="arrow arrow--ext" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 12L12 2M5 2h7v7"/></svg></span>';
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    note: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="currentColor"/><path d="M8 17V8.6h5.2c1.6 0 2.8 1.2 2.8 2.8V17" fill="none" stroke="#fff" stroke-width="2"/></svg>',
  };
  function hashId() { return decodeURIComponent((location.hash || "").replace(/^#/, "")); }
  function setTitle(t) { document.title = t ? t + "｜" + S.name + " / " + S.nameEn : S.name + " / " + S.nameEn; }

  /* ---------- ヘッダー ---------- */
  function header() {
    var isHome = page === "home";
    var current = { work: "photography", lyric: "lyrics", text: "writing" }[page] || page;
    var items = S.nav.map(function (n) {
      return '<li><a href="' + n.href + '"' + (n.key === current ? ' aria-current="page"' : "") +
        '><span class="ja">' + esc(n.ja) + '</span><span class="en">' + esc(n.en) + "</span></a></li>";
    }).join("");
    return '<header class="site-header' + (isHome ? " site-header--home" : "") + '">' +
      '<div class="wrap site-header__inner">' +
      '<a class="logo" href="index.html" aria-label="' + esc(S.name) + ' ホームへ"><span class="logo__ja">' + esc(S.name) + '</span><span class="logo__en en">' + esc(S.nameEn) + "</span></a>" +
      '<button class="menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="gnav"><span></span><span></span></button>' +
      '<nav class="gnav" id="gnav" aria-label="メインメニュー"><ul>' + items + "</ul></nav>" +
      "</div></header>";
  }

  /* ---------- フッター ---------- */
  function snsList() {
    return '<ul class="sns">' + S.sns.map(function (s) {
      return "<li>" + ext(s.url, (ICONS[s.icon] || "") + "<span>" + esc(s.name) + "</span>") + "</li>";
    }).join("") + "</ul>";
  }
  function footer() {
    var back = page === "home"
      ? '<span class="copyright">© ' + new Date().getFullYear() + " " + esc(S.nameEn) + "</span>"
      : '<a class="home-link" href="index.html">' + ARROW + '<span>ホームへ戻る <span class="en" style="font-size:11.5px;margin-left:.6em">HOME</span></span></a>';
    var contact = page === "contact" ? "" : '<a class="footer-contact" href="contact.html"><span>お問い合わせ</span><span class="en">CONTACT</span>' + ARROW + "</a>";
    return '<footer class="site-footer"><div class="wrap site-footer__inner">' + back + contact + snsList() +
      (page === "home" ? "" : '<span class="copyright">© ' + new Date().getFullYear() + " " + esc(S.nameEn) + "</span>") +
      "</div></footer>";
  }

  function pageHead(ja, en) {
    return '<section class="page-head"><span class="page-head__deco" aria-hidden="true"></span><div class="wrap">' +
      '<h1 class="page-head__ja reveal">' + esc(ja) + '<span class="page-head__en en">' + esc(en) + "</span></h1>" +
      '<div class="page-head__rule"></div></div></section>';
  }

  /* 前へ・次へ */
  function pager(base, prev, next, listHref, listLabel, label) {
    return '<nav class="pager" aria-label="' + label + '">' +
      (prev ? '<a href="' + base + '#' + encodeURIComponent(prev.id) + '">' + ARROW_PREV + "<span><small>PREV</small>" + esc(prev.title) + "</span></a>" : "<span></span>") +
      '<a class="pager__list" href="' + listHref + '">' + listLabel + "</a>" +
      (next ? '<a class="pager__next" href="' + base + '#' + encodeURIComponent(next.id) + '"><span><small>NEXT</small>' + esc(next.title) + "</span>" + ARROW + "</a>" : "<span></span>") +
      "</nav>";
  }

  /* =====================================================================
     各ページ
     ===================================================================== */
  var R = {};

  R.home = function () {
    var cats = S.categories.map(function (c) {
      var body;
      if (c.text) {
        body = '<p class="cat__text">' + esc(c.text) + "</p>";
      } else {
        body = '<ul class="cat__list">' + (window.WRITING || []).map(function (w) {
          return "<li>" + esc(w.title) + (w.status === "in-progress" ? "<small>（制作中）</small>" : "") + "</li>";
        }).join("") + "</ul>";
      }
      return '<a class="cat cat--' + c.tone + ' reveal" href="' + c.href + '">' +
        '<span class="cat__deco" aria-hidden="true"></span>' +
        '<span class="cat__no">' + esc(c.no) + "</span>" +
        '<h2 class="cat__ja">' + esc(c.ja) + "</h2>" +
        '<span class="cat__en en">' + esc(c.en) + "</span>" + body + ARROW + "</a>";
    }).join("");

    return '<section class="hero">' +
      '<svg class="hero__deco" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">' +
      '<circle cx="1420" cy="900" r="700" stroke="#fff" stroke-opacity=".75" stroke-width="1.2"/>' +
      '<circle cx="1420" cy="900" r="520" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>' +
      '<circle cx="925" cy="405" r="8" fill="#111"/>' +
      "</svg>" +
      '<div class="wrap hero__inner">' +
      '<h1 class="hero__title">' + esc(S.name) + '<span class="sr-only"> / ' + esc(S.nameEn) + "</span></h1>" +
      '<div class="hero__rule"></div>' +
      '<p class="hero__catch">' + esc(S.catch) + "</p>" +
      '<p class="hero__concept en"><span>' + esc(S.concept[0]) + "</span><span>" + esc(S.concept[1]) + "</span></p>" +
      "</div></section>" +
      '<section class="cats" aria-label="カテゴリ">' + cats + "</section>" +
      '<a class="profile-band" href="profile.html"><div class="wrap profile-band__inner">' +
      '<span class="profile-band__ja">経歴</span>' +
      '<span class="profile-band__en en">PROFILE / CAREER</span>' +
      '<span class="profile-band__text">これまでの歩みや活動について。</span>' + ARROW +
      "</div></a>" +
      '<a class="contact-band" href="contact.html"><div class="wrap contact-band__inner">' +
      '<span class="contact-band__ja">お問い合わせ</span>' +
      '<span class="contact-band__en en">CONTACT</span>' +
      '<span class="contact-band__text">' + esc(S.contactLead || "ご連絡はこちらから。") + "</span>" + ARROW +
      "</div></a>";
  };

  R.photography = function () {
    var P = window.PHOTOGRAPHY;
    var cards = P.works.map(function (w) {
      var solid = P.galleryFrame !== "photo";
      var frame = solid
        ? '<div class="work-card__frame work-card__frame--solid" style="background:' + esc(w.frameColor || "#8DAFBB") + '">'
        : '<div class="work-card__frame" style="background:#111"><img src="' + esc(w.images[0].thumb || w.images[0].src) + '" alt="' + esc(w.images[0].alt || w.title) + '" loading="lazy" decoding="async">';
      return '<a class="work-card reveal" href="work.html#' + encodeURIComponent(w.id) + '">' + frame +
        '<span class="work-card__frame-no">' + esc(w.no) + "</span>" +
        '<span class="work-card__frame-count">' + w.images.length + (w.images.length > 1 ? " PHOTOS" : " PHOTO") + "</span></div>" +
        '<div class="work-card__body"><h2 class="work-card__title">' + esc(w.title) + "</h2>" + ARROW +
        '<span class="work-card__meta">' + esc([w.artist, w.type].filter(Boolean).join("　／　")) + "</span>" +
        (w.summary ? '<p class="work-card__summary">' + esc(w.summary) + "</p>" : "") +
        "</div></a>";
    }).join("");

    var n = P.noteLink;
    return pageHead("写真", "PHOTOGRAPHY") +
      '<section class="section"><div class="wrap">' +
      '<div class="photo-intro"><p class="lead reveal">' + esc(P.intro) + "</p>" +
      (n && n.url ? '<div class="reveal">' + ext(n.url, "<span>" + esc(n.label) + "</span>" + ARROW_EXT, "text-link") +
        '<span class="text-link__sub">note｜' + esc(n.title) + "</span></div>" : "") +
      "</div>" +
      '<div class="works">' + cards + "</div></div></section>";
  };

  R.work = function () {
    var works = window.PHOTOGRAPHY.works;
    var i = works.findIndex(function (w) { return w.id === hashId(); });
    if (i < 0) i = 0;
    var w = works[i];
    setTitle(w.title + "（写真）");
    var multi = w.images.length > 1;
    var shots = w.images.map(function (im, k) {
      return '<button class="shot reveal" type="button" data-lb="' + k + '" aria-label="' + esc(im.alt || w.title) + 'を拡大表示">' +
        '<img src="' + esc(im.src) + '" alt="' + esc(im.alt || w.title) + '" ' + (k ? 'loading="lazy" ' : "") + 'decoding="async">' +
        (multi ? '<span class="shot__label">' + (k + 1) + " / " + w.images.length + "</span>" : "") + "</button>";
    }).join("");
    var prev = works[i - 1];
    var next = works[i + 1];

    return '<section class="section" style="padding-top:clamp(48px,7vw,96px)"><div class="wrap">' +
      '<article class="work-detail">' +
      '<div class="work-detail__images' + (multi ? " work-detail__images--multi" : "") + '">' + shots + "</div>" +
      '<div class="work-detail__info reveal">' +
      '<span class="work-detail__no">WORK ' + esc(w.no) + "</span>" +
      '<h1 class="work-detail__title">' + esc(w.title) + "</h1>" +
      '<div class="work-detail__meta">' + esc([w.artist, w.type].filter(Boolean).join("　／　")) + "</div>" +
      '<div class="statement"><span class="label-s en">STATEMENT</span>' + esc(w.statement) + "</div>" +
      (w.note ? '<div class="work-note"><span class="label-s en">NOTE</span>' + esc(w.note) + "</div>" : "") +
      "</div></article>" +
      pager("work.html", prev, next, "photography.html", "作品一覧へ", "作品の移動") +
      "</div></section>";
  };

  R.articles = function () {
    var rows = (window.ARTICLES || []).map(function (a, k) {
      var host = "";
      try { host = new URL(a.url).hostname.replace(/^www\./, ""); } catch (e) {}
      var title = a.title
        ? esc(a.title)
        : '<span class="placeholder">' + esc(a.label || "記事") + "（タイトル未入力）</span>";
      var meta = [a.source || host, a.date].filter(Boolean).map(esc).join("</span><span>");
      return '<li class="reveal">' + ext(a.url,
        '<span class="row__no">' + String(k + 1).padStart(3, "0") + "</span>" +
        "<div><h2 class=\"row__title\">" + title + "</h2>" +
        (a.description ? '<p class="row__desc">' + esc(a.description) + "</p>" : "") +
        (meta ? '<div class="row__meta"><span>' + meta + "</span></div>" : "") + "</div>" + ARROW_EXT, "row") + "</li>";
    }).join("");
    return pageHead("記事", "ARTICLES") +
      '<section class="section"><div class="wrap">' +
      '<p class="lead reveal" style="margin-bottom:clamp(40px,6vw,64px)">noteや外部サイトに掲載した記事。</p>' +
      '<ul class="list">' + rows + "</ul></div></section>";
  };

  R.lyrics = function () {
    var rows = (window.LYRICS || []).map(function (l) {
      return '<li class="reveal"><a class="row" href="lyric.html#' + encodeURIComponent(l.id) + '">' +
        '<span class="row__no">' + esc(l.no) + "</span>" +
        '<div><h2 class="row__title">' + esc(l.title) + "</h2>" +
        (l.keywords && l.keywords.length ? '<div class="chips">' + l.keywords.map(function (k) { return '<span class="chip">' + esc(k) + "</span>"; }).join("") + "</div>" : "") +
        "</div>" + ARROW + "</a></li>";
    }).join("");
    return pageHead("作詞", "LYRICS") +
      '<section class="section"><div class="wrap">' +
      '<p class="lead reveal" style="margin-bottom:clamp(40px,6vw,64px)">オリジナルの歌詞。</p>' +
      '<ul class="list">' + rows + "</ul></div></section>";
  };

  R.lyric = function () {
    var list = window.LYRICS;
    var i = list.findIndex(function (l) { return l.id === hashId(); });
    if (i < 0) i = 0;
    var l = list[i];
    setTitle(l.title + "（作詞）");
    var prev = list[i - 1];
    var next = list[i + 1];
    return '<section class="section" style="padding-top:clamp(56px,8vw,112px)"><div class="wrap">' +
      '<div class="lyric-head reveal"><span class="lyric-head__no">' + esc(l.no) + "</span>" +
      '<h1 class="lyric-title">' + esc(l.title) + "</h1></div>" +
      '<div class="lyric-layout"><aside class="lyric-aside">' +
      '<span class="label-s en">LYRICS</span><div>作詞　' + esc(S.name) + "</div>" +
      (l.keywords && l.keywords.length ? '<span class="label-s en" style="margin-top:28px">KEYWORDS</span><div class="chips">' +
        l.keywords.map(function (k) { return '<span class="chip">' + esc(k) + "</span>"; }).join("") + "</div>" : "") +
      (l.note ? '<p style="margin-top:28px;white-space:pre-line">' + esc(l.note) + "</p>" : "") +
      "</aside>" +
      '<pre class="lyric-body reveal">' + esc(l.body) + "</pre></div>" +
      pager("lyric.html", prev, next, "lyrics.html", "歌詞一覧へ", "歌詞の移動") +
      "</div></section>";
  };

  R.writing = function () {
    var rows = (window.WRITING || []).map(function (w, k) {
      var done = w.status === "published" && w.body;
      var status = done
        ? '<span class="status status--done">公開中 <span class="en">PUBLISHED</span></span>'
        : '<span class="status">制作中 <span class="en">IN PROGRESS</span></span>';
      var inner = '<span class="row__no">' + String(k + 1).padStart(3, "0") + "</span>" +
        '<div><h2 class="row__title">' + esc(w.title) + "</h2>" +
        (w.summary ? '<p class="row__desc">' + esc(w.summary) + "</p>" : "") + "</div>" + status;
      return '<li class="reveal">' + (done
        ? '<a class="row writing-row" href="text.html#' + encodeURIComponent(w.id) + '">' + inner + "</a>"
        : '<div class="row writing-row">' + inner + "</div>") + "</li>";
    }).join("");
    return pageHead("執筆", "WRITING") +
      '<section class="section"><div class="wrap">' +
      '<p class="lead reveal" style="margin-bottom:clamp(40px,6vw,64px)">現在制作中の文章作品。</p>' +
      '<ul class="list">' + rows + "</ul></div></section>";
  };

  R.text = function () {
    var w = (window.WRITING || []).find(function (x) { return x.id === hashId() && x.status === "published" && x.body; });
    if (!w) {
      setTitle("執筆");
      return pageHead("執筆", "WRITING") + '<section class="section"><div class="wrap"><p class="lead">この作品は現在制作中です。</p>' +
        '<p style="margin-top:32px"><a class="text-link" href="writing.html">執筆一覧へ ' + ARROW + "</a></p></div></section>";
    }
    setTitle(w.title + "（執筆）");
    return pageHead(w.title, "WRITING") + '<section class="section"><div class="wrap"><div class="prose">' + esc(w.body) +
      '</div><nav class="pager"><span></span><a class="pager__list" href="writing.html">執筆一覧へ</a><span></span></nav></div></section>';
  };

  R.contact = function () {
    var mail = S.contactEmail || "";
    var subjects = S.contactSubjects && S.contactSubjects.length ? S.contactSubjects : ["お仕事のご依頼", "撮影のご相談", "作品へのご感想", "その他"];
    return pageHead("お問い合わせ", "CONTACT") +
      '<section class="section"><div class="wrap contact">' +
      '<div class="contact__aside reveal">' +
      '<p class="lead">' + esc(S.contactText || "ご連絡は、下のフォームまたはメールでお送りください。") + "</p>" +
      '<div class="contact__mail"><span class="label-s en">MAIL</span>' +
      '<a class="contact__address" href="mailto:' + esc(mail) + '">' + esc(mail) + "</a>" +
      '<button class="contact__copy" type="button" data-copy="' + esc(mail) + '">アドレスをコピー</button>' +
      '<span class="contact__copied" role="status"></span></div>' +
      '<p class="contact__hint">「メールアプリで送る」を押すと、入力した内容が入った状態でメールアプリが開きます。そのまま送信してください。</p>' +
      "</div>" +
      '<form class="contact-form reveal" novalidate>' +
      '<label class="field"><span class="field__label">お名前<span class="field__req">必須</span></span><input name="name" type="text" autocomplete="name" required></label>' +
      '<label class="field"><span class="field__label">ご用件</span><select name="subject">' +
      subjects.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field"><span class="field__label">メッセージ<span class="field__req">必須</span></span><textarea name="message" rows="8" required></textarea></label>' +
      '<p class="form-error" role="alert"></p>' +
      '<button class="btn" type="submit"><span>メールアプリで送る</span>' + ARROW + "</button>" +
      "</form></div></section>";
  };

  function bindContact() {
    var form = document.querySelector(".contact-form");
    if (!form) return;
    var mail = S.contactEmail || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), msg = form.message.value.trim(), subj = form.subject.value;
      var err = form.querySelector(".form-error");
      if (!name || !msg) { err.textContent = "お名前とメッセージを入力してください。"; return; }
      err.textContent = "";
      var body = "お名前：" + name + "\nご用件：" + subj + "\n\n" + msg + "\n";
      location.href = "mailto:" + mail + "?subject=" + encodeURIComponent("【つくみ】" + subj) + "&body=" + encodeURIComponent(body);
    });
    var copy = document.querySelector(".contact__copy");
    if (copy) copy.addEventListener("click", function () {
      var out = document.querySelector(".contact__copied");
      try {
        navigator.clipboard.writeText(copy.getAttribute("data-copy")).then(function () { out.textContent = "コピーしました"; },
          function () { out.textContent = "コピーできませんでした。アドレスを長押ししてコピーしてください。"; });
      } catch (x) { out.textContent = "コピーできませんでした。アドレスを長押ししてコピーしてください。"; }
    });
  }

  /* ---------- 編集ボタン（ログインしたブラウザだけに表示） ---------- */
  function isEditor() {
    try {
      var flag = localStorage.getItem("tsukumi-editor");
      if (flag === "0") return false;
      if (flag === "1") return true;
      for (var i = 0; i < localStorage.length; i++) {
        if (/sveltia|decap-cms|netlify-cms/.test(localStorage.key(i))) return true;
      }
    } catch (e) {}
    return false;
  }
  function editButton() {
    if (!isEditor()) return;
    var target = {
      home: "settings/entries/site", contact: "settings/entries/site",
      photography: "photography/entries/photography", work: "photography/entries/photography",
      articles: "articles/entries/articles", lyrics: "lyrics/entries/lyrics", lyric: "lyrics/entries/lyrics",
      writing: "writing/entries/writing", text: "writing/entries/writing", profile: "profile/entries/profile",
    }[page] || "";
    var old = document.querySelector(".edit-fab");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "edit-fab";
    el.innerHTML = '<a href="' + base + "admin/#/collections/" + target + '">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M10.5 2.5l3 3L5 14H2v-3z"/></svg>' +
      "<span>このページを編集</span></a>" +
      '<button type="button" aria-label="編集ボタンを隠す">×</button>';
    el.querySelector("button").addEventListener("click", function () {
      try { localStorage.setItem("tsukumi-editor", "0"); } catch (e) {}
      el.remove();
    });
    document.body.appendChild(el);
  }

  R.profile = function () {
    var P = window.PROFILE;
    var groups = P.groups.map(function (g) {
      return '<div class="career-group reveal"><h2 class="career-group__ja">' + esc(g.ja) +
        '<span class="career-group__en en">' + esc(g.en) + "</span></h2>" +
        '<ul class="career-items">' + g.items.map(function (it) {
          return "<li>" + (it.period ? '<span class="period">' + esc(it.period) + "</span>" : "") +
            '<span class="title">' + esc(it.title) + "</span>" +
            (it.detail ? '<span class="detail">' + esc(it.detail) + "</span>" : "") + "</li>";
        }).join("") + "</ul></div>";
    }).join("");
    return pageHead("経歴", "PROFILE / CAREER") +
      '<section class="section"><div class="wrap">' +
      '<div class="profile-top reveal"><div class="profile-mark" aria-hidden="true">' + esc(P.name) + "</div>" +
      '<div><p class="profile-name">' + esc(P.name) + '<span class="en">' + esc(P.nameEn) + "</span></p>" +
      (P.bio ? '<p class="lead" style="margin-top:20px">' + esc(P.bio) + "</p>" : "") +
      '<div style="margin-top:24px">' + snsList() + "</div>" +
      '<p style="margin-top:20px"><a class="text-link" href="contact.html"><span>お問い合わせ</span>' + ARROW + "</a></p></div></div>" +
      '<div class="career">' + groups + "</div></div></section>";
  };

  /* =====================================================================
     描画と動き
     ===================================================================== */
  function render() {
    document.getElementById("header").innerHTML = header();
    main.innerHTML = (R[page] || R.home)();
    document.getElementById("footer").innerHTML = footer();
    bindMenu();
    bindReveal();
    bindLightbox();
    bindContact();
    editButton();
  }

  function bindMenu() {
    var btn = document.querySelector(".menu-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  function bindReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* 画像の拡大表示 */
  var lb;
  function bindLightbox() {
    var shots = document.querySelectorAll("[data-lb]");
    if (!shots.length) return;
    var srcs = Array.prototype.map.call(shots, function (b) { var im = b.querySelector("img"); return { src: im.getAttribute("src"), alt: im.alt }; });
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "画像の拡大表示");
      lb.innerHTML = '<img alt="">' +
        '<button class="lightbox__btn lightbox__close" type="button" aria-label="閉じる"><svg width="26" height="26" viewBox="0 0 26 26" stroke="currentColor" stroke-width="1.4"><path d="M3 3l20 20M23 3L3 23"/></svg></button>' +
        '<button class="lightbox__btn lightbox__prev" type="button" aria-label="前の画像"><svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" stroke-width="1.2" style="transform:scaleX(-1)"><path d="M0 6h32M27 1l5 5-5 5"/></svg></button>' +
        '<button class="lightbox__btn lightbox__next" type="button" aria-label="次の画像"><svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 6h32M27 1l5 5-5 5"/></svg></button>' +
        '<div class="lightbox__count"></div>';
      document.body.appendChild(lb);
      lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
      lb.querySelector(".lightbox__close").addEventListener("click", close);
      lb.querySelector(".lightbox__prev").addEventListener("click", function () { show(lb._i - 1); });
      lb.querySelector(".lightbox__next").addEventListener("click", function () { show(lb._i + 1); });
      document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(lb._i - 1);
        if (e.key === "ArrowRight") show(lb._i + 1);
      });
      var sx = null;
      lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        if (sx == null) return;
        var dx = e.changedTouches[0].clientX - sx; sx = null;
        if (Math.abs(dx) > 50) show(lb._i + (dx < 0 ? 1 : -1));
      });
    }
    lb._srcs = srcs;
    function show(i) {
      var n = lb._srcs.length;
      lb._i = (i + n) % n;
      var img = lb.querySelector("img");
      img.src = lb._srcs[lb._i].src; img.alt = lb._srcs[lb._i].alt;
      lb.querySelector(".lightbox__count").textContent = n > 1 ? (lb._i + 1) + " / " + n : "";
      lb.querySelector(".lightbox__prev").style.display = n > 1 ? "" : "none";
      lb.querySelector(".lightbox__next").style.display = n > 1 ? "" : "none";
    }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lb._from) lb._from.focus(); }
    shots.forEach(function (b) {
      b.addEventListener("click", function () {
        lb._from = b; show(+b.getAttribute("data-lb"));
        lb.classList.add("is-open"); document.body.style.overflow = "hidden";
        lb.querySelector(".lightbox__close").focus();
      });
    });
  }

  /* ページ遷移（サイト内リンクだけ、ふわっと切り替え） */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var href = a.getAttribute("href");
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
    var samePage = href.split("#")[0] === location.pathname.split("/").pop();
    if (samePage) return; // 同じページ内（作品の前後移動など）はハッシュで切り替え
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(function () { location.href = href; }, 260);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("is-leaving"); });
  window.addEventListener("hashchange", function () {
    if (page === "work" || page === "lyric" || page === "text") { render(); window.scrollTo(0, 0); }
  });

  render();
  }
})();
