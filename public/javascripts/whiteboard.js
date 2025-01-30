window.addEventListener("load",()=>{ //added the event listener 
    let canvas = document.getElementById("canvas") // got the id 
    let ctx = canvas.getContext("2d") // created the context in 2d 
    const container = document.getElementById("container")
    const clear = document.getElementById("clear")
    //Resizing
    canvas.height = window.innerHeight // set the canvas height to window height
    canvas.width = window.innerWidth // set the canvas width to window width 

     let painting = false   //setting the value of painting => false 

     //Stating position 
     function startposition(e){ // created event function 
        painting = true // set the value of painting to true
        draw(e)    // called the draw function everytime on start position 
     }
     function endposition(){   // created the function endposition 
        painting = false // set the the value of painting to false 
        ctx.beginPath()  // in the end position the begine path will be created new 
     }
     function draw(e){ // created the draw event function 
        if(!painting){  // if user is not painting then return the function 
            return
        }   //else 
        ctx.lineWidth = 10  //set the linewidth to 10 
        ctx.lineCap = 'round'  // the set the linecap to round 
        ctx.lineTo(e.clientX,e.clientY)    // set the line to both the axis x and y 
        ctx.stroke()   //  this will set the defaul color for drawing which is black 
        ctx.beginPath()  // this will create the new path 
        ctx.moveTo(e.clientX,e.clientY) // this will move the end cursor to new client x and y 
     }
     //Event Listener 

     canvas.addEventListener("mousedown",startposition) // if the mouse is clicked 
     canvas.addEventListener("mouseup",endposition)  // if the mouse is unclicked 
     canvas.addEventListener("mousemove",draw)  // if the mouse is moving 
})