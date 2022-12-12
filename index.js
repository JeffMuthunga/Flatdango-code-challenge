// Your code here
//Getting Elements by their id
const dividedList = document.getElementById('divList')
const title = document.getElementById('title')
const runTime = document.getElementById('runtime')
const description = document.getElementById('film-info')
const showTime = document.getElementById('showtime')
const ticketNo = document.getElementById('ticket-num')
const displayImage = document.getElementById('poster')
const btn = document.getElementById('buy-ticket')

//variables that will let us keep track of changes
let id = 0
let totalTickets
let ticketsSold = 0

document.addEventListener('DOMContentLoaded', (e) => {
    fetchData()
    
    btn.addEventListener('click', (e) => {
        fetchTicketsSold(id).then((data)=> {
            //if tickets are sold out
            if(data.capacity === data.tickets_sold){
                btn.textContent = 'SOLDOUT'
                btn.disabled = true 
                ticketNo.textContent =0

            } else{
            ticketsSold =data.tickets_sold
            totalTickets = ticketsSold +1
            
            //update method after a single tickets is bought
            fetch(`http://localhost:3000/films/${id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                    },
                body: JSON.stringify({
                    "tickets_sold": totalTickets
                    })
                })

            ticketNo.textContent = data.capacity - totalTickets
            }
        })

    })
})

//fetches data of a single element form db.json
function fetchTicketsSold(id) {
    return fetch(`http://localhost:3000/films/${id}`)
    .then((resp) => resp.json())
    .then((data)=> data )
    }  

// creating lists and delete buttons for objects in db.json
// and adding event listeners 
function createMovieList(film){
    let li = document.createElement('li')
    li.textContent = film.title
    li.className = "film-item"
    li.addEventListener('click', (e) =>{
        displayImage.src = film.poster
        title.textContent = film.title
        runTime.textContent = film.runtime
        description.textContent =film.description
        showTime.textContent= film.showtime
        ticketNo.textContent =film.capacity - film['tickets_sold']
        id = film.id
        btn.disabled = false
        btn.textContent = 'Buy Ticket'
    })
    
    let deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.className = 'deleteBtn'
    deleteBtn.addEventListener('click', (e) => {
        e.target.parentElement.remove()

        //delete method on an element
        fetch(`http://localhost:3000/films/${film.id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    })

    //appending the created lists and buttons
    li.appendChild(deleteBtn)
    dividedList.appendChild(li)

}

// fetching data and creating movie lists
function fetchData() {
    fetch('http://localhost:3000/films')
    .then((response) => response.json())
    .then((data) => {
        data.forEach(element => {
            createMovieList(element)
        });
    })

}