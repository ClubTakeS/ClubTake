// Firebaseの機能（Auth と Firestore）を読み込みます
// （login.html で読み込んだものを、ここで改めてインポートします）
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// デバッグ用のログを有効にします
setLogLevel('Debug');

// login.html で準備ができたグローバル変数（auth や db）を取得します
const auth = window.firebaseAuth;
const db = window.firebaseDb;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

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
            // （注意：Firestoreのパスはセキュリティルールと一致させる必要があります）
            const userId = user.uid;
            const roleDocRef = doc(db, `artifacts/${appId}/public/data/user_roles`, userId);
            
            const roleDoc = await getDoc(roleDocRef);

            if (roleDoc.exists() && roleDoc.data().isAdmin === true) {
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
            console.error('ログイン失敗:', error.code);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                errorMessage.textContent = 'メールアドレスまたはパスワードが正しくありません。';
            } else {
                errorMessage.textContent = 'ログイン中にエラーが発生しました。';
            }
        }
    });
}
