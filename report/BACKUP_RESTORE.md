# Firestore Snapshot Matrix (Backup & Restore)

No application is completely immune to catastrophic data deletion or rogue admin mistakes. V4 implements an instant cold-storage snapshot backup mechanic.

## Exporting Architecture
1. Navigate to **DevOps & Security -> DB Snapshot**.
2. Click **Export JSON Manifest**.
3. All complex Firestore structures (Users, Curriculum Maps, Subject Lists, API Keys, and Feature Flags) are instantly assembled into a localized `trade_sovereign_backup_YYYY_MM_DD.json` file on your local machine.

## Restoring Architecture
If another administrator accidentally wipes all Class 10 subjects or breaks a critical API key:
1. Click **Restore System**.
2. Upload the pre-existing JSON manifest.
3. The platform will reverse-engineer the document, rewriting the Firestore state to match the exact moment the snapshot was captured.

*Note: This process only restores Data/Metadata. It does not re-upload physically deleted PDF blobs.*
