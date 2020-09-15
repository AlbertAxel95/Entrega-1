
class Paint_Tools{

    constructor(tools, colors){
        this.set_tools(tools);
        this.set_colors(colors);
        this.brushColor = "#000000";
        this.eraserColor = "rgb(255, 255, 255)"
        this.brushSize = 1;
        this.eraserSize = 1;
        // Tool que estará activa desde el Comienzo.
        this.activeTool = "brush";
        // Nada más construirse, actualiza el Cursor del Mouse con el Ícono de la Tool activa. (Entre otros ajustes iniciales).
        this.set_initialMouseCursor();
        this.set_initialSelectedTool();
        this.set_initialSelectedColor();
    }


    set_initialMouseCursor(){
        switch(this.activeTool){
            case "brush": canvas.style.cursor = 'url("images/cursor.png") 0 30,default'; break;
            case "eraser": canvas.style.cursor = 'url("images/cursor.png") 0 30,default'; break;
        }
    }

    set_initialSelectedTool(){
        for(let i = 0; i < this.tools.length; i++){
            // Si esta es la Herramienta activa, le dibujo un recuadro.
            if (this.activeTool == this.tools[i].id){
                this.tools[i].style = "outline-style: solid;  outline-color: rgba(66, 104, 110, 0.63); background-color: rgba(95, 150, 160, 0.63);";
                break;
            }
        }
    }

    set_initialSelectedColor(){
        for(let i = 0; i < this.colors.length; i++){
            // Si este es el Color activo, le hago un Highlight.
            if (this.brushColor == this.colors[i].id){
                this.colors[i].style = "outline-style: solid;  outline-color: rgb(255, 255, 255)";
                break;
            }
        }
    }

    get_brushColor(){
        return this.brushColor;
    }

    get_eraserColor(){
        return this.eraserColor;
    }

    get_brushSize(){
        return this.brushSize;
    }

    get_eraserSize(){
        return this.eraserSize;
    }

    get_tools(){
        return this.tools;
    }

    get_activeTool(){
        return this.activeTool;
    }

    set_brushSize(value){
        this.brushSize = value;
    }

    set_eraserSize(value){
        this.eraserSize = value;
    }

    set_tools(tools){
        this.tools = tools;
    }

    set_activeTool(activeTool){
        this.activeTool = activeTool;
    }

    set_colors(colors){
        this.colors = colors;
    }

    set_brushColor(brushColor){
        this.brushColor = brushColor;
    }


    link_Tools(){
        // Esta función NO solo muestra el Cursor para el Mouse, correspondiente a la Tool activa... Sino que también le otorga un "Highlight" al Ícono del a herramienta
        // en la Tool Box, para que visualmente sea sencillo notar cual está activa.
        //------------------------------------------------------------------
        // Añade "Event Listeners" a los Íconos del Brush y la Goma.
        for(let i = 0; i < this.tools.length; i++){
            // Si clickeas en alguna de las herramientas, entra.
            this.tools[i].addEventListener("click", function(){
                // Remueve el estilo de todas las Herramientas. (Hay que tener en cuenta que estoy dentro de la función del componente HTML al que le haya sido linkeada esta función,
                // y que según él, no está mirando dentro de Paint Tools... Por eso debo aclararle que la instancia de 'Paint_Tools', "PaintTools", contiene el método que necesita).
                PaintTools.hideCursor_unactiveTools();
                    switch (this.id) {
                        case "brush":
                            PaintTools.set_activeTool("brush");
                            this.style = "outline-style: solid;  outline-color: rgba(66, 104, 110, 0.63); background-color: rgba(95, 150, 160, 0.63);"; break;
                        // Si clickeaste en 'eraser' carga su Ícono.
                        case "eraser":
                            PaintTools.set_activeTool("eraser");
                            this.style = "outline-style: solid;  outline-color: rgba(66, 104, 110, 0.63); background-color: rgba(95, 150, 160, 0.63);"; break;
                    }
                    // Actualiza el cursor del Mouse con el de la Herramienta seleccionada.
                    PaintTools.set_mouseCursor();
            });
        }
    }


    hideCursor_unactiveTools(){
        // Remuevo el estado activo de TODAS las Tools.
        for(let i = 0; i < this.tools.length; i++){
            this.tools[i].style = "";
        }
    }



    link_colorPalette(){
        // Permite que al clickear un Ícono de la Paleta de Colores, su Color se aplique al Brush para que puedas pintar con él.
        //------------------------------------------------------------------
        // Añade "Event Listeners" a los Buttons de los Colores.
        for(let i = 0; i < this.colors.length; i++){
            // Si clickeas en alguno de los colores, entra.
            this.colors[i].addEventListener("click", function(){
                //
                PaintTools.hideCursor_unactiveColors();
                // El ID es el Color que le quiero poner.
                PaintTools.set_brushColor(this.id);
                this.style = "outline-style: solid;  outline-color: rgb(255, 255, 255)";
            });
        }
    }


    hideCursor_unactiveColors(){
        // Remuevo el estado activo de TODAS las Tools.
        for(let i = 0; i < this.colors.length; i++){
            this.colors[i].style = "";
        }
    }
    

}