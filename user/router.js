const express = require("express");
const { Service } = require("./service");

const router = express.Router();

exports.userRouter = (secret) => {
  // Le service metier
  const service = Service(secret);

  /**
   * Cette route renvoie l'utilisateur connecté
   */
  router.get("/me", (req, rep) => {
    service.me(req.user).then((user) => rep.json(user));
  });

  /**
   * Cette route permet d'ajouer un ami à l'utilisateur connecté
   */
  router.post("/me/friend", (req, rep) => {
    service.addFriend(req.user, req.body).then((user) => rep.json(user));
  });

  /**
   * Cette route permet de récuperer les amis à l'utilisateur connecté
   */
  router.get("/me/friend", (req, rep) => {
    service.friend(req.user).then((user) => rep.json(user));
  });

  /**
   * Cette route permet de se connecter
   * Le body de la requete doit contenir le mot de passe et le login
   */
  router.post("/login", (req, rep) => {
    const { login, password } = req.body;
    console.log("POST / ", req.body);
    service
      .logUser(login, password)
      .then((token) =>
        token ? rep.json({ token }) : rep.status(403).json({ error: "oups" })
      );
  });

  /**
   * Cette route permet de récuperer une liste de tous les utilisateurs.
   * si le client est connecté, on envoie le profile complet sinon juste le login
   * dans un vrai projet, cette liste est paginée
   */
  router.get("/", (req, rep) => {
    service.allRedacted().then((data) => rep.json(data));
  });

  /**
   * Cette route permet de se créer un compte
   * Le body de la requete doit contenir le mot de passe et le login
   */
  router.post("/", (req, rep) => {
    service.create(req.body).then(() => rep.json(req.body));
  });

  return router;
};
