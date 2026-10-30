# Backend QuizzMe

API REST en Java 21, Spring Boot 3 et PostgreSQL. Ce dossier est indépendant du frontend React situé à la racine du dépôt.

## Prérequis

- Amazon Corretto 21. `JAVA_HOME` est configuré vers l’installation locale `C:\Program Files\Amazon Corretto\jdk21.0.12_12`.
- Maven 3.9 ou plus récent.
- Docker Desktop, pour lancer PostgreSQL localement.

Le projet cible Java 21 (`java.version` dans `pom.xml`) et Maven refuse toute autre version du JDK. Ferme puis rouvre IntelliJ et les terminaux après avoir configuré `JAVA_HOME`. Vérifie le JDK effectivement utilisé dans PowerShell :

```powershell
$env:JAVA_HOME
& "$env:JAVA_HOME\bin\java.exe" -version
```

Windows peut encore trouver Java 11 en premier via son `PATH` système. Pour utiliser Corretto 21 dans le terminal courant :

```powershell
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
```

## Démarrage local

Depuis PowerShell, à la racine du dépôt :

```powershell
Copy-Item backend\.env.example backend\.env
```

Modifie `backend\.env` et remplace le mot de passe d’exemple par un mot de passe local. Ce fichier est ignoré par Git. Puis démarre PostgreSQL :

```powershell
docker compose --env-file backend\.env -f backend\compose.yaml up -d
```

Les variables d’environnement Spring doivent également être définies pour le processus Java. Dans PowerShell :

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/quizzme"
$env:DB_USERNAME = "quizzme_dev"
$env:DB_PASSWORD = "le-meme-mot-de-passe-local"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn -f backend\pom.xml spring-boot:run
```

L’API écoute alors sur `http://localhost:8080`. L’application ne crée pas encore de tables ni de routes métier : les migrations Flyway et les premières API seront ajoutées au fil des étapes.

## Architecture cible

Organisation par fonctionnalité, avec les couches métier séparées :

```text
backend/src/main/java/com/quizzme/
├── config/                 # configuration transversale et sécurité
├── auth/                   # inscription, connexion, sessions
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── user/                   # profils et rôles
├── quiz/                   # quiz, questions et propositions
├── theme/                  # thèmes et contenus de référence
├── game/                   # parties et réponses en direct
└── leaderboard/            # scores et classements

backend/src/main/resources/
├── application.yml
└── db/migration/           # migrations SQL Flyway versionnées
```

Chaque fonctionnalité pourra contenir `api` (contrôleurs et DTO), `application` (cas d’usage), `domain` (règles métier) et `infrastructure` (JPA et intégrations). Les contrôleurs ne manipuleront pas directement les entités de base de données.

## Sécurité et configuration actuelle

Spring Security est dans le projet, mais aucune authentification personnalisée n’est encore configurée. En attendant la prochaine étape, Spring Security protège par défaut les routes et crée un mot de passe temporaire visible dans les logs au démarrage. Ne branche pas encore le frontend et ne déploie pas cette configuration.

Les identifiants PostgreSQL sont fournis par l’environnement, Hibernate ne modifie pas le schéma (`ddl-auto: validate`) et les erreurs HTTP ne divulguent ni message interne ni trace d’exception. Les secrets de production devront être configurés dans l’environnement de déploiement, jamais dans Git.

La suite du guidage commencera par le modèle utilisateur et les migrations, puis l’inscription/connexion avec Spring Security, avant les API de quiz, de thèmes, les drapeaux et les classements. Les drapeaux seront intégrés depuis une source de données choisie et attribuée correctement, pas copiés depuis une API au hasard.
