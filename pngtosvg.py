from PIL import Image


def pngtosvg(filename):
    """

    :param filename: 

    """
    im = Image.open(filename)
    width, height = im.size
    print(
        '<svg width="{}" height="{}" xmlns="http://www.w3.org/2000/svg">'.format(
            width, height
        )
    )
    for y in range(height):
        for x in range(width):
            r, g, b, a = im.getpixel((x, y))
            print(
                '<rect x="{}" y="{}" width="1" height="1" fill="rgb({},{},{})" />'.format(
                    x, y, r, g, b
                )
            )
    print("</svg>")


pngtosvg("pixil-frame-0_3.png")
