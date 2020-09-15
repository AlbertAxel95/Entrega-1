class Filters{
    // No necesito constructor, pero prefiero tener los métodos a mano y que no ocupen tanto espacio en mi Script principal.
    grey(r, g, b){
        let grey = ((r + g + b) / 3);
        return [grey, grey, grey];
    }


    sepia(r, g, b){
        // Sepia image processing.
        let new_r = (0.393 * r) + (0.769 * g) + (0.189 * b);
        let new_g = (0.349 * r) + (0.686 * g) + (0.168 * b);
        let new_b = (0.272 * r) + (0.534 * g) + (0.131 * b);
    
        // Si este nuevo rojo es mayor a 255, le pongo 255.
        if (new_r > 255) {new_r = 255};
        if (new_g > 255) {new_g = 255};
        if (new_b > 255) {new_b = 255};

        return [new_r, new_g, new_b]
    }


    brighten(r, g, b){
        let value = 70;
        return[r + value, g + value, b + value];
    }


    negative(r, g, b){
        let inverted_r = (255 - r);
        let inverted_g = (255 - g);
        let inverted_b = (255 - b);
        return [inverted_r, inverted_g, inverted_b]
    }


    blackPairColumns(x, r, g, b){
        // Pinta de NEGRO las Columnas Pares. (Por eso si el Resto es == 0, entra). (Básicamente "borra" las columnas pares, porque las vuelve completamente negras).
        if (x % 2 == 0){
            return [0, 0, 0];
        }
        return [r, g, b];
    }


    threshold(r, g, b){
        // 'Treshold', 'Binarization', etc.
        //-------------------------------------
        // Transformo de RGB a escala de Grises.
		let gray =  (0.299 * r + 0.587 * g + 0.114 * b)
        // Si es mayor a 127, considero que el Pixel es BLANCO. (Si no, considero que es NEGRO).
        if (gray > 127){
            return [255, 255, 255]
		}
        return[0, 0, 0]
    }
}