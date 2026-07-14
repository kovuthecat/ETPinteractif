import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { ModuleProps } from '../../types';
import SilhouetteCorps, { type SilhouetteZone } from '../../../components/SilhouetteCorps';
import IllustrationSlot from '../components/IllustrationSlot';
import { ZONES, ZONES_BY_ID, JALONS, DERNIER_JALON_INDEX, beneficesDeZone, type ZoneId } from './data';
import styles from './BeneficesArretModule.module.css';

/**
 * Module « Ce que l'arrêt répare » (plan approfondissement-tabac/S5.md). Une frise de 10
 * jalons (20 minutes → 10-15 ans) rallume la silhouette zone par zone. Registre positif et
 * factuel : jamais l'organe malade, jamais « si vous continuez de fumer », jamais de compte
 * à rebours anxiogène — uniquement ce que l'arrêt apporte, à tout âge et à tout moment.
 */

const MESSAGE_TRANSVERSE =
  "Ces étapes se déclenchent quel que soit l'âge, le nombre d'années de tabac ou de tentatives précédentes. Il n'est jamais trop tard — ni trop tôt.";

export default function BeneficesArretModule(_props: ModuleProps) {
  const [jalonIndex, setJalonIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);

  const jalonCourant = JALONS[jalonIndex];

  const zonesPassees = new Set<ZoneId>();
  for (let i = 0; i < jalonIndex; i++) {
    for (const z of JALONS[i].zones) zonesPassees.add(z);
  }
  const zonesCourantes = new Set(jalonCourant.zones);

  const silhouetteZones: SilhouetteZone[] = ZONES.map((z) => ({
    id: z.id,
    label: z.label,
    x: z.x,
    y: z.y,
    r: z.r,
    etat: zonesCourantes.has(z.id) ? 'allume' : zonesPassees.has(z.id) ? 'ouvert' : 'actif',
  }));

  function selectionnerJalon(index: number) {
    setJalonIndex(index);
    setSelectedZone(null);
  }

  function basculerZone(id: string) {
    setSelectedZone((current) => (current === id ? null : (id as ZoneId)));
  }

  const zoneDetail = selectedZone ? ZONES_BY_ID[selectedZone] : null;
  const beneficesZone = selectedZone ? beneficesDeZone(selectedZone) : [];

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Choisissez un moment après la dernière cigarette et regardez ce qui se répare, organe
        par organe.
      </p>

      <div className={styles.layout}>
        <div className={styles.silhouetteCol}>
          <SilhouetteCorps
            zones={silhouetteZones}
            onZoneClick={basculerZone}
            bodyImage={`${import.meta.env.BASE_URL}illustrations/tabac/silhouette-corps.png`}
          />
        </div>

        <div className={styles.panneau}>
          <div className={styles.frise}>
            <div
              className={styles.friseTrack}
              role="group"
              aria-label="Frise chronologique de l'arrêt"
            >
              {JALONS.map((jalon, index) => {
                const passe = index < jalonIndex;
                const actuel = index === jalonIndex;
                return (
                  <div key={jalon.echeance + index} className={styles.frisePoint}>
                    <button
                      type="button"
                      className={`${styles.friseDot}${actuel ? ` ${styles.friseDotActuel}` : ''}${passe ? ` ${styles.friseDotPasse}` : ''}`}
                      aria-current={actuel ? 'step' : undefined}
                      aria-label={`Étape ${jalon.echeance}`}
                      onClick={() => selectionnerJalon(index)}
                    >
                      {passe && <CheckCircle2 size={16} aria-hidden="true" />}
                    </button>
                    <span className={styles.friseLabel}>{jalon.echeance}</span>
                  </div>
                );
              })}
            </div>
            <p className={styles.friseNote}>Échelle non linéaire — repères chronologiques.</p>
          </div>

          <div className={`${styles.panel} panel`}>
            {zoneDetail ? (
              <div className={styles.detailZone}>
                <button type="button" className={styles.retour} onClick={() => setSelectedZone(null)}>
                  <ArrowLeft aria-hidden="true" /> Retour à l'étape
                </button>

                <div className={styles.detailHeader}>
                  <IllustrationSlot
                    id={`benef-${zoneDetail.id}`}
                    label={zoneDetail.illustrationLabel}
                    shape="rounded"
                    size={220}
                  />
                  <span className="eyebrow">{zoneDetail.label}</span>
                </div>

                <ul className={styles.beneficesListe}>
                  {beneficesZone.map((b) => {
                    const acquis = b.jalonIndex <= jalonIndex;
                    return (
                      <li
                        key={b.jalonIndex}
                        className={`${styles.beneficeItem}${acquis ? ` ${styles.beneficeAcquis}` : ''}`}
                      >
                        <span className={styles.beneficeMarque} aria-hidden="true">
                          {acquis && <CheckCircle2 size={16} />}
                        </span>
                        <div>
                          <span className={styles.beneficeEcheance}>
                            {b.echeance}
                            {acquis && <span className={styles.beneficeAcquisLabel}> — acquis</span>}
                          </span>
                          <p>{b.texte}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className={styles.detailJalon}>
                <p className={styles.echeance}>{jalonCourant.echeance}</p>
                <p className={styles.texteBenefice}>{jalonCourant.texte}</p>

                <div className={styles.zonesConcernees} aria-label="Zones concernées par cette étape">
                  {jalonCourant.zones.map((zid) => {
                    const zone = ZONES_BY_ID[zid];
                    return (
                      <div key={zid} className={styles.zoneCard}>
                        <IllustrationSlot id={`benef-${zid}`} label={zone.illustrationLabel} shape="rounded" size={80} />
                        <span className={styles.zoneChip}>
                          <CheckCircle2 size={14} aria-hidden="true" /> {zone.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {jalonIndex === DERNIER_JALON_INDEX && (
                  <div className={styles.horizon}>
                    <IllustrationSlot id="benef-horizon" label="L'horizon retrouvé" shape="rounded" size={110} />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className={styles.messageTransverse}>{MESSAGE_TRANSVERSE}</p>
        </div>
      </div>
    </div>
  );
}
