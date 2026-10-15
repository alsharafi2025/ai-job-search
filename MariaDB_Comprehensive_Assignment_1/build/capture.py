#!/usr/bin/env python3
"""Drive a real `mariadb` client inside a real xterm (on an Xvfb display) and
capture genuine screenshots for Sections 3-8 of the assignment.

Every figure starts from a cleared screen, the statements are typed line by
line exactly as the course guide prints them (so the `->` continuation
prompts appear naturally), and the terminal window is captured with
ImageMagick `import`. The raw capture is then trimmed to its content and
given a uniform margin, the way one crops a console screenshot.

Usage: capture.py OUTPUT_DIR TEE_LOG
"""
import os
import subprocess
import sys
import time

from PIL import Image, ImageChops

OUT, TEE_LOG = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

DISPLAY = ":99"
BG, FG = "#0c0c0c", "#cccccc"
ENV = dict(os.environ, DISPLAY=DISPLAY, LANG="C.UTF-8", LC_ALL="C.UTF-8", TERM="xterm")

FIGURES = [
    ("fig_3_1", ["CREATE DATABASE Demo;"]),
    ("fig_3_2", ["SHOW DATABASES;"]),
    ("fig_4_1", ["USE Demo;", "SELECT DATABASE();"]),
    ("fig_5_1", ["CREATE TABLE Book(", "id INT NOT NULL AUTO_INCREMENT,",
                 "name VARCHAR(100) NOT NULL,", "PRIMARY KEY (id));"]),
    ("fig_5_2", ["CREATE TABLE Price(", "id INT NOT NULL AUTO_INCREMENT,",
                 "price float NOT NULL,", "PRIMARY KEY (id));"]),
    ("fig_6_1", ["SHOW TABLES;"]),
    ("fig_7_1", ["DESC Book;"]),
    ("fig_7_2", ["DESC Price;"]),
    # (a) INSERT
    ("fig_8_1", ["INSERT INTO book", "(id, name)", "VALUES(1, 'MariaDB Book');",
                 "INSERT INTO price", "(id, price)", "VALUES(1, 200);"]),
    # (b) SELECT
    ("fig_8_2", ["SELECT * from book;", "SELECT * from price;"]),
    # (c) Inserting multiple records
    ("fig_8_3", ["INSERT INTO book", "(id, name)", "VALUES", "(2,'MariaDB Book2'),",
                 "(3,'MariaDB Book3'),", "(4,'MariaDB Book4'),", "(5,'MariaDB Book5');",
                 "SELECT * FROM book;"]),
    ("fig_8_4", ["INSERT INTO price", "(id, price)", "VALUES", "(2, 250),", "(3, 220),",
                 "(4, 190),", "(5, 300);", "SELECT * FROM price;"]),
    # (d) UPDATE
    ("fig_8_5", ["UPDATE price", "SET price = 250", "WHERE id = 1;", "SELECT * FROM price;"]),
    ("fig_8_6", ["UPDATE book", 'SET name = "MariaDB Book1"', "WHERE id = 1;",
                 "SELECT * FROM book;"]),
    ("fig_8_7", ["UPDATE price", "SET id = 6,", "price = 280", "WHERE id = 5;",
                 "SELECT * FROM price;"]),
    # (e) DELETE
    ("fig_8_8", ["DELETE FROM price", "WHERE id = 6;", "SELECT * FROM price;"]),
    # (f) WHERE
    ("fig_8_9", ["SELECT *", "FROM price", "WHERE price < 250;"]),
    ("fig_8_10", ["SELECT *", "FROM price", "WHERE id > 3", "AND price < 250;",
                  "SELECT *", "FROM price", "WHERE id > 3", "OR price < 250;"]),
    # (g) LIKE
    ("fig_8_11", ["SELECT name", "FROM book", "WHERE name LIKE 'M%';",
                  "SELECT name", "FROM book", "WHERE name LIKE '%4';",
                  "SELECT name", "FROM book", "WHERE name LIKE '%DB%';"]),
    ("fig_8_12", ["SELECT *", "FROM price", "WHERE price LIKE '1_0';",
                  "SELECT *", "FROM price", "WHERE price LIKE '_2_';"]),
    ("fig_8_13", ["SELECT *", "FROM price", "WHERE price NOT LIKE '2%';"]),
    # (h) ORDER BY
    ("fig_8_14", ["SELECT * FROM price", "WHERE price LIKE '2%'", "ORDER BY price;"]),
    ("fig_8_15", ["SELECT * FROM price", "WHERE price LIKE '2%'", "ORDER BY price DESC;"]),
    ("fig_8_16", ["SELECT * FROM price", "WHERE price LIKE '2%'", "ORDER BY price ASC;"]),
    # (i) DISTINCT
    ("fig_8_17", ["SELECT price FROM Price;", "SELECT DISTINCT price FROM Price;"]),
    # (j) FROM
    ("fig_8_18", ["SELECT * FROM price;", "SELECT price FROM Price;"]),
]


def run(*args):
    return subprocess.run(args, env=ENV, check=True, capture_output=True, text=True).stdout


def type_line(text):
    run("xdotool", "type", "--delay", "12", "--", text)
    run("xdotool", "key", "Return")
    # Statements ending in ';' execute; give the server time to answer.
    time.sleep(0.5 if text.rstrip().endswith(";") else 0.15)


def capture(win, name):
    time.sleep(1.0)
    raw = os.path.join(OUT, f"{name}_raw.png")
    run("import", "-window", win, raw)
    img = Image.open(raw).convert("RGB")
    bg = Image.new("RGB", img.size, BG)
    box = ImageChops.difference(img, bg).getbbox()
    crop = img.crop(box)
    pad = 18
    framed = Image.new("RGB", (crop.width + 2 * pad, crop.height + 2 * pad), BG)
    framed.paste(crop, (pad, pad))
    framed.save(os.path.join(OUT, f"{name}.png"))
    os.remove(raw)
    print(f"{name}: {framed.width}x{framed.height}", flush=True)


def main():
    xvfb = subprocess.Popen(["Xvfb", DISPLAY, "-screen", "0", "1400x1500x24",
                             "-nolisten", "tcp", "-dpi", "96"], env=ENV)
    time.sleep(1.5)
    xterm = subprocess.Popen(
        ["xterm", "-fa", "DejaVu Sans Mono", "-fs", "15", "-geometry", "72x50+0+0",
         "-bg", BG, "-fg", FG, "-cr", FG, "+sb", "-b", "0", "-bw", "0",
         "-xrm", "XTerm*cursorBlink: false",
         "-e", "mariadb", "-u", "root", f"--tee={TEE_LOG}"],
        env=ENV)
    try:
        win = run("xdotool", "search", "--sync", "--class", "xterm").split()[0]
        run("xdotool", "mousemove", "200", "200")
        run("xdotool", "windowfocus", "--sync", win)
        time.sleep(2.0)
        for name, lines in FIGURES:
            type_line(r"\! clear")
            time.sleep(0.6)
            for line in lines:
                type_line(line)
            capture(win, name)
        type_line("exit")
        time.sleep(1.0)
    finally:
        xterm.terminate()
        xvfb.terminate()


if __name__ == "__main__":
    main()
