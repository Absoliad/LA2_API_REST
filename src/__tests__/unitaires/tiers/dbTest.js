const db = require("../../../config/db");
const dbTiers = require("../../../routes/tiers/db");

jest.mock("../../../config/db", () => ({
  query: jest.fn(),
}));

describe("dbTiers service", () => {
  afterEach(() => jest.clearAllMocks());

  test("getAllTiers - retourne la liste des tiers", async () => {
    const result = [{ idTiers: 1, nomTiers: "Client" }];
    db.query.mockImplementation((sql, params, cb) => cb(null, result));

    await expect(dbTiers.getAllTiers(1)).resolves.toEqual(result);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM Tiers WHERE idUtilisateur = ?",
      [1],
      expect.any(Function)
    );
  });

  test("getAllTiers - rejette en cas d'erreur", async () => {
    const error = new Error("Erreur BDD");
    db.query.mockImplementation((sql, params, cb) => cb(error));

    await expect(dbTiers.getAllTiers(1)).rejects.toThrow("Erreur BDD");
  });

  test("createTiers - insère un tiers", async () => {
    // Pour createTiers, il y a un appel à 2 requêtes dans la vraie fonction
    // On mock un comportement qui renvoie d'abord un utilisateur trouvé, puis insertion réussie
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, [{}])) // utilisateur trouvé
      .mockImplementationOnce((sql, params, cb) =>
        cb(null, { insertId: 42 })
      );

    const data = { nomTiers: "Client", idUtilisateur: 1 };
    await expect(dbTiers.createTiers(data)).resolves.toEqual({ idTiers: 42 });

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT 1 FROM Utilisateur WHERE idUtilisateur = ? LIMIT 1",
      [1],
      expect.any(Function)
    );

    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO Tiers (nomTiers, idUtilisateur) VALUES (?, ?)",
      ["Client", 1],
      expect.any(Function)
    );
  });

  test("createTiers - rejette en cas d'erreur", async () => {
    db.query.mockImplementation((sql, params, cb) => cb(new Error("Erreur insertion")));

    await expect(dbTiers.createTiers({ nomTiers: "Client", idUtilisateur: 1 })).rejects.toThrow(
      "Erreur insertion"
    );
  });

  test("updateTiers - met à jour un tiers", async () => {
    // La fonction updateTiers prend idTiers et data
    // Il y a plusieurs requêtes, on mock les vérifications + update
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, [{}])) // Vérif tiers existe
      .mockImplementationOnce((sql, params, cb) => cb(null, [{}])) // Vérif utilisateur existe (si passé)
      .mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 1 })); // update

    const idTiers = 1;
    const data = { nomTiers: "Client modifié", idUtilisateur: 1 };

    await expect(dbTiers.updateTiers(idTiers, data)).resolves.toEqual(true);

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT 1 FROM Tiers WHERE idTiers = ? LIMIT 1",
      [1],
      expect.any(Function)
    );

    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "SELECT 1 FROM Utilisateur WHERE idUtilisateur = ? LIMIT 1",
      [1],
      expect.any(Function)
    );

    expect(db.query).toHaveBeenNthCalledWith(
      3,
      "UPDATE Tiers SET nomTiers = ?, idUtilisateur = ? WHERE idTiers = ?",
      ["Client modifié", 1, 1],
      expect.any(Function)
    );
  });

  test("updateTiers - rejette en cas d'erreur", async () => {
    const error = new Error("Erreur mise à jour");
    db.query.mockImplementation((sql, params, cb) => cb(error));

    await expect(dbTiers.updateTiers(1, { nomTiers: "Client modifié", idUtilisateur: 1 })).rejects.toThrow(
      "Erreur mise à jour"
    );
  });

  test("deleteTiers - supprime un tiers", async () => {
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, [{}])) // Vérif tiers existe
      .mockImplementationOnce((sql, params, cb) => cb(null)); // Suppression

    await expect(dbTiers.deleteTiers(1)).resolves.toBeUndefined();

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM Tiers WHERE idTiers = ?",
      [1],
      expect.any(Function)
    );

    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "DELETE FROM Tiers WHERE idTiers = ?",
      [1],
      expect.any(Function)
    );
  });

  test("deleteTiers - rejette en cas d'erreur", async () => {
    const error = new Error("Erreur suppression");
    db.query.mockImplementation((sql, params, cb) => cb(error));

    await expect(dbTiers.deleteTiers(1)).rejects.toThrow("Erreur suppression");
  });
});
