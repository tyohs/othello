# Othello

ReactとTypeScriptで実装した、ブラウザで2人対戦できるオセロです。合法手は盤面上の金色の点で表示されます。

## 遊び方

1. 黒から開始します。
2. 金色の点があるマスを選ぶと、8方向のうち挟める石がすべて裏返ります。
3. 置ける場所がないプレイヤーは自動でパスします。
4. 双方が置けなくなると、石の多い側を勝者として終了します。
5. 「最初から遊ぶ」で標準初期盤面へ戻せます。

## 設計

ゲームルールは [`src/lib/othello.ts`](src/lib/othello.ts) の純粋関数へ分離しています。

- `getFlips`: 1手で裏返る石を8方向から収集
- `getLegalMoves`: 現在のプレイヤーが置ける全マスを列挙
- `playMove`: 元の盤面を変更せず、新しい盤面と次のターンを返す
- `resolveNextTurn`: 通常交代、自動パス、ゲーム終了を判定
- `getScore`: 黒石と白石を集計

React側は関数の結果を表示するだけなので、ルールをブラウザなしでunit testできます。

## Setup

Node.js 20以上を推奨します。

```bash
npm ci
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

`next.config.ts` はGitHub Pages向けのstatic exportを維持しています。GitHub Actions上ではリポジトリ名を`basePath`として使用し、ローカルでは `/` で動作します。

## 学んだこと

初期実装では、合法手判定・石の反転・自動パスをReactコンポーネント内に直接書いていました。そのため、状態を更新する`useEffect`がレンダーごとに動く問題がありました。今回、ゲームルールを純粋関数化し、1手の結果として次のターンまで決める構造へ変更しています。
