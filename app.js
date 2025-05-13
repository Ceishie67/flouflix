const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de EJS comme moteur de template
app.set('view engine', 'ejs');

// Middleware pour les formulaires et fichiers statiques
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Création du dossier uploads s'il n'existe pas
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Conserver l'extension originale du fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtre pour n'accepter que les fichiers vidéo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une vidéo'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // Limite à 100Mo
  }
});

// Routes
// Page d'accueil avec formulaire d'upload
app.get('/', (req, res) => {
  res.render('index');
});

// Route pour uploader une vidéo
app.post('/upload', upload.single('videoFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Aucun fichier n\'a été uploadé.');
    }
    
    res.redirect('/videos');
  } catch (error) {
    res.status(500).send(`Erreur lors de l'upload: ${error.message}`);
  }
});

// Page qui liste toutes les vidéos disponibles
app.get('/videos', (req, res) => {
  try {
    const files = fs.readdirSync('uploads/');
    const videos = files.filter(file => {
      // Ne retenir que les fichiers vidéo
      const extension = path.extname(file).toLowerCase();
      return ['.mp4', '.webm', '.avi', '.mov', '.mkv'].includes(extension);
    });
    
    res.render('videos', { videos });
  } catch (error) {
    res.status(500).send(`Erreur lors du listage des vidéos: ${error.message}`);
  }
});

// Page "Mes vidéos uploadées" avec option de suppression
app.get('/my-uploads', (req, res) => {
  try {
    const files = fs.readdirSync('uploads/');
    const videos = files.filter(file => {
      // Ne retenir que les fichiers vidéo
      const extension = path.extname(file).toLowerCase();
      return ['.mp4', '.webm', '.avi', '.mov', '.mkv'].includes(extension);
    });
    
    res.render('my-uploads', { videos });
  } catch (error) {
    res.status(500).send(`Erreur lors du listage des vidéos: ${error.message}`);
  }
});

// Route pour supprimer une vidéo
app.post('/delete-video/:videoName', (req, res) => {
  try {
    const videoName = req.params.videoName;
    const videoPath = path.join(__dirname, 'uploads', videoName);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Vidéo non trouvée');
    }
    
    // Supprimer le fichier
    fs.unlinkSync(videoPath);
    
    // Rediriger vers la page des uploads
    res.redirect('/my-uploads');
  } catch (error) {
    res.status(500).send(`Erreur lors de la suppression de la vidéo: ${error.message}`);
  }
});

// Page de lecture d'une vidéo spécifique
app.get('/player/:videoName', (req, res) => {
  const videoName = req.params.videoName;
  
  // Vérifier si le fichier existe
  const videoPath = path.join(__dirname, 'uploads', videoName);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Vidéo non trouvée');
  }
  
  res.render('player', { videoName });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});