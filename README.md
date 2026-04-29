# 💱 Currency Converter App — Guide de déploiement complet

Application de conversion de devises (170+ devises incluant le TND), déployée sur AWS EC2 via Terraform et GitHub Actions.

---

## 🗂️ Structure du projet

```
currency-app/
├── terraform/              # Infrastructure AWS
│   ├── main.tf             # EC2, Security Group, EIP
│   └── outputs.tf          # IP publique, URLs
├── backend/                # API Node.js (Express)
│   ├── server.js
│   └── package.json
├── frontend/               # Interface React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── public/index.html
│   └── package.json
└── .github/workflows/
    └── deploy.yml          # Pipeline CI/CD (3 jobs)
```

---

## ⚙️ Prérequis — Secrets GitHub à configurer

Va dans ton repo GitHub → **Settings → Secrets and variables → Actions** et ajoute :

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | Depuis AWS Academy → AWS Details |
| `AWS_SECRET_ACCESS_KEY` | Depuis AWS Academy → AWS Details |
| `AWS_SESSION_TOKEN` | Depuis AWS Academy → AWS Details |
| `EC2_SSH_KEY` | Contenu complet du fichier `vockey.pem` |

> ⚠️ **AWS Academy** : les credentials expirent toutes les 4h. Remets-les à jour avant chaque run du pipeline.

---

## 🔑 Comment récupérer les credentials AWS Academy

1. Connecte-toi sur **AWS Academy**
2. Lance ton **Learner Lab**
3. Clique sur **"AWS Details"**
4. Copie `aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`
5. Pour `EC2_SSH_KEY` : télécharge `vockey.pem` → copie tout son contenu (y compris `-----BEGIN RSA PRIVATE KEY-----`)

---

## 🚀 Lancement du pipeline

1. **Push** ton code sur la branche `main`
2. Le pipeline se déclenche automatiquement :
   - **Job1** → Terraform crée l'EC2 t2.large Ubuntu 24.04 + Elastic IP
   - **Job2** → Installation Node.js 20, PM2, dépendances npm
   - **Job3** → Build React + lancement backend + frontend avec PM2

3. À la fin du **Job3**, l'URL s'affiche dans les logs :
   ```
   🌐 Frontend : http://<IP_PUBLIQUE>:3000
   🔌 Backend  : http://<IP_PUBLIQUE>:5000
   ```

---

## 🌐 Accès à l'application

| Service | URL |
|---|---|
| **Application** | `http://<IP_EC2>:3000` |
| **API Backend** | `http://<IP_EC2>:5000` |
| **Health check** | `http://<IP_EC2>:5000/health` |
| **Liste devises** | `http://<IP_EC2>:5000/currencies` |
| **Conversion** | `http://<IP_EC2>:5000/convert?from=USD&to=TND&amount=100` |

---

## 🔄 Gérer l'app avec PM2 (sur l'instance)

```bash
ssh -i vockey.pem ubuntu@<IP_EC2>

pm2 list              # Voir les processus
pm2 logs              # Voir les logs
pm2 restart all       # Redémarrer
pm2 stop all          # Arrêter
```

---

## 💡 Notes importantes

- Le **Security Group** ouvre les ports 22, 80, 3000, 5000
- Une **Elastic IP** est allouée → IP stable même après redémarrage
- Les taux de change proviennent de **ExchangeRate-API** (gratuit, temps réel)
- **TND** (Dinar Tunisien) est inclus parmi les 170+ devises
