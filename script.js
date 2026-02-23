const timeData = [
    {
        year: '2022',
        photo: 'images/WhatsApp Image 2026-02-24 at 00.22.21.jpeg',
        note: 'Henüz Bu Derece Yakın Olacağımızı bilmeden...',
        bgColor: '#e3f2fd',
        font: "'Special Elite', cursive",
        frame: 'polaroid-frame',
        jokes: ['Selam!', 'O zamanlar...', 'İlk kahve', 'Acemi şoförler']
    },
    {
        year: '2023',
        photo: 'images/WhatsApp Image 2026-02-24 at 00.43.45.jpeg',
        note: ' "Esko" Gezimiz ve Yağmurlu Günden...',
        bgColor: '#e3f2fd',
        font: "'Special Elite', cursive",
        frame: 'polaroid-frame',
        jokes: ['Selam!', 'O zamanlar...', 'İlk kahve', 'Acemi şoförler']
    },
    {
        year: '2024',
        photo: 'images/WhatsApp Image 2026-02-24 at 00.42.24.jpeg',
        note: 'Bugün Seni Kızdırdım Ama Özür dilerimm...    👉👈',
        bgColor: '#e3f2fd',
        font: "'Special Elite', cursive",
        frame: 'polaroid-frame',
        jokes: ['Selam!', 'O zamanlar...', 'İlk kahve', 'Acemi şoförler']
    },
    {
        year: '2025',
        photo: 'images/mezuniyet.jpeg',
        note: 'Hep Gururlandırdın 💖(Keşke Töreni Görebilseydim 🥺)',
        bgColor: '#fff3e0',
        font: "'Special Elite', cursive",
        frame: 'polaroid-frame',
        jokes: ['Ne gülmüştük ama!', 'Saçma sapan', 'Yollar bizi bekler', 'Dertleşmeler']
    },
    {
        year: 'Bugün',
        photo: 'images/20260126_191051.jpg',
        note: 'Ve hala yan yanayız!',
        bgColor: '#fce4ec',
        font: "'Montserrat', sans-serif",
        frame: 'polaroid-frame',
        jokes: ['Nice senelere!', 'Hep beraber!', 'Uçan balonlar', 'En iyi dost']
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Background Particles
    const particleContainer = document.getElementById('particles-container');
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 20 + 5;
        p.style.width = p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        p.style.opacity = Math.random() * 0.2;
        particleContainer.appendChild(p);
        p.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)` }, { transform: 'translate(0,0)' }], { duration: 15000 + Math.random() * 10000, iterations: Infinity });
    }

    // 2. Intersection Observer for Reveal & UI Control
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');

                // Toggle Time Machine Slider UI
                if (entry.target.id === 'time-machine') {
                    document.getElementById('tm-slider-ui').classList.remove('hidden-ui');
                }
            } else {
                if (entry.target.id === 'time-machine') {
                    document.getElementById('tm-slider-ui').classList.add('hidden-ui');
                    document.body.style.backgroundColor = '#FFFDD0'; // Reset home bg
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.initial-hide').forEach(el => observer.observe(el));

    // 3. Original Card Flip
    document.querySelectorAll('.card-container').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            // HCI: Remove flip hint after first interaction
            const hint = card.querySelector('.hci-hint');
            if (hint) hint.style.opacity = '0';
        });
    });

    // 4. Time Machine Logic
    const tmSlider = document.getElementById('tm-range');
    const tmPhoto = document.getElementById('tm-photo');
    const tmYear = document.getElementById('tm-year');
    const tmNote = document.getElementById('tm-note');
    const tmVisual = document.getElementById('tm-visual');
    const tmFlash = document.getElementById('flash-overlay');
    const jokesContainer = document.getElementById('jokes-container');

    // Add vignette element if not present
    let vignette = document.getElementById('time-tunnel-vignette');
    if (!vignette) {
        vignette = document.createElement('div');
        vignette.id = 'time-tunnel-vignette';
        document.body.appendChild(vignette);
    }

    let currentYearIndex = 0;

    tmSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        const nearestIndex = Math.round(val);

        // Continuous visual feedback (Time Tunnel)
        const distanceToNearest = Math.abs(val - nearestIndex);
        const intensity = Math.min(distanceToNearest * 4, 1); // Peak intensity at mid-point

        if (intensity > 0.1) {
            vignette.classList.add('vignette-active');
            document.getElementById('tm-display-container').classList.add('traveling');
            vignette.style.opacity = intensity;
        } else {
            vignette.classList.remove('vignette-active');
            document.getElementById('tm-display-container').classList.remove('traveling');
            vignette.style.opacity = '';
        }

        // Trigger data update when crossing the threshold
        if (nearestIndex !== currentYearIndex && distanceToNearest < 0.3) {
            const direction = nearestIndex > currentYearIndex ? 'right' : 'left';
            currentYearIndex = nearestIndex;
            triggerTimeTravel(nearestIndex, direction);
            if (window.navigator.vibrate) window.navigator.vibrate(50);
            if (nearestIndex == timeData.length - 1) triggerConfetti();
        }

        // HCI: Remove slider instruction
        const instr = document.querySelector('.tm-instruction');
        if (instr) instr.style.opacity = '0';
    });

    // Magnetic Snap: Smoothly animate to integer on release
    tmSlider.addEventListener('change', (e) => {
        const nearestIndex = Math.round(parseFloat(e.target.value));
        const startVal = parseFloat(e.target.value);
        const dist = nearestIndex - startVal;
        let step = 0;
        const animateSnap = () => {
            step += 0.1;
            if (step <= 1) {
                tmSlider.value = startVal + (dist * step);
                requestAnimationFrame(animateSnap);
            } else {
                tmSlider.value = nearestIndex;
            }
        };
        animateSnap();
    });

    function triggerTimeTravel(index, direction) {
        const displayContainer = document.getElementById('tm-display-container');
        const content = document.getElementById('tm-content');

        // Start Tunnel Visuals
        vignette.classList.add('vignette-active');
        displayContainer.classList.add('traveling');

        // Exit Current Content
        content.className = direction === 'right' ? 'tm-content-active tm-exit-left' : 'tm-content-active tm-exit-right';

        setTimeout(() => {
            // Update Data
            const data = timeData[index];
            tmYear.innerText = data.year;
            tmPhoto.src = data.photo;
            tmNote.innerText = data.note;
            document.body.style.backgroundColor = data.bgColor;
            tmNote.style.fontFamily = tmYear.style.fontFamily = data.font;
            tmVisual.className = data.frame;
            updateJokes(data.jokes);

            // Position for Entrance
            content.className = direction === 'right' ? 'tm-content-active tm-enter-right' : 'tm-content-active tm-enter-left';

            // Force Reflow
            content.offsetHeight;

            // Enter New Content
            content.className = 'tm-content-active';

            // End Tunnel Visuals
            setTimeout(() => {
                vignette.classList.remove('vignette-active');
                displayContainer.classList.remove('traveling');
            }, 400);
        }, 400);
    }

    function updateJokes(jokes) {
        jokesContainer.innerHTML = '';
        jokes.forEach(txt => {
            const j = document.createElement('div');
            j.className = 'joke';
            j.innerText = txt;
            j.style.top = `${Math.random() * 80 + 10}vh`;
            j.style.left = `${Math.random() * 80 + 5}vw`;
            j.style.animationDelay = `${Math.random() * 2}s`;
            jokesContainer.appendChild(j);
        });
    }

    // 5. Spotify Visibility Logic
    const spotifyContainer = document.getElementById('spotify-container');
    const footerSection = document.querySelector('.footer');

    // Hide spotify when near footer to avoid overlap
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                spotifyContainer.style.opacity = '0';
                spotifyContainer.style.pointerEvents = 'none';
            } else {
                spotifyContainer.style.opacity = '1';
                spotifyContainer.style.pointerEvents = 'auto';
            }
        });
    }, { threshold: 0.05 }); // Lower threshold to trigger sooner
    footerObserver.observe(footerSection);

    // 6. Final Surprise
    document.getElementById('surprise-btn').addEventListener('click', (e) => {
        for (let i = 0; i < 30; i++) createHeart(e.clientX, e.clientY);
    });

    function createHeart(x, y) {
        const h = document.createElement('div');
        h.className = 'heart-particle';
        h.innerHTML = '❤️';
        h.style.left = `${x}px`;
        h.style.top = `${y}px`;
        document.body.appendChild(h);

        let vx = (Math.random() - 0.5) * 15;
        let vy = (Math.random() - 0.5) * 15;
        let opacity = 1;

        const move = () => {
            x += vx; y += vy; vy += 0.2; opacity -= 0.02;
            h.style.left = `${x}px`; h.style.top = `${y}px`; h.style.opacity = opacity; h.style.transform = `scale(${opacity})`;
            if (opacity > 0) requestAnimationFrame(move); else h.remove();
        };
        requestAnimationFrame(move);
    }

    function triggerConfetti() {
        const end = Date.now() + 3000;
        (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
});
