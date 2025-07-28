const express = require('express');
const bcrypt = require('bcrypt');
const { User, Message, Favorite } = require('./database');
const { Op } = require('sequelize');

const router = express.Router();

// Middleware für JSON parsing
router.use(express.json());

// Account Management
router.post('/api/register', async (req, res) => {
  console.log('POST /api/register called with body:', req.body);
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Registration failed: Missing username or password.');
      return res.status(400).json({ error: 'Username und Passwort sind erforderlich' });
    }

    console.log(`Checking for existing user: ${username}`);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log(`Registration failed: User ${username} already exists.`);
      return res.status(400).json({ error: 'Username bereits vergeben' });
    }

    console.log(`Hashing password for ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Creating user ${username} in database.`);
    const user = await User.create({ username, password: hashedPassword });
    
    console.log(`User ${username} created successfully.`);
    res.json({ success: true, username: user.username });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Serverfehler bei der Registrierung.' });
  }
});

router.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }

    res.json({ success: true, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat History mit Suchfunktion
router.get('/api/history/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const { search, username } = req.query;
    
    let whereClause = { room };
    
    // Nur Nachrichten des eingeloggten Users anzeigen
    // if (username) { // Temporär deaktiviert, um alle Nachrichten zu zeigen
    //   whereClause.author = username;
    // }
    
    if (search) {
      whereClause.content = {
        [Op.iLike]: `%${search}%`
      };
    }

    const messages = await Message.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat Export
router.get('/api/export/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const { username } = req.query;
    
    let whereClause = { room };
    // if (username) { // Temporär deaktiviert für den Export
    //   whereClause.author = username;
    // }

    const messages = await Message.findAll({
      where: whereClause,
      order: [['createdAt', 'ASC']]
    });

    let txtContent = `Chat Export - Raum: ${room}\n`;
    txtContent += `Generiert am: ${new Date().toLocaleString('de-DE')}\n`;
    txtContent += '='.repeat(50) + '\n\n';

    messages.forEach(msg => {
      const timestamp = new Date(msg.createdAt).toLocaleString('de-DE');
      txtContent += `[${timestamp}] ${msg.author}: ${msg.content}\n`;
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="chat-${room}-${Date.now()}.txt"`);
    res.send(txtContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Favoriten
router.post('/api/favorites', async (req, res) => {
  try {
    const { username, room } = req.body;
    
    const [favorite, created] = await Favorite.findOrCreate({
      where: { username, room },
      defaults: { username, room }
    });

    res.json({ success: true, isFavorite: created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/favorites', async (req, res) => {
  try {
    const { username, room } = req.body;
    
    const deleted = await Favorite.destroy({
      where: { username, room }
    });

    res.json({ success: true, removed: deleted > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/favorites/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const favorites = await Favorite.findAll({
      where: { username }
    });

    res.json(favorites.map(f => f.room));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
