document.addEventListener('DOMContentLoaded', () => {
    const starCount = 400; // Yıldız sayısını artırdım
    const maxDepth = 1500;
    const starContainer = document.querySelector('.stars');
    const stars = [];

    // Yıldızları oluştur
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Rastgele başlangıç pozisyonu
        const x = Math.random() * window.innerWidth - window.innerWidth / 2;
        const y = Math.random() * window.innerHeight - window.innerHeight / 2;
        const z = Math.random() * maxDepth - maxDepth / 2;
        
        // Rastgele parlaklık
        const brightness = Math.random() * 0.5 + 0.5; // 0.5 ile 1 arası
        star.style.opacity = brightness;
        
        stars.push({
            element: star,
            x, y, z,
            originalX: x,
            originalY: y,
            originalZ: z,
            brightness
        });
        
        starContainer.appendChild(star);
    }

    // Mouse hareketi için event listener
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 25;
        mouseY = (e.clientY - window.innerHeight / 2) / 25;
    });

    // Animasyon fonksiyonu
    function animate() {
        stars.forEach(star => {
            // Z pozisyonunu güncelle (ileri hareket)
            star.z -= 2;
            
            // Eğer yıldız çok uzaklaştıysa başa al
            if (star.z < -maxDepth / 2) {
                star.z = maxDepth / 2;
            }

            // Parallax efekti için pozisyon hesaplama
            const parallaxX = star.originalX + mouseX * (star.z / maxDepth);
            const parallaxY = star.originalY + mouseY * (star.z / maxDepth);
            
            // Perspektif hesaplama
            const perspective = (maxDepth + star.z) / maxDepth;
            const scale = perspective * 1; // Yıldız boyutunu küçülttüm
            
            // 3D dönüşüm uygula
            const x = (parallaxX / perspective) + window.innerWidth / 2;
            const y = (parallaxY / perspective) + window.innerHeight / 2;
            const size = Math.max(0.5, scale); // Minimum boyut 0.5px
            
            // Opaklık hesaplama (parlaklık değerini kullan)
            const opacity = Math.min(perspective * star.brightness * 2, 1);
            
            // Stilleri uygula
            star.element.style.transform = `translate3d(${x}px, ${y}px, ${star.z}px)`;
            star.element.style.width = `${size}px`;
            star.element.style.height = `${size}px`;
            star.element.style.opacity = opacity;
            star.element.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`; // Parlaklık efekti
        });

        requestAnimationFrame(animate);
    }

    animate();
}); 