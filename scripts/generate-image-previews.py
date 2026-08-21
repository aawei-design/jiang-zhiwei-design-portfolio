from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps, ImageSequence


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PREVIEW_ROOT = PUBLIC / "previews"
SOURCE_DIRS = (PUBLIC / "assets", PUBLIC / "hero", PUBLIC / "portfolio")
RASTER_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def preview_path(source: Path) -> Path:
    relative = source.relative_to(PUBLIC)
    return PREVIEW_ROOT / Path(f"{relative.as_posix()}.webp")


def hero_still_path(source: Path) -> Path:
    return PREVIEW_ROOT / "hero-still" / source.name


def target_width(source: Path, width: int, height: int, animated: bool) -> int:
    relative = source.relative_to(PUBLIC)
    if relative.parts[0] == "hero":
        return min(width, 420)
    if height / max(width, 1) >= 2.2:
        return min(width, 720)
    if "posters" in relative.parts or source.name.startswith("profile"):
        return min(width, 720)
    if animated:
        return min(width, 960)
    return min(width, 1280)


def convert(source: Path) -> tuple[int, int]:
    destination = preview_path(source)
    destination.parent.mkdir(parents=True, exist_ok=True)
    before = source.stat().st_size

    with Image.open(source) as image:
        animated = getattr(image, "n_frames", 1) > 1
        width = target_width(source, image.width, image.height, animated)
        height = max(1, round(image.height * width / image.width))
        quality = 64 if source.relative_to(PUBLIC).parts[0] == "hero" else 72

        if animated:
            frames = []
            durations = []
            for frame in ImageSequence.Iterator(image):
                rendered = frame.convert("RGBA")
                if rendered.size != (width, height):
                    rendered = rendered.resize((width, height), Image.Resampling.LANCZOS)
                frames.append(rendered)
                durations.append(frame.info.get("duration", image.info.get("duration", 40)))

            frames[0].save(
                destination,
                format="WEBP",
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=image.info.get("loop", 0),
                quality=quality,
                alpha_quality=82,
                method=4,
                minimize_size=True,
            )
            if source.relative_to(PUBLIC).parts[0] == "hero":
                still_destination = hero_still_path(source)
                still_destination.parent.mkdir(parents=True, exist_ok=True)
                frames[0].save(
                    still_destination,
                    format="WEBP",
                    quality=74,
                    alpha_quality=82,
                    method=5,
                )
        else:
            rendered = ImageOps.exif_transpose(image)
            rendered = rendered.convert("RGBA" if rendered.mode in {"RGBA", "LA", "P"} else "RGB")
            if rendered.size != (width, height):
                rendered = rendered.resize((width, height), Image.Resampling.LANCZOS)
            rendered.save(
                destination,
                format="WEBP",
                quality=quality,
                alpha_quality=82,
                method=5,
            )

    return before, destination.stat().st_size


def main() -> None:
    sources = sorted(
        path
        for directory in SOURCE_DIRS
        for path in directory.rglob("*")
        if path.is_file() and path.suffix.lower() in RASTER_EXTENSIONS
    )
    before_total = 0
    after_total = 0
    for index, source in enumerate(sources, start=1):
        before, after = convert(source)
        before_total += before
        after_total += after
        print(f"[{index:03}/{len(sources):03}] {source.relative_to(PUBLIC)} -> {after / 1024:.0f} KB")

    reduction = 100 * (1 - after_total / before_total) if before_total else 0
    print(
        f"Created {len(sources)} previews: "
        f"{before_total / 1024 / 1024:.2f} MB -> {after_total / 1024 / 1024:.2f} MB "
        f"({reduction:.1f}% smaller)"
    )


if __name__ == "__main__":
    main()
