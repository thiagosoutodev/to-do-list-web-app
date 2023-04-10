// ============ Seleção de elementos DOM e criação de variáveis/constantes ============
const toDosList = document.querySelector("#to-dos-list") // Armazenamento em uma constante da 'div' que conterá todos as tarefas.
const createBtn = document.querySelector("#create-btn") // Armazenamento em uma constante do 'button' que criará novas tarefas.
let toDosArray = [] // Declaração e inicialização de um array vazio que irá receber cada objeto Javascript, ou seja, cada tarefa e seus respectivos atributos.


// ============ Eventos e chamada de funções ============

// Evento de clique sobre o botão que cria uma nova tarefa:
createBtn.addEventListener("click", createNewToDo)

displayToDos() // Toda vez que a página for carregada, essa função tem de ser chamada, senão não há a renderização dos dados do 'local storage'.

// ============ Declaração de funções ============

// Função que é disparada para criar uma nova tarefa:
function createNewToDo() {
    const toDoItem = { // Criação de um objeto correspondente à nova tarefa.
        id: new Date().getTime(), // 'Identificador único' e correspondente ao horário de criação da tarefa.
        text: "", // Por padrão, toda nova tarefa não vem com nenhum texto.
        isCompleted: false // Por padrão, toda nova tarefa não pode ser criada como já realizada.
    }

    toDosArray.unshift(toDoItem) // Adição da nova tarefa no começo da 'array' com o método 'unshift'.

    const { toDoElement, inputElement } = renderToDo(toDoItem) // Chamada da função que renderiza a nova tarefa na página e retorna um objeto com quatro itens, dos quais os dois primeiros são desestruturados pelo código em duas variáveis.

    toDosList.prepend(toDoElement) // O elemento HTML da lista de tarefas recebe a recém-criada tarefa.

    inputElement.removeAttribute("disabled") // O elemento 'input' de texto da nova tarefa tem seu atributo 'disabled' retirado para que possa ser editado.
    inputElement.focus() // O elemento 'input' de texto da nova tarefa é automaticamente focado pelo browser.

    saveToLocalStorage() // Chamada da função que salva a nova tarefa no 'local storage'.
}

// Função que é chamada para renderizar a tarefa no browser:
function renderToDo(toDoItem) {
    const toDoElement = document.createElement("div") // Criação da 'div' da tarefa em si, ou seja, o grande contâiner dos elementos que são criados abaixo.
    toDoElement.classList.add("to-do") // Adição da classe 'to-do' a esta 'div'.

    const checkboxElement = document.createElement("input") // Criação do 'input' 'checkbox' da tarefa.
    checkboxElement.type = "checkbox" // Adição do tipo 'checkbox' a este 'input'.
    checkboxElement.checked = toDoItem.isCompleted // Passagem do atributo booleano do objeto da tarefa, permitindo que a 'checkbox' seja renderizada marcada ou desmarcada.

    if (toDoItem.isCompleted) { // Se a tarefa estiver marcada como realizada, a classe 'complete' deve ser adicionada também.
        toDoElement.classList.add("complete")
    }

    const inputElement = document.createElement("input") // Criação do 'input' 'text' da tarefa.
    inputElement.type = "text" // Adição do atributo de tipo 'text' a este 'input'.
    inputElement.value = toDoItem.text // Passagem do atributo string do objeto da tarefa, permitindo que o texto seja corretamente renderizado.
    inputElement.setAttribute("disabled", "") // Adição a esta 'tag' do atributo que não permite a edição do campo.

    const actionsAreaElement = document.createElement("div") // Criação da 'div' que reúne os botões de edição e remoção de cada tarefa.
    actionsAreaElement.classList.add("actions-area") // Adição da classe 'actions-area' a esta 'div.

    const editBtnElement = document.createElement("button") // Criação do 'button' de edição da tarefa.
    editBtnElement.classList.add("edit-btn") // Adição da classe 'edit-btn' a este 'button'.

    const editIconElement = document.createElement("img") // Criação da 'img' do ícone dentro do botão.
    editIconElement.src = "./assets/edit-icon.svg" // Adição do atributo de 'source' com a passagem do caminho relativo do arquivo '.svg'.
    editIconElement.alt = "Botão de edição" // Adição do atributo de texto alternativo caso a imagem não seja corretamente carregada.

    const removeBtnElement = document.createElement("button") // Criação do 'button' de remoção da tarefa.
    removeBtnElement.classList.add("remove-btn") // Adição da classe 'remove-btn' a este 'button'.

    const removeIconElement = document.createElement("img") // Criação da 'img' do ícone dentro do botão.
    removeIconElement.src = "./assets/remove-icon.svg" // Adição do atributo de 'source' com a passagem do caminho relativo do arquivo '.svg'.
    removeIconElement.alt = "Botão de remoção" // Adição do atributo de texto alternativo caso a imagem não seja corretamente carregada.

    // Atribuição dos elementos filhos aos respectivos pais na hierarquia do HTML/árvore DOM:
    editBtnElement.append(editIconElement)
    removeBtnElement.append(removeIconElement)

    actionsAreaElement.append(editBtnElement)
    actionsAreaElement.append(removeBtnElement)

    toDoElement.append(checkboxElement)
    toDoElement.append(inputElement)
    toDoElement.append(actionsAreaElement)

    // Eventos dentro da função de renderização:
    // Evento de mudança sobre a 'checkbox' da tarefa:
    checkboxElement.addEventListener("change", () => { 
        toDoItem.isCompleted = checkboxElement.checked // Qualquer mudança na 'checkbox' é armazenada no atributo booleano do objeto que representa a tarefa.

        if (toDoItem.isCompleted) {
            toDoElement.classList.add("complete") // Se o atributo booleano do objeto for 'true', o elemento que é a tarefa renderizada recebe também a classe 'complete', o que muda algumas configurações de renderização.
        } else {
            toDoElement.classList.remove("complete") // Se o atributo booleano do objeto for 'false', o elemento que é a tarefa renderizada tem sua classe 'complete' removida, o que muda algumas configurações de renderização.
        }

        saveToLocalStorage() // Chamada da função que salva a mudança nos atributos da tarefa no 'local storage'.
    })

    // Evento de entrada de dados sobre o 'input' de texto da tarefa:
    inputElement.addEventListener("input", () => {
        toDoItem.text = inputElement.value // Qualquer entrada/mudança de dados no 'input' de texto é armazenada no atributo string do objeto que representa a tarefa.
    })

    // Evento de desfoco sobre o 'input' de texto da tarefa:
    inputElement.addEventListener("blur", () => {
        inputElement.setAttribute("disabled", "") // Quando o usuário clicar fora do 'input' de texto, o browser deve entender como um salvamento da edição, o que deve impossibilitar a continuação da edição, por isso a adição do atributo 'disabled' neste 'input'.
        saveToLocalStorage() // Chamada da função que salva a mudança nos atributos da tarefa no 'local storage'.
    })

    // Evento de teclar 'enter' sobre o 'input' de texto da tarefa:
    inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault() // Prevenção do comportamento padrão de dar 'refresh' na página ao submeter um formulário/input no browser.
            inputElement.setAttribute("disabled", "") // Quando o usuário teclar 'enter', o browser deve entender como um salvamento da edição, o que deve impossibilitar a continuação da edição, por isso a adição do atributo 'disabled' neste 'input'.
        }
        saveToLocalStorage() // Chamada da função que salva a mudança nos atributos da tarefa no 'local storage'.
    })

    // Evento de clique sobre o 'button' de edição da tarefa:
    editBtnElement.addEventListener("click", () => {
        inputElement.removeAttribute("disabled") // Quando o usuário clicar no botão de editar a tarefa, o browser deve entender como uma permissão para editar o campo de 'input' de texto da tarefa, por isso a remoção do atributo 'disabled' neste 'input'.
        inputElement.focus() // Quando o usuário clicar no botão de editar a tarefa, o browser focará automaticamente no campo de 'input' de texto da tarefa.
    })

    // Evento de clique sobre o 'button' de remoção da tarefa:
    removeBtnElement.addEventListener("click", () => {
        toDosArray = toDosArray.filter(t => t.id != toDoItem.id) // Quando o usuário clicar no botão de remover a tarefa, o browser deve filtrar a tarefa da lista/array geral de tarefas, removendo a tarefa em específico da variável.
        toDoElement.remove() // Remoção visual (desrenderização) de todos os elementos que fazem parte da tarefa removida.
        saveToLocalStorage() // Chamada da função que salva a mudança nos atributos da tarefa no 'local storage'.
    })

    return { toDoElement, inputElement, editBtnElement, removeBtnElement } // A função de renderização retorna um objeto de constantes que armazenam as respectivas tags HTML.
}

// Função que renderiza todas as tarefas que estão persistidas na memória do 'local storage':
function displayToDos() {
    loadLocalStorage() // Chamada da função que carrega os dados persistidos no 'local storage':
    
    for (let i = 0; i < toDosArray.length; i++) { // Laço de repetição que percorre os elementos da lista/array geral de tarefas e renderiza cada um deles através da função 'renderToDo()'
        const toDoItem = toDosArray[i]
        const { toDoElement } = renderToDo(toDoItem)
        toDosList.append(toDoElement)
    }
}

// Função que persiste os dados e suas mudanças ou exclusões na memória do browser através do 'local storage':
function saveToLocalStorage() {
    const save = JSON.stringify(toDosArray) // Armazenamento em uma constante do retorno ransformação da lista/array de tarefas de um conjunto de objetos para um arquivo JSON.
    localStorage.setItem("myToDos", save) // Método que armazena um arquivo JSON no 'local storage'.
}

// Função que carrega os dados persistidos no 'local storage':
function loadLocalStorage() {
    const data = localStorage.getItem("myToDos") // Armazenamento em uma constante do retorno do método 'getItem', que é um arquivo JSON.

    if (data) { // Se houver dados, eles devem ser transformados em um array de objetos Javascript.
        toDosArray = JSON.parse(data)
    }
}