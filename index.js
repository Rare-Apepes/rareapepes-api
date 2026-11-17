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

const ZOMBIE_CONTRACT = "0xf902a8baf88793ddf636a8791bd55a62b71c9ef4";
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

app.get("/zombies/purged", async (req, res) => {
  try {
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      contractAddresses: [ZOMBIE_CONTRACT],
      toAddress: DEAD_ADDRESS,
      category: ["erc721"],
      excludeZeroValue: false,
    });

    const purged = transfers.transfers.map((tx) => {
      const id = parseInt(tx.tokenId);
      const imageUrl = `https://data.zombieapepes.com/${id}.png`;
      return {
        tokenId: id,
        id: id,
        name: `Zombie Apepe #${id}`,
        image: imageUrl,
        imageUrl: imageUrl,
        imageURI: imageUrl,
        img: imageUrl,
        metadata: {
          image: imageUrl,
          name: `Zombie Apepe #${id}`,
        },
        transactionHash: tx.hash,
        txHash: tx.hash,
        hash: tx.hash,
        tx: tx.hash,
        transaction: tx.hash,
        blockNumber: parseInt(tx.blockNum, 16),
      };
    });

    const unique = Array.from(
      new Map(purged.map((item) => [item.tokenId, item])).values()
    );
    unique.sort((a, b) => b.blockNumber - a.blockNumber);

    res.json({
      purgedZombies: unique,
      zombies: unique,
      data: unique,
      items: unique,
      results: unique,
      purged: unique,
    });
  } catch (err) {
    console.error("Error fetching purged zombies:", err);
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
