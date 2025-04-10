document.addEventListener('DOMContentLoaded', () => {
    const starCount = 200;
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

    // Throttle fonksiyonu
    let lastMouseMoveTime = 0;
    const throttleTime = 16; // ~60fps

    // Mouse hareketi için throttled event listener
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMoveTime >= throttleTime) {
            mouseX = (e.clientX - window.innerWidth / 2) / 25;
            mouseY = (e.clientY - window.innerHeight / 2) / 25;
            lastMouseMoveTime = now;
        }
    }, { passive: true });

    // RAF için optimizasyon
    let rafId = null;
    let lastFrameTime = 0;
    const minFrameTime = 1000 / 60; // 60fps hedefi

    // Animasyon fonksiyonu
    function animate(currentTime) {
        rafId = requestAnimationFrame(animate);

        // FPS kontrolü
        if (currentTime - lastFrameTime < minFrameTime) return;
        lastFrameTime = currentTime;

        stars.forEach(star => {
            // Z pozisyonunu güncelle
            star.z -= 1.5;
            
            if (star.z < -maxDepth / 2) {
                star.z = maxDepth / 2;
            }

            // Parallax hesaplamaları
            const parallaxX = star.originalX + mouseX * (star.z / maxDepth);
            const parallaxY = star.originalY + mouseY * (star.z / maxDepth);
            
            // Perspektif hesaplama
            const perspective = (maxDepth + star.z) / maxDepth;
            const scale = perspective * 0.8;
            
            // 3D dönüşüm
            const x = (parallaxX / perspective) + window.innerWidth / 2;
            const y = (parallaxY / perspective) + window.innerHeight / 2;
            
            // Tek bir transform ile style güncelleme
            star.element.style.transform = transform(x, y, star.z, scale, perspective);
            star.element.style.opacity = Math.min(perspective * 1.5, 1);
        });
    }

    // Animasyonu başlat
    animate();

    // Cleanup fonksiyonu
    window.addEventListener('unload', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    });
}); 