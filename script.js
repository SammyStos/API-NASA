document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('asteroidContainer');
    const searchInput = document.getElementById('searchInput'); 
 
  
    function createCard(asteroid) {
        const closeApproach = asteroid.close_approach_data[0];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${asteroid.name}</h3>
            <p><strong>Data:</strong> ${new Date(closeApproach.close_approach_date).toLocaleDateString()}</p>
            <p><strong>Distância:</strong> ${closeApproach.miss_distance.kilometers} km</p>
            <p><strong>Diâmetro:</strong> ${asteroid.estimated_diameter.meters.estimated_diameter_max} m</p>
        `;
        card.addEventListener('click', function() {
            sessionStorage.setItem('selectedAsteroid', JSON.stringify(asteroid));
            window.location.href = 'detalhes2.html';
        });
        return card;
    }
 
 
    function loadAsteroids() {
fetch('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY')
            .then(response => response.json())
            .then(data => {
                if (data.near_earth_objects) {
                    sessionStorage.setItem('asteroids', JSON.stringify(data.near_earth_objects)); 
                    displayAsteroids(data.near_earth_objects); 
                }
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }
 
   
    function displayAsteroids(asteroids) {
        container.innerHTML = ''; 
        asteroids.forEach(asteroid => {
            if (asteroid.close_approach_data && asteroid.close_approach_data.length > 0) {
                const card = createCard(asteroid);
                container.appendChild(card);
            }
        });
    }
 

    function filterAsteroids() {
        const query = searchInput.value.toLowerCase();
        const asteroids = JSON.parse(sessionStorage.getItem('asteroids')) || [];
const filteredAsteroids = asteroids.filter(asteroid => asteroid.name.toLowerCase().includes(query));
        displayAsteroids(filteredAsteroids);
    }
 
   
    loadAsteroids();
 
   
    searchInput.addEventListener('input', filterAsteroids);
});