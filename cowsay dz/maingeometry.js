export class Geometry{

    square(width){
        console.log(`
        Площадь: ${width**2}
        Периметр: ${width*4}
        `);
    }

    rectangle(height,width){
        console.log(`
        Площадь: ${width*height}
        Периметр: ${(width+height)*2}
        `);
    }

    circle(radius){
        console.log(`
        Площадь: ${Math.PI*(radius**2)}
        Периметр: ${Math.PI*radius*2}
        `);
    }

}

