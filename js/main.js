// このコードは、Webページが読み込まれた後に実行されます
document.addEventListener('DOMContentLoaded', () => {
    
    // IntersectionObserverのオプション設定
    const options = {
        root: null, // ビューポート（今見えている画面）を基準にする
        rootMargin: '0px',
        threshold: 0.1 // 監視対象が10%見えたら実行する
    };

    // 要素が画面に入ってきたときに実行される関数
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            // もし要素が画面に入ってきたら
            if (entry.isIntersecting) {
                // その要素に「.is-visible」クラスを追加する (→ CSSが反応してアニメーションが始まる)
                entry.target.classList.add('is-visible');
                
                // アニメーションは1回だけで良いので、監視を解除する
                observer.unobserve(entry.target);
            }
        });
    };

    // 上記のルール（オプションとコールバック）を使って、監視する人（Observer）を作成
    const observer = new IntersectionObserver(callback, options);

    // HTMLの中から「.fade-in」クラスが付いているすべての要素を探してくる
    const targets = document.querySelectorAll('.fade-in');
    
    // 見つけてきた要素（「叡信の原則」セクションと「神髄」セクション）を、それぞれ監視するようお願いする
    targets.forEach(target => {
        observer.observe(target);
    });
});
