import { useState } from 'react';
import { ArrowRight, Brain, Check, Cloud, Dna, HeartPulse, ShieldAlert, Wind, X, type LucideIcon } from 'lucide-react';
import type { ModuleProps } from '../types';
import styles from './NicotineToxiqueModule.module.css';

type Category = 'toxiques' | 'dependance';
interface Hotspot { id: string; category: Category; label: string; eyebrow: string; detail: string; Icon: LucideIcon; position: string; }
const HOTSPOTS: Hotspot[] = [
  { id: 'respiratoire', category: 'toxiques', label: 'Goudrons et particules', eyebrow: 'Voies respiratoires', detail: 'Les goudrons adhèrent aux poumons. Les particules fines pénètrent dans les voies respiratoires et entretiennent leur inflammation.', Icon: Wind, position: 'topLeft' },
  { id: 'co', category: 'toxiques', label: 'Monoxyde de carbone', eyebrow: 'Gaz de combustion', detail: "Le monoxyde de carbone (CO) est un gaz asphyxiant qui endommage le coeur et les artères.", Icon: HeartPulse, position: 'bottomLeft' },
  { id: 'cancerogenes', category: 'toxiques', label: 'Cancérogènes', eyebrow: 'Risque de cancers', detail: 'La fumée contient environ 70 substances cancérogènes connues, associées à de multiples cancers.', Icon: Dna, position: 'topRight' },
  { id: 'melange', category: 'toxiques', label: 'Mélange chimique', eyebrow: 'Fumée de combustion', detail: "La fumée de tabac est un mélange complexe d'environ 7 000 substances chimiques.", Icon: Cloud, position: 'bottomRight' },
  { id: 'nicotine', category: 'dependance', label: 'Nicotine', eyebrow: 'Dépendance', detail: "La nicotine crée la dépendance. Elle n'est pas anodine, mais ce n'est pas elle qui provoque les cancers et les maladies liés à la fumée.", Icon: Brain, position: 'nicotine' },
];

export default function NicotineToxiqueModule({ onNavigate }: ModuleProps) {
  const [filter, setFilter] = useState<Category | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = HOTSPOTS.find((hotspot) => hotspot.id === selectedId) ?? null;
  const toggleFilter = (next: Category) => {
    setFilter((current) => current === next ? null : next);
    setSelectedId(null);
  };

  return (
    <div className={styles.module}>
      <p className={styles.intro}>La combustion produit la fumée qui rend malade. La nicotine joue un autre rôle : elle crée la dépendance.</p>
      <div className={styles.filters} aria-label="Filtrer la scène">
        <span className={styles.filtersLabel}>Mettre en évidence</span>
        <button type="button" className={`${styles.filterButton} ${styles.filterToxiques}`} aria-pressed={filter === 'toxiques'} onClick={() => toggleFilter('toxiques')}>
          {filter === 'toxiques' ? <Check aria-hidden="true" /> : <ShieldAlert aria-hidden="true" />} Toxiques de la combustion
        </button>
        <button type="button" className={`${styles.filterButton} ${styles.filterDependance}`} aria-pressed={filter === 'dependance'} onClick={() => toggleFilter('dependance')}>
          {filter === 'dependance' ? <Check aria-hidden="true" /> : <Brain aria-hidden="true" />} Dépendance
        </button>
      </div>

      <div className={styles.sceneShell}>
        <div className={styles.legend} aria-label="Légende de la scène">
          <span className={styles.legendToxiques}><ShieldAlert aria-hidden="true" /> Rouge : fumée toxique</span>
          <span className={styles.legendDependance}><Brain aria-hidden="true" /> Vert : nicotine / dépendance</span>
        </div>
        <div className={styles.scene}>
          <svg className={styles.illustration} viewBox="0 0 1000 620" role="img" aria-label="Une cigarette en combustion produit une fumée reliée à quatre familles toxiques rouges. La nicotine est isolée dans une zone verte.">
            <defs>
              <filter id="smokeBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
              <pattern id="toxicHatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" className={styles.hatchLine} /></pattern>
            </defs>
            <path className={styles.toxicArea} d="M82 102C196 18 426 34 570 142c121 91 137 282 17 374C458 615 190 582 91 456-1 338-16 174 82 102Z" />
            <path className={styles.hatchedArea} d="M82 102C196 18 426 34 570 142c121 91 137 282 17 374C458 615 190 582 91 456-1 338-16 174 82 102Z" />
            <circle className={styles.nicotineArea} cx="824" cy="310" r="146" />
            <g className={filter === 'dependance' ? styles.dimmed : undefined}>
              <path className={styles.connectorToxic} d="M394 273C300 231 250 178 188 134M397 326C295 362 234 433 172 493M463 264C489 179 550 129 610 99M471 337C507 413 555 465 622 505" />
              <g className={styles.smoke} filter="url(#smokeBlur)"><path d="M464 293c-67-42-17-81-73-117-44-28-12-67 4-91M495 290c-37-49 25-81-11-127-29-37 9-73 31-91M526 298c17-49 70-61 49-116-12-31 19-61 43-74" /></g>
              <g className={styles.cigarette}><rect x="284" y="288" width="173" height="42" rx="11" /><rect className={styles.filterTip} x="284" y="288" width="65" height="42" rx="11" /><rect className={styles.burningTip} x="445" y="288" width="18" height="42" rx="8" /><path className={styles.ember} d="M463 289c19 8 19 31 0 40" /></g>
            </g>
            <g className={filter === 'toxiques' ? styles.dimmed : undefined}>
              <path className={styles.connectorNicotine} d="M689 310h-90" /><circle className={styles.nicotineMark} cx="824" cy="310" r="46" /><path className={styles.nicotineMolecule} d="M801 299l18-11 21 11v23l-21 11-18-11Zm39 0 18-10 19 11v22l-19 11-18-11" />
            </g>
          </svg>

          {HOTSPOTS.map((hotspot) => {
            const Icon = hotspot.Icon;
            const isDimmed = filter !== null && filter !== hotspot.category;
            const isSelected = selectedId === hotspot.id;
            return (
              <button key={hotspot.id} type="button" className={`${styles.hotspot} ${styles[hotspot.category]} ${styles[hotspot.position]} ${isDimmed ? styles.hotspotDimmed : ''} ${isSelected ? styles.hotspotSelected : ''}`} aria-expanded={isSelected} aria-controls="hotspot-detail" onClick={() => setSelectedId((current) => current === hotspot.id ? null : hotspot.id)}>
                <Icon aria-hidden="true" /><span>{hotspot.label}</span>
              </button>
            );
          })}
          <div className={`${styles.sceneLabel} ${styles.combustionLabel} ${filter === 'dependance' ? styles.dimmed : ''}`}>Combustion</div>
          <div className={`${styles.sceneLabel} ${styles.nicotineLabel} ${filter === 'toxiques' ? styles.dimmed : ''}`}>Nicotine isolée</div>

          {selected ? (
            <aside id="hotspot-detail" className={`${styles.detailBubble} ${styles[selected.category]}`} aria-live="polite">
              <selected.Icon aria-hidden="true" />
              <div className={styles.detailContent}><span className={styles.detailEyebrow}>{selected.eyebrow}</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
              <button type="button" className={styles.closeButton} onClick={() => setSelectedId(null)} aria-label={`Fermer le détail « ${selected.label} »`}><X aria-hidden="true" /></button>
            </aside>
          ) : null}
        </div>
      </div>

      <p className={styles.takeaway}><strong>À retenir :</strong> retirer la combustion change l'exposition aux toxiques de la fumée, même si la dépendance à la nicotine reste à accompagner.</p>
      <nav className={styles.navigation} aria-label="Aller plus loin">
        <span>Continuer l'exploration</span>
        <button type="button" onClick={() => onNavigate('substituts')}>Substituts et vapoteuse <ArrowRight aria-hidden="true" /></button>
        <button type="button" onClick={() => onNavigate('nicotine')}>Comprendre la nicotine <ArrowRight aria-hidden="true" /></button>
      </nav>
    </div>
  );
}
