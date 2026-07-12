# -*- coding: utf-8 -*-
"""Pipeline de production des illustrations tabac (chantier illustrations-tabac, S1).
Même logique que build_assets.py (diabète) : Pillow + numpy, outil local, pas de
dépendance runtime. Lit les sources dans Downloads\\illustration ETP (hors repo),
écrit les PNG finaux dans public/illustrations/tabac/ (committé).

Usage : python design/illustrations/build_assets_tabac.py
"""
import os

from PIL import Image, ImageDraw
import numpy as np

SRC_DIR = r"C:\Users\kovu\Downloads\illustration ETP"
DST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "illustrations", "tabac")

# Marqueur flood-fill (magenta pur, absent des illustrations sources).
MARKER = (255, 0, 255)

PALETTE_COLORS = 256


def _load_source(src, crop=None):
    im = Image.open(os.path.join(SRC_DIR, src)).convert("RGB")
    if crop:
        im = im.crop(crop)
    return im


def build_transparent(src, dst, size=512, crop=None, thresh=42):
    """Overlay à fond transparent : flood-fill depuis les 8 points de bord (préserve
    l'intérieur clair fermé), palette adaptative sur le RGB, resize (conserve le ratio
    d'origine — icônes carrées comme scènes larges), puis optimize."""
    im = _load_source(src, crop)
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


# Table (source, cible, size). `size` borne la plus grande dimension (thumbnail) —
# 512 pour les icônes carrées (bénéfices/outils/idées reçues), 900 pour les scènes
# larges (techniques de prise, format 16:7).
ASSETS = [
    # Bénéfices de l'arrêt (silhouette, `benef-<zone>` — cf. benefices-arret/data.ts)
    ("Cerveau protégé.png", "benef-cerveau.png", 512, None),
    ("Goût & odorat retrouvés.png", "benef-bouche.png", 512, None),
    ("Cœur apaisé.png", "benef-coeur.png", 512, None),
    ("Poumons qui respirent.png", "benef-poumons.png", 512, None),
    ("Sang mieux oxygéné.png", "benef-sang.png", 512, None),
    ("Peau plus lumineuse.png", "benef-peau.png", 512, None),
    ("Jambes qui marchent.png", "benef-jambes.png", 512, None),
    # benef-horizon : aucune illustration dédiée dans le lot — reste en placeholder.

    # Boîte à outils (14 outils — cf. boite-a-outils/data.ts, tous couverts)
    ("La vague et les 4D.png", "outil-vague-4d.png", 512, None),
    ("Plans SI… ALORS….png", "outil-si-alors.png", 512, None),
    ("Bouger 10 minutes.png", "outil-bouger.png", 512, None),
    ("Respirer pour redescendre.png", "outil-respiration.png", 512, None),
    ("Surfer sur l'envie.png", "outil-surfer.png", 512, None),
    ("Faire place nette.png", "outil-place-nette.png", 512, None),
    ("Casser la routine.png", "outil-routine.png", 512, None),
    ("Occuper mains et bouche.png", "outil-mains-bouche.png", 512, None),
    ("Une semaine d'observation.png", "outil-journal.png", 512, None),
    ("Ma phrase de refus.png", "outil-refus.png", 512, None),
    ("La tirelire du non-fumeur.png", "outil-recompense.png", 512, None),
    ("La liste anti-ennui.png", "outil-anti-ennui.png", 512, None),
    ("Le plan de secours.png", "outil-faux-pas.png", 512, None),
    ("Traiter le manque.png", "outil-substituts.png", 512, None),

    # Idées reçues (21 cartes — cf. idees-recues/data.ts, 15/21 couvertes ; le reste
    # (vf-poids-coeur, vf-fumer-mince, vf-poids-regime, vf-vape-aide, vf-double-usage,
    # vf-vapeur-eau) reste en placeholder, aucune image dédiée dans le lot).
    ("Fumer me détend.png", "vf-detente.png", 512, None),
    ("Substituts et cœur.png", "vf-substituts-coeur.png", 512, None),
    ("« Trop tard pour moi ».png", "vf-trop-tard.png", 512, None),
    ("Quelques cigarettes seulement.png", "vf-petit-fumeur.png", 512, None),
    ("Light & tabac à rouler.png", "vf-light-roule.png", 512, None),
    ("Poids et arrêt.png", "vf-poids.png", 512, None),
    ("une question de volonté.png", "vf-volonte.png", 512, None),
    ("Les patchs ne marchent pas.png", "vf-patch-marche-pas.png", 512, None),
    ("Un écart n'efface rien.png", "vf-faux-pas.png", 512, None),
    ("Ca commence en 20mn.png", "vf-20min.png", 512, None),
    ("Patch + gomme.png", "vf-combinaison.png", 512, None),
    ("Plusieurs tentatives.png", "vf-tentatives.png", 512, None),
    ("L'envie est une vague.png", "vf-vague.png", 512, None),
    ("Vapoteuse vs cigarette.png", "vf-vapoteuse.png", 512, None),
    ("Réduire ou arrêter.png", "vf-reduire.png", 512, None),

    # Substituts — techniques de prise (`substitut-<forme>` — cf. substituts/data,
    # scènes larges 16:7, cf. TechniqueIllustration.tsx)
    ("Patch — technique.png", "substitut-patch.png", 900, None),
    ("Gomme — technique.png", "substitut-gomme.png", 900, None),
    ("Pastille — technique.png", "substitut-pastille.png", 900, None),
    ("Comprimé sublingual — technique.png", "substitut-sublingual.png", 900, None),
    ("Spray buccal — technique.png", "substitut-spray.png", 900, None),
    ("Vapoteuse — mode d'emploi.png", "substitut-vapoteuse.png", 900, None),
]


def main():
    for src, dst, size, crop in ASSETS:
        build_transparent(src, dst, size=size, crop=crop)


if __name__ == "__main__":
    main()
