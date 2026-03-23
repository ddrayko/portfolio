# 🎨 Gestion des Thèmes Spéciaux - Admin

## 📍 Accès

**URL** : `/admin/special-themes`

**Depuis le dashboard** : Section "THÈMES SPÉCIAUX" → Bouton "Gérer les Thèmes"

---

## 🎯 Fonctionnalités

### Vue d'ensemble

La page de gestion des thèmes spéciaux permet de :

- ✅ Voir tous les thèmes disponibles
- ✅ Configurer les dates de début et de fin
- ✅ Modifier l'année, le mois, le jour, l'heure, la minute et la seconde
- ✅ Sauvegarder les configurations
- ✅ Réinitialiser aux valeurs par défaut

---

## 🎨 Thèmes disponibles

### 1. Nouvel An

**ID** : `new-year`

**Description** : Thème doré festif pour célébrer la nouvelle année

**Configuration par défaut** :

- **Début** : 20 décembre, 00:00:00
- **Fin** : 2 janvier (année suivante), 23:59:59

**Effets visuels** :

- 3 particules dorées flottantes
- 2 confettis tombants
- Message "Bonne Année 2026"
- Dégradés dorés sur les titres
- Logo tournant
- Scrollbar dorée

---

## 🔧 Utilisation

### Étape 1 : Sélectionner un thème

1. Cliquez sur une carte de thème dans la liste de gauche
2. Le panneau de configuration s'affiche à droite

### Étape 2 : Configurer les dates

#### Date de début (vert)

| Champ   | Min  | Max  | Description        |
| ------- | ---- | ---- | ------------------ |
| Jour    | 1    | 31   | Jour du mois       |
| Mois    | 1    | 12   | Mois de l'année    |
| Année   | 2025 | 2100 | Année              |
| Heure   | 0    | 23   | Heure (format 24h) |
| Minute  | 0    | 59   | Minute             |
| Seconde | 0    | 59   | Seconde            |

#### Date de fin (rouge)

| Champ   | Min  | Max  | Description        |
| ------- | ---- | ---- | ------------------ |
| Jour    | 1    | 31   | Jour du mois       |
| Mois    | 1    | 12   | Mois de l'année    |
| Année   | 2025 | 2100 | Année              |
| Heure   | 0    | 23   | Heure (format 24h) |
| Minute  | 0    | 59   | Minute             |
| Seconde | 0    | 59   | Seconde            |

### Étape 3 : Aperçu

Un aperçu formaté s'affiche en bas :

```
Début : 20/12/2025 à 00:00:00
Fin : 02/01/2026 à 23:59:59
```

### Étape 4 : Sauvegarder

1. Cliquez sur **"Sauvegarder"**
2. Une notification de succès s'affiche
3. La configuration est enregistrée dans `localStorage`

### Étape 5 : Réinitialiser (optionnel)

1. Cliquez sur **"Réinitialiser"**
2. Les valeurs par défaut sont restaurées
3. Vous devez cliquer sur "Sauvegarder" pour appliquer

---

## 💾 Stockage

### LocalStorage

Les configurations sont sauvegardées dans :

```
localStorage.setItem('special-themes-config', JSON.stringify(themes))
```

### Format des données

```typescript
interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  startDate: {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    second: number;
  };
  endDate: {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    second: number;
  };
}
```

---

## 🔄 Intégration avec le handler

### Actuellement

Le `special-theme-handler.tsx` utilise des dates **codées en dur** :

```typescript
const isDecemberPeriod = now.getMonth() === 11 && now.getDate() >= 20;
const isJanuaryPeriod = now.getMonth() === 0 && now.getDate() <= 2;
```

### Prochaine étape (à implémenter)

Modifier le handler pour lire depuis `localStorage` :

```typescript
const config = localStorage.getItem("special-themes-config");
if (config) {
  const themes = JSON.parse(config);
  const newYearTheme = themes.find((t) => t.id === "new-year");

  if (newYearTheme) {
    const start = new Date(
      newYearTheme.startDate.year,
      newYearTheme.startDate.month - 1,
      newYearTheme.startDate.day,
      newYearTheme.startDate.hour,
      newYearTheme.startDate.minute,
      newYearTheme.startDate.second,
    );

    const end = new Date(
      newYearTheme.endDate.year,
      newYearTheme.endDate.month - 1,
      newYearTheme.endDate.day,
      newYearTheme.endDate.hour,
      newYearTheme.endDate.minute,
      newYearTheme.endDate.second,
    );

    const isActive = now >= start && now <= end;
  }
}
```

---

## 🎯 Exemples d'utilisation

### Exemple 1 : Thème Nouvel An classique

```
Début : 31/12/2025 à 00:00:00
Fin : 01/01/2026 à 23:59:59
```

### Exemple 2 : Période festive étendue

```
Début : 20/12/2025 à 00:00:00
Fin : 02/01/2026 à 23:59:59
```

### Exemple 3 : Test immédiat

```
Début : [Date actuelle] à [Heure actuelle]
Fin : [Date actuelle + 1 jour] à [Heure actuelle]
```

---

## ⚠️ Notes importantes

### Validation

- Les champs acceptent uniquement des nombres
- Les valeurs hors limites sont automatiquement corrigées
- Si un champ est vide, la valeur minimale est utilisée

### Persistance

- Les configurations sont sauvegardées **localement** dans le navigateur
- Elles ne sont **pas synchronisées** entre appareils
- Pour une synchronisation, il faudrait utiliser Firebase

### Rechargement

- Le handler vérifie les dates **toutes les heures**
- Pour un test immédiat, rechargez la page

---

## 🚀 Améliorations futures

### À implémenter

- [ ] Synchronisation Firebase des configurations
- [ ] Prévisualisation en temps réel du thème
- [ ] Historique des modifications
- [ ] Activation/désactivation manuelle
- [ ] Ajout de nouveaux thèmes personnalisés
- [ ] Export/Import de configurations
- [ ] Notifications avant activation/désactivation

### Thèmes futurs possibles

- 🎃 Halloween (octobre)
- 🎄 Noël (décembre)
- 💝 Saint-Valentin (février)
- 🎂 Anniversaire du site
- 🌸 Printemps (mars-avril)
- ☀️ Été (juin-août)

---

## 📱 Interface

### Desktop

- Liste des thèmes à gauche (1/3)
- Configuration à droite (2/3)
- Layout en grille responsive

### Mobile

- Liste des thèmes en haut
- Configuration en bas
- Layout en colonne unique

---

## 🎨 Design

### Couleurs

- **Début** : Vert (Clock icon)
- **Fin** : Rouge (Clock icon)
- **Thème sélectionné** : Ring primary
- **Boutons** : Primary (Sauvegarder), Outline (Réinitialiser)

### Icônes

- `Sparkles` : Thèmes, section
- `Calendar` : Configuration
- `Clock` : Dates de début/fin
- `Save` : Sauvegarder
- `RotateCcw` : Réinitialiser

---

**Créé le** : 21 décembre 2025
**Dernière mise à jour** : 21 décembre 2025
