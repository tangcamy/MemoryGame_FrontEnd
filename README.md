# Memory Game
A simple web application for poker game. 

## First
- HTMl 元素佈局
- CSS 卡片容器設定
- JavaScript  MVC(模組化程式碼）初始架構

## Features
- model ：資料
  - revealedCards[] : 儲存被翻開的卡片資訊
  - model.isReveledCardMatched (是否配對成功)

- view ：介面
  - view.displayCards(渲染卡片)：產生52張牌＋(洗牌演算法）Fisher-Yates Shuffle
  - view.getCardElement(渲染卡片內部元素) 
  - transformNumber (特殊數字轉換) ：11 (J)、12(Q)、13(K)、1(A)
  - listing view.flipCard ( 點擊時翻牌 ) : data-set取得卡片索引
  - view.renderScore (分數計算)
  - view.renderTriedTimes (嘗試次數)
  - view.appendWrongAnimation (配對錯誤的動畫)
  - view.showGameFinished (遊戲結束畫面)

- controller : 流程
```
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'}
```
  - dispatchCardAction (卡片狀態)：依照不同遊戲的狀態，做不同的行為
  - resetCard（配對失敗）： 資料清除，並且需停留一秒。

### Game Rule
1. 翻開兩張撲克牌，是否配對成功
2. 紀錄分數與嘗試次數

