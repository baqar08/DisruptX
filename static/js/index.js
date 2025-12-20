const sidebarItems = document.querySelectorAll('.sidebar-item');
const cards = document.querySelectorAll('.integration-card');
const searchInput = document.getElementById('searchInput');

if (sidebarItems && cards && searchInput) {
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const category = item.dataset.category;

            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const desc = card.querySelector('.card-desc').textContent.toLowerCase();

            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        if (searchTerm) {
            sidebarItems.forEach(i => i.classList.remove('active'));
        }
    });
}
