import Logger from "winston";
import PhraseDB from "../src/phrase_db";

describe("PhraseDB", () => {
  const { MongoClient, constructorSpy } = jest.requireMock("mongodb");
  Logger.level = "critical";

  beforeEach(() => {
    constructorSpy.mockClear();
    // collectionSpy.mockClear();
    // findSpy.mockClear();
    // insertOneSpy.mockClear();
  });

  it("should connect and return a client", async () => {
    const url = "mongodb://localhost:27017";
    const client = new MongoClient(url, {});
    const db = new PhraseDB("test", "test", client);
    const connectedClient = await db.connect();
    expect(constructorSpy).toHaveBeenCalledWith(url, {});
    expect(connectedClient).toBe(client);
  });
});
