
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function initDeleteButtons() {
    // Sélectionne tous les boutons de suppression
    const deleteButtons = document.querySelectorAll('.delete-btn');
    console.log('Boutons de suppression trouvés:', deleteButtons.length);
    
    // Ajoute un écouteur d'événement à chaque bouton
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Empêche le comportement par défaut pour éviter tout problème de navigation
            e.preventDefault();
            
            // Récupère le nom du fichier vidéo à partir de l'attribut data-video
            const videoFileName = this.getAttribute('data-video');
            console.log('Bouton de suppression cliqué pour la vidéo:', videoFileName);
            
            // Demande confirmation avant de supprimer
            if (confirm(`Êtes-vous sûr de vouloir supprimer la vidéo "${videoFileName}" ?`)) {
                console.log('Suppression confirmée, envoi de la requête...');
                // Appelle l'API pour supprimer la vidéo
                deleteVideo(videoFileName);
            } else {
                console.log('Suppression annulée par l\'utilisateur');
            }
        });
    });
}

// Fonction pour envoyer la requête de suppression au serveur
function deleteVideo(videoFileName) {
    console.log('Début de la fonction deleteVideo avec le fichier:', videoFileName);
    
    // Création de la requête fetch pour supprimer la vidéo
    fetch('/api/videos/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: videoFileName })
    })
    .then(response => {
        console.log('Réponse reçue du serveur:', response.status);
        if (!response.ok) {
            throw new Error('Erreur serveur: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Données reçues du serveur:', data);
        if (data.success) {
            // Si la suppression a réussi, on supprime l'élément du DOM
            const videoCard = document.querySelector(`.delete-btn[data-video="${videoFileName}"]`).closest('.video-card');
            videoCard.remove();
            
            // Affiche un message de succès
            showNotification('Vidéo supprimée avec succès!', 'success');
            
            // Si c'était la dernière vidéo, afficher le message "Aucune vidéo"
            const remainingVideos = document.querySelectorAll('.video-card');
            if (remainingVideos.length === 0) {
                const videoGrid = document.querySelector('.video-grid');
                videoGrid.innerHTML = `
                    <div class="empty-state">
                        <p>Aucune vidéo n'a été uploadée pour le moment.</p>
                        <a href="/upload" class="btn">Ajouter une vidéo</a>
                    </div>
                `;
            }
        } else {
            showNotification('Erreur: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Erreur lors de la suppression de la vidéo', 'error');
    });
}

// Fonction pour afficher une notification
function showNotification(message, type) {
    // Crée un élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajoute la notification au corps du document
    document.body.appendChild(notification);
    
    // Fait disparaître la notification après 3 secondes
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Initialise les boutons de suppression lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initDeleteButtons();
});

// Route pour supprimer une vidéo
router.post('/api/videos/delete', (req, res) => {
    console.log('Route de suppression appelée avec les données:', req.body);
    
    const { filename } = req.body;
    
    // Vérifiez que le nom de fichier est valide et existe
    if (!filename) {
        console.log('Erreur: Nom de fichier manquant');
        return res.status(400).json({ success: false, message: 'Nom de fichier manquant' });
    }
    
    // Chemin complet vers le fichier vidéo
    const videoPath = path.join(__dirname, '..', 'public', 'uploads', filename);
    console.log('Tentative de suppression du fichier:', videoPath);
    
    // Vérifiez si le fichier existe
    if (!fs.existsSync(videoPath)) {
        console.log('Erreur: Fichier non trouvé à', videoPath);
        return res.status(404).json({ success: false, message: 'Fichier non trouvé' });
    }
    
    // Supprimez le fichier
    try {
        fs.unlinkSync(videoPath);
        console.log('Fichier supprimé avec succès:', videoPath);
        
        res.json({ success: true, message: 'Vidéo supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la suppression du fichier: ' + error.message });
    }
});
