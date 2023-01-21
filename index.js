// Настройки для запроса на сервер
const options = {
  headers: {
    // Ключ доступа
		'X-RapidAPI-Key': '919c07dc0cmshcbf51fd61d497b2p157d8djsn1e8f42be2848',
		'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
	}
}

// Функция которая качает коктейли
async function getCocktails() {
  const response = await fetch(`https://the-cocktail-db.p.rapidapi.com/filter.php?i=Gin`, options)
  const json = await response.json()

  return json.drinks
}

// Функция которая качает детали для конкретного коктейля
async function getCocktailDetails(id) {
  const response = await fetch(`https://the-cocktail-db.p.rapidapi.com/lookup.php?i=${id}`, {
    ...options,
  })
  const json = await response.json()

  return json.drinks[0]
}

// Функция которая форматирует детали конкретного коктейля
// в ХТМЛ
function formatCocktailDetails(details) {
  const ingridients = Object
                        .entries(details)
                        .filter(([key, value]) => key.startsWith('strIngredient') && value !== null)
                        .map(([key, value]) => value)

  return `
    <div>
      <p>${details.strDrink}</p>
      <p>Tags: ${details.strTags}</p>
      <p>Category: ${details.strCategory}</p>
      <br/>
      <br/>
      <p>${details.strInstructions}</p>
      <ul>
        ${ingridients.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `
}

// Функция которая создает окошко для отображения информации про
// конкретный коктейль
function showPopup(position) {
  const div = document.createElement('div')
  div.style.width = '300px'
  div.style.height = '400px'
  div.style.overflowY = 'auto'
  div.style.backgroundColor = 'white'
  div.style.color = 'black'
  div.style.padding = '10px'
  div.style.borderRadius = '12px'

  div.style.position = 'absolute'
  div.style.top = `${position.y}px`
  div.style.left = `${position.x}px`

  div.onclick = () => {
    div.remove()
  }

  div.innerHTML = `
    <img src="https://i.pinimg.com/originals/c8/a1/76/c8a1765ffc8243f3a7b176c0ca84c3c1.gif" width="100%" />
  `

  document.body.append(div)

  return (html) => {
    div.innerHTML = html
  }
}

// Функция которая создает ДИВ элемент карточку для коктейля
function createCocktail(cocktail) {
  const div = document.createElement('div')
  div.classList.add('cocktail')

  div.onclick = async (event) => {
    const addHtml = showPopup({ x: event.pageX - 150, y: event.pageY - 200 })

    const cocktailDetails = await getCocktailDetails(cocktail.idDrink)
    const html = formatCocktailDetails(cocktailDetails)

    addHtml(html)
  }

  div.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" />
      <div>${cocktail.strDrink}</div>
  `

  return div
}


// Стартовая точка
(async () => {
  // Качаем коктейли
  const cocktails = await getCocktails()

  // Преобразовывавем каждый коктейль объект в ХТМЛ
  const cocktailCards = cocktails.map(c => createCocktail(c))

  // Добавляем все созданные карточки с коктейлями в БАДИ
  document.body.append(...cocktailCards)
})()
