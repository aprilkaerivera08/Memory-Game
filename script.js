    const emojis = ["😺", "🐈", "😸", "😻", "😼", "🙀", "😽", "😿", "😹"]
let cards = []
let flippedCards = []
let matchedPairs = 0
let moves = 0
let isLocked = false
let startTime = null
let timerInterval = null
let gridRows = 4
let gridCols = 4
const difficultyBtns = document.querySelectorAll(".difficulty-btn")
difficultyBtns.forEach((btn) => {
btn.addEventListener("click", (e) => {
difficultyBtns.forEach((b) => b.classList.remove("active"))
e.target.classList.add("active")
gridRows = parseInt(e.target.dataset.rows)
gridCols = parseInt(e.target.dataset.cols)
resetGame()
})
})
document.getElementById("resetBtn").addEventListener("click", resetGame)
document.getElementById("newBtn").addEventListener("click", () => location.reload())
function shuffle(array) {
const newArray = [...array]
for (let i = newArray.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
}
return newArray
}
function createCards() {
const gameBoard = document.getElementById("gameBoard")
const totalCards = gridRows * gridCols
const numPairs = totalCards / 2
const selectedEmojis = emojis.slice(0, numPairs)
const pairedCards = [...selectedEmojis, ...selectedEmojis]
const shuffledCards = shuffle(pairedCards)
gameBoard.innerHTML = ""
gameBoard.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`
cards = []
shuffledCards.forEach((emoji, index) => {
const card = document.createElement("div")
card.classList.add("card")
card.innerHTML = `
<div class="card-inner">
<div class="card-front">?</div>
<div class="card-back">${emoji}</div>
</div>
`
card.dataset.emoji = emoji
card.dataset.index = index
card.addEventListener("click", flipCard)
gameBoard.appendChild(card)
cards.push({ element: card, emoji, matched: false })
})
}
function flipCard(e) {
if (isLocked) return
const card = e.currentTarget
if (card.classList.contains("flipped") || card.classList.contains("matched")) return
card.classList.add("flipped")
flippedCards.push(card)
if (flippedCards.length === 2) {
moves++
document.getElementById("moves").textContent = moves
checkMatch()
}
}
function checkMatch() {
isLocked = true
const [card1, card2] = flippedCards
const match = card1.dataset.emoji === card2.dataset.emoji
if (match) {
card1.classList.add("matched")
card2.classList.add("matched")
matchedPairs++
document.getElementById("matched").textContent = matchedPairs
flippedCards = []
isLocked = false
const totalCards = gridRows * gridCols
if (matchedPairs === totalCards / 2) {
endGame()
}
} else {
setTimeout(() => {
card1.classList.remove("flipped")
card2.classList.remove("flipped")
flippedCards = []
isLocked = false
}, 600)
}
}
function startTimer() {
startTime = Date.now()
timerInterval = setInterval(() => {
const elapsed = Math.floor((Date.now() - startTime) / 1000)
document.getElementById("time").textContent = elapsed + "s"
}, 100)
}
function endGame() {
clearInterval(timerInterval)
const message = document.getElementById("message")
message.textContent = ` You Won! ${moves} moves in
${document.getElementById("time").textContent} `
message.classList.add("success")
}
function resetGame() {
clearInterval(timerInterval)
flippedCards = []
matchedPairs = 0
moves = 0
isLocked = false
document.getElementById("moves").textContent = "0"
document.getElementById("matched").textContent = "0"
document.getElementById("time").textContent = "0s"
document.getElementById("message").textContent = ""
document.getElementById("message").classList.remove("success", "info")
createCards()
startTimer()
}
createCards()
startTimer()