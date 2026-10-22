# タップカウンター

iPhone向けのタップカウンターPWA。依存ライブラリなし。

- 大きなタップ領域で +1 / −1 ボタンで -1 / リセット（確認ダイアログあり）
- 数字は localStorage に自動保存、ダークモード対応、オフライン動作
- すべて相対パスのため `https://<user>.github.io/counter/` のようなリポジトリ配下URLで動作

## 開発

```
npm run icons   # アイコン再生成（通常は不要）
npm test        # テスト
npm run build   # dist/ を生成
npm start       # ローカル確認
```

## 公開

main へマージ後、リポジトリの Settings → Pages → Source を「GitHub Actions」にすると
`.github/workflows/pages.yml` が自動デプロイします。
iPhone の Safari で開き、共有ボタン →「ホーム画面に追加」。
