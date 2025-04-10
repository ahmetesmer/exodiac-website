document.addEventListener('DOMContentLoaded', () => {
    const starCount = 200; // Yıldız sayısını azalttım
    const maxDepth = 1000;
    const starContainer = document.querySelector('.stars');
    const stars = [];

    // Performans için transform3d kullanımı
    const transform = (x, y, z, size, opacity) => 
        `translate3d(${x}px, ${y}px, ${z}px) scale(${size})`;

    // Yıldızları oluştur
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Rastgele başlangıç pozisyonu
        const x = Math.random() * window.innerWidth - window.innerWidth / 2;
        const y = Math.random() * window.innerHeight - window.innerHeight / 2;
        const z = Math.random() * maxDepth - maxDepth / 2;
        
        stars.push({
            element: star,
            x, y, z,
            originalX: x,
            originalY: y,
            originalZ: z
        });
        
        starContainer.appendChild(star);
    }

    // Mouse hareketi için throttle
    let mouseX = 0;
    let mouseY = 0;
    let frameId;
    let lastMouseMove = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMove > 16) { // 60fps için throttle
            mouseX = (e.clientX - window.innerWidth / 2) / 25;
            mouseY = (e.clientY - window.innerHeight / 2) / 25;
            lastMouseMove = now;
        }
    }, { passive: true });

    // Animasyon fonksiyonu
    function animate() {
        stars.forEach(star => {
            // Z pozisyonunu güncelle (ileri hareket)
            star.z -= 1.5;
            
            // Eğer yıldız çok uzaklaştıysa başa al
            if (star.z < -maxDepth / 2) {
                star.z = maxDepth / 2;
            }

            // Parallax efekti için pozisyon hesaplama
            const parallaxX = star.originalX + mouseX * (star.z / maxDepth);
            const parallaxY = star.originalY + mouseY * (star.z / maxDepth);
            
            // Perspektif hesaplama
            const perspective = (maxDepth + star.z) / maxDepth;
            const scale = perspective * 0.8; // Boyutu küçülttüm
            
            // 3D dönüşüm uygula
            const x = (parallaxX / perspective) + window.innerWidth / 2;
            const y = (parallaxY / perspective) + window.innerHeight / 2;
            
            // Opaklık hesaplama
            const opacity = Math.min(perspective * 0.8, 0.8);
            
            // Tek seferde transform güncelleme
            star.element.style.transform = transform(x, y, star.z, scale, opacity);
            star.element.style.opacity = opacity;
        });

        frameId = requestAnimationFrame(animate);
    }

    // Sayfa görünür değilse animasyonu durdur
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(frameId);
        } else {
            frameId = requestAnimationFrame(animate);
        }
    });

    animate();
}); 