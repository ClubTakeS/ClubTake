// Firebaseの機能（Auth と Realtime Database）を読み込みます
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// ★★★変更★★★ Firestore の代わりに Realtime Database の機能を読み込みます
// import { doc, getDoc, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";


// ★★★変更★★★ setLogLevel は database には無いので削除
// setLogLevel('Debug');

// login.html で準備ができたグローバル変数（auth や db）を取得します
const auth = window.firebaseAuth;
const db = window.firebaseDb;

// ★★★変更★★★ appId は db から取得します
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const appId = db.app.options.appId;


// ログインフォーム（login.htmlで id="login-form" を持つ要素）を探します
const loginForm = document.getElementById('login-form');
    
// エラーメッセージを表示する場所（login.htmlで id="error-message" を持つ要素）を探します
const errorMessage = document.getElementById('error-message');

// もしログインフォームがこのページにあれば、以下の処理を準備します
if (loginForm) {
    
    // フォームの「送信（submit）」ボタンが押された時のイベントを監視します
    loginForm.addEventListener('submit', async (event) => {
        
        // フォームのデフォルトの送信動作（ページがリロードされる）を防ぎます
        event.preventDefault();
        // エラーメッセージを一旦クリアします
        errorMessage.textContent = '確認中...';

        // フォームに入力されたメールアドレスとパスワードの値を取得します
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Firebase Auth に「メールアドレスとパスワード」でログインを試みる
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ログインに成功！
            console.log('ログイン成功:', user.email);

            // 次に、このユーザーが「管理者」かどうかをデータベースで確認します
            const userId = user.uid;
            
            // ▼▼▼▼▼▼▼▼▼▼ 変更点 ▼▼▼▼▼▼▼▼▼▼
            // Firestore の代わりに Realtime Database に問い合わせます
            // const roleDocRef = doc(db, `artifacts/${appId}/public/data/user_roles`, userId);
            // const roleDoc = await getDoc(roleDocRef);
            
            // Realtime Database のパスを指定 (admin-setup.html と合わせる)
            const roleRef = ref(db, `user_roles/${userId}`);
            const snapshot = await get(roleRef);

            // if (roleDoc.exists() && roleDoc.data().isAdmin === true) {
            if (snapshot.exists() && snapshot.val().isAdmin === true) {
            // ▲▲▲▲▲▲▲▲▲▲ 変更点 ▲▲▲▲▲▲▲▲▲▲

                // もし「管理者(isAdmin: true)」だったら
                console.log('管理者として認識しました。');
                // 管理者専用ページに移動します（ステップ3で作成します）
                window.location.href = 'admin.html';
            } else {
                // もし管理者でなければ
                console.log('一般メンバーとして認識しました。');
                // 通常のメンバー専用ページに移動します
                window.location.href = 'members.html';
            }

        } catch (error) {
            // ログインに失敗した場合
            
            // ▼▼▼▼▼▼▼▼▼▼ ここが修正点です ▼▼▼▼▼▼▼▼▼▼
            // error.code だけでなく、error オブジェクト全体を記録します
            console.error('ログイン失敗:', error); 
            // ▲▲▲▲▲▲▲▲▲▲ ここが修正点です ▲▲▲▲▲▲▲▲▲▲
            
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                errorMessage.textContent = 'メールアドレスまたはパスワードが正しくありません。';
            } else {
                errorMessage.textContent = 'ログイン中にエラーが発生しました。';
            }
        }
    });
}
