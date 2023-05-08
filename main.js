// 遊戲狀態說明
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardMatchFailed: 'CardMatchFailed',
  CardMatched: 'CardMatched',
  GameFinished: 'GameFinished'
}

// 花色變數不會被改變
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// view 視覺(獲取元素 ＆渲染卡片)
const view = {
  // 撲克牌特殊字元轉換`switch`方式
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  //number＆symbol index程式計算方式


  //-帶入正面 數字&symbol資訊
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1) // 數字 0~12 ,13~25,26~38,39~51
    const symbol = Symbols[Math.floor(index / 13)] //index=0,1,2,3 對應的花色
    //card 加入 back，後面好選到物件
    return `<p>${number}</p>
    <img src="${symbol}" />
    <p>${number}</p>`
  },

  //-帶入背面格式，透過data-index綁定index資訊帶到後面資料
  getCardElement(index) {
    return `<div data-index="${index}" class="card back"></div>`
  },


  //獲取的是一大堆indexes
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards"); //選id的cards
    // 原本：rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");
    // v2 由controller 控制洗牌的模組，這邊先用indexes表示我的資料是獲得一組“複數indexes": rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join("");
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("");
  },

  // - 原本input=只有一張card
  // flipCard(card) {
  //   if (card.classList.contains('back')) {
  //     //回傳正面-有數字
  //     card.classList.remove('back') // 先將back拔掉
  //     card.innerHTML = this.getCardContent(Number(card.dataset.index)) // 需帶入數字，透過data-的架構得知，dataset獲取的資料都是字串
  //     return //記得要加！！！！！！！！
  //   }
  //   // 如果是正面，回傳背面- 無數字
  //   card.classList.add('back')
  //   card.innerHTML = null
  // },

  // 調整一次input=很多card
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        //回傳正面-有數字
        card.classList.remove('back') // 先將back拔掉
        card.innerHTML = this.getCardContent(Number(card.dataset.index)) // 需帶入數字，透過data-的架構得知，dataset獲取的資料都是字串
        return //記得要加！！！！！！！！
      }
      // 如果是正面，回傳背面- 無數字
      card.classList.add('back')
      card.innerHTML = null
    })

  },

  // 當配對成功時候呈現
  // 原本:input只有一張car
  // pairCard(card) {
  //   card.classList.add('paired')
  // }

  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },

  renderScore(score) {
    //text Content = inner text
    //與innerHTML 不一樣
    document.querySelector('.score').textContent = `Score:${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried:${times} times`
  },

  // 先寫成一張卡片的格式，再改成...cards格式
  // appendWrongAnimation(card) {
  //   card.classList.add('wrong')
  //   // 加上一個監聽器，當動作結束後classList的wrong css移除，下次同一張還可以做出相同的動畫
  //   card.addEventListener('animationend', event => {
  //     card.classList.remove('wrong')
  //   }, {
  //     once: true; //EventListener只會觸發一次，這樣對瀏覽器的效度比較好
  //   })
  // }

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      // 加上一個監聽器，當動作結束後classList的wrong css移除，下次同一張還可以做出相同的動畫
      card.addEventListener('animationend', event => {
        card.classList.remove('wrong')
      }, {
        once: true //EventListener只會觸發一次，這樣對瀏覽器的效度比較好
      })
    })
  },

  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

//洗牌演算法
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys()) //產生一個陣列
    //for 每張牌的最後一張與某一張進行位置交換
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * index + 1) // 數字+1後隨機產生再取整數
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}


// model 資料管理
const model = {
  revealedCards: [],
  isReveledCardMatched() {
    return this.revealedCards[0].dataset.index % 13 == this.revealedCards[1].dataset.index % 13
  },

  // 用冒號,不用等號
  score: 0,
  triedTime: 0

}

// controller 狀態控制
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  //修改先前view.displayCards()，勁量避免view,model 於global區域。
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  //依照不同遊戲的狀態，做不同的行為
  dispatchCardAction(card) {
    // 假如已經被翻過來的卡片，不進行任何動作
    if (!card.classList.contains('back')) {
      return
    }
    // 狀態切換
    switch (this.currentState) {
      // 第一張牌的狀態
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card) //卡片翻牌
        model.revealedCards.push(card)// 紀錄資料
        this.currentState = GAME_STATE.SecondCardAwaits //狀態改變
        break
      // 第二張牌的狀態
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTime)
        view.flipCards(card)
        model.revealedCards.push(card)
        if (model.isReveledCardMatched()) {
          //配對成功
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardMatched
          view.pairCards(...model.revealedCards)//換成成功配對的css ; 原本：view.pairCard(model.revealedCards[0],view.pairCard(model.revealedCards[1]）
          model.revealedCards = []
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          //配對失敗
          view.appendWrongAnimation(...model.revealedCards)
          this.currentState = GAME_STATE.CardMatchFailed
          setTimeout(this.resetCards, 1000) // 表示一秒
        }
        break
    }
    console.log('currentState', this.currentState)
    console.log('reverseCard', model.revealedCards)
  },

  // 卡片清掉＆卡片放回去＆狀態變成第一個
  resetCards() {
    view.flipCards(...model.revealedCards) //原本： view.flipCard(model.revealedCards[0]) ,  view.flipCard(model.revealedCards[1])
    model.revealedCards = []
    //this.currentState = GAME_STATE.FirstCardAwaits，會error，因為setTimeout呼叫this.resetCards,那resetCards的this會是setTimeout;所以要用controller.currentState呼叫。
    controller.currentState = GAME_STATE.FirstCardAwaits
    console.log(this)
  }
}



// 預設狀態
controller.generateCards()

// 設置card監聽器 Node List (Array-like)，選到的每一張card
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    //console.log(card)
    // view.appendWrongAnimation(card)
    controller.dispatchCardAction(card)
  })
})

