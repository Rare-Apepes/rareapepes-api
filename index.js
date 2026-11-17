const express = require("express");
const cors = require("cors");
const { Alchemy, Network, Utils } = require("alchemy-sdk");

const app = express();
app.use(cors());

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const ZOMBIE_CONTRACT = "0xf902a8baf88793ddf636a8791bd55a62b71c9ef4";
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

app.get("/zombies/purged", async (req, res) => {
  try {
    // Get Transfer events to the dead address (burns)
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      contractAddresses: [ZOMBIE_CONTRACT],
      toAddress: DEAD_ADDRESS,
      category: ["erc721"],
      excludeZeroValue: false,
    });

    const purged = transfers.transfers.map((tx) => ({
      tokenId: parseInt(tx.tokenId),
      name: `Zombie Apepe #${parseInt(tx.tokenId)}`,
      image: `https://data.zombieapepes.com/${parseInt(tx.tokenId)}.png`,
      transactionHash: tx.hash,
      blockNumber: parseInt(tx.blockNum, 16),
    }));

    // Remove duplicates
    const unique = Array.from(
      new Map(purged.map((item) => [item.tokenId, item])).values()
    );
    unique.sort((a, b) => b.blockNumber - a.blockNumber); // newest first

    res.json({
      purgedZombies: unique,
      zombies: unique,
      data: unique,
      items: unique,
      results: unique,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purged zombies", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Rare Apepes API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
