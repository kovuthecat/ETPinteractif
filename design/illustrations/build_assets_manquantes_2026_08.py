# -*- coding: utf-8 -*-
"""Pipeline ponctuel — lot d'illustrations manquantes du chantier
enrichissement-visuel-2026-07 (aliments garde-manger + tabac vrai/faux + cardio Alerte),
générées par Thibault et déposées dans Downloads\\Illustration ETP manquante.
Même logique que build_assets.py / build_assets_tabac.py (flood-fill transparence,
palette adaptative). Écrit dans public/illustrations/{diabete,cardio,tabac}/.

Usage : python design/illustrations/build_assets_manquantes_2026_08.py
"""
import os

from PIL import Image, ImageDraw
import numpy as np

SRC_DIR = r"C:\Users\kovu\Downloads\Illustration ETP manquante"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "illustrations")
DIABETE_DIR = os.path.join(ROOT, "diabete")
CARDIO_DIR = os.path.join(ROOT, "cardio")
TABAC_DIR = os.path.join(ROOT, "tabac")

MARKER = (255, 0, 255)
PALETTE_COLORS = 256


def _load_source(src):
    return Image.open(os.path.join(SRC_DIR, src)).convert("RGB")


def build_transparent(src, dst_dir, dst, size=512):
    im = _load_source(src)
    w, h = im.size
    work = im.copy()
    seeds = [
        (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
        (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2),
    ]
    for s in seeds:
        ImageDraw.floodfill(work, s, MARKER, thresh=42)

    aw = np.array(work)
    base = np.array(im)
    mask = np.all(aw == MARKER, axis=-1)
    alpha = np.where(mask, 0, 255).astype("uint8")
    rgba = Image.fromarray(np.dstack([base, alpha]), "RGBA")
    rgba.thumbnail((size, size), Image.LANCZOS)

    rgb_quant = rgba.convert("RGB").quantize(
        colors=PALETTE_COLORS, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG
    ).convert("RGB")
    alpha_channel = rgba.split()[3]
    out = Image.merge("RGBA", (*rgb_quant.split(), alpha_channel))

    os.makedirs(dst_dir, exist_ok=True)
    out_path = os.path.join(dst_dir, dst)
    out.save(out_path, format="PNG", optimize=True, compress_level=9)
    print(f"[transparent] {dst_dir.split(os.sep)[-1]:<8} {dst:<28} {out.size[0]}x{out.size[1]}  {os.path.getsize(out_path) // 1024} Ko")


# Aliments partagés (diabete/ ET cardio/) — gm-legumes-enrichi + gm-situations + gm-monde
SHARED_FOOD_ASSETS = [
    ("Tomate.png", "aliment-tomate.png"),
    ("courgette.png", "aliment-courgette.png"),
    ("Aubergine.png", "aliment-aubergine.png"),
    ("poivron.png", "aliment-poivron.png"),
    ("epinard.png", "aliment-epinards.png"),
    ("Haricots verts.png", "aliment-haricots-verts.png"),
    ("Oignons.png", "aliment-oignon.png"),
    ("gombos.png", "aliment-gombo.png"),
    ("courge.png", "aliment-potiron.png"),
    ("chou.png", "aliment-chou.png"),
    ("Thon.png", "aliment-thon.png"),
    ("Merguez.png", "aliment-merguez.png"),
    ("Feta.png", "aliment-feta.png"),
    ("fromage.png", "aliment-fromage.png"),
    ("olives.png", "aliment-olives.png"),
    ("houmous.png", "aliment-houmous.png"),
    ("pois cassés.png", "aliment-pois-casses.png"),
    ("Naan.png", "aliment-naan.png"),
    ("viande rouge.png", "aliment-viande-rouge.png"),
    ("ghee.png", "aliment-ghee.png"),
    ("Pate d'arachide.png", "aliment-arachide.png"),
]

# Tabac vrai/faux (tabac/ uniquement)
TABAC_VF_ASSETS = [
    ("poids benefice coeur.png", "vf-poids-coeur.png"),
    ("cigarette vs kilos.png", "vf-fumer-mince.png"),
    ("bouger d'abord.png", "vf-poids-regime.png"),
    ("vapoteuse option aide.png", "vf-vape-aide.png"),
    ("piege du double usage.png", "vf-double-usage.png"),
    ("vape pas de l'eau.png", "vf-vapeur-eau.png"),
]

# Cardio (cardio/ uniquement)
CARDIO_ASSETS = [
    ("VITE Asymetrie.png", "vite-visage.png"),
    ("VITE Bras.png", "vite-bras.png"),
    ("VITE  Trouble de la parole.png", "vite-parole.png"),
    ("VITE — Appeler le 15.png", "vite-urgence.png"),
    ("Signe — Douleur thoracique.png", "infarctus-douleur.png"),
    ("Signe — Douleur irradiante.png", "infarctus-irradiation.png"),
    ("Signe — Sueurs froides.png", "infarctus-sueurs.png"),
    ("Atypique — Douleur dans le dos.png", "infarctus-atypique-dos.png"),
    ("Atypique — Douleur dans le ventre.png", "infarctus-atypique-ventre.png"),
    ("Atypique — Fatigue intense.png", "infarctus-atypique-fatigue.png"),
    ("Atypique — Nausées isolées.png", "infarctus-atypique-nausees.png"),
    ("Artère du fumeur — plaque & caillot.png", "tabac-artere-fumeur.png"),
    ("Artère après l'arrêt du tabac.png", "tabac-artere-arret.png"),
    ("Brassard automesure geste correct.png", "automesure-brassard.png"),
]


def main():
    for src, dst in SHARED_FOOD_ASSETS:
        build_transparent(src, DIABETE_DIR, dst)
        build_transparent(src, CARDIO_DIR, dst)
    for src, dst in TABAC_VF_ASSETS:
        build_transparent(src, TABAC_DIR, dst)
    for src, dst in CARDIO_ASSETS:
        build_transparent(src, CARDIO_DIR, dst)


if __name__ == "__main__":
    main()
