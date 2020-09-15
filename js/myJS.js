//alert("Your screen resolution is: " + window.screen.width * window.devicePixelRatio + "x" + window.screen.height * window.devicePixelRatio);


// |LINK|
// - https://drive.google.com/file/d/1FNikDOprATlvLC5JhVyCGB3h-yMWV4su/view
// - 1h27m19s


// |BUGS|
// - La Paleta de Colores NO Inicia con el Color Negro seleccionado. (No lo marca como seleccionado, pero si pintás, pinta).


// Tamaño máximo permitido para el Canvas y las Imágenes.
const MAX_CANVAS_WIDTH = 800;
const MAX_CANVAS_HEIGHT = 600;


let canvas = document.querySelector('.canvas1');
canvas.width = MAX_CANVAS_WIDTH; canvas.height = MAX_CANVAS_HEIGHT;

let context = canvas.getContext("2d");
// Background Color
context.fillStyle = "rgb(255, 255, 255)";
// Permite que el Canvas muestre su color de Fondo, (porque aplica el FillStyle). Lo nombré 'clean_canvas' porque al ser el fondo blanco, técnicamente "Limpia" lo que haya.
clean_canvas();

// Cuando se hace Click en el Button del HTML, en realidad le haces Click al INPUT.
let input_selectFile = document.querySelector('.selectFile');

// Mis Objetos.
let filters = new Filters;
let imageSelected_Data = new ImageSelected_Data;
let PaintTools = new Paint_Tools;

// Por defecto inicias sin estar presionando el Mouse.
let click_down = false;
let lastX = -1;
let lastY = -1;
// Leo las herramientas definidas en el HTML y las guardo.
PaintTools.set_tools(document.getElementsByClassName("Tools"));
// Actualiza
PaintTools.showCursor_activeTool();
PaintTools.set_colors(document.getElementsByClassName("Color"));
PaintTools.showCursor_activeColor();



// Cuando eliges una Imagen de tu PC para cargar, y la confirmas, cambia la selección del Input y entra.
input_selectFile.onchange = e => {
    // Limpio el Canvas antes de dibujar o re-dibujar una Imagen.
    clean_canvas();
    // Si elegiste cargar más de una Imagen, no importa, tomo siempre la primera, la '0'. (Contiene el Filepath de la Imagen).
    let image_filepath = e.target.files[0];

    // Como no le puedes asignar el Filepath de la Imagen a 'img.src' porque tiraría la excepción de 'Cross-Origin', necesito este intérprete.
    // (Interpreta el Encabezado del archivo para obtener su información).
    let reader = new FileReader();
    // Lee el archivo y arma un DataURL (el Filepath pero escrito como una URL con el Protocolo Data).
    reader.readAsDataURL(image_filepath);

    // Una vez el 'reader' termina de hacer su interpretación del Archivo.
    reader.onload = readerEvent => {
        // La imagen en protocolo Data se encuentra acá. (En este punto ya es compatible con la Carga de Imágenes, y no tira la excepción 'Cross-Origin').
        let content = readerEvent.target.result;

        let image = new Image();
        image.src = content;

        image.onload = function(){
            imageSelected_Data.set_imageData(prepare_image(image, this));
            // Aplico filtro seleccionado cada vez que cargas una nueva Imagen. (Por defecto está seleccionado "sin filtro").
            applyFilter();
        }
    }
}



function prepare_image(image, data){
    let scaledWidth;  let scaledHeight;

    if ((!(image.width == canvas.width)) && (!(image.height == canvas.height))){
        let rightScale = imageSelected_Data.reescaleValues(image);
        scaledWidth = (image.width * rightScale);
        scaledHeight = (image.height * rightScale);
        /*
            console.log("Selected Scale: " + rightScale)
            console.log("Scaled Width: " + scaledWidth);
            console.log("Scaled Height: " + scaledHeight);
        */
        // Para que no se vean los bordes, actualizo el tamaño del Canvas al de la Imagen.
        canvas.width = scaledWidth;  canvas.height = scaledHeight;
    } else {
        scaledWidth = image.width;
        scaledHeight = image.height;
    }

    context.drawImage(data, 0, 0, scaledWidth, scaledHeight);
    return context.getImageData(0, 0, scaledWidth, scaledHeight);
}


function draw_filtered_image(imageData, filter){
    // Si el filtro es '0' significa "Sin filtro", así que no realizo modificaciones.
    if (filter != 0){
        for (let y = 0; y < imageData.height; y++){
            for (let x = 0; x < imageData.width; x++){
                // Calculo el Index del Color. (Index + 0) = R; (Index + 1) = G; (Index + 2) = B; (Index + 3) = Alpha.
                let index = (x + y * imageData.width) * 4;
                let rgba = [4];
                
                let r = imageSelected_Data.getRed(index);
                let g = imageSelected_Data.getGreen(index);
                let b = imageSelected_Data.getBlue(index);         
                
                // Aplica un Filtro según el que eligas.
                switch(filter) {
                    // Aplico el Filtro a 'imageData.data' (que es el pixel x,y actual), y retorno el cambio. (El 'case 0' que sería 'No Filter', no necesita un case,
                    // porque en mi Class 'ImageSelected_Data', cuando aplicas un filtro la Imagen vuelve a su color original antes de aplicarlo).
                    case 1: rgba = filters.grey(r, g, b); break;
                    case 2: rgba = filters.sepia(r, g, b); break;
                    case 3: rgba = filters.brighten(r, g, b); break;
                    case 4: rgba = filters.negative(r, g, b); break;
                    //rgba = filters.blackPairColumns(x, r, g, b);
                }
                imageData.data[index + 0] = rgba[0];
                imageData.data[index + 1] = rgba[1];
                imageData.data[index + 2] = rgba[2];
                //imageData.data[index + 3] = rgba[3];
            }
        }
    }
    // Redibuja la Imagen con los cambios que le hayas hecho en memoria.
    context.putImageData(imageData, 0, 0);
}


function clean_canvas(){
    // Limpia el Canvas, (borra lo que tenga).
    context.fillRect(0, 0, canvas.width, canvas.height);
}


function applyFilter(){
    //alert($('#filterSelected option:selected').attr("value"));
    // Lo parseo a Int porque llega como String.
    let filterValue = parseInt($('#filterSelected option:selected').attr("value"));
    // Paso la info de la Imagen, y el Value del Filter a aplicar.
    draw_filtered_image(imageSelected_Data.get_imageData(), filterValue);
 }


document.getElementById("saveImage").onclick = function saveImage(){
    let imagen = canvas.toDataURL("image/png");
    this.href = imagen;
}


document.getElementById("clearImage").onclick = function clearImage(){
    context.fillStyle = "rgb(255, 255, 255)";
    clean_canvas();
}



//====================================================================================================================
//                                                   PINTAR / BORRAR
//====================================================================================================================
canvas.addEventListener("mousedown", function(){
    // Cuando presionas el Click, Activa la variable que indica que tienes el Click presionado.
    click_down = true;
})


document.body.addEventListener("mouseup", function(){
    // A menos que haya clickeado dentro del Canvas (por lo cual seguramente Pinté/Borré), tomo como que NO hubo modificación, y no seteo la Imagen actual como el nuevo Back-up.
    if (click_down){
        imageSelected_Data.set_imageData(context.getImageData(0, 0, canvas.width, canvas.height));
    }
    // Cuando presionas el Click, Desactiva la variable que indica que tienes el Click presionado.
    click_down = false;
    // Como levantas el mouse, evita que si pintas un pedazo, mueves el mouse a otro lado, y pintas otro pedazo... Se dibuje una línea entre el final del primer pedazo y el comienzo del segundo.
    // (Es decir, le dice "levantó el Mouse, así que cuando vuelva a clickear comenzará a pintar una nueva línea, y NO la misma").
    lastX = -1;
})


canvas.addEventListener("mousemove", function(event){
    //let brush = document.getElementById("brush").classList;    
    //let eraser = document.getElementById("eraser").classList;

    if (click_down){
        switch(PaintTools.get_activeTool()){
            case "brush": paint(event, PaintTools.get_brushSize(), PaintTools.get_brushColor()); break;
            case "eraser": paint(event, PaintTools.get_eraserSize(), PaintTools.get_eraserColor());
        }
    }
});


function paint(event, size, color) {
    context.lineWidth = size;
    context.strokeStyle = color;
    context.lineCap = "round";

    let x = event.layerX - 10;
    let y = event.layerY;

    context.beginPath();
    // Si es distinto, significa que sigue pintando la misma línea. (Si no, significa que debe cortar la línea y comenzar otra desde la nueva coordenada x, y).
    if (lastX != -1){
        context.moveTo(lastX, lastY);
    } else {
        context.moveTo(x, y);
    }
    context.lineTo(x, y);
    context.stroke();

    lastX = x;
    lastY = y;
}


function set_brushSize(){
    let new_size = parseInt($('#brushSizeSelected option:selected').attr("value"));
    PaintTools.set_brushSize(new_size);
}

function set_eraserSize(){
    console.log("Set erazer Size");
    let new_size = parseInt($('#eraserSizeSelected option:selected').attr("value"));
    PaintTools.set_eraserSize(new_size);
}