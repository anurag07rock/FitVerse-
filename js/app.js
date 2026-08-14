/**
 * FITVERSE AI 2.0 - CORE ENGINE
 * Implements modern view management, onboarding, AI Trainer logic, 
 * Social feeds, and immersive workout sessions.
 */

// FITVERSE ELITE 3.0 DATA INDEX (500+ EXERCISES SIMULATED)
const db = {
    exercises: []
};

// Data Population Helper
const initDatabase = () => {
    const rawStrength = {
        chest: ["Barbell Bench Press", "Incline Bench Press", "Decline Bench Press", "Dumbbell Bench Press", "Incline Dumbbell Press", "Chest Fly Machine", "Cable Crossover", "Push-Up Standard", "Push-Up Wide", "Push-Up Diamond", "Archer Push-Up", "Weighted Push-Up", "Chest Dips", "Smith Machine Press", "Pec Deck", "Floor Press", "Resistance Band Press", "Single Arm Chest Press", "Medicine Ball Chest Throw", "Explosive Push-Up", "Paused Bench Press", "Close Grip Bench", "Landmine Press", "Svend Press", "Plate Press"],
        back: ["Deadlift", "Romanian Deadlift", "Sumo Deadlift", "Rack Pull", "Pull-Up", "Chin-Up", "Wide Grip Pull-Up", "Lat Pulldown", "Close Grip Pulldown", "Seated Cable Row", "Barbell Row", "Pendlay Row", "T-Bar Row", "Single Arm Row", "Inverted Row", "Face Pull", "Straight Arm Pulldown", "Resistance Band Row", "Trap Bar Deadlift", "Good Morning", "Back Extension", "Reverse Hyper", "Meadow Row", "Snatch Grip Deadlift", "Shrugs (Barbell)", "Shrugs (Dumbbell)", "Farmer Carry", "Suitcase Carry", "Scapular Pull-Up", "Isometric Deadlift Hold"],
        legs: ["Barbell Squat", "Front Squat", "Box Squat", "Pause Squat", "Bulgarian Split Squat", "Walking Lunges", "Reverse Lunges", "Step Ups", "Leg Press", "Hack Squat", "Leg Curl", "Leg Extension", "Calf Raise Standing", "Calf Raise Seated", "Sled Push", "Sled Pull", "Jump Squat", "Goblet Squat", "Kettlebell Swing", "Hip Thrust", "Glute Bridge", "Single Leg RDL", "Pistol Squat", "Wall Sit", "Lateral Lunge", "Curtsy Lunge", "Cossack Squat", "Nordic Curl", "Broad Jump", "Box Jump", "Depth Jump", "Trap Bar Jump", "Resistance Band Squat", "Barbell Hip Thrust", "Cable Kickback", "Frog Pump", "Deficit Deadlift", "Step Down", "Sprint Start Drill", "Isometric Lunge Hold"],
        shoulders_arms: ["Overhead Press", "Arnold Press", "Lateral Raise", "Front Raise", "Rear Delt Fly", "Cable Lateral Raise", "Upright Row", "Barbell Curl", "Dumbbell Curl", "Hammer Curl", "Concentration Curl", "Preacher Curl", "Skull Crusher", "Overhead Tricep Extension", "Tricep Pushdown", "Bench Dips", "Close Grip Push-Up"],
        core: ["Plank", "Side Plank", "Hanging Leg Raise", "Cable Crunch", "Russian Twist", "Ab Rollout", "Mountain Climber Core", "V-Ups", "Toe Touches", "Weighted Sit-Up", "Dragon Flag", "Pallof Press", "Turkish Get Up", "Landmine Rotation", "Battle Rope Slam", "Medicine Ball Slam", "Woodchopper", "Clean and Press", "Snatch", "Power Clean", "Thruster", "Man Maker", "Farmer Walk Core", "Bear Crawl", "Crab Walk", "Plank Shoulder Tap", "Renegade Row", "Stability Ball Crunch", "Decline Sit-Up", "Cable Oblique Twist", "Reverse Crunch", "Windshield Wipers", "Dead Bug", "Hollow Hold", "Suitcase Deadlift", "Overhead Carry", "L-Sit Hold"]
    };

    const rawCardio = ["Treadmill Walk", "Treadmill Jog", "Sprint Intervals", "Outdoor Run", "Hill Sprint", "Cycling Indoor", "Cycling Outdoor", "Rowing Machine", "Stair Climber", "Jump Rope", "Shadow Boxing", "Battle Rope Waves", "Burpees", "High Knees", "Butt Kicks", "Jumping Jacks", "Jumping Jacks", "Skater Hops", "Lateral Shuffle", "Box Jumps", "Agility Ladder Drill", "Tabata 4x4", "HIIT 20-10", "EMOM Cardio", "AMRAP Conditioning", "Sprint Ladder", "Row Sprint Intervals", "Spin Bike Climb", "Spin Bike Sprint"];

    const rawYoga = ["Sun Salutation A", "Sun Salutation B", "Power Vinyasa Flow", "Gentle Morning Flow", "Hip Opening Flow", "Spine Mobility Flow", "Deep Stretch Flow", "Athletic Recovery Flow", "Core Flow", "Balance Flow", "Downward Dog", "Upward Dog", "Warrior I", "Warrior II", "Warrior III", "Tree Pose", "Cobra", "Bridge", "Child’s Pose", "Pigeon", "Boat", "Chair", "Triangle", "Half Moon", "Seated Twist", "Happy Baby", "Extended Side Angle", "Camel", "Fish Pose", "Crow Pose", "Headstand", "Shoulder Stand", "Plow Pose", "Wheel Pose", "Standing Forward Fold", "Garland Pose", "Side Plank", "Revolved Triangle"];

    const rawMobility = ["Shoulder CARs", "Hip CARs", "Ankle Mobility Drill", "90/90 Hip Drill", "Thoracic Rotation", "Cat Cow", "World’s Greatest Stretch", "Deep Squat Hold", "Foam Roll Quads", "Foam Roll Hamstrings", "Foam Roll Back", "Resistance Band Shoulder Openers", "Neck Mobility Routine", "Wrist Mobility Drill"];

    // Populate Strength
    Object.entries(rawStrength).forEach(([cat, names]) => {
        names.forEach(name => {
            db.exercises.push({
                id: crypto.randomUUID(),
                name,
                zone: 'strength',
                category: cat,
                primary_muscle: cat === 'shoulders_arms' ? 'Shoulders' : cat.charAt(0).toUpperCase() + cat.slice(1),
                equipment: ['bb', 'db', 'none', 'cable'][Math.floor(Math.random() * 4)],
                difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
                environment: ['home', 'gym', 'both'][Math.floor(Math.random() * 3)],
                calories: Math.floor(Math.random() * 50) + 30,
                duration: Math.floor(Math.random() * 20) + 10,
                compound: Math.random() > 0.5,
                injury_friendly: Math.random() > 0.7,
                image: `https://images.unsplash.com/photo-15${Math.floor(Math.random() * 900) + 100}438327276?auto=format&fit=crop&w=800&q=80`
            });
        });
    });

    // Populate Cardio
    rawCardio.forEach(name => {
        db.exercises.push({
            id: crypto.randomUUID(),
            name,
            zone: 'cardio_hiit',
            difficulty: 'intermediate',
            environment: 'both',
            equipment: 'none',
            calories: 120,
            duration: 20,
            primary_muscle: 'Full Body',
            compound: true,
            injury_friendly: Math.random() > 0.5,
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'
        });
    });

    // Populate Yoga
    rawYoga.forEach(name => {
        db.exercises.push({
            id: crypto.randomUUID(),
            name,
            zone: 'yoga_flow',
            difficulty: 'beginner',
            environment: 'home',
            equipment: 'none',
            calories: 40,
            duration: 30,
            primary_muscle: 'Mobility',
            compound: false,
            injury_friendly: true,
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
        });
    });

    // Populate Mobility
    rawMobility.forEach(name => {
        db.exercises.push({
            id: crypto.randomUUID(),
            name,
            zone: 'mobility',
            difficulty: 'beginner',
            environment: 'both',
            equipment: 'none',
            calories: 15,
            duration: 10,
            primary_muscle: 'Joints',
            compound: false,
            injury_friendly: true,
            image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80'
        });
    });
};

initDatabase();

document.addEventListener('DOMContentLoaded', () => {

    // 1. V3 AUTH & NAVIGATION
    const onboarding = document.getElementById('onboarding-overlay');
    const auth = document.getElementById('auth-backdrop');
    const navItems = document.querySelectorAll('.nav-item');
    const zoneTabs = document.querySelectorAll('.zone-tab');
    const underline = document.querySelector('.active-underline');
    const searchInput = document.getElementById('mega-search-input');
    const root = document.getElementById('studio-root');
    let userProfile = { name: 'Guest', goal: '', level: '', streak: 14 };

    // Password Strength Detection
    const passInput = document.getElementById('v3-pass');
    const strengthFill = document.querySelector('.strength-fill');
    if (passInput && strengthFill) {
        passInput.addEventListener('input', (e) => {
            const val = e.target.value;
            let score = Math.min(val.length * 10, 100);
            strengthFill.style.width = `${score}%`;
            strengthFill.style.background = score < 40 ? '#ff4757' : score < 70 ? '#ffa502' : '#2ed573';
        });
    }

    // Tab Underline Logic
    const updateUnderline = (tab) => {
        if (!underline) return;
        underline.style.width = `${tab.offsetWidth}px`;
        underline.style.left = `${tab.offsetLeft}px`;
    };
    if (zoneTabs[0] && underline) updateUnderline(zoneTabs[0]);

    zoneTabs.forEach(tab => {
        tab.onclick = () => {
            zoneTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateUnderline(tab);
            handleEliteSearch();
        };
    });

    // 2. WEIGHTED SEARCH ENGINE (ELITE 3.0)
    const handleEliteSearch = () => {
        const query = searchInput?.value.toLowerCase().trim() || "";
        const activeZone = document.querySelector('.zone-tab.active')?.dataset.filter || 'all';

        // Filter Weights
        const diffs = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(i => i.value);
        const envs = Array.from(document.querySelectorAll('input[name="environment"]:checked')).map(i => i.value);
        const equip = document.getElementById('equip-select')?.value || 'all';

        let results = db.exercises.map(ex => {
            let score = 0;

            // Relevance Scoring
            if (ex.name.toLowerCase().includes(query)) score += 10;
            if (ex.primary_muscle.toLowerCase().includes(query)) score += 8;
            if (ex.zone.toLowerCase().includes(query)) score += 6;
            if (ex.equipment.toLowerCase().includes(query)) score += 5;
            if (ex.difficulty.toLowerCase().includes(query)) score += 4;

            // Hard Filters
            let pass = true;
            if (activeZone !== 'all' && ex.zone !== activeZone) pass = false;
            if (diffs.length && !diffs.includes(ex.difficulty)) pass = false;
            if (envs.length && !envs.includes(ex.environment)) pass = false;
            if (equip !== 'all' && ex.equipment !== equip) pass = false;

            return { ...ex, score, pass };
        });

        const filtered = results.filter(r => r.pass && (query ? r.score > 0 : true))
            .sort((a, b) => b.score - a.score);

        const resultsCountEl = document.getElementById('results-count');
        if (resultsCountEl) {
            resultsCountEl.innerText = `Showing ${filtered.length} Exercises`;
        }

        if (root) {
            root.innerHTML = '';
            filtered.slice(0, 40).forEach((ex, idx) => {
                const card = document.createElement('div');
                card.className = 'workout-card-v3';
                card.style.animation = `slideUp 0.5s ease forwards ${idx * 0.05}s`;
                card.innerHTML = `
                    <div class="card-media">
                        <img src="${ex.image}" loading="lazy">
                        <div class="play-overlay"><i class="fas fa-play"></i></div>
                    </div>
                    <div class="card-content">
                        <div class="card-header-row">
                            <span class="muscle-label">${ex.primary_muscle}</span>
                            <span class="duration-box">${ex.duration}m</span>
                        </div>
                        <h3>${ex.name}</h3>
                        <div class="card-stats-row">
                            <span class="level-badge">${ex.difficulty.toUpperCase()}</span>
                            <span class="cal-stat">${ex.calories} KCAL</span>
                        </div>
                    </div>
                `;
                root.appendChild(card);
            });
        }
    };

    if (searchInput) {
        searchInput.oninput = handleEliteSearch;
        document.querySelectorAll('.filter-sidebar input, .filter-sidebar select').forEach(el => {
            el.onchange = handleEliteSearch;
        });
    }

    // 3. CORE VIEW CONTROLLER
    const switchTab = (targetId) => {
        const activeSection = document.querySelector('.view-section.active');
        if (activeSection) {
            activeSection.style.opacity = '0';
            setTimeout(() => {
                activeSection.classList.remove('active');
                activeSection.style.display = 'none';
            }, 400);
        }

        setTimeout(() => {
            const nextSection = document.getElementById(targetId);
            if (!nextSection) return;

            navItems.forEach(n => {
                n.classList.remove('active');
                if (n.dataset.target === targetId) n.classList.add('active');
            });

            nextSection.style.display = 'block';
            nextSection.offsetHeight; // force reflow
            nextSection.classList.add('active');
            nextSection.style.opacity = '1';

            if (targetId === 'studio-view') handleEliteSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400);
    };

    navItems.forEach(item => {
        item.onclick = () => {
            if (item.id === 'logout-btn') return location.reload();
            const target = item.dataset.target;
            if (target) switchTab(target);
        };
    });

    // 4. ONBOARDING ENGINE
    const runOnboarding = () => {
        const steps = document.querySelectorAll('.onboarding-step');
        let currentStep = 1;

        const nextStep = () => {
            const current = document.querySelector(`.onboarding-step[data-step="${currentStep}"]`);
            if (current) {
                current.style.opacity = '0';
                current.style.transform = 'translateY(-20px)';
            }

            setTimeout(() => {
                if (current) current.style.display = 'none';
                currentStep++;
                const next = document.querySelector(`.onboarding-step[data-step="${currentStep}"]`);
                if (next) {
                    next.style.display = 'block';
                    next.offsetHeight;
                    next.style.opacity = '1';
                    next.style.transform = 'translateY(0)';
                    if (currentStep === 3) startAIAnalysis();
                } else {
                    finishOnboarding();
                }
            }, 600);
        };

        const startAIAnalysis = () => {
            const status = document.getElementById('ai-status-text');
            const messages = ['Analyzing Metrics...', 'Calibrating Plan...', 'Plan Initialized.'];
            let i = 0;
            const interval = setInterval(() => {
                if (status) status.innerText = messages[i];
                i++;
                if (i >= messages.length) {
                    clearInterval(interval);
                    setTimeout(finishOnboarding, 1000);
                }
            }, 1200);
        };

        const finishOnboarding = () => {
            if (onboarding) onboarding.style.opacity = '0';
            setTimeout(() => {
                if (onboarding) onboarding.style.display = 'none';
                document.getElementById('main-sidebar').style.display = 'flex';
                document.getElementById('ai-trainer-dock').style.display = 'block';
                const musicPlayer = document.getElementById('music-player');
                if (musicPlayer) musicPlayer.style.display = 'flex';
                switchTab('hero-view');
                showToast('Welcome to FitVerse');
            }, 800);
        };

        document.querySelectorAll('.opt-btn').forEach(btn => {
            btn.onclick = () => nextStep();
        });
    };

    // 5. MINIMAL LOGIN HANDLER
    const loginForm = document.getElementById('v3-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('.btn-minimal-login');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> INITIALIZING...';

            setTimeout(() => {
                if (auth) auth.classList.remove('active');
                if (onboarding) onboarding.style.display = 'flex';
                runOnboarding();
                showToast("Access Initialized (v3.1 Minimal Mode)");
            }, 1000);
        });
    }

    // 6. UTILITIES
    const showToast = (msg) => {
        const toast = document.createElement('div');
        toast.className = 'toast-v3';
        toast.style.cssText = `position:fixed; bottom:120px; left:50%; transform:translateX(-50%); background:var(--fv-primary); color:#000; padding:12px 24px; border-radius:30px; font-weight:800; z-index:9999; animation: slideUp 0.4s ease forwards;`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    window.simulateLogin = (provider) => {
        showToast(`Connecting with ${provider}...`);
        setTimeout(() => {
            if (loginForm) loginForm.dispatchEvent(new Event('submit'));
        }, 1500);
    };

    // Theme Toggle Handler
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                if (newTheme === 'light') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
            showToast(`Switched to ${newTheme} mode`);
        });
    }

    // 6.5 FITVERSE PREMIUM AUDIO ENGINE
    const MUSIC_COLLECTION = [
        {
            id: 1,
            title: "Neon Gym Ascent",
            artist: "Tokyo Synthwave Syndicate",
            genre: "Workout Power",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
            duration: "6:12"
        },
        {
            id: 2,
            title: "Hyperdrive Pulse",
            artist: "Vector Prime",
            genre: "Workout Power",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
            duration: "7:05"
        },
        {
            id: 3,
            title: "Lofi Focus Chill",
            artist: "Bedroom Beats Crew",
            genre: "Focus Flow",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=400&q=80",
            duration: "5:44"
        },
        {
            id: 4,
            title: "Midnight Deep Flow",
            artist: "Enigmatic Frequency",
            genre: "Focus Flow",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
            duration: "5:02"
        },
        {
            id: 5,
            title: "Elite Cardio Storm",
            artist: "Beat Drifter",
            genre: "Workout Power",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
            duration: "5:18"
        },
        {
            id: 6,
            title: "Forest Solitude",
            artist: "Ethereal Echoes",
            genre: "Chill Recovery",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80",
            duration: "6:02"
        },
        {
            id: 7,
            title: "Zen Horizon",
            artist: "Aura Balance",
            genre: "Chill Recovery",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
            cover: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80",
            duration: "7:22"
        },
        {
            id: 8,
            title: "Vaporwave Shredder",
            artist: "Glitch Dreamer",
            genre: "Focus Flow",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
            cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
            duration: "5:38"
        }
    ];

    const audioPlayer = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;

    // Load track by index
    const loadTrack = (index) => {
        const track = MUSIC_COLLECTION[index];
        if (!track) return;
        currentTrackIndex = index;
        audioPlayer.src = track.url;
        
        // Update player dashboard cards
        const artImg = document.getElementById('current-player-art');
        const titleText = document.getElementById('current-player-title');
        const artistText = document.getElementById('current-player-artist');
        const genreBadge = document.getElementById('current-player-genre');
        const timeTotal = document.getElementById('player-time-total');
        const timeCurrent = document.getElementById('player-time-current');
        const progressFill = document.getElementById('player-progress-fill');
        
        if (artImg) artImg.src = track.cover;
        if (titleText) titleText.innerText = track.title;
        if (artistText) artistText.innerText = track.artist;
        if (genreBadge) genreBadge.innerText = track.genre;
        if (timeTotal) timeTotal.innerText = track.duration;
        if (timeCurrent) timeCurrent.innerText = "0:00";
        if (progressFill) progressFill.style.width = "0%";
        
        // Highlight active list items
        document.querySelectorAll('.track-item-card').forEach(card => card.classList.remove('active'));
        const activeCard = document.querySelector(`.track-item-card[data-index="${index}"]`);
        if (activeCard) activeCard.classList.add('active');
    };

    // Toggle play state
    const togglePlay = () => {
        const playBtn = document.getElementById('player-play-btn');
        const eq = document.getElementById('eq-visualizer');
        const art = document.getElementById('current-player-art');
        
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (eq) eq.classList.remove('playing');
            if (art) art.classList.remove('playing');
        } else {
            audioPlayer.play().then(() => {
                isPlaying = true;
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                if (eq) eq.classList.add('playing');
                if (art) art.classList.add('playing');
            }).catch(err => {
                console.warn("Audio playback failed:", err);
            });
        }
    };

    const nextTrack = () => {
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= MUSIC_COLLECTION.length) nextIndex = 0;
        loadTrack(nextIndex);
        if (isPlaying) {
            audioPlayer.play().catch(err => console.log(err));
        }
    };

    const prevTrack = () => {
        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = MUSIC_COLLECTION.length - 1;
        loadTrack(prevIndex);
        if (isPlaying) {
            audioPlayer.play().catch(err => console.log(err));
        }
    };

    // Time update listener
    audioPlayer.addEventListener('timeupdate', () => {
        const duration = audioPlayer.duration || 0;
        const currentTime = audioPlayer.currentTime || 0;
        if (duration > 0) {
            const percent = (currentTime / duration) * 100;
            const progressFill = document.getElementById('player-progress-fill');
            const timeCurrent = document.getElementById('player-time-current');
            
            if (progressFill) progressFill.style.width = `${percent}%`;
            
            const min = Math.floor(currentTime / 60);
            const sec = Math.floor(currentTime % 60).toString().padStart(2, '0');
            if (timeCurrent) timeCurrent.innerText = `${min}:${sec}`;
        }
    });

    audioPlayer.addEventListener('ended', () => {
        nextTrack();
        audioPlayer.play().catch(err => console.log(err));
    });

    // Populate track lists
    const renderTracks = (genreFilter = "All") => {
        const container = document.getElementById('tracks-list-container');
        if (!container) return;
        container.innerHTML = "";
        
        MUSIC_COLLECTION.forEach((track, index) => {
            if (genreFilter !== "All" && track.genre !== genreFilter) return;
            
            const card = document.createElement('div');
            card.className = `track-item-card ${index === currentTrackIndex ? 'active' : ''}`;
            card.dataset.index = index;
            card.innerHTML = `
                <div class="track-card-art">
                    <img src="${track.cover}" alt="Art" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
                    <div class="track-card-play-hover">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="track-card-details">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
                <div class="track-card-meta">
                    <span class="duration">${track.duration}</span>
                    <span class="genre-badge">${track.genre}</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                const wasPlaying = isPlaying;
                loadTrack(index);
                if (!wasPlaying) {
                    togglePlay();
                } else {
                    audioPlayer.play().catch(err => console.log(err));
                }
            });
            
            container.appendChild(card);
        });
    };

    // Attach listeners on load
    const initMusicPlayer = () => {
        // Connect Spotify button in sidebar
        const spotifyConnectBtn = document.getElementById('spotify-connect');
        if (spotifyConnectBtn) {
            spotifyConnectBtn.onclick = (e) => {
                e.preventDefault();
                switchTab('music-view');
            };
        }

        // Control Buttons
        const playBtn = document.getElementById('player-play-btn');
        const prevBtn = document.getElementById('player-prev-btn');
        const nextBtn = document.getElementById('player-next-btn');
        const volumeSlider = document.getElementById('player-volume-slider');
        const progressContainer = document.getElementById('player-progress-container');

        if (playBtn) playBtn.addEventListener('click', togglePlay);
        if (prevBtn) prevBtn.addEventListener('click', prevTrack);
        if (nextBtn) nextBtn.addEventListener('click', nextTrack);
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audioPlayer.volume = e.target.value;
            });
        }
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percentage = clickX / width;
                if (audioPlayer.duration) {
                    audioPlayer.currentTime = percentage * audioPlayer.duration;
                }
            });
        }

        // Pills filter
        document.querySelectorAll('.music-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.music-pill-btn').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                renderTracks(btn.dataset.genre);
            });
        });

        // Load first track initially
        loadTrack(0);
        renderTracks("All");
    };

    // 6.8 PROFILE DROPDOWN & EDIT MODAL MANAGER
    const initProfileManager = () => {
        const profileBtn = document.getElementById('user-profile-btn');
        const profileDropdown = document.getElementById('profile-dropdown');
        const editNameBtn = document.getElementById('edit-name-btn');
        const editPicBtn = document.getElementById('edit-pic-btn');
        const settingsBtn = document.getElementById('dropdown-settings-btn');
        const logoutBtn = document.getElementById('dropdown-logout-btn');
        
        const editModal = document.getElementById('profile-edit-modal');
        const closeModalBtn = document.getElementById('close-profile-modal');
        const editForm = document.getElementById('profile-edit-form');
        
        const nameInput = document.getElementById('edit-profile-name-input');
        const goalSelect = document.getElementById('edit-profile-goal-select');
        const levelSelect = document.getElementById('edit-profile-level-select');
        
        // Avatar selection state
        let selectedAvatarUrl = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80";

        // Preset Avatars click logic
        const presetOptions = document.querySelectorAll('.preset-avatar-option');
        presetOptions.forEach(opt => {
            opt.onclick = () => {
                presetOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                selectedAvatarUrl = opt.src;
                
                // Reset file upload label
                const uploadLabel = document.getElementById('upload-file-name-label');
                if (uploadLabel) uploadLabel.innerText = "Choose an image file...";
                const fileInput = document.getElementById('edit-profile-avatar-file');
                if (fileInput) fileInput.value = ""; // clear selected file
            };
        });

        // File Uploader logic
        const fileInput = document.getElementById('edit-profile-avatar-file');
        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        selectedAvatarUrl = event.target.result;
                        
                        // Update upload label name
                        const uploadLabel = document.getElementById('upload-file-name-label');
                        if (uploadLabel) uploadLabel.innerText = file.name;
                        
                        // Remove active class from preset options
                        presetOptions.forEach(o => o.classList.remove('active'));
                    };
                    reader.readAsDataURL(file);
                }
            };
        }

        // Toggle dropdown
        if (profileBtn && profileDropdown) {
            profileBtn.onclick = (e) => {
                e.stopPropagation();
                const isHidden = profileDropdown.style.display === 'none';
                profileDropdown.style.display = isHidden ? 'flex' : 'none';
            };
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (profileDropdown && !profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                    profileDropdown.style.display = 'none';
                }
            });
        }

        // Open modal
        const openEditModal = () => {
            if (profileDropdown) profileDropdown.style.display = 'none';
            if (editModal) editModal.style.display = 'flex';
        };

        if (editNameBtn) editNameBtn.onclick = openEditModal;
        if (editPicBtn) editPicBtn.onclick = openEditModal;
        if (settingsBtn) settingsBtn.onclick = openEditModal;

        // Close modal
        if (closeModalBtn && editModal) {
            closeModalBtn.onclick = () => {
                editModal.style.display = 'none';
            };
            editModal.onclick = (e) => {
                if (e.target === editModal) {
                    editModal.style.display = 'none';
                }
            };
        }

        // Handle profile edits save
        if (editForm) {
            editForm.onsubmit = (e) => {
                e.preventDefault();
                
                const newName = nameInput.value.trim();
                const newGoal = goalSelect.value;
                const newLevel = levelSelect.value;

                // Update UI state
                userProfile.name = newName;
                userProfile.goal = newGoal;
                userProfile.level = newLevel;

                // Update Header and Dropdown Avatars
                const triggerAvatar = document.getElementById('dropdown-avatar-trigger');
                const dropAvatar = document.getElementById('dropdown-avatar-img');
                if (triggerAvatar) triggerAvatar.src = selectedAvatarUrl;
                if (dropAvatar) dropAvatar.src = selectedAvatarUrl;

                // Update dropdown texts
                const nameDisplay = document.getElementById('dropdown-profile-name');
                const goalDisplay = document.getElementById('dropdown-detail-goal');
                const levelDisplay = document.getElementById('dropdown-detail-level');

                if (nameDisplay) nameDisplay.innerText = newName;
                if (goalDisplay) goalDisplay.innerText = newGoal;
                if (levelDisplay) levelDisplay.innerText = newLevel;

                // Close modal and show toast
                if (editModal) editModal.style.display = 'none';
                showToast("Profile updated successfully!");
            };
        }

        // Handle Simulated Log Out
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                showToast("Signing out...");
                setTimeout(() => {
                    location.reload();
                }, 1000);
            };
        }
    };

    initMusicPlayer();
    initProfileManager();

    // 7. SCROLL PROGRESS
    const progress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const perc = (window.scrollY / totalHeight) * 100;
        if (progress) progress.style.width = `${perc}%`;
    });

    // 8. YOUTUBE VIDEO LAUNCHER (PROD-READY PORT)
    window.launchYoutubeVideo = async (exerciseName, buttonEl) => {
        let originalText = "";
        if (buttonEl) {
            originalText = buttonEl.innerHTML;
            buttonEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;
            buttonEl.disabled = true;
        }
        try {
            const res = await fetch(`http://localhost:3000/api/youtube/search?exerciseName=${encodeURIComponent(exerciseName)}`);
            const data = await res.json();
            if (data.videos && data.videos.length > 0) {
                window.open(data.videos[0].youtubeUrl, '_blank');
            } else {
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' tutorial')}`, '_blank');
            }
        } catch (e) {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' tutorial')}`, '_blank');
        } finally {
            if (buttonEl) {
                buttonEl.innerHTML = originalText;
                buttonEl.disabled = false;
            }
        }
    };

});

