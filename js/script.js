var rgb = {
    r: 0,
    g: 0,
    b: 0,

    create: function(r, g, b) {
        var o = Object.create(this);

        o.r = r;
        o.g = g;
        o.b = b;

        return o;
    }
};

var hsl = {
    h: 0,
    s: 0,
    l: 0,

    create: function(h, s, l) {
        var o = Object.create(this);

        o.h = h;
        o.s = s;
        o.l = l;

        return 0;
    },

    toRGB: function() {
        var c = (1 - Math.abs(2 * this.l)) * this.s,
            x = c * (1 - Math.abs(this.h / 60) % 2 - 1),
            m = this.l - c / 2;

        var r, g, b;

        if (this.h >= 0 && this.h < 60) {
            r = c; g = x; b = 0;
        }
        else if (this.h >= 60 && this.h < 120) {
            r = x; g = c; b = 0;
        }
        else if (this.h >= 120 && this.h < 180) {
            r = 0; g = c; b = x;
        }
        else if (this.h >= 180 && this.h < 240) {
            r = 0; g = x; b = c;
        }
        else if (this.h >= 240 && this.h < 300) {
            r = x; g = 0; b = c;
        }
        else if (this.h >= 300 && this.h < 360) {
            r = c; g = 0; b = x;
        }

        return rgb.create(r + m, g + m, b + m);
    },

    toHex: function() {
        var rgb = this.toRGB(),
            str = rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16);
        return hex.parse(str);
    }
};

var hex = {
    r: 0,
    g: 0,
    b: 0,

    create: function(r, g, b) {
        var o = Object.create(this);

        o.r = r || 0;
        o.g = g || 0;
        o.b = b || 0;

        return this;
    },

    parse: function(str) {
        var r, g, b;

        if (str.length > 0) {
            var raw = str[0] === '#' ? str.substring(1) : str;

            if (raw.length === 3 || raw.length === 6) {
                if (raw.length === 3) {
                    r = parseInt(raw[0], 16);
                    g = parseInt(raw[1], 16);
                    b = parseInt(raw[2], 16);
                }
                else if (raw.length === 6) {
                    r = parseInt(raw.substring(0, 1), 16);
                    g = parseInt(raw.substring(1, 2), 16);
                    b = parseInt(raw.substring(2, 3), 16);
                }

                return hex.create(r, g, b);
            }
        }

        return hex.create();
    },

    toRGB: function() {
        return rgb.create(this.r, this.g, this.b);
    },

    toHSL: function() {
        // TODO
    },

    toString: function() {
        return '#' + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
    }
};

/*
function rand(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toPercent(x)
{
    return Math.round(x * 100) + '%';
}

function updateColor(inputType) {
    var hex = $('#hex-input').val();

    if (hex[0] !== '#') {
        hex = '#' + hex;
    }

    var rgbR = $('#rgb-r-input').val();
    var rgbG = $('#rgb-g-input').val();
    var rgbB = $('#rgb-b-input').val();

    var hslH = $('#hsl-h-input').val();
    var hslS = $('#hsl-s-input').val();
    var hslL = $('#hsl-l-input').val();

    var color;

    switch (inputType) {
        case 'hex':
            color = $.Color(hex);
            break;
        case 'rgb':
            color = $.Color(rgbR, rgbG, rgbB);
            break;
        case 'hsl':
            color = $.Color({hue: hslH, saturation: hslS, lightness: hslL});
            break;
    }

    var hex = color.toHexString(false).toUpperCase();

    var red = color.red();
    var green = color.green();
    var blue = color.blue();

    var hue = color.hue();
    var saturation = color.saturation();
    var saturationPercent = toPercent(saturation);
    var lightness = color.lightness();
    var lightnessPercent = toPercent(lightness);

    // update all inputs
    if (inputType !== 'hex') {
        $('#hex-input').val(hex);
    }

    if (inputType !== 'rgb') {
        $('#rgb-r-input').val(red);
        $('#rgb-g-input').val(green);
        $('#rgb-b-input').val(blue);
    }

    if (inputType !== 'hsl') {
        $('#hsl-h-input').val(hue);
        $('#hsl-s-input').val(saturation);
        $('#hsl-l-input').val(lightness);
    }


    // update all outputs
    $('#rgb-r-output').text(red);
    $('#rgb-g-output').text(green);
    $('#rgb-b-output').text(blue);

    $('#hsl-h-output').text(hue);
    $('#hsl-s-output').text(saturationPercent);
    $('#hsl-l-output').text(lightnessPercent);

    $('#hex-output').text(hex).data('manually-changed', true);

    // update color preview
    $('.color-preview').css('background-color', color.toRgbaString());
}

$(function() {
    // start out with a random color by default for fun
    $('#rgb-r-input').val(rand(0, 255));
    $('#rgb-g-input').val(rand(0, 255));
    $('#rgb-b-input').val(rand(0, 255));

    updateColor('rgb');

    var setBeingUsed = function() {
        $(this).data('being-changed', true);
    };

    $('input[type=range]')
        .data('being-changed', true)
        .on('change', setBeingUsed)
        .on('mousedown', setBeingUsed)
        .on('mouseup', setBeingUsed)
        .each(function(i, input) {
            setInterval(function() {
                var beingChanged = $(input).data('being-changed');

                if (! beingChanged) return;

                var lastValue = $(input).data('last-value');
                var newValue = $(input).val();

                if (lastValue === newValue) return;

                $(input).data('last-value', newValue);

                var inputType = $(input).closest('.input-container').attr('data-type');

                updateColor(inputType);
            }, 8 /!* roughly 120 FPS *!/);
        });

    $('#hex-input').on('keyup', function() {
        var inputType = $(this).closest('.input-container').attr('data-type');

        updateColor(inputType);
    });
});
*/
