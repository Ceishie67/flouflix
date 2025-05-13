// Pour les boutons d'options vidéo
document.addEventListener('DOMContentLoaded', function() {
  // Ouvrir/fermer le menu d'options
  document.querySelectorAll('.video-options-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const menu = this.nextElementSibling;
      
      // Fermer tous les autres menus d'abord
      document.querySelectorAll('.video-options-menu.active').forEach(m => {
        if (m !== menu) m.classList.remove('active');
      });
      
      // Ouvrir/fermer le menu actuel
      menu.classList.toggle('active');
    });
  });

  // Fermer le menu si on clique ailleurs
  document.addEventListener('click', function() {
    document.querySelectorAll('.video-options-menu').forEach(menu => {
      menu.classList.remove('active');
    });
  });

  // Actions pour renommer
  document.querySelectorAll('.rename-option').forEach(option => {
    option.addEventListener('click', function() {
      // Stocker l'ID ou référence de la vidéo dans un attribut data
      const videoId = this.closest('.video-card').dataset.videoId;
      const videoName = this.closest('.video-card').querySelector('.video-info h3').textContent;
      
      // Pré-remplir le champ avec le nom actuel
      document.getElementById('new-video-name').value = videoName;
      document.getElementById('rename-modal').dataset.videoId = videoId;
      
      // Afficher la modale
      document.getElementById('rename-modal').classList.add('active');
    });
  });

  // Actions pour supprimer
  document.querySelectorAll('.delete-option').forEach(option => {
    option.addEventListener('click', function() {
      // Stocker l'ID ou référence de la vidéo
      const videoId = this.closest('.video-card').dataset.videoId;
      document.getElementById('delete-modal').dataset.videoId = videoId;
      
      // Afficher la modale
      document.getElementById('delete-modal').classList.add('active');
    });
  });

  // Fermer les modales
  document.querySelectorAll('.modal-close, .modal-btn-cancel').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal-backdrop').classList.remove('active');
    });
  });

  // Action de renommage (à lier à votre backend)
  document.querySelector('#rename-modal .modal-btn-ok').addEventListener('click', function() {
    const videoId = this.closest('.modal-backdrop').dataset.videoId;
    const newName = document.getElementById('new-video-name').value;
    
    // Ajouter ici votre code AJAX pour envoyer la demande au serveur
    console.log(`Renommer la vidéo ${videoId} en "${newName}"`);
    
    // Fermer la modale après l'action
    this.closest('.modal-backdrop').classList.remove('active');
    
    // Optionnel: actualiser la page ou mettre à jour le DOM
    // location.reload();
  });

  // Action de suppression (à lier à votre backend)
  document.querySelector('#delete-modal .modal-btn-delete').addEventListener('click', function() {
    const videoId = this.closest('.modal-backdrop').dataset.videoId;
    
    // Ajouter ici votre code AJAX pour envoyer la demande au serveur
    console.log(`Supprimer la vidéo ${videoId}`);
    
    // Fermer la modale après l'action
    this.closest('.modal-backdrop').classList.remove('active');
    
    // Optionnel: actualiser la page ou supprimer l'élément du DOM
    // document.querySelector(`.video-card[data-video-id="${videoId}"]`).remove();
  });
});