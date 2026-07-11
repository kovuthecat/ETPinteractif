# -*- coding: utf-8 -*-
"""Pipeline de production des illustrations diabète (S1, plans/illustrations-diabete/index.md
§2). Outil local (Pillow + numpy) — pas de dépendance runtime, ne figure pas dans
package.json. Lit les sources dans Downloads\\illustration ETP (hors repo), écrit les PNG
finaux dans public/illustrations/diabete/ (committé).

Usage : python design/illustrations/build_assets.py
"""
import os

from PIL import Image, ImageDraw
import numpy as np

SRC_DIR = r"C:\Users\kovu\Downloads\illustration ETP"
# Régénérations ponctuelles déposées directement à la racine de Downloads (hors sous-dossier),
# ex. cellules M1 régénérées le 2026-07-11 — cf. plans/illustrations-diabete/S4.md étape 1.
SRC_DIR_ROOT = r"C:\Users\kovu\Downloads"
DST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "illustrations", "diabete")

# Marqueur flood-fill (magenta pur, absent des illustrations sources).
MARKER = (255, 0, 255)

# Les illustrations sources sont en aplats (peu de couleurs) : une palette adaptative
# ramène le poids sous la cible ~90 Ko/asset sans perte visible (vérifié à l'œil, cf.
# VALIDATION.md). Pour les overlays transparents, seul le canal RGB est quantifié —
# l'alpha (bords du flood-fill) reste en dégradé plein pour un contour net.
PALETTE_COLORS = 256


def _load_source(src, crop=None, base=None):
    """Ouvre + convertit RGB (le passage par Pillow ré-encode le PNG et élimine les chunks
    privés type C2PA 'caBX' — aucun besoin de traitement séparé)."""
    im = Image.open(os.path.join(base or SRC_DIR, src)).convert("RGB")
    if crop:
        im = im.crop(crop)
    return im


def build_opaque(src, dst, size=512, crop=None, base=None):
    """Fond décoratif opaque (pas de transparence nécessaire) : recadrage + resize + palette
    adaptative + optimize."""
    im = _load_source(src, crop, base=base)
    im.thumbnail((size, size), Image.LANCZOS)
    im = im.quantize(colors=PALETTE_COLORS, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG)
    os.makedirs(DST_DIR, exist_ok=True)
    out_path = os.path.join(DST_DIR, dst)
    im.save(out_path, format="PNG", optimize=True, compress_level=9)
    print(f"[opaque]      {dst:<28} {im.size[0]}x{im.size[1]}  {os.path.getsize(out_path) // 1024} Ko")


def build_transparent(src, dst, size=768, crop=None, thresh=42, base=None):
    """Overlay à fond transparent : flood-fill depuis les 8 points de bord (préserve l'intérieur
    clair fermé, ex. cellules/organes), palette adaptative sur le RGB (alpha préservé en plein
    dégradé), puis resize + optimize."""
    im = _load_source(src, crop, base=base)
    w, h = im.size
    work = im.copy()
    seeds = [
        (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
        (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2),
    ]
    for s in seeds:
        ImageDraw.floodfill(work, s, MARKER, thresh=thresh)

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

    os.makedirs(DST_DIR, exist_ok=True)
    out_path = os.path.join(DST_DIR, dst)
    out.save(out_path, format="PNG", optimize=True, compress_level=9)
    print(f"[transparent] {dst:<28} {out.size[0]}x{out.size[1]}  {os.path.getsize(out_path) // 1024} Ko")


# Table (source, cible, mode, crop, size, base). `base=None` -> SRC_DIR (Downloads\illustration ETP).
# S1 : pipeline + silhouette/organes nécessaires à la silhouette partagée bodyImage/hotspots.
# S4 : cellules/clé/jeton/pancréas du mécanisme M1 (cellules régénérées à la racine de Downloads,
# cf. SRC_DIR_ROOT). S7 : vignettes M2/M3/M8 (session récurrente — compléter cette table au fil
# des prochains lots générés et validés).
ASSETS = [
    ("silouhette.png", "silhouette.png", "opaque", None, 512, None),
    ("Œil  rétine.png", "organe-yeux.png", "transparent", None, 512, None),
    ("Rein.png", "organe-reins.png", "transparent", None, 512, None),
    ("Nerf.png", "organe-nerfs.png", "transparent", None, 512, None),
    ("Pied — points d'auto-examen.png", "pied-auto-examen.png", "transparent", None, 512, None),
    ("Plaque atherome isolée.png", "plaque.png", "transparent", None, 512, None),
    ("Artere saine.png", "artere-saine.png", "transparent", None, 512, None),
    # S4 — mécanisme M1 (clé/serrure)
    ("Cellule-serrure (fermée).png", "cell-closed.png", "transparent", None, 512, None),
    ("cellule ouverte.png", "cell-open.png", "transparent", None, 512, SRC_DIR_ROOT),
    ("Cellule serrure rouillée.png", "cell-rusty.png", "transparent", None, 512, SRC_DIR_ROOT),
    ("Clé insuline.png", "key.png", "transparent", None, 512, None),
    ("Jeton de sucre (glucose).png", "sugar.png", "transparent", None, 512, None),
    # Pancréas : recadré sur la moitié haute (« en forme »), la moitié basse (« fatigué ») n'est pas utilisée.
    ("Pancréas stylisé (en forme  etfatigué).png", "pancreas.png", "transparent", (0, 0, 1254, 652), 512, None),

    # S7 — M2 Alimentation (aliment-<id>.png, 33 aliments dont 5 nouveaux — cf. alimentation/data.ts)
    ("Baguette blanche.png", "aliment-baguette.png", "transparent", None, 512, None),
    ("Pain complet.png", "aliment-pain-complet.png", "transparent", None, 512, None),
    ("Pain pita.png", "aliment-pain-pita.png", "transparent", None, 512, None),
    ("Riz blanc.png", "aliment-riz-blanc.png", "transparent", None, 512, None),
    ("Riz basmati.png", "aliment-riz-basmati.png", "transparent", None, 512, None),
    ("Riz complet.png", "aliment-riz-complet.png", "transparent", None, 512, None),
    ("Semoule fine.png", "aliment-semoule-couscous.png", "transparent", None, 512, None),
    ("Pomme de terre purée.png", "aliment-pomme-de-terre.png", "transparent", None, 512, None),
    ("Patate douce.png", "aliment-patate-douce.png", "transparent", None, 512, None),
    ("Igname.png", "aliment-igname.png", "transparent", None, 512, None),
    ("Attiéké  manioc.png", "aliment-manioc.png", "transparent", None, 512, None),
    ("Galette de riz soufflé.png", "aliment-galette-riz.png", "transparent", None, 512, None),
    ("Lentilles.png", "aliment-lentilles.png", "transparent", None, 512, None),
    ("Pois chiches.png", "aliment-pois-chiches.png", "transparent", None, 512, None),
    ("Pomme.png", "aliment-pomme.png", "transparent", None, 512, None),
    ("Banane.png", "aliment-banane.png", "transparent", None, 512, None),
    ("Dattes.png", "aliment-dattes.png", "transparent", None, 512, None),
    ("Pasteque.png", "aliment-pasteque.png", "transparent", None, 512, None),
    ("Brocoli.png", "aliment-brocoli.png", "transparent", None, 512, None),
    ("Carotte.png", "aliment-carotte.png", "transparent", None, 512, None),
    ("yaourt.png", "aliment-yaourt.png", "transparent", None, 512, None),
    ("poulet.png", "aliment-poulet.png", "transparent", None, 512, None),
    ("Oeuf.png", "aliment-oeuf.png", "transparent", None, 512, None),
    ("Avocat.png", "aliment-avocat.png", "transparent", None, 512, None),
    ("huile d'olive.png", "aliment-huile-olive.png", "transparent", None, 512, None),
    ("Sardine.png", "aliment-sardine.png", "transparent", None, 512, None),
    ("Saumon.png", "aliment-saumon.png", "transparent", None, 512, None),
    ("noix.png", "aliment-noix.png", "transparent", None, 512, None),
    ("Pâtes blanches.png", "aliment-pates-blanches.png", "transparent", None, 512, None),
    ("Pâtes complètes.png", "aliment-pates-completes.png", "transparent", None, 512, None),
    ("Couscous complet.png", "aliment-couscous-complet.png", "transparent", None, 512, None),
    ("Banane plantain.png", "aliment-banane-plantain.png", "transparent", None, 512, None),
    ("Haricots rouges.png", "aliment-haricots-rouges.png", "transparent", None, 512, None),

    # S7 — M3 Activité physique (centre + 4 rayons + 13 activités dont 'sol' nouveau)
    ("Motif central  activité.png", "activite-centre.png", "transparent", None, 512, None),
    ("Rayon — bénéfice  sucre.png", "activite-rayon-sucre.png", "transparent", None, 512, None),
    ("Rayon — bénéfice  cœur & vaisseaux.png", "activite-rayon-coeur.png", "transparent", None, 512, None),
    ("Rayon — bénéfice tête.png", "activite-rayon-tete.png", "transparent", None, 512, None),
    ("Rayon — bénéfice autonomie.png", "activite-rayon-autonomie.png", "transparent", None, 512, None),
    ("Activité — marcher.png", "activite-marche.png", "transparent", None, 512, None),
    ("Activité — vélo.png", "activite-velo.png", "transparent", None, 512, None),
    ("Activité — ménage.png", "activite-menage.png", "transparent", None, 512, None),
    ("Activité — bricolage.png", "activite-bricolage.png", "transparent", None, 512, None),
    ("Activité — jardinage.png", "activite-jardinage.png", "transparent", None, 512, None),
    ("Activité — porter les courses.png", "activite-courses.png", "transparent", None, 512, None),
    ("Activité — monter les escaliers.png", "activite-escaliers.png", "transparent", None, 512, None),
    ("Activité — se lever d'une chaise.png", "activite-chaise.png", "transparent", None, 512, None),
    ("Activité — danser.png", "activite-danse.png", "transparent", None, 512, None),
    ("Activité — jouer avec les enfants.png", "activite-petitsenfants.png", "transparent", None, 512, None),
    ("activité - laver la voiture.png", "activite-voiture.png", "transparent", None, 512, None),
    ("Activité — marcher le chien.png", "activite-chien.png", "transparent", None, 512, None),
    ("Activité — se relever du sol.png", "activite-sol.png", "transparent", None, 512, None),

    # S7 — M8 Hypoglycémie (7 signes + 4 resucrages)
    ("Signe — tremblements.png", "signe-tremblements.png", "transparent", None, 512, None),
    ("Signe — sueurs.png", "signe-sueurs.png", "transparent", None, 512, None),
    ("Signe — palpitations.png", "signe-palpitations.png", "transparent", None, 512, None),
    ("Signe — faim soudaine.png", "signe-faim-soudaine.png", "transparent", None, 512, None),
    ("Signe — irritabilité.png", "signe-irritabilite.png", "transparent", None, 512, None),
    ("Signe — vision trouble.png", "signe-vision-trouble.png", "transparent", None, 512, None),
    ("Signe — difficulté à se concentrer.png", "signe-difficulte-a-se-concentrer.png", "transparent", None, 512, None),
    ("Resucrage — jus de fruit.png", "resucrage-jus.png", "transparent", None, 512, None),
    ("Resucrage — morceaux de sucre.png", "resucrage-sucre.png", "transparent", None, 512, None),
    ("Resucrage — comprimés de glucose.png", "resucrage-comprimes.png", "transparent", None, 512, None),
    ("Resucrage — soda classique.png", "resucrage-soda.png", "transparent", None, 512, None),
]


def main():
    for src, dst, mode, crop, size, base in ASSETS:
        if mode == "opaque":
            build_opaque(src, dst, size=size, crop=crop, base=base)
        elif mode == "transparent":
            build_transparent(src, dst, size=size, crop=crop, base=base)
        else:
            raise ValueError(f"mode inconnu: {mode}")


if __name__ == "__main__":
    main()
