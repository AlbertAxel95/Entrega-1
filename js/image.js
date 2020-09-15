
class ImageSelected_Data {

    set_imageData(imageData){
        this.imageData = imageData;
        this.colors = [];
        this.generate_colorsBackup();
    }

    get_imageData(){
        this.load_colorsBackup();
        return this.imageData;
    }


    generate_colorsBackup(){
        for (let y = 0; y < this.imageData.height; y++){
            this.colors[y] = new Array;
            for (let x = 0; x < this.imageData.width; x++){
                let index = (x + y * this.imageData.width) * 4;
                this.colors[y][x] = new Array(4);
                this.colors[y][x][0] = this.imageData.data[index + 0];
                this.colors[y][x][1] = this.imageData.data[index + 1];
                this.colors[y][x][2] = this.imageData.data[index + 2];
                this.colors[y][x][3] = this.imageData.data[index + 3];
            }
        }
    }


    load_colorsBackup(){
        for (let y = 0; y < this.imageData.height; y++){
            for (let x = 0; x < this.imageData.width; x++){
                let index = (x + y * this.imageData.width) * 4;
                this.imageData.data[index + 0] = this.colors[y][x][0];
                this.imageData.data[index + 1] = this.colors[y][x][1];
                this.imageData.data[index + 2] = this.colors[y][x][2];
                this.imageData.data[index + 3] = this.colors[y][x][3];
            }
        }
    }


    reescaleValues(image){
        // Se encarga de elegir el mejor tipo de Downscale/Upscale para la Imagen, según su resolución con respecto a la del Canvas.
        let width_scalePercentage = 999;
        let height_scalePercentage = 999;
        let widthHeigth = [null, null];

        if ((image.width > MAX_CANVAS_WIDTH) || (image.height > MAX_CANVAS_HEIGHT)){
            // Si es más grande, la tengo que Achicar.
            // ---
            if (image.width > MAX_CANVAS_WIDTH){
                // EJ: 800 / 1600 = 0.5.
                width_scalePercentage = (MAX_CANVAS_WIDTH / image.width);
                console.log("Reduce Width: " + MAX_CANVAS_WIDTH + " / " + image.width + " = " + widthHeigth[0]);
            }
            if (image.height > MAX_CANVAS_HEIGHT){
                height_scalePercentage = (MAX_CANVAS_HEIGHT / image.height);
                console.log("Reduce Height: " + MAX_CANVAS_HEIGHT + " / " + image.height + " = " + widthHeigth[1]);
            }
        } else if ((image.width < MAX_CANVAS_WIDTH) || (image.height < MAX_CANVAS_HEIGHT)){
            // Si es más chica, la tengo que Agrandar.
            // ---
            if (image.width < MAX_CANVAS_WIDTH){
                // EJ: 800 / 400 = 2.
                width_scalePercentage = (MAX_CANVAS_WIDTH / image.width);
                console.log("Enlarge Width: " + MAX_CANVAS_WIDTH + " / " + image.width + " = " + widthHeigth[0]);
            }
            if (image.height < MAX_CANVAS_HEIGHT){
                height_scalePercentage = (MAX_CANVAS_HEIGHT / image.height);
                console.log("Enlarge Height: " + MAX_CANVAS_HEIGHT + " / " + image.height + " = " + widthHeigth[1]);
            }
        }

        if (width_scalePercentage <= height_scalePercentage){
            return width_scalePercentage;
        }
        return height_scalePercentage;
    }


    // Funciones para obtener RGBA.
    getRed(index){
        return this.imageData.data[index + 0];
    }

    getGreen(index){
        return this.imageData.data[index + 1];
    }

    getBlue(index){
        return this.imageData.data[index + 2];
    }

    getAlpha(index){
        return this.imageData.data[index + 3];
    }
  }