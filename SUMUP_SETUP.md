# Activer le paiement SumUp — NeuroAlchemy

Ce document explique comment activer le paiement en ligne par carte (SumUp) sur le site de réservation. Tant que les informations ci-dessous ne sont pas renseignées, le site fonctionne normalement : les clientes et clients peuvent réserver un créneau, mais aucune tentative de paiement en ligne n'est faite — un message leur indique qu'Hassiba confirmera le règlement (Wero, PayPal ou espèces). **Aucune fonctionnalité n'est bloquée en attendant.**

## Architecture en place

- Le site (statique, hébergé sur Vercel) ne contient et n'affiche jamais de clé secrète.
- Toute la logique de paiement tourne côté serveur, dans des **Supabase Edge Functions** (projet Supabase `hmbrgbubksyijxotjdib`, anciennement "Bloom-Glow-", repris entièrement pour NeuroAlchemy).
- Le prix payé est toujours recalculé côté serveur à partir de la table `services` (jamais confié au navigateur du client).
- Le statut d'un paiement n'est considéré comme "payé" qu'après vérification directe auprès de l'API SumUp (webhook + revérification), jamais sur la seule foi d'un retour du navigateur.

## Ce qu'Hassiba doit fournir

1. **Un compte marchand SumUp actif** (pas seulement un compte personnel de paiement — un compte professionnel avec possibilité d'API).
2. Depuis [me.sumup.com/settings/developer](https://me.sumup.com/settings/developer) : créer une **clé API** (API key).
3. Le **Merchant Code** du compte (visible dans les paramètres du compte SumUp, format `MCXXXXXX`).
4. Configurer, dans le tableau de bord SumUp, le **logo et le nom affichés sur la page de paiement** (Branding / Business profile) pour que la page de paiement ait l'identité NeuroAlchemy.

## Où renseigner ces informations

Ces deux valeurs doivent être ajoutées comme **secrets de la fonction Supabase** (jamais dans le code, jamais dans Git) :

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard) → projet **Bloom-Glow-** (`hmbrgbubksyijxotjdib`) → **Edge Functions** → **Manage secrets**.
2. Ajouter :
   - `SUMUP_API_KEY` = la clé API SumUp
   - `SUMUP_MERCHANT_CODE` = le merchant code SumUp
3. Aucun redéploiement n'est nécessaire : les fonctions lisent ces secrets à chaque appel.

Dès que ces deux secrets sont renseignés, le paiement en ligne s'active automatiquement sur la page de réservation — aucune autre action technique n'est nécessaire.

## Comment tester

1. Créer d'abord un **compte sandbox** SumUp (gratuit, sans argent réel) : Developer Settings → onglet Sandboxes.
2. Renseigner temporairement les secrets ci-dessus avec la clé API et le merchant code **sandbox**.
3. Faire une réservation test sur le site avec une méthode payante (ex. Neurofeedback — 70 €).
4. Vérifier la redirection vers la page de paiement SumUp, puis le retour sur le site avec le message de confirmation.
5. Une fois validé, remplacer les secrets par les identifiants du **compte SumUp réel**.

Note : un montant de `11` (dans n'importe quelle devise) échoue toujours volontairement en sandbox — c'est normal, cela sert à tester le cas d'échec.

## Comment vérifier qu'un paiement est bien confirmé

- Dans l'**espace admin** (`/admin.html`), l'onglet Réservations affiche le statut de paiement de chaque réservation (En attente / Payé / Échoué).
- Le statut n'est jamais mis à jour par le simple retour du client sur le site : il est confirmé par SumUp lui-même (webhook `sumup-webhook`, revérifié automatiquement via l'API SumUp).
- En cas de doute sur une transaction précise, le tableau de bord SumUp (me.sumup.com) reste la source officielle des transactions et montants réellement encaissés.

## Étapes restant à effectuer côté compte SumUp

- [ ] Créer/activer le compte marchand SumUp professionnel.
- [ ] Générer la clé API et récupérer le merchant code.
- [ ] Renseigner les deux secrets dans Supabase (voir ci-dessus).
- [ ] Personnaliser le branding de la page de paiement (logo, nom).
- [ ] Faire un premier test en sandbox, puis un premier vrai paiement de faible montant pour valider le circuit complet.

## Paiements hors ligne (Wero, PayPal, espèces)

Ces moyens de paiement restent gérés manuellement par Hassiba, comme aujourd'hui — ils ne passent pas par SumUp. Dans l'espace admin, une réservation réglée autrement que par carte peut être marquée manuellement comme "payée (espèces)".
