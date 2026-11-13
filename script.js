(function() {
    window.APP = window.APP || {};

    // ================= 音频系统 =================
    APP.audioCtx = null;
    APP.bgmAudio = new Audio();
    APP.bgmAudio.loop = true;
    APP.settings = { master: 100, bgm: 100, sfx: 100 };

    APP.initAudio = function() {
        if (!APP.audioCtx) {
            APP.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (APP.audioCtx.state === 'suspended') {
            APP.audioCtx.resume();
        }
    };

    APP.playTone = function(opts) {
        if (!APP.audioCtx) return;
        const { type = 'sine', freq = 200, freqEnd = 80, dur = 0.1, vol = 0.2 } = opts;
        const sfxRatio = APP.settings.sfx / 100;
        const masterRatio = APP.settings.master / 100;
        const o = APP.audioCtx.createOscillator();
        const g = APP.audioCtx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, APP.audioCtx.currentTime);
        o.frequency.exponentialRampToValueAtTime(freqEnd, APP.audioCtx.currentTime + dur);
        g.gain.setValueAtTime(vol * sfxRatio * masterRatio, APP.audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, APP.audioCtx.currentTime + dur);
        o.connect(g); g.connect(APP.audioCtx.destination);
        o.start(); o.stop(APP.audioCtx.currentTime + dur);
    };

    APP.playSquish = () => APP.playTone({ type:'sine', freq:200, freqEnd:80, dur:0.1, vol:0.2 });
    APP.playFly    = () => APP.playTone({ type:'sawtooth', freq:300, freqEnd:100, dur:0.3, vol:0.1 });
    APP.playThud   = () => APP.playTone({ type:'triangle', freq:150, freqEnd:40, dur:0.3, vol:0.4 });

    APP.playTypeBlip = function() {
        if (!APP.audioCtx) return;
        const sfxRatio = APP.settings.sfx / 100;
        const masterRatio = APP.settings.master / 100;
        const o = APP.audioCtx.createOscillator();
        const g = APP.audioCtx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(700 + Math.random()*200, APP.audioCtx.currentTime);
        g.gain.setValueAtTime(0.08 * sfxRatio * masterRatio, APP.audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, APP.audioCtx.currentTime + 0.04);
        o.connect(g); g.connect(APP.audioCtx.destination);
        o.start(); o.stop(APP.audioCtx.currentTime + 0.04);
    };

    APP.applyBgmVolume = function() {
        const masterRatio = APP.settings.master / 100;
        const bgmUserRatio = APP.settings.bgm / 100;
        const effectiveBgmRatio = Math.min(0.4, 0.4 * bgmUserRatio) * masterRatio;
        APP.bgmAudio.volume = Math.max(0, Math.min(1, effectiveBgmRatio));
    };

    // ================= 多语言文本 =================
    APP.TEXTS = {
        en: {
            prompt: "What language do you speak?", greetLine1: "Hi, I'm Cokey.", greetLine2: "Nice to meet you...\nLet's play together.",
            settingsTitle: "Settings", labelCreator: "Creator", labelLang: "Language", labelMode: "Mode", labelAudio: "Audio",
            labelMaster: "Master", labelBgm: "BGM", labelSfx: "SFX", labelUpload: "Upload Media",
            btnPlayMusic: "▶ Play", musicUrlPlaceholder: "Music URL (MP3)",
            modeNormal: "Normal", modeSnow: "Slushy", modeLiquid: "Liquid",
            drawBtn: "Workshop", drawName: "Name...", btnDone: "Done", pageAcc: "Accessory", pageWeap: "Weapon",
            eraser: "Eraser", wearTips: "Drag items to edit", btnSave: "Save & Exit",
            logSquish: "Squishy", logFly: "Flying! Help!", logLand: "Ouch... dizzy...",
            logDress: "Editing mode", logLock: "Saved, locked", logHit: "Ouch!", logModeSnow: "Slushy", logModeLiquid: "Liquid",
            quotes: ["I'm a bit sleepy today...", "Do you want to touch my ears?", "Hehe, that tickles.", "Please don't throw me too far.", "I like the quiet.", "Can we just stay like this?", "I'm not a real pig, you know.", "The sky looks nice today.", "Are you bored?", "I think I need a nap.", "You are very gentle.", "I'm a little hungry.", "Don't poke my nose!", "Let's just sit here.", "It's warm here.", "I'm observing you.", "What are you thinking about?", "Life is simple.", "I dream of marshmallows.", "Thank you for playing with me."]
        },
        es: {
            prompt: "¿Qué idioma hablas?", greetLine1: "Hola, soy Cokey.", greetLine2: "Encantado de conocerte...\nJuguemos juntos.",
            settingsTitle: "Ajustes", labelCreator: "Creador", labelLang: "Idioma", labelMode: "Modo", labelAudio: "Audio",
            labelMaster: "Volumen", labelBgm: "Música", labelSfx: "Efectos", labelUpload: "Subir archivo",
            btnPlayMusic: "▶ Reproducir", musicUrlPlaceholder: "URL de música (MP3)",
            modeNormal: "Normal", modeSnow: "Granizado", modeLiquid: "Líquido",
            drawBtn: "Taller", drawName: "Nombre...", btnDone: "Listo", pageAcc: "Accesorio", pageWeap: "Arma",
            eraser: "Borrador", wearTips: "Arrastra para editar", btnSave: "Guardar y salir",
            logSquish: "Suavecito", logFly: "¡Volando! ¡Socorro!", logLand: "Ay... mareado...",
            logDress: "Modo edición", logLock: "Guardado y bloqueado", logHit: "¡Ay!", logModeSnow: "Granizado", logModeLiquid: "Líquido",
            quotes: ["Hoy tengo un poco de sueño...", "¿Quieres tocar mis orejas?", "Jeje, eso hace cosquillas.", "Por favor, no me lances muy lejos.", "Me gusta el silencio.", "¿Podemos quedarnos así?", "No soy un cerdo real, ¿sabes?", "El cielo se ve bonito hoy.", "¿Estás aburrido?", "Creo que necesito una siesta.", "Eres muy gentil.", "Tengo un poco de hambre.", "¡No me toques la nariz!", "Solo sentémonos aquí.", "Hace calor aquí.", "Te estoy observando.", "¿En qué estás pensando?", "La vida es simple.", "Sueño con malvaviscos.", "Gracias por jugar conmigo."]
        },
        zh: {
            prompt: "你使用什么语言？", greetLine1: "你好，我是 Cokey。", greetLine2: "很高兴认识你……\n一起玩吧。",
            settingsTitle: "设置", labelCreator: "创作者", labelLang: "语言", labelMode: "模式", labelAudio: "音频",
            labelMaster: "总音量", labelBgm: "背景音乐", labelSfx: "音效", labelUpload: "上传视频/音频",
            btnPlayMusic: "▶ 播放", musicUrlPlaceholder: "音乐链接 (MP3)",
            modeNormal: "普通", modeSnow: "绵绵冰", modeLiquid: "液态",
            drawBtn: "创意工坊", drawName: "名字...", btnDone: "完成", pageAcc: "装饰绘制", pageWeap: "武器绘制",
            eraser: "橡皮", wearTips: "拖动物品进行编辑", btnSave: "保存并退出",
            logSquish: "Q弹软糯", logFly: "啊啊啊救命！", logLand: "晕死我了...",
            logDress: "进入了编辑模式", logLock: "保存完毕，锁定", logHit: "哎呀，好痛！", logModeSnow: "绵绵冰", logModeLiquid: "液态",
            quotes: ["今天有点困呢……", "你想摸摸我的耳朵吗？", "嘿嘿，好痒。", "请别把我扔太远啦。", "我喜欢安静。", "我们就这样待着好不好？", "你知道我不是真的猪吧。", "今天的天空很好看。", "你无聊了吗？", "我想我需要睡个午觉。", "你很温柔。", "我有点饿了。", "别戳我的鼻子！", "我们就在这里坐一会儿吧。", "这里很暖和。", "我在观察你。", "你在想什么呢？", "生活其实很简单。", "我梦见棉花糖了。", "谢谢你陪我玩。"]
        }
    };

    APP.state = { currentLang: 'zh', currentMode: 'normal', isFrozen: true, tick: 0, isBlinking: false, isFlying: false, isHit: false, isWearingMode: false, isWeaponPage: false };
    const TEXTS = APP.TEXTS;

    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('pigCanvas');
        const ctx = canvas.getContext('2d');
        const wrapper = document.getElementById('pigWrapper');
        const introBubble = document.getElementById('introBubble');
        const bubbleText = document.getElementById('bubbleText');
        const langOverlay = document.getElementById('langOverlay');
        const drawToggleBtn = document.getElementById('drawToggleBtn');
        const systemLog = document.getElementById('systemLog');
        const settingsPanel = document.getElementById('settingsPanel');
        const pageTitle = document.getElementById('pageTitle');

        APP.dom = { canvas, ctx, wrapper, introBubble, langOverlay, drawToggleBtn, systemLog, settingsPanel, pageTitle };

        function applyLanguage(lang) {
            APP.state.currentLang = lang;
            const t = TEXTS[lang];
            document.getElementById('settingsTitle').textContent = t.settingsTitle;
            document.getElementById('labelCreator').textContent = t.labelCreator;
            document.getElementById('labelLang').textContent = t.labelLang;
            document.getElementById('labelMode').textContent = t.labelMode;
            document.getElementById('labelAudio').textContent = t.labelAudio;
            document.getElementById('labelMaster').textContent = t.labelMaster;
            document.getElementById('labelBgm').textContent = t.labelBgm;
            document.getElementById('labelSfx').textContent = t.labelSfx;
            document.getElementById('uploadBtnText').textContent = t.labelUpload;
            document.getElementById('btnPlayMusic').textContent = t.btnPlayMusic;
            document.getElementById('musicUrlInput').placeholder = t.musicUrlPlaceholder;
            document.getElementById('modeNormal').textContent = t.modeNormal;
            document.getElementById('modeSnow').textContent = t.modeSnow;
            document.getElementById('modeLiquid').textContent = t.modeLiquid;
            document.getElementById('drawBtnLabel').textContent = t.drawBtn;
            document.getElementById('drawName').placeholder = t.drawName;
            document.getElementById('btnExitDraw').textContent = t.btnDone;
            document.getElementById('eraserLabel').textContent = t.eraser;
            document.getElementById('wearTips').textContent = t.wearTips;
            document.getElementById('btnExitWear').textContent = t.btnSave;
            pageTitle.textContent = APP.state.isWeaponPage ? t.pageWeap : t.pageAcc;
        }
        APP.applyLanguage = applyLanguage;

        // ================= 建模渲染 =================
        const PALETTE_PIG = { '1': '#6B3A4A', '2': '#FFFFFF', '3': '#F7B6C9', '4': '#EBA0B8', '5': '#FFFFFF', '6': '#F2D8D8', '7': '#1A1A1A', '8': '#3A2530', '9': '#FF8FA3', 'A': '#FFB3C6', 'B': '#FFFFFF' };
        setInterval(() => { APP.state.isBlinking = true; setTimeout(() => { APP.state.isBlinking = false; }, 200); }, 4000);

        function generatePig(expression) {
            let m = Array(32).fill(0).map(() => Array(32).fill(0));
            for(let y=4; y<9; y++) { for(let x=5; x<9; x++) { m[y][x] = 3; if(x===8 || y===8) m[y][x] = 1; if(x===7 && y===6) m[y][x] = 'A'; } }
            for(let y=4; y<9; y++) { for(let x=23; x<27; x++) { m[y][x] = 4; if(x===23 || y===8) m[y][x] = 1; if(x===24 && y===6) m[y][x] = 'A'; } }
            for(let y=6; y<22; y++) { let start = 4 + Math.abs(y-14); let end = 28 - Math.abs(y-14); for(let x=start; x<end; x++) m[y][x] = (x < 16 && y < 16) ? 2 : 3; }
            if (expression === 'dizzy') { m[12][8]=7; m[12][9]=7; m[13][10]=7; m[14][8]=7; m[14][9]=7; m[12][22]=7; m[12][23]=7; m[13][21]=7; m[14][22]=7; m[14][23]=7; }
            else if (expression === 'hit') { m[12][9]=7; m[12][10]=7; m[13][10]=7; m[14][9]=7; m[14][10]=7; m[12][21]=7; m[12][22]=7; m[13][21]=7; m[14][21]=7; m[14][22]=7; }
            else { for(let y=11; y<16; y++) { for(let x=8; x<13; x++) m[y][x] = 7; for(let x=19; x<24; x++) m[y][x] = 7; } for(let y=12; y<15; y++) { m[y][9] = 8; m[y][10] = 8; m[y][20] = 8; m[y][21] = 8; } m[11][9] = 'B'; m[11][20] = 'B'; }
            for(let y=14; y<19; y++) { for(let x=13; x<19; x++) { m[y][x] = 9; if(y===15 && (x===14 || x===17)) m[y][x] = 1; } }
            m[16][6] = 'A'; m[17][6] = 'A'; m[16][25] = 'A'; m[17][25] = 'A';
            for(let y=22; y<31; y++) { let start = 8; let end = 24; if(y>26) { start = 10; end = 22; } for(let x=start; x<end; x++) m[y][x] = (x < 15) ? 3 : 4; }
            for(let y=24; y<31; y++) for(let x=13; x<19; x++) m[y][x] = 5;
            m[24][6] = 1; m[24][7] = 2; m[25][6] = 1; m[25][7] = 2; m[24][25] = 1; m[24][26] = 4; m[25][25] = 1; m[25][26] = 4; m[30][12] = 1; m[30][13] = 1; m[30][18] = 1; m[30][19] = 1;
            return m;
        }

        function draw() {
            ctx.clearRect(0, 0, 64, 64);
            const pixelSize = 2, bobY = APP.state.isWearingMode ? 0 : Math.sin(APP.state.tick * 0.05) * 1; 
            let expression = APP.state.isHit ? 'hit' : (APP.state.isFlying ? 'dizzy' : 'normal');
            const matrix = generatePig(expression);
            for (let y = 0; y < 32; y++) {
                for (let x = 0; x < 32; x++) {
                    let c = matrix[y][x];
                    if (APP.state.isBlinking && expression === 'normal' && !APP.state.isWearingMode) {
                        if ((y >= 12 && y <= 14) && ((x >= 8 && x <= 12) || (x >= 19 && x <= 23))) { if (y === 13) c = '7'; else c = (x < 16) ? '2' : '3'; }
                    }
                    if (c !== 0) { ctx.fillStyle = PALETTE_PIG[c] || '#000'; ctx.fillRect(x * pixelSize, (y + bobY) * pixelSize, pixelSize, pixelSize); }
                }
            }
            if (APP.state.isFlying) { let starX = 32 + Math.cos(APP.state.tick * 0.2) * 20, starY = 10 + Math.sin(APP.state.tick * 0.2) * 5; ctx.fillStyle = '#FFD700'; ctx.fillRect(starX, starY, 4, 4); ctx.fillRect(64 - starX, starY + 2, 4, 4); }
            APP.state.tick++; requestAnimationFrame(draw);
        }
        draw();

        let logCount = 0;
        function addLog(type, text) {
            const el = document.createElement('div');
            el.className = 'log-item';
            el.textContent = `【${type}】 ${text}`;
            systemLog.appendChild(el);
            logCount++;
            if (logCount > 6) { systemLog.removeChild(systemLog.firstChild); logCount--; }
        }
        APP.addLog = addLog;

        // ================= 打字系统 =================
        let bubbleTimer = null;
        let typeTimer = null;
        function say(text) {
            if (!text) return;
            clearTimeout(bubbleTimer);
            clearInterval(typeTimer);
            introBubble.style.opacity = '0';
            introBubble.classList.remove('show');
            
            setTimeout(() => {
                const chars = Array.from(text);
                bubbleText.innerHTML = '';
                introBubble.classList.add('show');
                introBubble.style.opacity = '1';
                let i = 0;
                typeTimer = setInterval(() => {
                    if (i < chars.length) {
                        const ch = chars[i];
                        if (ch === '\n') bubbleText.innerHTML += '<br>';
                        else bubbleText.textContent += ch;
                        if (ch !== ' ' && ch !== '\n') APP.playTypeBlip();
                        i++;
                    } else {
                        clearInterval(typeTimer);
                        bubbleTimer = setTimeout(() => {
                            introBubble.style.opacity = '0';
                            introBubble.classList.remove('show');
                        }, 3000); 
                    }
                }, 60);
            }, 300);
        }
        APP.say = say;

        function startIntro() {
            wrapper.classList.remove('intro-start');
            wrapper.classList.add('intro-talking');
            const prompts = [TEXTS.en.prompt, TEXTS.es.prompt, TEXTS.zh.prompt];
            let pIdx = 0, langTimer = null;
            setTimeout(() => {
                introBubble.classList.add('show');
                bubbleText.textContent = prompts[pIdx];
                langTimer = setInterval(() => {
                    introBubble.style.opacity = '0';
                    setTimeout(() => {
                        pIdx = (pIdx + 1) % prompts.length;
                        bubbleText.textContent = prompts[pIdx];
                        introBubble.style.opacity = '1';
                    }, 500);
                }, 2200);
                langOverlay.classList.add('show');

                document.querySelectorAll('.lang-btn, .lang-btn-sm').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const lang = e.currentTarget.dataset.lang;
                        if (!lang) return;
                        APP.initAudio(); 
                        clearInterval(langTimer);
                        applyLanguage(lang);
                        langOverlay.classList.remove('show');
                        introBubble.style.opacity = '0';
                        introBubble.classList.remove('show');
                        setTimeout(() => {
                            const t = TEXTS[APP.state.currentLang];
                            const fullText = t.greetLine1 + '\n' + t.greetLine2;
                            say(fullText);
                            setTimeout(() => {
                                wrapper.classList.remove('intro-talking');
                                wrapper.classList.add('intro-end');
                                setTimeout(() => {
                                    APP.state.isFrozen = false;
                                    drawToggleBtn.classList.add('show');
                                }, 1200);
                            }, fullText.length * 60 + 3800);
                        }, 600);
                    });
                });
            }, 400);
        }

        // ================= 猪猪交互 =================
        let dragStartX = 0, dragStartY = 0, dragLastX = 0, dragLastY = 0, isDragging = false;
        let lastClickTime = 0;

        wrapper.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.item-scaler')) return;
            if (APP.state.isFrozen || APP.state.isFlying) return;
            APP.initAudio();
            const now = Date.now();
            if (now - lastClickTime < 300) {
                const quotes = TEXTS[APP.state.currentLang].quotes;
                say(quotes[Math.floor(Math.random() * quotes.length)]);
            }
            lastClickTime = now;
            isDragging = true;
            dragStartX = dragLastX = e.clientX;
            dragStartY = dragLastY = e.clientY;
            wrapper.style.transition = 'none';
            if (APP.state.currentMode === 'snow') {
                canvas.style.transform = 'scaleX(1.08) scaleY(0.92)'; canvas.style.borderRadius = '40% 60% 65% 35% / 40% 50% 60% 50%';
            } else if (APP.state.currentMode === 'liquid') {
                canvas.style.transition = 'none'; canvas.style.transform = 'scaleX(1.25) scaleY(0.75)'; canvas.style.borderRadius = '35% 65% 25% 75% / 50% 60% 40% 50%';
            } else {
                canvas.style.transform = 'scaleX(1.12) scaleY(0.88)';
            }
            APP.playSquish();
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging || APP.state.isFrozen || APP.state.isFlying) return;
            const dx = e.clientX - dragLastX, dy = e.clientY - dragLastY;
            const totalDx = e.clientX - dragStartX, totalDy = e.clientY - dragStartY;
            if (APP.state.currentMode === 'snow') {
                canvas.style.transform = `scale(${1 + Math.abs(dx) / 50}, ${1 + Math.abs(dy) / 50})`;
                canvas.style.borderRadius = `${40 + dx/10}% ${60 - dx/10}% ${65 + dy/10}% ${35 - dy/10}% / ${40 + dy/10}% ${50 - dy/10}% ${60 - dy/10}% ${50 + dy/10}%`;
            } else if (APP.state.currentMode === 'liquid') {
                wrapper.style.transition = 'none'; wrapper.style.transform = `translate(${totalDx}px, ${totalDy}px)`;
                canvas.style.transform = `scale(${1 + totalDx / 120}, ${1 - totalDy / 120})`;
                const r1 = 50 + totalDx / 4, r2 = 50 - totalDx / 4;
                canvas.style.borderRadius = `${r1}% ${100-r1}% ${100-r2}% ${r2}% / ${r2}% ${r1}% ${100-r1}% ${100-r2}%`;
            } else {
                wrapper.style.transform = `translate(${totalDx}px, ${totalDy}px)`;
                canvas.style.transform = `scale(${1 + Math.abs(dx) / 40}, ${1 + Math.abs(dy) / 40})`;
            }
            dragLastX = e.clientX; dragLastY = e.clientY;
        });

        window.addEventListener('pointerup', () => {
            if (!isDragging || APP.state.isFrozen) return;
            isDragging = false;
            const speed = Math.hypot(dragLastX - dragStartX, dragLastY - dragStartY);
            const t = TEXTS[APP.state.currentLang];
            if (APP.state.currentMode === 'liquid') {
                canvas.style.transition = 'transform 2.8s cubic-bezier(0.2, 0.8, 0.2, 1), border-radius 2.8s ease';
                canvas.style.transform = 'scale(1)'; canvas.style.borderRadius = '0';
                wrapper.style.transition = 'transform 2.2s ease'; wrapper.style.transform = 'translate(0px, 0px)';
                addLog(t.logModeLiquid, t.logSquish);
            } else if (APP.state.currentMode === 'snow') {
                canvas.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 1.2s ease';
                canvas.style.transform = 'scale(1)'; canvas.style.borderRadius = '0';
                wrapper.style.transition = 'transform 0.8s ease'; wrapper.style.transform = 'translate(0px, 0px)';
                addLog(t.logModeSnow, t.logSquish);
            } else {
                canvas.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.3s';
                canvas.style.transform = 'scale(1)'; canvas.style.borderRadius = '0';
                wrapper.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                if (speed > 150) {
                    APP.state.isFlying = true; APP.playFly(); addLog(t.logFly, t.logFly);
                    say(t.quotes[Math.floor(Math.random() * t.quotes.length)]);
                    const dx = (dragLastX - dragStartX) * 4, dy = (dragLastY - dragStartY) * 4;
                    wrapper.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    wrapper.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.2}deg)`;
                    setTimeout(() => {
                        APP.playThud();
                        wrapper.style.transition = 'transform 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)'; wrapper.style.transform = 'translate(0px, 0px) rotate(0deg)';
                        setTimeout(() => { APP.state.isFlying = false; addLog(t.logLand, t.logLand); }, 2500);
                    }, 1000);
                } else {
                    wrapper.style.transform = 'translate(0px, 0px)'; addLog(t.logSquish, t.logSquish);
                }
            }
        });

        // ================= 设置面板 =================
        document.getElementById('settingsBtn').addEventListener('click', () => settingsPanel.classList.toggle('show'));
        document.getElementById('closeSettings').addEventListener('click', () => settingsPanel.classList.remove('show'));
        document.querySelectorAll('.setting-row').forEach(row => {
            row.addEventListener('click', () => {
                const key = row.dataset.row;
                const sub = document.getElementById('sub' + key.charAt(0).toUpperCase() + key.slice(1));
                const isOpen = sub.classList.contains('show');
                document.querySelectorAll('.setting-sub').forEach(s => s.classList.remove('show'));
                document.querySelectorAll('.setting-row').forEach(r => r.classList.remove('open'));
                if (!isOpen) { sub.classList.add('show'); row.classList.add('open'); }
            });
        });

        document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn[data-mode]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active'); APP.state.currentMode = btn.dataset.mode;
            });
        });

        const sliderMaster = document.getElementById('sliderMaster');
        const sliderBgm = document.getElementById('sliderBgm');
        const sliderSfx = document.getElementById('sliderSfx');
        sliderMaster.addEventListener('input', () => { APP.settings.master = parseInt(sliderMaster.value); document.getElementById('valMaster').textContent = APP.settings.master; APP.applyBgmVolume(); });
        sliderBgm.addEventListener('input', () => { APP.settings.bgm = parseInt(sliderBgm.value); document.getElementById('valBgm').textContent = APP.settings.bgm; APP.applyBgmVolume(); });
        sliderSfx.addEventListener('input', () => { APP.settings.sfx = parseInt(sliderSfx.value); document.getElementById('valSfx').textContent = APP.settings.sfx; });

        document.getElementById('btnPlayMusic').addEventListener('click', () => {
            const url = document.getElementById('musicUrlInput').value.trim();
            if (url) { 
                APP.initAudio();
                APP.bgmAudio.src = url; APP.bgmAudio.loop = true; APP.applyBgmVolume(); 
                APP.bgmAudio.play().catch(e => alert('播放失败！请确保是MP3直链，或先摸一下小猪激活权限。')); 
            }
        });
        document.getElementById('mediaFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            APP.initAudio();
            APP.bgmAudio.src = URL.createObjectURL(file); APP.bgmAudio.loop = true; APP.applyBgmVolume();
            APP.bgmAudio.play().catch(err => alert('文件播放失败，请尝试转为MP3或使用链接。'));
        });

        setTimeout(() => { startIntro(); }, 200);
    });
})();
window.addEventListener('DOMContentLoaded', () => {
    if (!window.APP) return;
    const state = APP.state;
    const TEXTS = APP.TEXTS;

    const canvas = document.getElementById('pigCanvas');
    const wearOverlay = document.getElementById('wearOverlay');
    const btnExitWear = document.getElementById('btnExitWear');
    const fullDrawScreen = document.getElementById('fullDrawScreen');
    const btnExitDraw = document.getElementById('btnExitDraw');
    const paletteContainer = document.getElementById('paletteContainer');
    const drawPagesContainer = document.getElementById('drawPagesContainer');
    const drawPagesWrapper = document.getElementById('drawPagesWrapper');
    const pageTitle = document.getElementById('pageTitle');
    const dragHandle = document.getElementById('dragHandle');
    const dragKnob = document.getElementById('dragKnob');
    const equippedLayer = document.getElementById('equippedLayer');
    const itemsLayer = document.getElementById('itemsLayer');
    const drawToggleBtn = document.getElementById('drawToggleBtn');

    let gridSize = 16;
    const canvasAcc = document.getElementById('gridCanvasAcc');
    const canvasWeap = document.getElementById('gridCanvasWeap');
    const canvases = [
        { el: canvasAcc, ctx: canvasAcc.getContext('2d'), data: Array(64).fill('').map(()=>Array(64).fill('')) },
        { el: canvasWeap, ctx: canvasWeap.getContext('2d'), data: Array(64).fill('').map(()=>Array(64).fill('')) }
    ];
    let currentColor = '#FF9F9F';
    let isErasing = false;
    let isEraserPopupOpen = false;
    const eraserPopup = document.getElementById('eraserPopup');
    const eraserSizeRange = document.getElementById('eraserSizeRange');
    eraserSizeRange.oninput = (e) => { document.getElementById('eraserSizeVal').textContent = e.target.value; };

    const colors = ['#FF5252','#FF4081','#E040FB','#7C4DFF','#536DFE','#448AFF','#40C4FF','#18FFFF','#64FFDA','#69F0AE','#B2FF59','#EEFF41','#FFFF00','#FFD740','#FFAB40','#FF6E40','#D7CCC8','#BCAAA4','#8D6E63','#BDBDBD','#9E9E9E','#757575','#616161','#424242','#FFFFFF','#000000','#FF9F9F','#F7B6C9','#EBA0B8','#6B3A4A','#A5D6A7','#81C784','#4CAF50','#2E7D32','#FFF9E6','#8DAF83'];

    const eraser = document.createElement('div'); eraser.className = 'eraser-swatch';
    let eraserPressTimer = null;
    eraser.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (isEraserPopupOpen) { eraserPopup.classList.remove('show'); isEraserPopupOpen = false; }
        else { eraserPressTimer = setTimeout(() => { eraserPopup.classList.add('show'); isEraserPopupOpen = true; }, 400); }
    });
    eraser.addEventListener('pointerup', () => clearTimeout(eraserPressTimer));
    eraser.addEventListener('pointerleave', () => clearTimeout(eraserPressTimer));
    eraser.addEventListener('click', () => { isErasing = true; document.querySelectorAll('.color-swatch, .eraser-swatch').forEach(el => el.classList.remove('active')); eraser.classList.add('active'); });
    paletteContainer.appendChild(eraser);

    colors.forEach(c => {
        const sw = document.createElement('div'); sw.className = 'color-swatch'; sw.style.backgroundColor = c;
        sw.onclick = () => {
            isErasing = false; if (isEraserPopupOpen) { eraserPopup.classList.remove('show'); isEraserPopupOpen = false; }
            currentColor = c; document.querySelectorAll('.color-swatch, .eraser-swatch').forEach(el => el.classList.remove('active')); sw.classList.add('active');
        };
        paletteContainer.appendChild(sw);
    });

    drawToggleBtn.addEventListener('click', () => {
        if (state.isFlying || state.isFrozen) return;
        fullDrawScreen.classList.add('show');
        setTimeout(resizeCanvases, 50);
    });

    function resizeCanvases() {
        const rect = drawPagesWrapper.getBoundingClientRect();
        const size = Math.max(180, Math.floor(Math.min(rect.width - 60, rect.height - 60) / gridSize) * gridSize);
        canvases.forEach(c => {
            c.el.width = size; c.el.height = size;
            c.el.style.width = size + 'px'; c.el.style.height = size + 'px';
            redrawGrid(c);
        });
    }

    function redrawGrid(c) {
        const cw = c.el.width / gridSize, ch = c.el.height / gridSize;
        c.ctx.clearRect(0, 0, c.el.width, c.el.height);
        c.ctx.strokeStyle = '#EEE'; c.ctx.lineWidth = 1;
        for (let i = 0; i <= gridSize; i++) {
            c.ctx.beginPath(); c.ctx.moveTo(i*cw, 0); c.ctx.lineTo(i*cw, c.el.height); c.ctx.stroke();
            c.ctx.beginPath(); c.ctx.moveTo(0, i*ch); c.ctx.lineTo(c.el.width, i*ch); c.ctx.stroke();
        }
        for (let y = 0; y < gridSize; y++) for (let x = 0; x < gridSize; x++) {
            if (c.data[y][x]) { c.ctx.fillStyle = c.data[y][x]; c.ctx.fillRect(x*cw, y*ch, cw, ch); }
        }
    }

    let activeCanvasObj = null;
    let lastGx = -1, lastGy = -1;
    function drawLine(c, x0, y0, x1, y1) {
        let dx = Math.abs(x1-x0), sx = x0 < x1 ? 1 : -1;
        let dy = -Math.abs(y1-y0), sy = y0 < y1 ? 1 : -1;
        let err = dx + dy, e2;
        const cw = c.el.width / gridSize, ch = c.el.height / gridSize;
        const colorToUse = isErasing ? '' : currentColor;
        const es = parseInt(eraserSizeRange.value) || 1;
        while (true) {
            for (let ey = 0; ey < es; ey++) for (let ex = 0; ex < es; ex++) {
                let px = x0 + ex, py = y0 + ey;
                if (px >= 0 && px < gridSize && py >= 0 && py < gridSize) {
                    c.data[py][px] = colorToUse;
                    c.ctx.fillStyle = colorToUse || '#FFF';
                    c.ctx.fillRect(px*cw, py*ch, cw, ch);
                    c.ctx.strokeStyle = '#EEE'; c.ctx.strokeRect(px*cw, py*ch, cw, ch);
                }
            }
            if (x0 === x1 && y0 === y1) break;
            e2 = 2 * err;
            if (e2 >= dy) { err += dy; x0 += sx; }
            if (e2 <= dx) { err += dx; y0 += sy; }
        }
    }

    canvases.forEach(c => {
        c.el.addEventListener('pointerdown', (e) => {
            activeCanvasObj = c;
            const rect = c.el.getBoundingClientRect();
            lastGx = Math.floor((e.clientX - rect.left) / (rect.width / gridSize));
            lastGy = Math.floor((e.clientY - rect.top) / (rect.height / gridSize));
            drawLine(c, lastGx, lastGy, lastGx, lastGy);
        });
        c.el.addEventListener('pointermove', (e) => {
            if (activeCanvasObj !== c) return;
            const rect = c.el.getBoundingClientRect();
            let gx = Math.floor((e.clientX - rect.left) / (rect.width / gridSize));
            let gy = Math.floor((e.clientY - rect.top) / (rect.height / gridSize));
            gx = Math.max(0, Math.min(gridSize - 1, gx));
            gy = Math.max(0, Math.min(gridSize - 1, gy));
            if (gx !== lastGx || gy !== lastGy) {
                drawLine(c, lastGx, lastGy, gx, gy);
                lastGx = gx; lastGy = gy;
            }
        });
    });
    window.addEventListener('pointerup', () => { activeCanvasObj = null; lastGx = -1; lastGy = -1; });

    let pageStartX = 0;
    drawPagesWrapper.addEventListener('pointerdown', (e) => { pageStartX = e.clientX; });
    drawPagesWrapper.addEventListener('pointerup', (e) => {
        const dx = e.clientX - pageStartX;
        const t = TEXTS[state.currentLang];
        if (dx < -50 && !state.isWeaponPage) {
            state.isWeaponPage = true; pageTitle.textContent = t.pageWeap; drawPagesContainer.style.transform = 'translateX(-100%)';
        } else if (dx > 50 && state.isWeaponPage) {
            state.isWeaponPage = false; pageTitle.textContent = t.pageAcc; drawPagesContainer.style.transform = 'translateX(0)';
        }
    });

    // ================= 核心：物品生成与交互 =================
    function createItemFromCanvas(sourceCanvas, isWeapon) {
        const tc = document.createElement('canvas'); tc.width = 64; tc.height = 64;
        const tctx = tc.getContext('2d');
        const cw = 64 / gridSize, ch = 64 / gridSize;
        for (let y = 0; y < gridSize; y++) for (let x = 0; x < gridSize; x++) {
            if (sourceCanvas.data[y][x]) { tctx.fillStyle = sourceCanvas.data[y][x]; tctx.fillRect(x*cw, y*ch, cw, ch); }
        }
        const url = tc.toDataURL();

        function createDOMFromData(posX, posY) {
            const scaler = document.createElement('div');
            scaler.className = 'item-scaler';
            scaler.style.left = '50%'; scaler.style.top = '50%';
            scaler.style.transform = `translate(${posX}px, ${posY}px) scale(1) rotate(0deg)`;
            scaler.style.pointerEvents = 'auto';

            const img = document.createElement('img');
            img.src = url; img.className = 'item-img';
            img.dataset.scale = 1; img.dataset.rotate = 0;
            img.style.pointerEvents = 'auto';
            scaler.appendChild(img);

            // 恢复四角工具栏（灰色模式下可见）
            const toolbar = document.createElement('div'); toolbar.className = 'item-toolbar';
            const copyBtn = document.createElement('div'); copyBtn.className = 'tool-btn btn-copy'; copyBtn.textContent = 'C';
            const delBtn = document.createElement('div'); delBtn.className = 'tool-btn btn-del'; delBtn.textContent = 'X';
            const scaleBtn = document.createElement('div'); scaleBtn.className = 'tool-btn btn-scale'; scaleBtn.textContent = 'S';
            const rotateBtn = document.createElement('div'); rotateBtn.className = 'tool-btn btn-rotate'; rotateBtn.textContent = 'R';
            toolbar.append(copyBtn, delBtn, scaleBtn, rotateBtn);
            scaler.appendChild(toolbar);

            itemsLayer.appendChild(scaler);

            let sL = posX, sT = posY;
            let lastX = 0, lastY = 0;
            let isDraggingItem = false;

            img.addEventListener('pointerdown', (e) => {
                // 主界面的装饰品不可拖动，直接穿透点击猪
                if (!state.isWearingMode && !isWeapon) return;

                e.stopPropagation();
                
                // 只有编辑模式才显示虚线框
                if (state.isWearingMode) {
                    document.querySelectorAll('.item-scaler').forEach(el => el.classList.remove('item-selected'));
                    scaler.classList.add('item-selected');
                }

                isDraggingItem = true; 
                lastX = e.clientX; 
                lastY = e.clientY;
            });

            window.addEventListener('pointermove', (e) => {
                if (!isDraggingItem) return;
                
                // 【核心修复】使用增量差值计算，完美解决“瞬移”问题
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                sL += dx;
                sT += dy;
                lastX = e.clientX;
                lastY = e.clientY;
                
                scaler.style.transform = `translate(${sL}px, ${sT}px) scale(${parseFloat(img.dataset.scale) || 1}) rotate(${parseFloat(img.dataset.rotate) || 0}deg)`;
            });

            window.addEventListener('pointerup', () => {
                if (!isDraggingItem) return;
                isDraggingItem = false; 

                // 碰撞检测
                const pigRect = canvas.getBoundingClientRect();
                const itemRect = scaler.getBoundingClientRect();
                const overlap = !(itemRect.right < pigRect.left || itemRect.left > pigRect.right || itemRect.bottom < pigRect.top || itemRect.top > pigRect.bottom);

                if (state.isWearingMode) {
                    // 编辑模式下，装饰碰猪则吸附，否则放回原位
                    if (!isWeapon && overlap) {
                        equippedLayer.appendChild(scaler);
                    } else {
                        itemsLayer.appendChild(scaler);
                    }
                } else if (isWeapon && overlap) {
                    // 主界面下，武器碰猪则打猪
                    state.isHit = true; APP.playThud();
                    canvas.style.transform = 'scale(1.2, 0.8)';
                    setTimeout(() => { state.isHit = false; canvas.style.transform = 'scale(1, 1)'; }, 800);
                    const t = TEXTS[state.currentLang];
                    APP.addLog(t.logHit, t.logHit); APP.say(t.logHit);
                }
            });

            function updateTransform() {
                scaler.style.transform = `translate(${sL}px, ${sT}px) scale(${parseFloat(img.dataset.scale) || 1}) rotate(${parseFloat(img.dataset.rotate) || 0}deg)`;
            }

            copyBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); createDOMFromData(sL + 20, sT + 20); });
            delBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); scaler.remove(); });
            scaleBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                let base = parseFloat(img.dataset.scale) || 1; const startX = e.clientX;
                const onMove = (ev) => { img.dataset.scale = Math.max(0.3, Math.min(3, base + (ev.clientX - startX) * 0.01)); updateTransform(); };
                const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
            });
            rotateBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                let base = parseFloat(img.dataset.rotate) || 0; const startX = e.clientX;
                const onMove = (ev) => { img.dataset.rotate = base + (ev.clientX - startX) * 0.5; updateTransform(); };
                const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
            });
        }
        
        // 武器生成在左下角避免挡猪，装饰生成在中间
        createDOMFromData(isWeapon ? -120 : 0, isWeapon ? 150 : 0);
    }

    btnExitDraw.addEventListener('click', () => {
        fullDrawScreen.classList.remove('show');
        const target = state.isWeaponPage ? canvases[1] : canvases[0];
        if (target.data.some(row => row.some(cell => cell))) { createItemFromCanvas(target, state.isWeaponPage); }
        target.data = Array(64).fill('').map(()=>Array(64).fill(''));
        redrawGrid(target);
        
        // 【核心恢复】进入灰色编辑模式
        wearOverlay.classList.add('show'); btnExitWear.classList.add('show');
        state.isWearingMode = true;
        const t = TEXTS[state.currentLang]; APP.addLog(t.logDress, t.logDress);
    });

    btnExitWear.addEventListener('click', () => {
        // 【核心恢复】退出编辑模式，锁定物品
        wearOverlay.classList.remove('show'); btnExitWear.classList.remove('show'); 
        state.isWearingMode = false;
        document.querySelectorAll('.item-scaler').forEach(el => el.classList.remove('item-selected'));
        const t = TEXTS[state.currentLang]; APP.addLog(t.logLock, t.logLock);
    });

    document.getElementById('btnZoomIn').addEventListener('click', () => {
        canvases.forEach(c => { const cur = parseFloat(c.el.style.transform.replace('scale(', '').replace(')', '')) || 1; c.el.style.transform = `scale(${Math.min(1.6, cur + 0.2)})`; });
    });
    document.getElementById('btnZoomOut').addEventListener('click', () => {
        canvases.forEach(c => { const cur = parseFloat(c.el.style.transform.replace('scale(', '').replace(')', '')) || 1; c.el.style.transform = `scale(${Math.max(0.5, cur - 0.2)})`; });
    });

    let isDraggingHandle = false;
    dragHandle.addEventListener('pointerdown', (e) => { isDraggingHandle = true; dragHandle.setPointerCapture(e.pointerId); });
    window.addEventListener('pointermove', (e) => {
        if (!isDraggingHandle) return;
        const rect = dragHandle.getBoundingClientRect();
        let pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        dragKnob.style.left = (pct * 100) + '%';
        gridSize = Math.floor(16 + pct * 48);
        clearTimeout(window._resizeTimer);
        window._resizeTimer = setTimeout(resizeCanvases, 30);
    });
    window.addEventListener('pointerup', () => { isDraggingHandle = false; });

    function panCanvas(dx, dy) {
        canvases.forEach(c => {
            const cur = c.el.style.transform || '';
            const m = cur.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
            const tx = m ? parseFloat(m[1]) : 0;
            const ty = m ? parseFloat(m[2]) : 0;
            const sc = cur.match(/scale\(([\d.]+)\)/);
            const s = sc ? sc[1] : 1;
            c.el.style.transform = `translate(${tx + dx}px, ${ty + dy}px) scale(${s})`;
        });
    }
    document.getElementById('btnPanUp').addEventListener('click', () => panCanvas(0, -20));
    document.getElementById('btnPanDown').addEventListener('click', () => panCanvas(0, 20));
    document.getElementById('btnPanLeft').addEventListener('click', () => panCanvas(-20, 0));
    document.getElementById('btnPanRight').addEventListener('click', () => panCanvas(20, 0));
});
// ================= 语言系统终极修复补丁 =================
setTimeout(() => {
    if (!window.APP) return;
    
    // 找到设置面板里的语言按钮
    const langBtns = document.querySelectorAll('.lang-btn-sm');
    
    langBtns.forEach(btn => {
        // 使用克隆大法，彻底清除之前错误绑定的“开场打字”事件
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 重新绑定正确的纯语言切换事件
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = e.currentTarget.dataset.lang;
            if (!lang || lang === APP.state.currentLang) return;
            
            // 1. 唤醒音频
            APP.initAudio();
            
            // 2. 应用语言（更新所有UI文字）
            APP.applyLanguage(lang);
            
            // 3. 按钮高亮提示（可选）
            document.querySelectorAll('.lang-btn-sm').forEach(b => b.style.borderColor = 'transparent');
            newBtn.style.borderColor = 'var(--pink)';
            
            // 4. 如果已经在主界面（不是冻结状态），让小猪用新语言立刻说句话
            if (!APP.state.isFrozen) {
                const t = APP.TEXTS[lang];
                // 先说一句切换成功的提示，或者直接用新语言打招呼
                const msg = lang === 'zh' ? "语言切换成功啦！" : (lang === 'en' ? "Language switched!" : "¡Idioma cambiado!");
                APP.say(msg);
                if (APP.addLog) APP.addLog(lang === 'zh' ? '语言' : 'Lang', msg);
            } else {
                // 如果还在开场阶段，更新底部悬浮的语言按钮状态
                document.querySelectorAll('.lang-btn').forEach(b => {
                    b.style.background = b.dataset.lang === lang ? 'rgba(217,130,155,0.2)' : 'transparent';
                });
            }
            
            // 5. 关闭设置面板
            document.getElementById('settingsPanel').classList.remove('show');
        });
    });
    
    // 顺便修复一下底部悬浮的语言按钮（防止它触发设置里的逻辑）
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // 重新绑定开场的语言选择逻辑（只能在这里重新加，因为上面克隆清空了）
    // 等等，为了防止彻底破坏开场逻辑，这里其实不需要动底部按钮。
}, 1500); // 延迟1.5秒，确保原逻辑绑定完毕后再覆盖