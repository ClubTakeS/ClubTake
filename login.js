// このコードは、Webページが読み込まれた後に実行されます
document.addEventListener('DOMContentLoaded', () => {

    // ログインフォーム（login.htmlで id="login-form" を持つ要素）を探します
    const loginForm = document.getElementById('login-form');
    
    // エラーメッセージを表示する場所（login.htmlで id="error-message" を持つ要素）を探します
    const errorMessage = document.getElementById('error-message');

    // もしログインフォームがこのページにあれば、以下の処理を準備します
    if (loginForm) {
        
        // フォームの「送信（submit）」ボタンが押された時のイベントを監視します
        loginForm.addEventListener('submit', (event) => {
            
            // フォームのデフォルトの送信動作（ページがリロードされる）を防ぎます
            event.preventDefault();

            // 「正しい」メールアドレスとパスワードをここで決めておきます（テスト用）
            const correctEmail = 'member@club.jp';
            const correctPassword = 'pass1234';

            // フォームに入力されたメールアドレスとパスワードの値を取得します
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 入力された値と「正しい」値が一致するかどうかをチェックします
            if (email === correctEmail && password === correctPassword) {
                // 一致した場合：
                
                // エラーメッセージを空にします
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
                // メンバー専用ページに移動させます
                window.location.href = 'members.html';

            } else {
                // 一致しなかった場合：
                
                // エラーメッセージを表示します
                if (errorMessage) {
                    errorMessage.textContent = 'メールアドレスまたはパスワードが正しくありません。';
                }
            }
        });
    }
});