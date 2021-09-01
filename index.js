const pagination = () => {
  // 初期値設定
  let page = 1; // 現在のページ（何ページ目か）
  const step = 10; // ステップ数（1ページに表示する項目数）

  // 現在のページ/全ページ を表示
  // <p class="count"></p> の中身を書き換え
  const count = (page, step) => {
      const p = document.querySelector('.table');
      // 全ページ数 menuリストの総数/ステップ数の余りの有無で場合分け
      const total = (menu.length % step == 0) ? (menu.length / step) : (Math.floor(menu.length / step) + 1);
      p.innerText = page + "/" + total + "ページ";
  }

  // ページを表示
  // <ul class="menu_list"></ul> の中身を書き換え
  const show = (page, step) => {
      const ul = document.querySelector('.menu_list');
      // 一度リストを空にする
      while (ul.lastChild) {
          ul.removeChild(ul.lastChild);
      }
      const first = (page - 1) * step + 1;
      const last = page * step;
      menu.forEach((item, i) => {
          if(i < first - 1 || i > last - 1) return;
          let li = document.createElement('li');
          li.innerText = item.name_jp;
          ul.appendChild(li);
      });
      count(page,step);
  }

  // 最初に1ページ目を表示
  show(page, step);

  // 前ページ遷移トリガー
  document.getElementById('prev').addEventListener('click', () => {
      if(page <= 1) return;
      page = page - 1;
      show(page, step);
  });

  // 次ページ遷移トリガー
  document.getElementById('next').addEventListener('click', () => {
      if(page >= menu.length / step) return;
      page = page + 1;
      show(page, step);
  });
}

window.onload = () => {
  pagination();
}