function randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function hexToRGBA(hex: string, opacity: string) {
    let val = hex;
    if (val.startsWith('#')) {
        val = val.substring(1);
    }
    if (val.length > 6) {
        return 'rgba(255, 255, 255, 1)';
    } else if (val.length < 6) {
        const zero = [];
        for (let i = 0; i < 6 - val.length; i++) {
            zero.push('0');
        }
        val = val.concat(val, ...zero);
    }

    const red = parseInt(val.substr(0, 2), 16);
    const green = parseInt(val.substr(2, 2), 16);
    const blue = parseInt(val.substr(4, 2), 16);
    return 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')';
}


function hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error('unable to convert hex to rgb')
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

const threshold = 110;

function colorsAreClose(color1: string, color2: string): boolean {
    const color1RGB = hexToRgb(color1);
    const color2RGB = hexToRgb(color2);

    if (!color1RGB) {
        console.error('could not convert color 1 to rgb');
        return false
    }
    if (!color2RGB) {
        console.error('could not convert color 2 to rgb');
        return false
    }

    const rDist = Math.abs(color1RGB.r - color2RGB.r);
    const gDist = Math.abs(color1RGB.g - color2RGB.g);
    const bDist = Math.abs(color1RGB.b - color2RGB.b);

    return (rDist + gDist + bDist) < threshold
}

const globalDisallowedColors: string[] = [
    '#ffffff',
    '#000000',
    '#424242',
    '#303030',
    '#7aa2c9',
    '#354cbd',
    '#2418b6',
    '#25544c'
]

export function getRandomColor(disallowedColors: string[]) {
    disallowedColors = [
        ...disallowedColors,
        ...globalDisallowedColors
    ]

    // generate a new random color
    let newColor = randomColor();

    let whileCount = 0;

    // while this newColor is
    while (
        // in the disallowed colors OR
    disallowedColors.includes(newColor) ||

    // it is similar to one of the values in the disallowed colors
    (disallowedColors.reduce(
        // eslint-disable-next-line
        (previousValue: boolean, currentValue: string) => (previousValue ? previousValue : colorsAreClose(newColor, currentValue)),
        false
    ))
        ) {
        whileCount++;
        if (whileCount > 500) {
            console.log('could not find different enough color')
            return newColor;
        }

        // generate another one
        newColor = randomColor();
    }

    // return in
    return newColor
}
