const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../db/dbConnection");

const router = express.Router();

// ───── GET /codeblocks ─────
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const blocks = await db.collection("codeblocks").find({}, {
      projection: { solution: 0 },
    }).toArray();

    const blocksWithId = blocks.map(block => ({
      ...block,
      id: block._id.toString()
    })).sort((a, b) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      return difficultyOrder[a.difficulty.toLowerCase()] - difficultyOrder[b.difficulty.toLowerCase()];
    });

    res.json(blocksWithId);
  } catch (error) {
    console.error("Error fetching code blocks:", error);
    res.status(500).json({ error: "Failed to fetch code blocks" });
  }
});

// ───── GET /codeblocks/:id ─────
router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    let block;

    try {
      block = await db.collection("codeblocks").findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { solution: 0 } }
      );
    } catch {
      block = await db.collection("codeblocks").findOne(
        { title: req.params.id },
        { projection: { solution: 0 } }
      );
    }

    if (!block) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({
      ...block,
      id: block._id.toString()
    });
  } catch (error) {
    console.error("Error fetching code block:", error);
    res.status(500).json({ error: "Failed to fetch code block" });
  }
});

module.exports = router;
