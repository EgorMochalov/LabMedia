"use strict"
document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear();
    let page = 1

    if (localStorage.getItem('page')) {
        page = localStorage.getItem('page')
    }

    let data;
    let saveData;

    document.querySelector('.sortButton.data').addEventListener('click', sortrDate)
    document.querySelector('.sortButton.rating').addEventListener('click', sortrRating)
    document.querySelector('.clear').addEventListener('click', clearFilter)
    document.querySelector('.searchInput').addEventListener('input', (e) => { searchFilter(e.target.value.toLowerCase()) })
    document.querySelector('.searchInput').addEventListener('keyup', () => { searchFilter(document.querySelector('.searchInput').value.toLowerCase()) })




    function loadData() {
        fetch('https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users').then(data => data.json()).then(res => {
            data = res
            saveData = structuredClone(res);
            refreshTabel(data)
            createPag(data)

            if (localStorage.getItem('search')) {
                searchFilter(localStorage.getItem('search'))
                document.querySelector('.searchInput').value = localStorage.getItem('search')
            }
            if (localStorage.getItem('sort')) {
                let sort = JSON.parse(localStorage.getItem('sort'))
                if (sort.source == "data") {
                    if (sort.click == 1) {
                        sortrDate()
                    }
                    else {
                        document.querySelector('.sortButton.data').classList.add('firstClick')
                        document.querySelector('.sortButton.data').classList.add('active')
                        sortrDate()
                    }
                }
                else if (sort.source == "rating") {
                    if (sort.click == 1) {
                        sortrRating()
                    }
                    else {
                        document.querySelector('.sortButton.rating').classList.add('firstClick')
                        document.querySelector('.sortButton.rating').classList.add('active')
                        sortrRating()
                    }
                }
            }
            clearVisible()
        })
    }

    function refreshTabel(Data) {
        let tabelBody = document.querySelector('.tabelBody')
        let newBody = document.createElement('div')
        newBody.classList.add('tabelBody')
        if (page < Math.ceil(Data.length / 5) && localStorage.getItem('page')) {
            page = localStorage.getItem('page')
        }
        else if (localStorage.getItem('page')) {
            page = Math.ceil(Data.length / 5)
        }
        console.log(page)
        Data = Data.filter((item, index) => {
            return index + 1 > (page - 1) * 5 && index + 1 <= 5 * page
        })
        console.log(Data)
        Data.forEach(item => {
            let newRow = document.createElement('div')
            newRow.classList.add('row')

            let newName = document.createElement('span')
            newName.classList.add('tableTitle')
            newName.innerText = item.username

            let newEmail = document.createElement('span')
            newEmail.innerText = item.email

            let newData = document.createElement('span')
            newData.innerText = new Date(item.registration_date).toLocaleDateString("RU")

            let newRecord = document.createElement('span')
            newRecord.innerText = item.rating

            let newButton = document.createElement('button')
            newButton.classList.add('deliteButton')
            newButton.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill = "none" > <path d="M3.63499 2.66666L14.3132 13.3333" stroke="black" stroke-width="1.5" stroke-linecap="round" /> <path d="M3.63499 13.3333L14.3132 2.66665" stroke="black" stroke-width="1.5" stroke-linecap="round" /></svg > ')
            newButton.addEventListener('click', () => { visibleModal(item.id) })


            newRow.appendChild(newName)
            newRow.appendChild(newEmail)
            newRow.appendChild(newData)
            newRow.appendChild(newRecord)
            newRow.appendChild(newButton)

            newBody.appendChild(newRow)
        });

        tabelBody.replaceWith(newBody)
    }

    //Pagination
    function createPag(data) {
        let container = document.querySelector('.paginationContainer')
        let newContainer = document.createElement('div')
        newContainer.classList.add('paginationContainer')
        let count = Math.ceil(data.length / 5)
        for (let i = 1; i <= count; i++) {
            let newPag = document.createElement('a')
            newPag.classList.add('pag')
            newPag.innerText = i
            newPag.addEventListener('click', function (e) {
                document.querySelectorAll('.pag').forEach((item)=>{
                    if(item.textContent == e.target.textContent){
                        item.classList.add('active')
                    }
                    else {
                        item.classList.remove('active')
                    }
                })
                page = e.target.textContent
                localStorage.setItem('page',e.target.textContent)
                refreshTabel(data)
            })

            if (i == page) {
                newPag.classList.add('active')
            }

            newContainer.appendChild(newPag)
        }
        container.replaceWith(newContainer)
    }


    //Modal
    function visibleModal(index) {
        document.querySelector('.modalTrue').addEventListener('click', () => {
            deliteRow(index);
            document.querySelector('.modal').classList.add('dNone')
        })
        document.querySelector('.modalFalse').addEventListener('click', () => { document.querySelector('.modal').classList.add('dNone') })
        document.querySelector('.modal').classList.remove('dNone')
    }

    //Filter
    function searchFilter(text) {
        let test = data.filter(function (item) {
            item.email.toLowerCase().indexOf(text) >= 0
            return item.username.toLowerCase().indexOf(text) >= 0 || item.email.toLowerCase().indexOf(text) >= 0;
        })
        localStorage.setItem('search', text)
        refreshTabel(test)
        createPag(test)
        clearVisible()

    }

    //Sort
    function sortrDate() {
        if (document.querySelector('.sortButton.rating').classList.contains('active')) {
            document.querySelector('.sortButton.rating').classList.remove('active')
            document.querySelector('.sortButton.rating').classList.remove('firstClick')
            document.querySelector('.sortButton.rating').classList.remove('doubleClick')
        }
        let date = document.querySelector('.sortButton.data')
        if (!date.classList.contains('doubleClick') && !date.classList.contains('firstClick')) {
            data = data.sort((a, b) => {
                if (new Date(a.registration_date) > new Date(b.registration_date)) return -1;
                else if (new Date(a.registration_date) < new Date(b.registration_date)) return 1;
                else return 0;
            })
            searchFilter(document.querySelector('.searchInput').value.toLowerCase())
            localStorage.setItem('sort', JSON.stringify({ 'click': 1, 'source': "data" }))

            date.classList.add('active')
            clearVisible()
            date.classList.add('firstClick')
        }
        else if (date.classList.contains('firstClick')) {
            data = data.sort((a, b) => {
                if (new Date(a.registration_date) < new Date(b.registration_date)) return -1;
                else if (new Date(a.registration_date) > new Date(b.registration_date)) return 1;
                else return 0;
            })
            searchFilter(document.querySelector('.searchInput').value.toLowerCase())
            clearVisible()
            localStorage.setItem('sort', JSON.stringify({ 'click': 2, 'source': "data" }))
            date.classList.remove('firstClick')
            date.classList.add('doubleClick')
        }
        else {
            data = structuredClone(saveData)
            searchFilter(document.querySelector('.searchInput').value.toLowerCase())
            localStorage.removeItem('sort')

            date.classList.remove('doubleClick')
            date.classList.remove('active')
            clearVisible()
        }
    }

    function sortrRating() {
        if (document.querySelector('.sortButton.data').classList.contains('active')) {
            document.querySelector('.sortButton.data').classList.remove('active')
            document.querySelector('.sortButton.data').classList.remove('firstClick')
            document.querySelector('.sortButton.data').classList.remove('doubleClick')
        }
        let rating = document.querySelector('.sortButton.rating')
        if (!rating.classList.contains('doubleClick') && !rating.classList.contains('firstClick')) {
            data = data.sort((a, b) => {
                if (a.rating < b.rating) return -1;
                else if (a.rating > b.rating) return 1;
                else return 0;
            })
            searchFilter(document.querySelector('.searchInput').value.toLowerCase())
            localStorage.setItem('sort', JSON.stringify({ 'click': 1, 'source': "rating" }))
            rating.classList.add('active')
            clearVisible()
            rating.classList.add('firstClick')
        }
        else if (rating.classList.contains('firstClick')) {
            data = data.sort((a, b) => {
                if (a.rating > b.rating) return -1;
                else if (a.rating < b.rating) return 1;
                else return 0;
            })
            searchFilter(document.querySelector('.searchInput').value.toLowerCase())
            localStorage.setItem('sort', JSON.stringify({ 'click': 2, 'source': "rating" }))
            clearVisible()
            rating.classList.remove('firstClick')
            rating.classList.add('doubleClick')
        }
        else {
            rating.classList.remove('doubleClick')
            rating.classList.remove('active')
            data = structuredClone(saveData)
            refreshTabel(data)
            searchFilter(document.querySelector('.searchInput').value.toLowerCase())
            localStorage.removeItem('sort')
            clearVisible()
        }
    }


    //Active

    function deliteRow(index) {
        data = data.filter(function (item) {
            return item.id !== index;
        });
        saveData = saveData.filter(function (item) {
            return item.id !== index;
        });
        searchFilter(document.querySelector('.searchInput').value.toLowerCase())
    }

    function clearVisible() {
        if (document.querySelector('.sortButton.rating').classList.contains('active') || document.querySelector('.sortButton.data').classList.contains('active') || document.querySelector('.searchInput').value != "") {
            document.querySelector('.clear').classList.remove('dHidden')
        }
        else {
            document.querySelector('.clear').classList.add('dHidden')
        }
    }

    function clearFilter() {
        localStorage.clear()
        document.querySelector('.sortButton.rating').classList.remove('active')
        document.querySelector('.sortButton.rating').classList.remove('firstClick')
        document.querySelector('.sortButton.rating').classList.remove('doubleClick')

        document.querySelector('.sortButton.data').classList.remove('active')
        document.querySelector('.sortButton.data').classList.remove('firstClick')
        document.querySelector('.sortButton.data').classList.remove('doubleClick')

        document.querySelector('.searchInput').value = ""

        data = structuredClone(saveData)
        refreshTabel(data)
        createPag(data)
        clearVisible()
    }

    loadData()
})