# Utilise l'image officielle de MariaDB
FROM mariadb:latest

# Variables d'environnement pour la configuration de la BDD
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=api-ig2i
ENV MYSQL_USER=utilisateur
ENV MYSQL_PASSWORD=motdepasse

# Copie le fichier SQL dans le dossier d'initialisation de MariaDB
COPY init.sql /docker-entrypoint-initdb.d/

# (optionnel) Configuration personnalisée
# COPY my.cnf /etc/mysql/my.cnf

# Port exposé
EXPOSE 3306

