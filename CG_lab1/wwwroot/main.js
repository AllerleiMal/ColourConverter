// Default

let RGB = {
    R: document.getElementById("r-input"),
    G: document.getElementById("g-input"),
    B: document.getElementById("b-input")
};
let XYZ = {
    X: document.getElementById("x-input"),
    Y: document.getElementById("y-input"),
    Z: document.getElementById("z-input")
};
let HSV = {
    H: document.getElementById("h-input"),
    S: document.getElementById("s-input"),
    V: document.getElementById("v-input")
};

let monitor = document.getElementById("colourMonitor");


let colourPicker = new iro.ColorPicker("#colourPicker", {
    width: 250,
    color: "rgb(255, 0, 0)",
    borderWidth: 1,
    borderColor: "#fff",
    layout: [
        {
            component: iro.ui.Wheel,
            options: {
                sliderType: 'hue'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'hue'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'saturation'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'value'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'red'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'green'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'blue'
            }
        }
    ]
});

function applyRgbChanges(rgb){
    RGB.R.value = rgb.r;
    RGB.G.value = rgb.g;
    RGB.B.value = rgb.b;
}

function applyHsvChanges(hsv){
    HSV.H.value = hsv.h;
    HSV.S.value = hsv.s;
    HSV.V.value = hsv.v;
}

function applyXyzChanges(xyz){
    XYZ.X.value = xyz.X;
    XYZ.Y.value = xyz.Y;
    XYZ.Z.value = xyz.Z;
}

function convertRgbToXyz(rgb){
    function f(x){
        if (x >= 0.04045){
            return Math.pow((x + 0.055) / 1.055, 2.4);
        }else{
            return x / 12.92;
        }
    }
    
    let Rn = f(rgb.r / 255 ) * 100;
    let Gn = f( rgb.g / 255 ) * 100;
    let Bn = f( rgb.b / 255 ) * 100;
    
    return{
        X: Rn * 0.412453 + Gn * 0.357580 + Bn * 0.180423,
        Y: Rn * 0.212671 + Gn * 0.715160 + Bn * 0.072169,
        Z: Rn * 0.019334 + Gn * 0.119193 + Bn * 0.950227
    }
}

function convertXyzToRgb(xyz){
    function f(x){
        if (x >= 0.0031308){
            return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
        }
        
        return 12.92 * x;
    }
    
    let Rn = 3.2406 * xyz.X.value / 100 - 1.5372 * xyz.Y.value / 100 - 0.4986 * xyz.Z.value / 100;
    let Gn = -0.9689 * xyz.X.value / 100 + 1.8758 * xyz.Y.value / 100 + 0.0415 * xyz.Z.value / 100;
    let Bn = 0.0557 * xyz.X.value / 100 - 0.2040 * xyz.Y.value / 100 + 1.0570 * xyz.Z.value / 100;
    // let Rn = 3.240479 * xyz.X.value -1.537150 * xyz.Y.value -0.498535 * xyz.Z.value;
    // let Gn = -0.969256 * xyz.X.value + 1.875992 * xyz.Y.value + 0.041556 * xyz.Z.value;
    // let Bn = 0.055648 * xyz.X.value - 0.204043 * xyz.Y.value + 1.057311 * xyz.Z.value;
    
    return{
        R: f(Rn) * 255,
        G: f(Gn) * 255,
        B: f(Bn) * 255
    }
}

colourPicker.on('color:change', function(color){
    applyRgbChanges(color.rgb);
    applyHsvChanges(color.hsv);
    applyXyzChanges(convertRgbToXyz(color.rgb))
    // document.body.style.background = color.rgbString;
    monitor.style.background = color.rgbString;
});

function preprocessRgbColor(colorAspect){
    let value = colorAspect;
    if (value < 0){
        value = 0;
    }else if (value > 255){
        value = 255;
    }
    
    return value;
}

//RGB listeners
RGB.B.addEventListener('change', (event) => {
    colourPicker.color.blue = preprocessRgbColor(RGB.B.value);
})

RGB.G.addEventListener('change', (event) => {
    colourPicker.color.green = preprocessRgbColor(RGB.G.value);
})

RGB.R.addEventListener('change', (event) => {
    colourPicker.color.red = preprocessRgbColor(RGB.R.value);
})

//XYZ listeners
XYZ.X.addEventListener('change', (event) => {
    let new_rgb = convertXyzToRgb(XYZ);
    colourPicker.color.blue = preprocessRgbColor(new_rgb.B);
    colourPicker.color.green = preprocessRgbColor(new_rgb.G);
    colourPicker.color.red = preprocessRgbColor(new_rgb.R);
})

XYZ.Y.addEventListener('change', (event) => {
    let new_rgb = convertXyzToRgb(XYZ);
    colourPicker.color.blue = preprocessRgbColor(new_rgb.B);
    colourPicker.color.green = preprocessRgbColor(new_rgb.G);
    colourPicker.color.red = preprocessRgbColor(new_rgb.R);
})

XYZ.Z.addEventListener('change', (event) => {
    let new_rgb = convertXyzToRgb(XYZ);
    colourPicker.color.blue = preprocessRgbColor(new_rgb.B);
    colourPicker.color.green = preprocessRgbColor(new_rgb.G);
    colourPicker.color.red = preprocessRgbColor(new_rgb.R);
})

function preprocessHsvColor(colorAspect, type){
    if (type === 'H'){
        return colorAspect % 360;
    }else{
        let value = colorAspect;
        if (value < 0){
            value = 0;
        }else if (value > 100){
            value = 100;
        }
        
        return value;
    }
}

//HSV listeners
HSV.H.addEventListener('change', (event) => {
    colourPicker.color.hue = preprocessHsvColor(HSV.H.value, 'H');
})

HSV.S.addEventListener('change', (event) => {
    colourPicker.color.saturation = preprocessHsvColor(HSV.S.value, 'S');
})

HSV.V.addEventListener('change', (event) => {
    colourPicker.color.value = preprocessHsvColor(HSV.V.value, 'V');
})

colourPicker.color.blue = 255;
colourPicker.color.red = 255;
colourPicker.color.green = 255;