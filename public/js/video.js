document.addEventListener('DOMContentLoaded', function() {
            const btnDeleteMultiple = document.getElementById('btn-delete-multiple');
            const btnCancel = document.querySelector('.btn-cancel');
            const btnConfirm = document.querySelector('.btn-confirm');
            const selectionCount = document.querySelector('.selection-count');
            const uploadItems = document.querySelectorAll('.upload-item');
            const checkboxes = document.querySelectorAll('.video-checkbox');
            
            // Activer le mode sélection
            btnDeleteMultiple.addEventListener('click', function() {
                document.body.classList.add('selection-mode');
                checkboxes.forEach(cb => cb.style.display = 'block');
                updateSelectionCount();
            });
            
            // Annuler la sélection
            btnCancel.addEventListener('click', function() {
                document.body.classList.remove('selection-mode');
                checkboxes.forEach(cb => {
                    cb.style.display = 'none';
                    cb.checked = false;
                });
                uploadItems.forEach(item => item.classList.remove('selected'));
            });
            
            // Valider la suppression
            btnConfirm.addEventListener('click', function() {
                const selectedItems = document.querySelectorAll('.upload-item.selected');
                if (selectedItems.length > 0) {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} vidéo(s) ?`)) {
                        selectedItems.forEach(item => item.remove());
                    }
                }
                document.body.classList.remove('selection-mode');
                checkboxes.forEach(cb => {
                    cb.style.display = 'none';
                    cb.checked = false;
                });
            });
            
            // Gérer la sélection des vidéos
            checkboxes.forEach((checkbox, index) => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        uploadItems[index].classList.add('selected');
                    } else {
                        uploadItems[index].classList.remove('selected');
                    }
                    updateSelectionCount();
                });
            });
            
            // Mettre à jour le compteur
            function updateSelectionCount() {
                const selectedCount = document.querySelectorAll('.upload-item.selected').length;
                selectionCount.textContent = `${selectedCount} vidéo(s) sélectionnée(s)`;
            }
        });