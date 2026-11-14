# Worlds Upon The Wind: laptop setup

Goal: get the base game (no CHSOS questions yet) running on the laptop so we can test it and then add the question system.

Source: https://github.com/max99x/wutw-public (CC0, except audio, which is excluded, so the game runs silent).

## What you need
- **Godot 4.7.x.** The project requires 4.7 and was tested on 4.7.2. Use the standard build, not the .NET one.
  - Ubuntu: don't use `apt install godot3` or `godot4`. Those packages are older than 4.7. Download the Linux x86_64 build from https://godotengine.org/download/archive/4.7-stable/ and unzip it somewhere like `~/Games/godot/`. It is a single binary that needs no install. Put it on your PATH or symlink it:

    ```bash
    ln -s ~/Games/godot/Godot_v4.7*_linux.x86_64 ~/.local/bin/godot
    godot --version   # should print 4.7.x
    ```

  - A Flatpak (`flathub org.godotengine.Godot`) also works, but check its version is 4.7 and be aware the sandbox limits file access outside your home folder.
  - The desktop (Arch/CachyOS) uses `sudo pacman -S godot`, which gave 4.7.2.
- **git-lfs** (this is the thing that bit us on the desktop).
  - Ubuntu: `sudo apt install git-lfs`, then `git lfs install`
  - Without it the repo's Japanese data files come down as 130-byte placeholder text files, and New Game crashes on `assert(line.size() == 2)` in `stroke.gd`.
- **About 9 GB free disk** (repo ~7 GB plus ~530 MB of LFS data).

## Setup
1. **Clone it outside any Syncthing folder.** It is huge and would sync everywhere.

   ```bash
   mkdir -p ~/Games && cd ~/Games
   git lfs install
   git clone https://github.com/max99x/wutw-public.git
   ```

   A shallow clone (`--depth 1`) also works and is smaller.

2. **Check the LFS files are real.**

   ```bash
   head -c 100 ~/Games/wutw-public/wutw/japanese/databases/kanji_to_strokes.csv
   ```

   You should see rows like `一,一`. If you see `version https://git-lfs...`, run:

   ```bash
   cd ~/Games/wutw-public && git lfs pull
   ```

   **Fallback if git-lfs isn't available** (for example, no sudo on a work machine):

   ```bash
   cd ~/Games/wutw-public/wutw/japanese/databases
   for f in $(grep -l 'git-lfs' *); do
     curl -sSfL -o "$f.tmp" "https://media.githubusercontent.com/media/max99x/wutw-public/main/wutw/japanese/databases/$f" && mv "$f.tmp" "$f"
   done
   ```

3. **Import the project.** Open Godot, click **Import**, and select `~/Games/wutw-public/wutw/project.godot`. The first import is slow (thousands of resources plus the ~230 MB `parsed_sentences.json`). Let the progress bar finish.
   - If the console shows errors right after the first import, close the project and reopen it. The README says to do this.
   - Optional headless pre-import: `cd ~/Games/wutw-public/wutw && godot --headless --path . --import`

4. **Run it.** Press F5, then New Game.

## Laptop hardware (ThinkPad T14 Gen 1 AMD)
- It is x86_64, so the Linux x86_64 Godot build and the game's bundled Linux extension both apply.
- The project uses Godot's Forward Plus renderer, which needs Vulkan. The Ryzen's Vega graphics support it through Mesa's RADV driver, which Ubuntu normally ships. Check with `vulkaninfo --summary` (from `sudo apt install vulkan-tools`). If it lists no AMD device, run `sudo apt install mesa-vulkan-drivers`.
- Integrated graphics will be slower than the desktop. If the game runs poorly, lower the window size or the in-game settings first. Switching to the Compatibility renderer (`godot --rendering-method gl_compatibility`) may be faster, but the game's custom shaders were written for Forward Plus, so visuals could break. Treat it as a last resort.
- The first import is memory hungry (the 230 MB `parsed_sentences.json` plus thousands of resources). With 8 GB of RAM, close the browser and other apps while it runs. I don't know how much RAM yours has.

## Niri / Wayland
Godot 4 runs on Wayland and XWayland. If the game window opens oddly sized or tiled, that's the compositor, not the project. If the editor has display problems, try `godot --display-driver x11`. I haven't tested Godot on Niri myself. The desktop ran it fine in a floating window, per your screenshot.

## Expected errors (ignore these)
- `WwiseGodot: Cannot open file Init.bnk` and `Bank Load Failed`: this is the excluded audio.
- `10 resources still in use at exit`: harmless on quit.

## Known unresolved issue
- `res://map/settlement_list/settlement_list.tscn` fails to parse (line 78) in my headless runs. It may be a headless-only artifact. If the map screen is broken in the real game, start there. Send the error text to Claude.

## If it is very slow
- The first launch after the import is the slowest. Later launches are much quicker.
- The Godot debugger with many errors slows things down. Fix or ignore the errors, or run the game without the debugger attached.
- Closing other heavy apps helps. The project is big for a laptop.

## Next steps (after the base game runs)
1. Read how events, card rewards and the Japanese practice minigames are defined (`wutw/events/`, `wutw/cards/`, `wutw/japanese/practice_blanks/`).
2. Decide where questions plug in (clinical-vignette events first, card rewards second).
3. Load the CHSOS question bank (`game/web/nodes_generated.js` is the current source) into Godot resources.
4. Later options: add plain Godot audio in place of the Wwise system, and try an Android or web export. Both are blocked by the native extensions (map generator, Steam, Wwise) until those are rebuilt or stubbed out.

## Paths
- Godot project: `~/Games/wutw-public/wutw/project.godot`
- Existing web prototype (for reference only): `game/web/` in this repo
