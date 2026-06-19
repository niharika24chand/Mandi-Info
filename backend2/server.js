const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// ── Mock Farmer Cold Storage Data ───────────────────────
const farmersData = {
  101: {
    id: 101,
    name: 'Rajesh Kumar',
    commodity: 'Potato',
    roomNumber: 'A-12',
    totalBags: 250,
    weight: '12,500 kg',
    age: 45, // days stored
  },
  102: {
    id: 102,
    name: 'Suresh Yadav',
    commodity: 'Onion',
    roomNumber: 'B-07',
    totalBags: 180,
    weight: '9,000 kg',
    age: 30,
  },
  103: {
    id: 103,
    name: 'Priya Singh',
    commodity: 'Garlic',
    roomNumber: 'C-03',
    totalBags: 120,
    weight: '4,800 kg',
    age: 60,
  },
  104: {
    id: 104,
    name: 'Amit Verma',
    commodity: 'Apple',
    roomNumber: 'D-21',
    totalBags: 300,
    weight: '15,000 kg',
    age: 15,
  },
};

// ── GET all farmer IDs ──────────────────────────────────
app.get('/api/farmers', (req, res) => {
  const farmerList = Object.values(farmersData).map((f) => ({
    id: f.id,
    name: f.name,
  }));
  return res.json({ success: true, farmers: farmerList });
});

// ── GET single farmer by ID ─────────────────────────────
app.get('/api/farmer/:id', (req, res) => {
  const farmerId = parseInt(req.params.id, 10);
  const farmer = farmersData[farmerId];

  if (!farmer) {
    return res.status(404).json({
      success: false,
      error: `Farmer with ID ${farmerId} not found.`,
    });
  }

  return res.json({ success: true, farmer });
});

// ── Health check ────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'Annsetu Backend2 — Farmer Storage' })
);

app.listen(PORT, () => {
  console.log(`✅ Annsetu backend2 (Farmer Storage) running on http://localhost:${PORT}`);
});
