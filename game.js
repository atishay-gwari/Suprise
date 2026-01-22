// Leps' Chronicles of WonderCore
// A Valentine's Day Adventure Game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// Game State
const gameState = {
    currentScene: 1,
    hasScarf: false,
    knightTalked: false,
    cheshireTalked: false,
    canProceed: false,
    gameEnded: false
};

// Player (Orange Cat with Blue Cape)
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    speed: 4,
    direction: 'right',
    frame: 0,
    animTimer: 0
};

// Input handling
const keys = {};
let dialogueActive = false;
let currentNPC = null;
let awaitingAnswer = false;

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if ((e.key === ' ' || e.key.toLowerCase() === 'e') && !dialogueActive) {
        checkInteraction();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Dialogue system
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const dialogueInput = document.getElementById('dialogue-input');
const dialogueBtn = document.getElementById('dialogue-btn');

dialogueBtn.addEventListener('click', handleDialogueResponse);
dialogueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleDialogueResponse();
});

function showDialogue(text, needsInput = false) {
    dialogueActive = true;
    dialogueBox.classList.remove('hidden');
    dialogueText.textContent = text;
    if (needsInput) {
        dialogueInput.classList.remove('hidden');
        dialogueInput.value = '';
        dialogueInput.focus();
        awaitingAnswer = true;
    } else {
        dialogueInput.classList.add('hidden');
        awaitingAnswer = false;
    }
}

function hideDialogue() {
    dialogueActive = false;
    dialogueBox.classList.add('hidden');
    dialogueInput.classList.add('hidden');
    awaitingAnswer = false;
    currentNPC = null;
}

function handleDialogueResponse() {
    if (awaitingAnswer) {
        const answer = dialogueInput.value.trim().toLowerCase();
        if (currentNPC === 'knight') {
            if (answer === 'didier drogba' || answer === 'drogba') {
                showDialogue("The Knight nods solemnly: 'A true Blue indeed! The path to Wonderland opens before you, brave traveler. May your journey be filled with wonder!'", false);
                gameState.canProceed = true;
                setTimeout(() => {
                    hideDialogue();
                    transitionToScene(2);
                }, 3000);
            } else {
                showDialogue("The Knight shakes his head: 'That is not the answer I seek. Think carefully, little lion... Who is the King of Stamford Bridge?'", true);
            }
        } else if (currentNPC === 'cheshire') {
            if (answer === 'scorpions' || answer === 'scorpion' || answer === 'the scorpions') {
                showDialogue("The Cheshire Cat's grin widens impossibly: 'Yesss... the winds of change blow through your heart! The final door awaits...'", false);
                gameState.canProceed = true;
                setTimeout(() => {
                    hideDialogue();
                    transitionToScene(3);
                }, 3000);
            } else {
                showDialogue("The Cat's smile flickers: 'Hmm, that melody doesn't quite ring true... What band makes her heart sing?'", true);
            }
        }
    } else {
        hideDialogue();
    }
}


// Scene Objects
const scenes = {
    1: { // Lantern Waste (Narnia)
        name: "The Lantern Waste",
        objects: [],
        npcs: []
    },
    2: { // Garden of Hearts (Wonderland)
        name: "The Garden of Hearts",
        objects: [],
        npcs: []
    },
    3: { // Grand Finale
        name: "The Grand Finale",
        objects: [],
        npcs: []
    }
};

// Initialize scene objects
function initScenes() {
    // Scene 1: Lantern Waste
    scenes[1].objects = [
        { type: 'wardrobe', x: 50, y: 150, width: 80, height: 120 },
        { type: 'lamp', x: 200, y: 100 },
        { type: 'lamp', x: 400, y: 80 },
        { type: 'lamp', x: 600, y: 120 },
        { type: 'lamp', x: 750, y: 90 },
        { type: 'chest', x: 500, y: 350, width: 50, height: 35, hasScarf: true },
        { type: 'tree', x: 150, y: 50 },
        { type: 'tree', x: 350, y: 30 },
        { type: 'tree', x: 550, y: 60 },
        { type: 'tree', x: 700, y: 40 },
        { type: 'tree', x: 100, y: 400 },
        { type: 'tree', x: 300, y: 450 },
        { type: 'tree', x: 650, y: 420 }
    ];
    scenes[1].npcs = [
        { type: 'knight', x: 800, y: 280, width: 50, height: 70 }
    ];

    // Scene 2: Garden of Hearts
    scenes[2].objects = [
        { type: 'mushroom', x: 100, y: 150, size: 'large' },
        { type: 'mushroom', x: 300, y: 400, size: 'medium' },
        { type: 'mushroom', x: 600, y: 120, size: 'large' },
        { type: 'mushroom', x: 750, y: 350, size: 'small' },
        { type: 'rose', x: 200, y: 300 },
        { type: 'rose', x: 450, y: 200 },
        { type: 'rose', x: 700, y: 450 },
        { type: 'rose', x: 150, y: 480 },
        { type: 'rose', x: 550, y: 380 }
    ];
    scenes[2].npcs = [
        { type: 'cheshire', x: 450, y: 100, width: 60, height: 50 }
    ];

    // Scene 3: Grand Finale
    scenes[3].objects = [
        { type: 'heartWardrobe', x: 400, y: 200, width: 100, height: 150 }
    ];
}

// Drawing functions
function drawScene1() {
    // Snowy forest background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a237e');
    gradient.addColorStop(0.5, '#283593');
    gradient.addColorStop(1, '#3949ab');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snow on ground
    ctx.fillStyle = '#e8eaf6';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Snow hills
    ctx.fillStyle = '#c5cae9';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 80);
    ctx.quadraticCurveTo(200, canvas.height - 120, 400, canvas.height - 90);
    ctx.quadraticCurveTo(600, canvas.height - 60, 900, canvas.height - 100);
    ctx.lineTo(900, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    // Snowflakes
    drawSnowflakes();

    // Draw objects
    scenes[1].objects.forEach(obj => {
        if (obj.type === 'wardrobe') drawWardrobe(obj.x, obj.y);
        if (obj.type === 'lamp') drawLamp(obj.x, obj.y);
        if (obj.type === 'chest') drawChest(obj.x, obj.y, obj.hasScarf && !gameState.hasScarf);
        if (obj.type === 'tree') drawSnowyTree(obj.x, obj.y);
    });

    // Draw Knight NPC
    scenes[1].npcs.forEach(npc => {
        if (npc.type === 'knight') drawKnight(npc.x, npc.y);
    });

    // Scene title
    drawSceneTitle("The Lantern Waste");
    
    // Show scarf indicator if collected
    if (gameState.hasScarf) {
        drawScarfIndicator();
    }
}


function drawScene2() {
    // Wonderland gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4a148c');
    gradient.addColorStop(0.3, '#7b1fa2');
    gradient.addColorStop(0.6, '#9c27b0');
    gradient.addColorStop(1, '#ce93d8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Magical grass
    ctx.fillStyle = '#00c853';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    
    // Grass pattern
    for (let i = 0; i < canvas.width; i += 15) {
        ctx.fillStyle = `hsl(${120 + Math.sin(i * 0.1) * 20}, 80%, ${40 + Math.sin(i * 0.05) * 10}%)`;
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 80);
        ctx.lineTo(i + 7, canvas.height - 95 - Math.random() * 10);
        ctx.lineTo(i + 14, canvas.height - 80);
        ctx.fill();
    }

    // Draw objects
    scenes[2].objects.forEach(obj => {
        if (obj.type === 'mushroom') drawMushroom(obj.x, obj.y, obj.size);
        if (obj.type === 'rose') drawGiantRose(obj.x, obj.y);
    });

    // Draw Cheshire Cat
    scenes[2].npcs.forEach(npc => {
        if (npc.type === 'cheshire') drawCheshireCat(npc.x, npc.y);
    });

    // Floating particles
    drawMagicParticles();

    drawSceneTitle("The Garden of Hearts");
}

function drawScene3() {
    // Romantic finale background
    const gradient = ctx.createRadialGradient(450, 300, 50, 450, 300, 500);
    gradient.addColorStop(0, '#ff6b9d');
    gradient.addColorStop(0.5, '#c44569');
    gradient.addColorStop(1, '#6a1b4d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    for (let i = 0; i < 50; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 47) % canvas.height;
        const size = 1 + Math.sin(Date.now() * 0.003 + i) * 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(Date.now() * 0.005 + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw heart wardrobe
    drawHeartWardrobe(400, 200);

    drawSceneTitle("The Grand Finale");
}

// Object drawing functions
function drawWardrobe(x, y) {
    // Main body
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x, y, 80, 120);
    
    // Wood grain
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 10 + i * 15, y);
        ctx.lineTo(x + 10 + i * 15, y + 120);
        ctx.stroke();
    }
    
    // Doors
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(x + 5, y + 10, 32, 100);
    ctx.fillRect(x + 43, y + 10, 32, 100);
    
    // Handles
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x + 35, y + 60, 4, 0, Math.PI * 2);
    ctx.arc(x + 45, y + 60, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Snow on top
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x + 40, y - 5, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawLamp(x, y) {
    // Pole
    ctx.fillStyle = '#37474f';
    ctx.fillRect(x - 3, y, 6, 150);
    
    // Lamp housing
    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.lineTo(x + 15, y - 30);
    ctx.lineTo(x - 15, y - 30);
    ctx.closePath();
    ctx.fill();
    
    // Light glow
    const glowGradient = ctx.createRadialGradient(x, y - 15, 5, x, y - 15, 40);
    glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
    glowGradient.addColorStop(0.5, 'rgba(255, 180, 80, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y - 15, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Light bulb
    ctx.fillStyle = '#fff3e0';
    ctx.beginPath();
    ctx.arc(x, y - 15, 8, 0, Math.PI * 2);
    ctx.fill();
}


function drawChest(x, y, closed) {
    // Chest body
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x, y + 10, 50, 25);
    
    // Chest lid
    ctx.fillStyle = closed ? '#a1887f' : '#6d4c41';
    if (closed) {
        ctx.beginPath();
        ctx.moveTo(x - 2, y + 10);
        ctx.lineTo(x + 52, y + 10);
        ctx.lineTo(x + 48, y - 5);
        ctx.lineTo(x + 2, y - 5);
        ctx.closePath();
        ctx.fill();
    } else {
        // Open lid
        ctx.save();
        ctx.translate(x, y - 5);
        ctx.rotate(-0.8);
        ctx.fillRect(0, 0, 50, 15);
        ctx.restore();
        
        // Scarf visible inside
        ctx.fillStyle = '#1565c0';
        ctx.fillRect(x + 10, y + 12, 30, 8);
    }
    
    // Lock
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x + 25, y + 5, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnowyTree(x, y) {
    // Trunk
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x + 15, y + 60, 20, 80);
    
    // Snow-covered foliage layers
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath();
    ctx.moveTo(x + 25, y);
    ctx.lineTo(x + 60, y + 50);
    ctx.lineTo(x - 10, y + 50);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + 25, y + 30);
    ctx.lineTo(x + 70, y + 80);
    ctx.lineTo(x - 20, y + 80);
    ctx.closePath();
    ctx.fill();
    
    // Snow on branches
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(x + 25, y - 5);
    ctx.lineTo(x + 50, y + 40);
    ctx.lineTo(x, y + 40);
    ctx.closePath();
    ctx.fill();
}

function drawKnight(x, y) {
    // Body armor (Chelsea Blue)
    ctx.fillStyle = '#034694';
    ctx.fillRect(x + 10, y + 25, 30, 35);
    
    // Helmet
    ctx.fillStyle = '#546e7a';
    ctx.beginPath();
    ctx.arc(x + 25, y + 15, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Visor
    ctx.fillStyle = '#263238';
    ctx.fillRect(x + 10, y + 10, 30, 8);
    
    // Plume
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(x + 25, y - 5, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Shield with Chelsea lion
    ctx.fillStyle = '#034694';
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 25);
    ctx.lineTo(x + 5, y + 25);
    ctx.lineTo(x + 5, y + 55);
    ctx.lineTo(x, y + 65);
    ctx.lineTo(x - 5, y + 55);
    ctx.closePath();
    ctx.fill();
    
    // Lion emblem on shield
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x, y + 40, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs
    ctx.fillStyle = '#455a64';
    ctx.fillRect(x + 12, y + 60, 10, 20);
    ctx.fillRect(x + 28, y + 60, 10, 20);
    
    // Sword
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(x + 42, y + 20, 4, 50);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 38, y + 18, 12, 6);
}

function drawMushroom(x, y, size) {
    const scale = size === 'large' ? 1.5 : size === 'medium' ? 1 : 0.6;
    
    // Stem
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 15 * scale, y + 40 * scale, 30 * scale, 60 * scale);
    
    // Cap
    const hue = (x * 3 + y * 2) % 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
    ctx.beginPath();
    ctx.ellipse(x + 30 * scale, y + 40 * scale, 45 * scale, 35 * scale, 0, Math.PI, 0);
    ctx.fill();
    
    // Spots
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
        const spotX = x + (10 + i * 12) * scale;
        const spotY = y + (20 + (i % 2) * 15) * scale;
        ctx.beginPath();
        ctx.arc(spotX, spotY, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
}


function drawGiantRose(x, y) {
    // Stem
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y + 100);
    ctx.quadraticCurveTo(x - 20, y + 50, x, y + 30);
    ctx.stroke();
    
    // Leaves
    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.ellipse(x - 25, y + 60, 20, 10, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 75, 18, 8, 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Rose petals
    const petalColors = ['#e91e63', '#f06292', '#f48fb1', '#c2185b'];
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = petalColors[i % petalColors.length];
        ctx.beginPath();
        const angle = (i / 8) * Math.PI * 2;
        const px = x + Math.cos(angle) * 15;
        const py = y + 15 + Math.sin(angle) * 12;
        ctx.ellipse(px, py, 18, 12, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Center
    ctx.fillStyle = '#880e4f';
    ctx.beginPath();
    ctx.arc(x, y + 15, 10, 0, Math.PI * 2);
    ctx.fill();
}

function drawCheshireCat(x, y) {
    const bobY = Math.sin(Date.now() * 0.003) * 5;
    const actualY = y + bobY;
    
    // Body (striped purple)
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.ellipse(x + 30, actualY + 25, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Stripes
    ctx.fillStyle = '#4a148c';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + 5 + i * 12, actualY + 10, 6, 30);
    }
    
    // Head
    ctx.fillStyle = '#9c27b0';
    ctx.beginPath();
    ctx.arc(x + 30, actualY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.moveTo(x + 10, actualY - 15);
    ctx.lineTo(x + 5, actualY - 35);
    ctx.lineTo(x + 20, actualY - 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 50, actualY - 15);
    ctx.lineTo(x + 55, actualY - 35);
    ctx.lineTo(x + 40, actualY - 20);
    ctx.closePath();
    ctx.fill();
    
    // Giant grin
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 30, actualY + 5, 18, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 7; i++) {
        const toothX = x + 15 + i * 5;
        ctx.fillRect(toothX, actualY + 8, 3, 6);
    }
    
    // Eyes (mischievous)
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.ellipse(x + 20, actualY - 5, 8, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 40, actualY - 5, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 22, actualY - 5, 3, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 42, actualY - 5, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail
    ctx.strokeStyle = '#7b1fa2';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x + 60, actualY + 25);
    ctx.quadraticCurveTo(x + 90, actualY + 10, x + 85, actualY + 40);
    ctx.stroke();
}

function drawHeartWardrobe(x, y) {
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.05;
    
    ctx.save();
    ctx.translate(x + 50, y + 75);
    ctx.scale(pulse, pulse);
    ctx.translate(-50, -75);
    
    // Heart shape
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.bezierCurveTo(50, 0, 0, 0, 0, 50);
    ctx.bezierCurveTo(0, 90, 50, 120, 50, 150);
    ctx.bezierCurveTo(50, 120, 100, 90, 100, 50);
    ctx.bezierCurveTo(100, 0, 50, 0, 50, 30);
    ctx.fill();
    
    // Glow effect
    ctx.shadowColor = '#ff4081';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Door lines
    ctx.strokeStyle = '#c2185b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 40);
    ctx.lineTo(50, 140);
    ctx.stroke();
    
    // Handles
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(40, 90, 5, 0, Math.PI * 2);
    ctx.arc(60, 90, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Sparkles around
    for (let i = 0; i < 8; i++) {
        const angle = (Date.now() * 0.002 + i * 0.8) % (Math.PI * 2);
        const dist = 80 + Math.sin(Date.now() * 0.003 + i) * 10;
        const sx = x + 50 + Math.cos(angle) * dist;
        const sy = y + 75 + Math.sin(angle) * dist;
        
        ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(Date.now() * 0.01 + i) * 0.3})`;
        drawStar(sx, sy, 5, 8, 4);
    }
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}


// Player drawing (Orange Cat with Blue Cape)
function drawPlayer() {
    const bobY = Math.sin(Date.now() * 0.01) * 2;
    const x = player.x;
    const y = player.y + bobY;
    
    // Cape (blue with golden emblem)
    ctx.fillStyle = '#1565c0';
    ctx.beginPath();
    if (player.direction === 'right') {
        ctx.moveTo(x + 10, y + 10);
        ctx.lineTo(x - 15, y + 35);
        ctx.lineTo(x + 5, y + 35);
        ctx.lineTo(x + 15, y + 15);
    } else {
        ctx.moveTo(x + 30, y + 10);
        ctx.lineTo(x + 55, y + 35);
        ctx.lineTo(x + 35, y + 35);
        ctx.lineTo(x + 25, y + 15);
    }
    ctx.closePath();
    ctx.fill();
    
    // Cape emblem (golden lion)
    ctx.fillStyle = '#ffd700';
    const emblemX = player.direction === 'right' ? x - 5 : x + 45;
    ctx.beginPath();
    ctx.arc(emblemX, y + 25, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Body (orange)
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 25, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#ffb74d';
    ctx.beginPath();
    ctx.arc(x + 20, y + 8, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 2);
    ctx.lineTo(x + 5, y - 10);
    ctx.lineTo(x + 15, y);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 32, y + 2);
    ctx.lineTo(x + 35, y - 10);
    ctx.lineTo(x + 25, y);
    ctx.closePath();
    ctx.fill();
    
    // Inner ears
    ctx.fillStyle = '#ffcc80';
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 1);
    ctx.lineTo(x + 7, y - 6);
    ctx.lineTo(x + 14, y);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 31, y + 1);
    ctx.lineTo(x + 33, y - 6);
    ctx.lineTo(x + 26, y);
    ctx.closePath();
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(x + 14, y + 5, 4, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 26, y + 5, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000';
    const lookX = player.direction === 'right' ? 1 : -1;
    ctx.beginPath();
    ctx.arc(x + 14 + lookX, y + 5, 2, 0, Math.PI * 2);
    ctx.arc(x + 26 + lookX, y + 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 10);
    ctx.lineTo(x + 17, y + 14);
    ctx.lineTo(x + 23, y + 14);
    ctx.closePath();
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 10);
    ctx.lineTo(x + 15, y + 12);
    ctx.moveTo(x + 5, y + 14);
    ctx.lineTo(x + 15, y + 14);
    ctx.moveTo(x + 35, y + 10);
    ctx.lineTo(x + 25, y + 12);
    ctx.moveTo(x + 35, y + 14);
    ctx.lineTo(x + 25, y + 14);
    ctx.stroke();
    
    // Tail
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const tailWag = Math.sin(Date.now() * 0.01) * 10;
    if (player.direction === 'right') {
        ctx.moveTo(x + 5, y + 30);
        ctx.quadraticCurveTo(x - 10, y + 20 + tailWag, x - 5, y + 10);
    } else {
        ctx.moveTo(x + 35, y + 30);
        ctx.quadraticCurveTo(x + 50, y + 20 + tailWag, x + 45, y + 10);
    }
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#ff9800';
    const legOffset = Math.sin(Date.now() * 0.015) * 3;
    ctx.fillRect(x + 8, y + 32 + legOffset, 8, 10);
    ctx.fillRect(x + 24, y + 32 - legOffset, 8, 10);
    
    // Paws
    ctx.fillStyle = '#ffcc80';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 43 + legOffset, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 28, y + 43 - legOffset, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Effects
let snowflakes = [];
let magicParticles = [];

function initEffects() {
    // Snowflakes for scene 1
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5,
            wobble: Math.random() * Math.PI * 2
        });
    }
    
    // Magic particles for scene 2
    for (let i = 0; i < 30; i++) {
        magicParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 2,
            speedY: -Math.random() * 1 - 0.5,
            hue: Math.random() * 60 + 280
        });
    }
}

function drawSnowflakes() {
    ctx.fillStyle = '#fff';
    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += Math.sin(flake.wobble + Date.now() * 0.001) * 0.5;
        
        if (flake.y > canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
        }
        
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawMagicParticles() {
    magicParticles.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += Math.sin(Date.now() * 0.002 + particle.x) * 0.5;
        
        if (particle.y < -10) {
            particle.y = canvas.height + 10;
            particle.x = Math.random() * canvas.width;
        }
        
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, 0.6)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
}


function drawSceneTitle(title) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 200, 35);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'italic 18px Georgia';
    ctx.fillText(title, 20, 33);
    
    // Controls hint
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(canvas.width - 180, 10, 170, 35);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Georgia';
    ctx.fillText('WASD: Move | E/Space: Interact', canvas.width - 170, 32);
}

function drawScarfIndicator() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 50, 150, 30);
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(20, 58, 30, 14);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Georgia';
    ctx.fillText('Chelsea Scarf ✓', 60, 70);
}

// Interaction system
function checkInteraction() {
    if (gameState.currentScene === 1) {
        // Check chest
        const chest = scenes[1].objects.find(o => o.type === 'chest');
        if (chest && !gameState.hasScarf) {
            const dist = Math.hypot(player.x - chest.x, player.y - chest.y);
            if (dist < 60) {
                gameState.hasScarf = true;
                showDialogue("You found the Chelsea Blue Scarf! A beautiful silk scarf with the club's crest. Now find the Knight at the edge of the woods.");
                return;
            }
        }
        
        // Check knight
        const knight = scenes[1].npcs.find(n => n.type === 'knight');
        if (knight) {
            const dist = Math.hypot(player.x - knight.x, player.y - knight.y);
            if (dist < 70) {
                currentNPC = 'knight';
                if (!gameState.hasScarf) {
                    showDialogue("The Knight speaks: 'Halt, traveler! Before I test your knowledge, you must first find the Chelsea Blue Scarf hidden in this forest.'");
                } else {
                    showDialogue("The Knight speaks: 'Only a true fan of the Blues may pass. Tell me, little lion, who is the King of Stamford Bridge and her all-time favorite Chelsea legend?'", true);
                }
                return;
            }
        }
    }
    
    if (gameState.currentScene === 2) {
        // Check Cheshire Cat
        const cheshire = scenes[2].npcs.find(n => n.type === 'cheshire');
        if (cheshire) {
            const dist = Math.hypot(player.x - cheshire.x, player.y - cheshire.y);
            if (dist < 80) {
                currentNPC = 'cheshire';
                showDialogue("The Cheshire Cat grins: 'You've traveled far, little lion, but the final door only opens for a melody. What is her all-time favorite band?'", true);
                return;
            }
        }
    }
    
    if (gameState.currentScene === 3) {
        // Check heart wardrobe
        const wardrobe = scenes[3].objects.find(o => o.type === 'heartWardrobe');
        if (wardrobe) {
            const dist = Math.hypot(player.x - (wardrobe.x + 50), player.y - (wardrobe.y + 75));
            if (dist < 100) {
                triggerEnding();
                return;
            }
        }
    }
}

function transitionToScene(sceneNum) {
    // Fade effect
    let alpha = 0;
    const fadeOut = setInterval(() => {
        alpha += 0.05;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (alpha >= 1) {
            clearInterval(fadeOut);
            gameState.currentScene = sceneNum;
            player.x = 100;
            player.y = 300;
            gameState.canProceed = false;
            
            // Fade in
            let fadeAlpha = 1;
            const fadeIn = setInterval(() => {
                fadeAlpha -= 0.05;
                if (fadeAlpha <= 0) {
                    clearInterval(fadeIn);
                }
            }, 30);
        }
    }, 30);
}

function triggerEnding() {
    gameState.gameEnded = true;
    const endScreen = document.getElementById('end-screen');
    endScreen.classList.remove('hidden');
    
    // Create falling petals
    const petalsContainer = document.getElementById('petals-container');
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDuration = (3 + Math.random() * 4) + 's';
            petal.style.animationDelay = Math.random() * 2 + 's';
            petal.style.width = (15 + Math.random() * 15) + 'px';
            petal.style.height = (15 + Math.random() * 15) + 'px';
            petalsContainer.appendChild(petal);
        }, i * 100);
    }
}

// Game loop
function update() {
    if (dialogueActive || gameState.gameEnded) return;
    
    let moving = false;
    
    if (keys['w'] || keys['arrowup']) {
        player.y -= player.speed;
        moving = true;
    }
    if (keys['s'] || keys['arrowdown']) {
        player.y += player.speed;
        moving = true;
    }
    if (keys['a'] || keys['arrowleft']) {
        player.x -= player.speed;
        player.direction = 'left';
        moving = true;
    }
    if (keys['d'] || keys['arrowright']) {
        player.x += player.speed;
        player.direction = 'right';
        moving = true;
    }
    
    // Boundary checks
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(50, Math.min(canvas.height - player.height - 60, player.y));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (gameState.currentScene) {
        case 1:
            drawScene1();
            break;
        case 2:
            drawScene2();
            break;
        case 3:
            drawScene3();
            break;
    }
    
    drawPlayer();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize and start
initScenes();
initEffects();
gameLoop();

console.log("🏰 Leps' Chronicles of WonderCore");
console.log("A Valentine's Day Adventure");
console.log("Controls: WASD to move, E or Space to interact");
