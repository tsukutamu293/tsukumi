# つくみ / TSUKUMI — 個人サイト

写真・記事・作詞・執筆、そして経歴をまとめたクリエイティブアーカイブです。
ビルド作業のいらない静的サイト（HTML / CSS / JavaScript）で作っています。

---

## 1. ページ一覧

| ファイル | ページ |
|---|---|
| `index.html` | トップ（つくみ／書く、撮る、歌う、考える。／4カテゴリ／経歴への導線／SNS） |
| `photography.html` | 写真 一覧（説明文・note記事リンク・作品一覧。画像枠はベタ塗り） |
| `work.html#fullerene` | 作品001「私＝フラーレン」個別ページ |
| `work.html#water-transition` | 作品002「水相転移」個別ページ（3枚で1作品） |
| `articles.html` | 記事 一覧（外部リンク・新しいタブで開く） |
| `lyrics.html` | 作詞 一覧 |
| `lyric.html#tomei` など | 歌詞の個別ページ（`#tomei` `#aonisai` `#drop`） |
| `writing.html` | 執筆 一覧（制作中 / IN PROGRESS） |
| `text.html#作品ID` | 執筆作品の本文ページ（公開に切り替えた作品だけ表示） |
| `profile.html` | 経歴 / PROFILE・CAREER |
| `contact.html` | お問い合わせ / CONTACT（メール作成フォーム） |
| `admin/` | 編集画面（ログインして文章・写真・記事などを編集） |

## 2. 使用した技術

- HTML / CSS / JavaScript（ライブラリなし・ビルド不要）
- フォント：Google Fonts「Zen Maru Gothic」（日本語・丸ゴシック）、「Jost」（英語）
- 画像：長辺2000pxの本画像＋長辺900pxのサムネイルに最適化済みのJPEG
- 編集画面：Sveltia CMS（無料。GitHubのアカウントでログインし、編集内容はGitHubに保存→Vercelが自動で再公開）

**Next.jsではなく静的サイトにした理由**
制作環境でパッケージのインストールができなかったことに加え、内容がほぼ固定の個人サイトなら、
静的サイトの方が「無料・メンテナンス不要・ファイルを書き換えるだけで更新」という条件に合うためです。
Vercel・GitHub Pages・Netlify・Cloudflare Pages のどれでも無料で公開できます。
将来、ブログ機能などが必要になったら、`content.js` のデータをそのまま使ってNext.jsへ移行できます。

## 3. ローカルでの確認方法

内容を `content/` のJSONファイルから読み込むため、`index.html` をダブルクリックで開くと表示されません。
ローカルサーバーで開いてください（Macのターミナル）：
  ```
  cd tsukumi
  python3 -m http.server 8000
  ```
  ブラウザで http://localhost:8000 を開きます。

## 4. 作品写真の配置方法

1. 写真を `images/photography/` に入れます（例：`new-work.jpg`）。
   - 目安：長辺2000px前後・JPEG。一覧用に長辺900px程度の `-thumb.jpg` もあると軽くなります（なければ本画像を使います）。
2. `assets/js/content.js` の `PHOTOGRAPHY.works` に作品を追加し、`images` にファイル名を書きます。
3. 一覧の画像枠は、現在 `galleryFrame: "solid"`（ベタ塗り）です。
   一覧にも写真を出したくなったら `"photo"` に変えます。枠の色は作品ごとの `frameColor` で変えられます。

## 5. コンテンツの追加・編集方法

### A. 編集画面から（おすすめ・スマホでも可）

公開後、`https://あなたのサイト/admin/` を開いてログインすると、フォーム形式で編集できます。
「保存（公開）」を押すとGitHubに保存され、1〜2分でサイトに反映されます。

**最初に一度だけ行う設定**
1. `admin/config.yml` の `repo: YOUR-GITHUB-NAME/tsukumi` を、自分のGitHubユーザー名／リポジトリ名に書き換える。
2. GitHubでログイン用の鍵（アクセストークン）を作る：
   GitHub → 右上アイコン → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token
   - Repository access：**Only select repositories** でこのサイトのリポジトリだけ選ぶ
   - Permissions：**Contents** を **Read and write**
   - 有効期限は1年程度がおすすめ。作られた文字列（github_pat_…）をコピーしておく。
3. `/admin/` を開き、**「Sign in with Token（トークンでログイン）」** を選んで、2の文字列を貼り付ける。

ログインできるのは、このトークンを持っているあなただけです。トークンは他人に教えないでください。
期限が切れたら、2の手順で作り直してログインし直します。

**サイト上の「このページを編集」ボタン**
一度 `/admin/` を開いたブラウザでは、サイトの右下に「このページを編集」ボタンが出て、
そのページの内容の編集画面へ直接移動できます。訪問者には表示されません。
ボタンの「×」で、そのブラウザでは非表示にできます。

**編集できる内容**
- 写真：説明文、note記事リンク、作品の追加・並べ替え、写真のアップロード、一覧のベタ塗り⇄写真の切り替え
- 記事：追加・並べ替え・タイトルや説明の入力
- 作詞：歌詞の追加（改行・空白・表記はそのまま表示されます）
- 執筆：公開状態（制作中／公開）の切り替えと本文
- 経歴：分野・活動・時期・詳細・自己紹介
- サイト全体：キャッチコピー、カードの説明文、SNS、お問い合わせ先メールアドレスや選択肢

### B. ファイルを直接書き換える場合

内容はすべて `content/` フォルダのJSONファイルにあります（`site.json` `photography.json` `articles.json` `lyrics.json` `writing.json` `profile.json`）。
写真は `images/photography/` に置き、`photography.json` の `src` にパスを書きます。

### お問い合わせについて

お問い合わせページのフォームは、入力内容が入った状態で訪問者のメールアプリを開き、
`tsukutamu293@fuji.waseda.jp` 宛てに送ってもらう仕組みです（無料・サーバー不要）。
メールアプリを使わずにサイト上で送信まで完結させたい場合は、Web3Forms などの無料フォームサービスに切り替えられます。
宛先は編集画面の「サイト全体」で変更できます。

### 記事の状況
- 記事003（note）：タイトル「海鷹祭に行ったら橋から落ちた。でも、ぼた餅な話を聞いたよ。」を入力済み。
- 記事002（ゼミの記事）：リンク先を読み込めなかったため、タイトル・説明は未入力です。編集画面から入力してください。

## 6. 無料で公開する手順（Vercel）

1. GitHubのアカウントを作り、新しいリポジトリ（例：`tsukumi`）を作成。
2. この `tsukumi` フォルダの中身をすべてアップロード（「Add file → Upload files」でドラッグ＆ドロップ可）。
3. https://vercel.com に GitHub でログイン →「Add New → Project」→ リポジトリを選んで「Deploy」。
   - Framework Preset は「Other」、ビルド設定は空欄のままでOK。
4. `https://tsukumi-xxxx.vercel.app` のようなURLで公開されます。以後、GitHub上のファイルを更新すると（編集画面からの保存も含め）自動で反映されます。
5. 公開後、`robots.txt` と `sitemap.xml` の `YOUR-SITE.vercel.app` を実際のURLに書き換えます。
6. 検索に早く載せたい場合は、Google Search Console にURLを登録し、`sitemap.xml` を送信します。

※ GitHub Pages を使う場合は、リポジトリの「Settings → Pages」で main ブランチを公開するだけで使えます。

## 7. 未実装・今後の対応が必要なもの

- ゼミの記事のタイトルと説明（本人の入力待ち）
- 編集画面の `admin/config.yml` のリポジトリ名（公開時に本人が設定）
- 経歴の時期・詳細、自己紹介文（本人の入力待ち）
- OGP画像（SNSでシェアされたときのサムネイル）。作品写真をトップに出さない方針のため未設定。必要なら文字だけの画像を用意して `og:image` を追加します。
- 独自ドメイン（不要とのことで未設定）
- 作品・歌詞の個別ページはJavaScriptで内容を表示する方式のため、Googleでの個別ページ単位の検索表示はNext.js等で静的に書き出す場合より弱めです。サイト名「つくみ」「TSUKUMI」での検索には、トップページのタイトル・説明文・構造化データで対応しています。
