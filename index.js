const express = require("express");
const cors = require("cors");
const { Alchemy, Network } = require("alchemy-sdk");

const app = express();
app.use(cors());

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const PURGE_CONTRACT = "0xB4e6d7ccC8BC15E7e503D0Bb581C51d363AE6c27";
const ZOMBIE_PURGED_TOPIC = "0x590abfe59f7ad7b49f1f18380e0793a4859955598a97c4bcabb3e9e3fc0509fb";

app.get("/zombies/purged", async (req, res) => {
  try {
    const logs = await alchemy.core.getLogs({
      address: PURGE_CONTRACT,
      topics: [ZOMBIE_PURGED_TOPIC],
      fromBlock: "0x0",
      toBlock: "latest",
    });

    const purged = logs.map((log) => {
      // tokenId is the second topic (indexed)
      const tokenId = parseInt(log.topics[2], 16);
      return {
        tokenId,
        transactionHash: log.transactionHash,
        blockNumber: parseInt(log.blockNumber, 16),
      };
    });

    // Remove duplicates and sort
    const unique = Array.from(new Map(purged.map(item => [item.tokenId, item])).values());
    unique.sort((a, b) => a.tokenId - b.tokenId);

    res.json({
      purgedZombies: unique,
      zombies: unique,
      data: unique,
      items: unique,
      results: unique,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purged zombies" });
  }
});

app.get("/", (req, res) => {
  res.send("Rare Apepes API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
