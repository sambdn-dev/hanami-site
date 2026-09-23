"""Derive raster-only web assets from the approved flattened Hanami master.

No logo paths are drawn or generated. Every glyph/symbol pixel comes from the
source image; only the uniform cream matte is converted to alpha, with optional
monochrome recolouring for the requested green/white variants.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from PIL import Image, ImageDraw


SITE_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUT = SITE_ROOT / "public" / "brand" / "2026"
FOREST = (15, 61, 40)
CREAM = (248, 246, 239)


def alpha_from_master(source: Image.Image) -> Image.Image:
    """Recover alpha from the near-uniform cream matte using its red channel."""
    rgb = source.convert("RGB")
    red = rgb.getchannel("R")
    # Background red is 253–255, while fully coloured logo pixels are < 90.
    # The 90–250 band retains the antialiasing present in the original raster.
    return red.point(lambda value: max(0, min(255, round((250 - value) * 255 / 160))))


def crop_symbol(alpha: Image.Image, region: tuple[int, int, int, int], pad: int = 8) -> Image.Image:
    x0, y0, x1, y1 = region
    cropped = alpha.crop(region)
    bbox = cropped.getbbox()
    if bbox is None:
        raise ValueError(f"No logo pixels found in {region}")
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(cropped.width, bbox[2] + pad)
    bottom = min(cropped.height, bbox[3] + pad)
    return cropped.crop((left, top, right, bottom))


def tint(mask: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", mask.size, (*color, 0))
    image.putalpha(mask)
    return image


def save_pair(mask: Image.Image, stem: str, output: Path) -> None:
    tint(mask, FOREST).save(output / f"{stem}-vert.png")
    tint(mask, CREAM).save(output / f"{stem}-blanc.png")


def make_circle_icon(mask: Image.Image, output: Path) -> None:
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((0, 0, 511, 511), fill=(*FOREST, 255))
    white = tint(mask, CREAM)
    white.thumbnail((275, 360), Image.Resampling.LANCZOS)
    canvas.alpha_composite(white, ((512 - white.width) // 2, (512 - white.height) // 2))
    canvas.save(output / "icone-h-cercle-vert.png")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--motif-source", type=Path, required=True)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()

    source_path = args.source.resolve()
    output = args.out.resolve()
    output.mkdir(parents=True, exist_ok=True)
    source_copy = output / "logo-maitre-raster-original.png"
    if source_copy != source_path:
        shutil.copy2(source_path, source_copy)

    source = Image.open(source_path).convert("RGB")
    if source.size != (1559, 1009):
        raise ValueError(f"Unexpected master size: {source.size}; inspect crop regions before continuing")
    alpha = alpha_from_master(source)

    primary = crop_symbol(alpha, (300, 325, 1270, 680), 10)
    secondary = crop_symbol(alpha, (300, 325, 1270, 615), 10)
    h_icon = crop_symbol(alpha, (315, 337, 520, 612), 3)
    leaf = crop_symbol(alpha, (1165, 345, 1265, 440), 6)

    # The standalone three-blade motif is present in the supplied brand board,
    # not in the isolated wordmark. Extract its existing pixels from that board.
    motif = Image.open(args.motif_source).convert("RGB")
    if motif.size != (1448, 1086):
        raise ValueError(f"Unexpected motif-board size: {motif.size}")
    grass_region = motif.crop((480, 495, 580, 620))
    grass_red = grass_region.getchannel("R")
    grass_mask = grass_red.point(lambda value: max(0, min(255, round((245 - value) * 255 / 73))))
    grass = crop_symbol(grass_mask, (0, 0, grass_mask.width, grass_mask.height), 3)

    save_pair(primary, "logo-principal", output)
    save_pair(secondary, "logo-secondaire", output)
    save_pair(h_icon, "icone-h", output)
    save_pair(leaf, "feuille", output)
    save_pair(grass, "trois-brins", output)
    make_circle_icon(h_icon, output)

    circle = Image.open(output / "icone-h-cercle-vert.png")
    for size in (16, 32, 180, 512):
        circle.resize((size, size), Image.Resampling.LANCZOS).save(output / f"app-icon-{size}.png")
    circle.save(output / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    print(f"Derived 15 PNG assets and one ICO from {source_path} into {output}")
    print("No SVG created: the approved master is a flattened raster image.")


if __name__ == "__main__":
    main()
